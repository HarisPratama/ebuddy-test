// @ts-ignore
import express from 'express';
// @ts-ignore
import cors from 'cors';
import * as dotenv from 'dotenv';
import userRoutes from '../routes/userRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});