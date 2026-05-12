require('dotenv').config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db';

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(express.json());

connectDB();

import authRoutes from './src/routes/auth';
import projectRoutes from './src/routes/projects';
import taskRoutes from './src/routes/tasks';

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 8080;
app.listen(Number(PORT) || 8080, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));