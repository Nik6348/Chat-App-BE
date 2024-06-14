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

// Server Setup
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// Database Connection
mongoConnection(DB_URI);

// Middlewares
app.use(cors({
  origin: 'https://nik6348.github.io',
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(helmet());
app.use(cookieParser())

// Routes
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/friend', friendRoutes);

app.use('/', (req, res) => {
  res.send('Welcome to Chat App API');
});

// Error Handling
app.use(errorHandler);

// Real-time Messaging Setup
io.on('connection', (socket) => {
  // Join a room with the user's ID
  const userId = socket.handshake.query.userId;
  socket.join(userId);

  console.log(`User ${userId} connected`);

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
    socket.leave(userId);
  });

  socket.on('send_message', (msg) => {
    console.log('Message received on server: ', msg);
    io.to(msg.receiver).emit('receive_message', msg);
  });

  socket.on('message_delivered', ({ messageId }) => {
    io.emit('update_message_status', { messageId, status: 'Delivered' });
  });

  socket.on('message_seen', ({ messageId }) => {
    io.emit('update_message_status', { messageId, status: 'Seen' });
  });
});
// Listen on the HTTP server, not the Express app
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});