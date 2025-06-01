'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import ChatView from '@/components/chat/ChatView';
import { Loading } from '@/components/ui/Loading';
import ChatService, { Chat } from '@/services/chat-service';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const router = useRouter();
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const fetchChat = async () => {
      if (!user || !chatId) return;
      
      try {
        setLoading(true);
        const chatData = await ChatService.getChat(chatId);
        
        if (!chatData) {
          setError('Chat not found');
          return;
        }
        
        // Verify this chat belongs to the current user
        if (chatData.userId !== user.uid) {
          setError('You do not have permission to view this chat');
          return;
        }
        
        setChat(chatData);
      } catch (err) {
        console.error('Error fetching chat:', err);
        setError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChat();
  }, [chatId, user]);

  // Handle back button click
  const handleBack = () => {
    router.push('/dashboard/chats');
  };

  const handleRenameClick = () => {
    if (chat?.title) {
      setNewTitle(chat.title);
    } else {
      setNewTitle('New Chat Title'); // Default or empty title
    }
    setIsRenaming(true);
  };

  const handleSaveRename = async () => {
    if (!chat || !newTitle.trim() || newTitle === chat.title) {
      setIsRenaming(false);
      return;
    }
    try {
      await ChatService.updateChat(chatId, { title: newTitle.trim() });
      setChat(prevChat => prevChat ? { ...prevChat, title: newTitle.trim() } : null);
    } catch (error) {
      console.error("Failed to rename chat:", error);
      // Optionally, show an error to the user
    }
    setIsRenaming(false);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" type="spinner" />
      </div>
    );
  }

  if (error) {
    // Assuming you have a Card component
    const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>;
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-semibold text-red-500 mb-2">Error</h3>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button 
          onClick={handleBack}
          className="mt-4 text-blue-500 hover:underline"
        >
          Back to Chat History
        </button>
      </Card>
    );
  }

  if (!chat) {
     // Assuming you have a Card component
    const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>;
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Chat not found</p>
        <button 
          onClick={handleBack}
          className="mt-4 text-blue-500 hover:underline"
        >
          Back to Chat History
        </button>
      </Card>
    );
  }


  return (
    <div className="max-w-6xl mx-auto pt-8"> {/* Added pt-8 for space above */}
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
           Back to Chat History
        </button>
        <div className="flex items-center mt-4">
          {isRenaming ? (
            <>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleSaveRename} // Save when input loses focus
                onKeyPress={(e) => { if (e.key === 'Enter') handleSaveRename(); }} // Save on Enter key
                className="text-2xl font-bold mr-2 border-b-2 border-blue-500 dark:border-blue-400 bg-transparent focus:outline-none"
              />
            </>
          ) : (
            <h1 className="text-2xl font-bold mr-2 gradient-text">{chat.title || 'Chat'}</h1>
          )}
          {!isRenaming && (
            <button onClick={handleRenameClick} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FaEdit />
            </button>
          )}
        </div>
      </div>
      
      <ChatView 
        initialChat={chat}
        onUpdateChat={(updatedChat) => setChat(updatedChat)}
      />
    </div>
  );
}