import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DB_URL;

export default async function connectToDB() {
    try {
      await mongoose.connect(dbUrl!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      } as ConnectOptions);
      console.log('Connected to the Database');
    } catch (error) {
      console.error(error);
    }
};
