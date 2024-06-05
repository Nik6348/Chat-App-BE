import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { registerUser, loginUser, getUser, updateUser, deleteUser, getMe } from '../controllers/userController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Route to register a new user
router.post('/register', asyncHandler(registerUser));

// Route to login an existing user
router.post('/login', asyncHandler(loginUser));

// Route to get an login user
router.get('/me', authMiddleware, asyncHandler(getMe));

// Route to get a user by id
router.get('/getuser/:id', authMiddleware, asyncHandler(getUser));

// Route to update a user
router.patch('/update', authMiddleware, asyncHandler(updateUser));

// Route to delete a user
router.delete('/delete', authMiddleware, asyncHandler(deleteUser));

export default router;
