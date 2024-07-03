// Server Setup
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { mongoConnection } from './database/db.js';
import { DB_URI, PORT } from './configs/env.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import { errorHandler } from './middlewares/errorHandlers.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Initialize Express App and HTTP Server
const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
mongoConnection(DB_URI);

// CORS Configuration
const corsOptions = {
  origin: ['https://nik6348.github.io/Chat-App-FE/#/', 'http://localhost:5173'],
  credentials: true,
};

// Apply Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// Define Routes
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/friend', friendRoutes);
app.use('/', (req, res) => {
  res.send('Welcome to Chat App API');
});

// Error Handling Middleware
app.use(errorHandler);

// Initialize Socket.io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io Events
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  socket.join(userId);

  console.log(`User ${userId} connected`);

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
    socket.leave(userId);
  });

  socket.on('send_message', async (msg) => {
    console.log('Message sent:', msg);
    // Emit the message to the recipient
    io.to(msg.receiver).emit('receive_message', msg);
  });

  socket.on('message_delivered', async ({ messageId }) => {
    console.log('Message delivered:', messageId);
    // Emit the status update to the recipient
    io.emit('update_message_status', { messageId, status: 'Delivered' });
  });

  socket.on('message_seen', async ({ messageId }) => {
    console.log('Message seen:', messageId);
    // Emit the status update to the recipient
    io.emit('update_message_status', { messageId, status: 'Seen' });
  });
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});