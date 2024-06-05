import express from 'express';
import { sendMessage, getMessages, editMessage, deleteMessage, deleteAllMessageSpecificUser } from '../controllers/messageController.js'; // Adjust the import path as necessary
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new message
router.post('/send/:friendId', authMiddleware, asyncHandler(sendMessage));

// Route to get all messages between two users
router.get('/:friendId', authMiddleware, asyncHandler(getMessages));

// Route to update a message
router.put('/edit/:id', authMiddleware, asyncHandler(editMessage));

// Route to delete a message
router.delete('/delete/:id', authMiddleware, asyncHandler(deleteMessage));

// Route to delete all messages between two users
router.delete('/deleteAll/:friendId', authMiddleware, asyncHandler(deleteAllMessageSpecificUser));

export default router;
