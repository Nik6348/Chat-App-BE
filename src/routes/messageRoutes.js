import express from 'express';
import { sendMessage, getMessages, getMessageById, updateStatus, uploadFile, deleteMessage, deleteAllMessageSpecificUser } from '../controllers/messageController.js'; // Adjust the import path as necessary
import asyncHandler from '../utils/asyncHandler.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';
const router = express.Router();

// Route to create a new message
router.post('/send/:friendId', authMiddleware, asyncHandler(sendMessage));

// Route to get all messages between two users
router.get('/:friendId', authMiddleware, asyncHandler(getMessages));

// Route to get messages by ID
router.get('/:id', authMiddleware, asyncHandler(getMessageById));

// Route to update a message
router.put('/update-status/:id', authMiddleware, asyncHandler(updateStatus));

// Route to upload a file
router.post('/upload', upload.single('file'), asyncHandler(uploadFile));

// Route to delete a message
router.delete('/delete/:id', authMiddleware, asyncHandler(deleteMessage));

// Route to delete all messages between two users
router.delete('/deleteAll/:friendId', authMiddleware, asyncHandler(deleteAllMessageSpecificUser));

export default router;
