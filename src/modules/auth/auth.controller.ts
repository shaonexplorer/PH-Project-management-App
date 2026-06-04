import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../app/utils/catch-async';

// Signup handler
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;
  const user = await AuthService.register({ name, email, password, role });
  res.status(201).json({ user });
});

// Login handler
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const { token, user } = await AuthService.login(email, password);
  res.status(200).json({ token, user });
});

export const authController = {
  signup,
  login,
};
