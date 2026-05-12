import User from '../models/User';
import Task from '../models/Task';
import {  generateToken  } from '../utils/jwt';

export const registerUser = async (req: any, res: any) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account created successfully! Please login.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await (user as any).matchPassword(password))) {
      const token = generateToken(user._id.toString(), user.role);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: any, res: any) => {
  res.json(req.user);
};

export const logoutUser = async (req: any, res: any) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getAllUsers = async (req: any, res: any) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  try {
    const users = await User.find({}).select('-password').lean();
    const usersWithTasks = await Promise.all(users.map(async (u) => {
      const taskCount = await Task.countDocuments({ assignedTo: u._id });
      return { ...u, taskCount };
    }));
    res.json(usersWithTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
