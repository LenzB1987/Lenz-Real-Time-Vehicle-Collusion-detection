// src/components/messaging/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getMessages } from '../../services/messagingService';

const ChatRoom = ({ chat, currentUser, onMessageSent, onNewMessageReceived }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const otherParticipant = chat.participants?.find(p => p.id !== currentUser?.id);
  
  // Load messages when chat changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!chat || !chat.id) return;
      
      try {
        setLoading(true);
        const messageList = await getMessages(chat.id);
        setMessages(messageList);
        setError('');
      } catch (err) {
        console.error('Failed to load messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [chat]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Set up "simulated" real-time messaging
  useEffect(() => {
    if (!chat || !chat.id) return;
    
    // Simulate receiving message every few seconds (for demo purposes)
    const simulateIncomingMessage = () => {
      // Only simulate response if the selected chat is from the system
      if (otherParticipant?.role === 'system' && Math.random() > 0.7) {
        const responses = [
          "I've updated the collision detection algorithm.",
          "The latest safety metrics are now available.",
          "New accident hotspot identified on Kampala Road.",
          "System maintenance scheduled for this weekend.",
          "Please review the latest safety recommendations."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const newMsg = {
          id: Date.now().toString(),
          chatId: chat.id,
          senderId: otherParticipant.id,
          content: randomResponse,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        setMessages(prev => [...prev, newMsg]);
        onNewMessageReceived(chat.id, newMsg);
      }
    };
    
    const intervalId = setInterval(simulateIncomingMessage, 45000 + Math.random() * 30000);
    
    return () => clearInterval(intervalId);
  }, [chat, otherParticipant, onNewMessageReceived]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const message = {
        chatId: chat.id,
        content: newMessage,
        senderId: currentUser.id,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Add optimistically to UI
      const optimisticMessage = { ...message, id: `temp-${Date.now()}`, sending: true };
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      
      // Send to server
      const sentMessage = await sendMessage(message);
      
      // Replace optimistic message with actual message
      setMessages(prev => 
        prev.map(msg => msg.id === optimisticMessage.id ? sentMessage : msg)
      );
      
      // Notify parent component
      onMessageSent(chat.id, sentMessage);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove failed optimistic message
      setMessages(prev => prev.filter(msg => !msg.sending));
    }
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          {otherParticipant?.name?.charAt(0) || 'C'}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">
            {chat.name || otherParticipant?.name || 'Chat'}
          </h3>
          <p className="text-xs text-gray-500">
            {otherParticipant?.role ? `${otherParticipant.role.charAt(0).toUpperCase() + otherParticipant.role.slice(1)}` : 'User'}
          </p>
        </div>
        <button className="ml-auto p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
      
      {/* Messages container */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="bg-red-50 text-red-800 p-3 rounded-md">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <i className="fas fa-comment-dots text-4xl mb-2"></i>
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser.id;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isCurrentUser 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    } ${message.sending ? 'opacity-70' : ''}`}
                  >
                    <div className="mb-1">{message.content}</div>
                    <div className={`text-xs flex justify-end ${
                      isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                      {isCurrentUser && (
                        <span className="ml-1">
                          {message.sending ? (
                            <i className="fas fa-clock"></i>
                          ) : message.read ? (
                            <i className="fas fa-check-double"></i>
                          ) : (
                            <i className="fas fa-check"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 resize-none"
              rows="2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              newMessage.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;