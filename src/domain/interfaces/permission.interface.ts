import { Schema } from 'mongoose';
import { PermissionName } from '../enums/permission.enum';

export interface IPermission extends Document {
    name: PermissionName;
    roles: Array<Schema.Types.ObjectId>;
};
