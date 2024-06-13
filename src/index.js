// /server.js
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

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['https://nik6348.github.io', 'http://localhost:5173'],
    credentials: true,
  }
});

mongoConnection(DB_URI);


app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/friend', friendRoutes);

app.use('/', (req, res) => {
  res.send('Welcome to Chat App API');
});

app.use(errorHandler);


// Socket IO
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  socket.join(userId);
  console.log('User connected: ', userId);

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

  socket.on('disconnect', () => {
    console.log('User disconnected', userId);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});