import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string; // user id
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Express middleware to protect routes.
 * Expects an `Authorization: Bearer <token>` header.
 * On success, attaches `req.user = { id, role }`.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Try Authorization header first
  let token: string | undefined;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if ((req as any).cookies && (req as any).cookies.accessToken) {
    // Fallback to cookie named 'accessToken'
    token = (req as any).cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Missing authentication token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    // Attach minimal user info to request
    (req as any).user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
