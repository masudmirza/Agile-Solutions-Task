import { compare, genSalt, hash } from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { ErrorCode } from '../domain/enums/error-code.enum';
import Role from '../domain/models/role.model';
import User from '../domain/models/user.model';
import { validationResult } from 'express-validator'
import RolePermission from '../domain/models/role-permission.model';
import Permission from '../domain/models/permission.model';

dotenv.config();

export default class UserController {
    async signUp (req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0].msg })
            }

            const existUser = await User.findOne({ email: email });
            if (existUser) {
                return res.status(400).json({ message: ErrorCode.USER_ALREADY_EXISTS });
            }

            const existRole = await Role.findOne({ name: role });
        

            if (!existRole) {
                return res.status(400).json({ message: ErrorCode.BAD_REQUEST });
            }

            const passwordHash = await hash(password, await genSalt(10));

            const user = new User({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: passwordHash,
                roleId: existRole.id
            });

            await user.save();

            res.status(201).json({ success: true });
        } catch (error) {            
            return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
        }
    }

    async signIn (req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0].msg })
            }

            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: ErrorCode.USER_NOT_FOUNDED });
            }

            const isValidPassword = await compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: ErrorCode.PASSWORD_INVALID });
            }

            const roleId = user.roleId;

            const accessToken = sign(
                { email, roleId },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
            );
            const refreshToken = sign(
                { email, roleId },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
            );

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
        }
    }

    refreshToken (req: Request, res: Response) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: ErrorCode.NOT_AUTHENTICATED });
        }

        verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ message: ErrorCode.NOT_AUTHENTICATED });
            } else {
                const { email } = decoded;

                const user = await User.findOne({ email: email });
                if (!user) {
                    return res.status(401).json({ message: ErrorCode.NOT_AUTHENTICATED });
                }

                const roleId = user.roleId;

                const accessToken = sign(
                    { email, roleId },
                    process.env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
                );
                const newRefreshToken = sign(
                    { email, roleId },
                    process.env.REFRESH_TOKEN_SECRET as string,
                    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
                );

                res.status(200).json({ accessToken, newRefreshToken });
            }
        });
    }

    async updateUser (req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const { firstName, lastName, role } = req.body;

            const existUser = await User.findById(userId);
            if (!existUser) {
                return res.status(404).json({ message: ErrorCode.USER_NOT_FOUNDED });
            }

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0].msg })
            }

            const existRole = await Role.findOne({ name: role });
            if (!existRole) {
                return res.status(400).json({ message: ErrorCode.BAD_REQUEST });
            }

            const updatedUser = {
                firstName,
                lastName,
                roleId: existRole.id,
            };

            const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
                            
            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });        }
    };

    async deleteUser (req: Request, res: Response) {
        try {
            const userId = req.params.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: ErrorCode.USER_NOT_FOUNDED });
            }

            await User.findByIdAndDelete(userId);

            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
        }
    }

    async getUserById (req: Request, res: Response) {
        try {
            const userId = req.params.id;                           

            const user = await User.findById(userId, '-password')
            .populate({
                path: 'roleId',
                select: '-users -permissions',
            });            

            if (!user) {
                return res.status(404).json({ message: ErrorCode.USER_NOT_FOUNDED });
            }
            
            const rolePermissions = await RolePermission.find({ roleId: user.roleId })
            
            const permissionIds = rolePermissions.map((rp) => rp.permissionId);

            const permissions = await Permission.find({
                _id: { $in: permissionIds }
            }).select('-roles');

            const result = { ...user.toObject(), permissions };            

            res.status(200).json(result);
        } catch (error) {            
            return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
        }
    }

    async getAllUsers (req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;

            const users = await User.find()
                .select('-password')
                .skip((page - 1) * limit)
                .limit(limit);

            const count = await User.countDocuments();
            const totalPages = Math.ceil(count / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const paginationData = {
                currentPage: page,
                totalPages,
                totalCount: count,
                hasPrevPage,
                hasNextPage,
            };

            res.status(200).json({ users, paginationData });
        } catch (error) {
            return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
        }
    }
}
