import express, { type Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js'; // Add this import

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes); // Mount the lead routes

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running smoothly' });
});

export default app;