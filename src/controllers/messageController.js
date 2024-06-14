import { Message } from '../models/messageModel.js';
import { encrypt, decrypt } from '../utils/encription.js';
import { AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../configs/env.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
// Controller to send a new message
export const sendMessage = async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    // Encrypt the message before saving
    const encryptedMessage = encrypt(text);

    const message = new Message({
        sender: userId,
        receiver: friendId,
        text: encryptedMessage.encryptedData,
        iv: encryptedMessage.iv,
        status: 'Sent',
    });
    await message.save();

    res.status(201).json({ message: 'Message sent successfully', data: message });
};

// Controller to get a specific message by ID
export const getMessageById = async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    // decrypt message
    message.text = decrypt({ encryptedData: message.text, iv: message.iv });

    res.status(200).json({ message: 'Message retrieved successfully', data: message });
};

// Controller to get messages between two users
export const getMessages = async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
        $or: [
            { sender: userId, receiver: friendId },
            { sender: friendId, receiver: userId },
        ],
    }).sort('createdAt');

    // decrypt messages
    messages.forEach((message) => {
        message.text = decrypt({ encryptedData: message.text, iv: message.iv });
    });

    res.status(200).json({ message: 'Messages retrieved successfully', data: messages });
};

// Controller to update a message
export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    res.status(200).json({ message: 'Message status updated successfully', data: message });
};

// Controller to delete a message
export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const message = await Message.deleteOne({ _id: id, sender: userId });
    if (!message) {
        return res.status(404).send({ error: 'Message not found' });
    }
    res.send(`Message with ID ${id} deleted successfully`);
};

// Controller to delete all messages between two users
export const deleteAllMessageSpecificUser = async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user._id;
    await Message.deleteMany({
        $or: [
            { sender: userId, receiver: friendId },
            { sender: friendId, receiver: userId },
        ],
    });
    res.send(`All messages between user with ID ${userId} and user with ID ${friendId} deleted successfully`)
};

// Controller to upload a file
export const uploadFile = async (req, res) => {
    const s3Client = new S3Client({
        region: AWS_REGION,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
    });
    const fileContent = fs.readFileSync(req.file.path);
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: req.file.filename,
        Body: fileContent,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    res.status(200).json({ message: 'File uploaded successfully' });
};