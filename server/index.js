import express, { json } from 'express';
import dotenv from 'dotenv';
import { database } from './config/database.config.js';
import { cloudinaryConfig } from './config/cloudinary.config.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/user.route.js';
app.use(json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://localhost:3000",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));

//mongoDB connection
database();

//cloudinary connection
cloudinaryConfig();

//user routes
app.use('/api/v1/user', router);

//courses routes
app.use('/api/v1/courses', router);

//payment routes
app.use('/api/v1/payment', router);

//module routes
app.use('/api/v1/module', router);

//lesson routes
app.use('/api/v1/lesson', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});