import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Example protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.send('This route is protected');
});

export default router;