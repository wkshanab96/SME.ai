import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useRouter } from 'next/navigation';
import ChatService, { ChatMessage as DbChatMessage, Chat } from '@/services/chat-service';
import { Card, Loading, Modal, Button } from '@/components/ui';
import { HiOutlineChat, HiOutlineClock, HiOutlineArrowCircleRight } from 'react-icons/hi';

interface ProjectChatHistoryProps {
  projectId: string;
  onSelectChat: (content: string) => void;
}

const ProjectChatHistory: React.FC<ProjectChatHistoryProps> = ({ projectId, onSelectChat }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<{[key: string]: DbChatMessage[]}>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState<{[key: string]: boolean}>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDeleteId, setChatToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !projectId) return;
    
    const fetchProjectChats = async () => {
      setLoading(true);
      try {
        // Get all chats for this project
        const projectChats = await ChatService.getProjectChats(projectId);
        setChats(projectChats);
        
        // Initialize loading state for each chat
        const initialLoadingState: {[key: string]: boolean} = {};
        projectChats.forEach(chat => {
          initialLoadingState[chat.chatId] = true;
        });
        setLoadingMessages(initialLoadingState);
        
        // Load messages for each chat
        const messagesPromises = projectChats.map(async chat => {
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
        console.error('Error fetching project chats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectChats();
  }, [projectId, user]);

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

  // Get first user message from a chat to display as a summary
  const getChatSummary = (chatId: string) => {
    const messages = chatMessages[chatId];
    if (!messages || messages.length === 0) return 'Empty chat';
    
    // Try to find the first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      // Truncate message if too long
      return firstUserMessage.content.length > 60
        ? firstUserMessage.content.substring(0, 60) + '...'
        : firstUserMessage.content;
    }
    
    // If no user message found, return the first message
    return messages[0].content.length > 60
      ? messages[0].content.substring(0, 60) + '...'
      : messages[0].content;
  };

  // When a user selects a chat, use the first message as the new prompt
  const handleSelectChat = (chatId: string) => {
    const messages = chatMessages[chatId];
    if (!messages || messages.length === 0) return;
    
    // Find the first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      onSelectChat(firstUserMessage.content);
    }
  };

  const handleDeleteChat = (chatId: string) => {
 setChatToDeleteId(chatId);
 setIsDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!user || !projectId) return;
    const confirmation = true; // Confirmation is handled by the modal
    if (confirmation && chatToDeleteId) { // Ensure chatToDeleteId is not null
 setLoading(true); // Set loading state while deleting
    try {
 await ChatService.deleteChat(chatToDeleteId);
      // Remove the deleted chat from the state to update the UI without refreshing
 setChats(chats.filter(chat => chat.chatId !== chatToDeleteId));
 } catch (error) {
 console.error('Error deleting chat:', error);
 } finally {
 setIsDeleteModalOpen(false);
 setChatToDeleteId(null);
 setLoading(false); // Reset loading state
 }
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
          No previous chats found for this project.
 </p>
 </Card>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
      {chats.map(chat => (
        <div key={chat.chatId} className="relative group">
          <Card
            // Prevent card click when delete button is clicked
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest('button')) {
                handleSelectChat(chat.chatId);
 }
            }}
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
                      getChatSummary(chat.chatId)
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
 onClick={() => handleDeleteChat(chat.chatId)}
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
        {/* Use chatToDeleteId to ensure we delete the correct chat */}
        <Button onClick={confirmDeleteChat} variant="destructive">Delete</Button> {/* Corrected call to confirmDeleteChat */}
      </div>
    </Modal>
 </div>
 );

};

export default ProjectChatHistory;