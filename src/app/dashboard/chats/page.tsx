'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlinePlus } from 'react-icons/hi';
import { Button, Card } from '@/components/ui';
import ChatHistory from '@/components/chat/ChatHistory';

export default function ChatsPage() {
  const router = useRouter();
  
  return (
    <div className="max-w-6xl mx-auto pt-8"> {/* Added pt-8 for space above */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold gradient-text">Chat History</h1>
        <Button
          onClick={() => router.push('/dashboard/chats/new')}
          className="flex items-center text-sm" // Added text-sm for minimal appearance
          variant="primary"
        >
          <HiOutlinePlus className="mr-1.5 h-4 w-4" /> New Chat {/* Adjusted icon margin and size */}
        </Button>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          View and continue your previous conversations with the AI assistant.
        </p>
        
        <Card className="p-4 md:p-6 shadow-sm">
          <ChatHistory 
            onSelectChat={(chatId) => router.push(`/dashboard/chats/${chatId}`)}
          />
        </Card>
      </div>
    </div>
  );
}