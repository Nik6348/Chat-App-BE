import { User } from '../models/userModel.js';
import { FriendRequest } from '../models/friendRequestModel.js'

// Function to send a friend request
export const sendFriendRequest = async (req, res) => {
  const { id } = req.params;
  const senderId = req.user._id;

  // Check if the user is trying to send a request to themselves
  if (senderId.toString() === id) {
    return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
  }

  // Check if the user already has a pending request from the sender
  const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: id, status: 'pending' });
  if (existingRequest) {
    return res.status(400).json({ message: 'Friend request already sent.' });
  }

  // Check if the users are already friends
  const areFriends = await User.findOne({ _id: senderId, friends: id });
  if (areFriends) {
    return res.status(400).json({ message: 'You are already friends with this user.' });
  }

  // Create a new friend request
  const newRequest = new FriendRequest({ sender: senderId, receiver: id });
  await newRequest.save();

  // Add the request to the sentRequests array of the sender
  await User.findByIdAndUpdate(senderId, { $push: { sentRequests: newRequest._id } });

  // Add the request to the receivedRequests array of the receiver
  await User.findByIdAndUpdate(id, { $push: { recievedRequests: newRequest._id } });

  res.status(201).json({ message: 'Friend request sent successfully.', data: newRequest });
};

// Function to accept a friend request
export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find the friend request
  const request = await FriendRequest.findById(id);
  if (!request) {
    return res.status(404).json({ message: 'Friend request not found.' });
  }

  // Update the request status to accepted
  request.status = 'accepted';
  await request.save();

  // Remove the request from the sentRequests array of the sender
  await User.findByIdAndUpdate(request.sender, { $pull: { sentRequests: request._id } });

  // Remove the request from the receivedRequests array of the receiver
  await User.findByIdAndUpdate(request.receiver, { $pull: { recievedRequests: request._id } });

  // Add the receiver to the friends array of the sender
  await User.findByIdAndUpdate(request.sender, { $push: { friends: userId } });

  // Add the sender to the friends array of the receiver
  await User.findByIdAndUpdate(request.receiver, { $push: { friends: request.sender } });

  res.status(200).json({ message: 'Friend request accepted.', data: request });
};

// Function to reject a friend request
export const rejectFriendRequest = async (req, res) => {
  const { id } = req.params;

  // Find the friend request
  const request = await FriendRequest.findById(id);
  if (!request) {
    return res.status(404).json({ message: 'Friend request not found.' });
  }

  // Update the request status to rejected
  request.status = 'rejected';
  await request.save();

  // Remove the request from the sentRequests array of the sender
  await User.findByIdAndUpdate(request.sender, { $pull: { sentRequests: request._id } });

  // Remove the request from the receivedRequests array of the receiver
  await User.findByIdAndUpdate(request.receiver, { $pull: { recievedRequests: request._id } });

  res.status(200).json({ message: 'Friend request rejected.', data: request });
}

// Function to get all friends
export const getAllFriends = async (req, res) => {
  const userId = req.user._id;

  // Find the user and populate friends
  const user = await User.findById(userId)
    .populate({
      path: 'friends',
      select: 'fullName userName'
    });

  // Extract the friends from the user object
  const friends = user.friends;

  res.status(200).json({
    message: 'Friends fetched successfully.',
    data: friends
  });
};

// Function to get sent friend requests
export const getSentFriendRequests = async (req, res) => {
  const userId = req.user._id;

  // Find the user and populate only the sentRequests field
  const user = await User.findById(userId).populate({
    path: 'sentRequests',
    populate: {
      path: 'receiver',
      select: 'fullName userName'
    }
  }).select('sentRequests');

  // Extract the sentRequests from the user object
  const sentRequests = user.sentRequests;

  res.status(200).json({ message: 'Sent friend requests fetched successfully.', data: sentRequests });
}

// Function to get received friend requests
export const getReceivedFriendRequests = async (req, res) => {
  const userId = req.user._id;

  // Find the user and populate only the receivedRequests field
  const user = await User.findById(userId).populate({
    path: 'recievedRequests',
    populate: {
      path: 'sender',
      select: 'fullName userName'
    }
  });

  // Extract the receivedRequests from the user object
  const receivedRequest = user.recievedRequests;

  res.status(200).json({ message: 'Received friend requests fetched successfully.', data: receivedRequest });
};