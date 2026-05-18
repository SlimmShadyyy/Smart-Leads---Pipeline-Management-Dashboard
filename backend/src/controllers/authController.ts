import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Crucial: .js extension for local imports!

// Helper function to generate JWTs
const generateToken = (userId: string, role: string) => {
  // Ensure JWT_SECRET is defined in your .env file
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// --- REGISTER CONTROLLER ---
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: 'User already exists with this email' });
       return;
    }

    // Create and save the new user (password is hashed automatically by our model)
    const user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

// --- LOGIN CONTROLLER ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       res.status(401).json({ message: 'Invalid credentials' });
       return;
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
};