// src/components/messaging/MessagingPanel.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import ChatRoom from './ChatRoom';
import { getChats, getContacts } from '../../services/messagingService';

const MessagingPanel = () => {
  const { currentUser } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadMessagingData = async () => {
      try {
        setLoading(true);
        // Load contacts
        const contactsList = await getContacts(currentUser.id);
        setContacts(contactsList);
        
        // Load chats
        const chatList = await getChats(currentUser.id);
        setChats(chatList);
        
        // Select most recent chat if available
        if (chatList.length > 0) {
          const sortedChats = [...chatList].sort((a, b) => 
            new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0)
          );
          setSelectedChat(sortedChats[0]);
        }
        
        setError('');
      } catch (err) {
        console.error('Failed to load messaging data:', err);
        setError('Failed to load messaging data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      loadMessagingData();
    }
  }, [currentUser]);
  
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };
  
  const handleNewMessageReceived = (chatId, message) => {
    // Update chats with the new message
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...(chat.messages || []), message],
            lastMessage: message,
            unreadCount: selectedChat?.id === chatId ? 0 : (chat.unreadCount || 0) + 1
          };
        }
        return chat;
      });
    });
  };
  
  const handleMessageSent = (chatId, message) => {
    // Update chats with the sent message
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...(chat.messages || []), message],
            lastMessage: message,
            unreadCount: 0
          };
        }
        return chat;
      });
    });
  };
  
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Search by chat name
    if (chat.name && chat.name.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Search by participant names
    const participantMatch = chat.participants?.some(
      p => p.name && p.name.toLowerCase().includes(searchLower)
    );
    
    if (participantMatch) return true;
    
    // Search in last message
    if (chat.lastMessage?.content && chat.lastMessage.content.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    return false;
  });
  
  return (
    <div className="flex h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Left sidebar - chat list */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
          </div>
        </div>
        
        {/* Chat list */}
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'No chats match your search.' : 'No chats available.'}
            </div>
          ) : (
            <ul>
              {filteredChats.map((chat) => {
                const otherParticipant = chat.participants?.find(p => p.id !== currentUser.id);
                
                return (
                  <li 
                    key={chat.id}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                      ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-medium">
                        {otherParticipant?.name?.charAt(0) || 'C'}
                      </div>
                      
                      <div className="ml-3 flex-grow min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 truncate">
                            {chat.name || otherParticipant?.name || 'Chat'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessage?.timestamp ? 
                              new Date(chat.lastMessage.timestamp).toLocaleDateString() : ''}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage?.content || 'No messages yet'}
                          </p>
                          
                          {chat.unreadCount > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* New chat button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center">
            <i className="fas fa-plus mr-2"></i>
            New Conversation
          </button>
        </div>
      </div>
      
      {/* Right side - chat room */}
      <div className="flex-grow">
        {selectedChat ? (
          <ChatRoom 
            chat={selectedChat}
            currentUser={currentUser}
            onMessageSent={handleMessageSent}
            onNewMessageReceived={handleNewMessageReceived}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <i className="fas fa-comments text-6xl mb-4"></i>
            <p>Select a conversation or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPanel;