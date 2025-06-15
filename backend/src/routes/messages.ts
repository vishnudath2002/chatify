// routes/messageRoutes.ts
import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import { Server } from 'socket.io';

export default function messageRoutes(io: Server) {
  const router = Router();

  router.post('/', sendMessage(io)); // ✅ pass io here
  router.get('/:senderId/:receiverId', getMessages);

  return router;
}
