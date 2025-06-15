import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import { User } from '../types';

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        navigate('/login'); // Redirect to login on error (e.g., unauthorized)
      }
    };
    fetchUsers();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white shadow-lg p-6 flex flex-col transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Chat</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your User
          </label>
          <select
            onChange={(e) => setCurrentUserId(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="">Choose your user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Contacts</h3>
        <ul className="flex-1 overflow-y-auto">
          {users
            .filter((u) => u._id !== currentUserId)
            .map((u) => (
              <li
                key={u._id}
                onClick={() => setSelectedUser(u._id)}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedUser === u._id
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                  {u.username[0].toUpperCase()}
                </div>
                <span className="font-medium">{u.username}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentUserId && selectedUser ? (
          <Chat currentUserId={currentUserId} receiverId={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <p className="text-gray-500 text-lg">
              Select a user and contact to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;