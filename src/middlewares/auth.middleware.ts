import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ErrorCode } from '../domain/enums/error-code.enum';
import User from '../domain/models/user.model';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: ErrorCode.NOT_AUTHENTICATED });
    }

    verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: ErrorCode.NOT_AUTHENTICATED });
        } else {
            const { email } = decoded;

            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({ message: ErrorCode.NOT_AUTHENTICATED });
            }

            (req as any).user = user;

            next();
        }
    });
};
