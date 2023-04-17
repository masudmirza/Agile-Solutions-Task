import { ConnectOptions } from 'mongoose';

export default interface MongooseConnectOptions extends ConnectOptions {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
};