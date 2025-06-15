// server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import messageRoutes from './routes/messages';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!, {

} as any)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/messages', messageRoutes(io)); // ✅ fixed this line
app.use('/api/users', userRoutes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
