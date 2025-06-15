import { Request, Response } from 'express';
import Message from '../models/Message';
import { Server } from 'socket.io';

export const sendMessage = (io: Server) => async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    await message.save();

    // Emit to both receiver and sender
    io.to(receiverId).to(senderId).emit('newMessage', message)

    res.status(201).json(message);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort('timestamp');
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};