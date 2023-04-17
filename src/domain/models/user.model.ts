import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema: Schema<IUser> = new mongoose.Schema({
    firstName: {
        type: String,
        trim:true,
        required: true
    },
    lastName: {
        type: String,
        trim:true,
        required: true
    },
    email: {
        type: String,
        trim:true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
  }, {
    timestamps: true
});
  
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
  
export default User;
