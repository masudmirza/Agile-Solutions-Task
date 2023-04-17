import { NextFunction, Request, Response } from 'express';
import Role from '../domain/models/role.model';
import { PermissionName } from '../domain/enums/permission.enum';
import { ErrorCode } from '../domain/enums/error-code.enum';
import RolePermission from '../domain/models/role-permission.model';
import { RoleName } from '../domain/enums/role.enum';
import Permission from '../domain/models/permission.model';

export const checkPermission = (permissionName: PermissionName) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
      const user = (req as any).user;   
      const roleId = user.roleId;

      const role = await Role.findById(roleId);
      if (role?.name === RoleName.ADMIN) {
        return next();
      }

      const existPermission = await Permission.findOne({ name: permissionName });

      const permission = await RolePermission.findOne({ roleId: roleId, permissionId: existPermission?.id });
      
      if (!permission) {
        return res.status(403).json({ message: ErrorCode.NOT_AUTHORIZED });
      }
      
      return next();
    } catch (error) {
      return res.status(500).json({ message: ErrorCode.INTERNAL_SERVER_ERROR });
    }
};
