import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllFriends, getSentFriendRequests, getReceivedFriendRequests } from '../controllers/friendController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Route to send a friend request
router.post('/send-request/:id', authMiddleware, asyncHandler(sendFriendRequest));

// Route to accept a friend request
router.post('/accept-request/:id', authMiddleware, asyncHandler(acceptFriendRequest));

// Route to reject a friend request
router.post('/reject-request/:id', authMiddleware, asyncHandler(rejectFriendRequest));

// Route to get all friend requests
router.get('/all-friends', authMiddleware, asyncHandler(getAllFriends));

// Route to get sent friend requests
router.get('/sent', authMiddleware, asyncHandler(getSentFriendRequests));

// Route to get received friend requests
router.get('/received', authMiddleware, asyncHandler(getReceivedFriendRequests));

export default router;
