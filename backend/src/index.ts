import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js'; // Import the config!

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Only start the server if the database connects successfully
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});