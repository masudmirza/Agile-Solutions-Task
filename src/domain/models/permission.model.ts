import mongoose, { Model, Schema } from 'mongoose';
import { IPermission } from '../../interfaces/permission.interface';
import { PermissionName } from '../enums/permission.enum';

const permissionSchema: Schema<IPermission> = new mongoose.Schema({
    name: {
        type: String,
        enum: Object.values(PermissionName),
        required: true
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'RolePermission' 
        }
    ],
});
  
const Permission: Model<IPermission> = mongoose.model<IPermission>('Permission', permissionSchema);
  
export default Permission;
