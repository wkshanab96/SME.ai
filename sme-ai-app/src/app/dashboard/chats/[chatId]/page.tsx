'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, Loading } from '@/components/ui';
import ChatView from '@/components/chat/ChatView';
import ChatService, { Chat } from '@/services/chat-service';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const router = useRouter();
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" type="spinner" />
      </div>
    );
  }

  if (error) {
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="text-blue-500 hover:underline flex items-center"
        >
          ← Back to Chat History
        </button>
        <h1 className="text-2xl font-bold mt-4 gradient-text">
          {chat.title || 'Chat'}
        </h1>
      </div>
      
      <ChatView 
        initialChat={chat}
        onUpdateChat={(updatedChat) => setChat(updatedChat)}
      />
    </div>
  );
}