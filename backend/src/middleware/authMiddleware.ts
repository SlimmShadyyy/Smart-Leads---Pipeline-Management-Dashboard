import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extend the Request interface to include our user payload
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// 2. JWT Verification Middleware
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    
    // Attach the user payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// 3. Role-Based Access Control (RBAC) Middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: `User role '${req.user?.role}' is not authorized to access this route` });
      return;
    }
    next();
  };
};