import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import ChatService, { ChatMessage as DbChatMessage, Chat } from '@/services/chat-service';
import { Card, Loading, Modal, Button } from '@/components/ui';
import { HiOutlineChat, HiOutlineClock, HiOutlineArrowCircleRight } from 'react-icons/hi';

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSelectChat }) => {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<{[key: string]: DbChatMessage[]}>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState<{[key: string]: boolean}>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDeleteId, setChatToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserChats = async () => {
      setLoading(true);
      try {
        // Get all standalone chats (those without projectId)
        const userChats = await ChatService.getUserChats(user.uid);
        const standaloneChats = userChats.filter(chat => !chat.projectId);
        setChats(standaloneChats);
        
        // Initialize loading state for each chat
        const initialLoadingState: {[key: string]: boolean} = {};
        standaloneChats.forEach(chat => {
          initialLoadingState[chat.chatId] = true;
        });
        setLoadingMessages(initialLoadingState);
        
        // Load messages for each chat
        const messagesPromises = standaloneChats.map(async chat => {
          const messages = await ChatService.getChatMessages(chat.chatId);
          return { chatId: chat.chatId, messages };
        });
        
        const allMessages = await Promise.all(messagesPromises);
        
        // Create a map of chatId -> messages
        const messagesMap: {[key: string]: DbChatMessage[]} = {};
        allMessages.forEach(item => {
          messagesMap[item.chatId] = item.messages;
          
          // Mark this chat as loaded
          setLoadingMessages(prev => ({
            ...prev,
            [item.chatId]: false
          }));
        });
        
        setChatMessages(messagesMap);
      } catch (error) {
        console.error('Error fetching user chats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserChats();
  }, [user]);

  // Format the timestamp in a readable format
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Get first user message from a chat to display as a summary or use the title
  const getChatSummary = (chat: Chat) => {
    // First try to use the chat title if it's meaningful
    if (chat.title && chat.title !== 'New Chat' && chat.title.length > 0) {
      return chat.title.length > 60
        ? chat.title.substring(0, 60) + '...'
        : chat.title;
    }
    
    // Otherwise try to find the first user message
    const messages = chatMessages[chat.chatId];
    if (!messages || messages.length === 0) return 'Empty chat';
    
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 60
        ? firstUserMessage.content.substring(0, 60) + '...'
        : firstUserMessage.content;
    }
    
    // If no user message found, return the first message
    return messages[0].content.length > 60
      ? messages[0].content.substring(0, 60) + '...'
      : messages[0].content;
  };

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
  };

  // Handle chat deletion
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChatToDeleteId(chatId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!user || !chatToDeleteId) return;
    
    setLoading(true);
    try {
      await ChatService.deleteChat(chatToDeleteId);
      // Remove the deleted chat from the state
      setChats(chats.filter(chat => chat.chatId !== chatToDeleteId));
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setChatToDeleteId(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loading size="md" type="spinner" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No previous chats found. Start a new conversation!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
      {chats.map(chat => (
        <div key={chat.chatId} className="relative group">
          <Card
            onClick={() => handleSelectChat(chat.chatId)}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <HiOutlineChat className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 leading-tight mb-2">
                    {loadingMessages[chat.chatId] ? (
                      <div className="flex items-center">
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ) : (
                      getChatSummary(chat)
                    )}
                  </h3>
                  <div className="flex-shrink-0">
                    <HiOutlineArrowCircleRight className="w-5 h-5 text-blue-500" />
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <HiOutlineClock className="mr-1" />
                  <span>{formatTime(chat.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Add a subtle gradient highlight effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 hover:opacity-100 rounded-md transition-opacity pointer-events-none"></div>
          </Card>

          {/* Delete Button - appears on hover */}
          <button
            onClick={(e) => handleDeleteChat(e, chat.chatId)}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to delete this chat? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteChat} variant="destructive">Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ChatHistory;