import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../configs/env.js';

// register user
export const registerUser = async (req, res) => {
  const { fullName, userName, password } = req.body;
  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res.status(400).json({ message: 'userName already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    fullName,
    userName,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({ message: 'User registered successfully', data: user });
};

//login user
export const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });

  if (!user) {
    return res.status(400).json({ message: 'userName not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Password not match' });
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  res.cookie('token', token, { httpOnly: true, secure: true, maxAge: JWT_EXPIRE * 1000 });
  res.status(200).json({ message: 'Login successfully', data: user });
}

// getuser
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by ID or username
    const user = await User.findOne({ userName: id });

    // If user is not found, return 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is found, return success response with user data
    res.status(200).json({ message: 'User found successfully', data: user });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// update user
export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: 'User not found' });

  await User.findByIdAndUpdate(userId, req.body, { new: true });

  res.status(200).json({ message: 'User updated successfully', data: user });
}

// delete user
export const deleteUser = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: 'User not found' });

  await User.findByIdAndDelete(userId);

  // Clear the cookie
  res.clearCookie('token');
  res.send(`User ${userId} deleted successfully`)
}

// getUser controller
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User found successfully', data: user });
};
