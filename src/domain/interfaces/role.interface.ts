import { Schema } from 'mongoose';
import { RoleName } from '../enums/role.enum';

export interface IRole extends Document {
    name: RoleName;
    users: Array<Schema.Types.ObjectId>;
    permissions: Array<Schema.Types.ObjectId>;
};
