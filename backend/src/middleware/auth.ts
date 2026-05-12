import jwt from 'jsonwebtoken';
import User from '../models/User';

const protect = async (req: any, res: any, next: any) => {
  let token;

  // Check for token in Cookies or Authorization Header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // 1. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;

    // 2. Get User from DB
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found, access denied' });
    }

    // 3. Attach User to Request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export {  protect  };
