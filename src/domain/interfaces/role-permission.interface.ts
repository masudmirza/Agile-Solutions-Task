import { Schema } from 'mongoose';

export interface IRolePermission extends Document {
    roleId: Schema.Types.ObjectId;
    permissionId: Schema.Types.ObjectId;
};
