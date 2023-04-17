import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import UserRoutes from './routes/user.route';
import connectToDB from './db';
import seed from './seeders/index.seeder';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
const port = process.env.PORT;

app.use('/api', new UserRoutes().router);

connectToDB();
seed();

app.listen(port, () => {
    console.log(`Server running on the http://localhost:${port}`);
})
