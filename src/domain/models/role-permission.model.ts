import mongoose, { Model, Schema } from 'mongoose';
import { IRolePermission } from '../interfaces/role-permission.interface';

const rolePermissionSchema: Schema<IRolePermission> = new mongoose.Schema({
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    permissionId: {
        type: Schema.Types.ObjectId,
        ref: 'Permission'
    },
});
  
const RolePermission: Model<IRolePermission> = mongoose.model<IRolePermission>('RolePermission', rolePermissionSchema);
  
export default RolePermission;
