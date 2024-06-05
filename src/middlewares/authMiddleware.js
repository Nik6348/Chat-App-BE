import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.js';
import asyncHandler from '../utils/asyncHandler.js';

// auth middleware
export const authMiddleware = asyncHandler((req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;
  next();
})