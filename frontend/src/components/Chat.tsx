import React, { useState, useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import axios from 'axios';
import { Message, User } from '../types';

interface ChatProps {
  currentUserId: string;
  receiverId: string;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [receiver, setReceiver] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch receiver details
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${receiverId}`);
        console.log(res)
        setReceiver(res.data);
      } catch (error) {
        console.error('Error fetching receiver:', error);
      }
    };
    fetchReceiver();
  }, [receiverId]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/messages/${currentUserId}/${receiverId}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [currentUserId, receiverId]);

  // Socket.IO for real-time messaging
  useEffect(() => {
    const socket: typeof Socket = io('http://localhost:5000');
    socket.emit('join', currentUserId);

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/messages', {
        senderId: currentUserId,
        receiverId,
        content,
      });
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50 flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
          {receiver?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {receiver?.username || 'Loading...'}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-4 flex ${
                msg.sender === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg transition-all duration-200 ${
                  msg.sender === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-3 border rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            disabled={!content.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;