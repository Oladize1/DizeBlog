import express from 'express';

import { connectDB } from './DB/connectDB.js';
import { authRouter } from './Routes/auth.js';
import { postRouter } from './Routes/post.js';
import dotenv from 'dotenv';
import cors from 'cors'
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/blog', authRouter);
app.use('/api/blog/post', postRouter);

app.get('/test', (req, res) => {
    res.send('Hello World!');
})

// Global error handler middleware in Express
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});


const PORT = process.env.PORT || 3000;
const connectdb = () => {
    try {
        const conn = connectDB(process.env.MONGO_URI);
        if (!conn) {
            return console.log(`error connecting the database`);

        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log('error',error);  
    }
}

connectdb();
