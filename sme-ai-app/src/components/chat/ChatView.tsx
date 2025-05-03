import React, { useState, useRef, useEffect } from 'react';
import Message, { MessageRole } from './Message';
import ChatInput from './ChatInput';
import { Card } from '@/components/ui';

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface ChatViewProps {
  projectId?: string; // Optional project ID for project-specific chats
  initialMessages?: ChatMessage[];
}

const ChatView: React.FC<ChatViewProps> = ({ 
  projectId,
  initialMessages = [] 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const [useCloud, setUseCloud] = useState(false);
  const [specialty, setSpecialty] = useState('general');
  const [documentType, setDocumentType] = useState('');
  
  // Track if this is the first message (for input positioning)
  const isFirstMessage = messages.length === 0;
  
  // Reference to messages container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Sample prompt suggestions
  const promptSuggestions = [
    "What are the key requirements in ASME B31.3 for pipe stress analysis?",
    "Can you help me understand API 570 inspection requirements?",
    "What's the difference between a full bore and reduced bore ball valve?",
    "How do I calculate minimum wall thickness for a pressure vessel?"
  ];

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    // Generate a unique ID for the message
    const messageId = Date.now().toString();
    const timestamp = new Date();
    
    // Add user message to the chat
    const userMessage: ChatMessage = {
      id: messageId,
      content,
      role: 'user',
      timestamp
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your backend API
      // For demo purposes, we'll simulate a delay and return a fixed response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate AI response based on user message
      let responseContent = `This is a simulated response to your query about "${content}".`;
      
      // Add context about which features were used
      const contextSources = [];
      if (useInternet) contextSources.push('internet');
      if (useCloud) contextSources.push('cloud');
      if (specialty !== 'general') contextSources.push(`${specialty} specialty`);
      
      if (contextSources.length > 0) {
        responseContent += `\n\nI used the following sources for context: ${contextSources.join(', ')}.`;
      }
      
      // Add document creation context if selected
      if (documentType) {
        responseContent += `\n\nI'll prepare a ${documentType} document based on your request.`;
      }
      
      // Add AI response to the chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: responseContent,
        role: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error - possibly add an error message to the chat
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate bottom padding based on whether there are any messages
  const contentPaddingClass = isFirstMessage ? 'pb-0' : 'pb-32';

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 ${contentPaddingClass}`}>
        {isFirstMessage ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome to SME.AI
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Your intelligent assistant for engineering knowledge
              </p>
            </div>
            
            <div className="w-full max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Try asking about:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {promptSuggestions.map((suggestion, index) => (
                  <Card 
                    key={index}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSendMessage(suggestion)}
                  >
                    <p className="text-gray-800">{suggestion}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <Message
                key={message.id}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <Message
                content=""
                role="ai"
                isLoading={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        isFirstMessage={isFirstMessage}
        onToggleUseInternet={setUseInternet}
        onToggleUseCloud={setUseCloud}
        onSpecialtyChange={setSpecialty}
        onDocumentTypeChange={setDocumentType}
      />
    </div>
  );
};

export default ChatView;