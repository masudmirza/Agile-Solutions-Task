import mongoose, { Model, Schema } from 'mongoose';
import { IRole } from '../interfaces/role.interface';
import { RoleName } from '../enums/role.enum';

const roleSchema: Schema<IRole> = new mongoose.Schema({
    name: {
        type: String,
        enum: Object.values(RoleName),
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'RolePermission'
        }
    ],
});
  
const Role: Model<IRole> = mongoose.model<IRole>('Role', roleSchema);
  
export default Role;
