import React, { useState, useRef, useEffect } from 'react';
import Message, { MessageRole } from './Message';
import ChatInput from './ChatInput';
import { Card } from '@/components/ui';

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  isNew?: boolean; // Added flag to track new messages for animation
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
  const [showInputAnimation, setShowInputAnimation] = useState(false);
  
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
    
    // Add user message to the chat with isNew flag
    const userMessage: ChatMessage = {
      id: messageId,
      content,
      role: 'user',
      timestamp,
      isNew: true
    };
    
    // Trigger input animation - moving down
    setShowInputAnimation(true);
    
    // Add the user message
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
      
      // Add AI response to the chat with isNew flag
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        content: responseContent,
        role: 'ai',
        timestamp: new Date(),
        isNew: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Reset isNew flag after animation completes
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id || msg.id === aiMessage.id 
              ? { ...msg, isNew: false } 
              : msg
          )
        );
        setShowInputAnimation(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setShowInputAnimation(false);
      // Handle error - possibly add an error message to the chat
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-[#111827]">
      {/* Centered content with welcome message for empty state */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome to SME.AI
            </h1>
            <p className="text-xl text-gray-300">
              Your intelligent assistant for engineering knowledge
            </p>
          </div>
          
          {/* Input box for empty state */}
          <div className={`w-full max-w-2xl px-4 mt-8 ${showInputAnimation ? 'transform translate-y-10 opacity-0 transition-all duration-300' : ''}`}>
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
          
          {/* Suggestions below the input */}
          <div className="w-full max-w-2xl px-4 mt-10">
            <h2 className="text-lg font-semibold text-gray-300 mb-3 text-center">
              Try asking about:
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {promptSuggestions.map((suggestion, index) => (
                <Card 
                  key={index}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-800 border border-gray-700 hover:border-blue-500 transition-colors duration-200"
                  onClick={() => handleSendMessage(suggestion)}
                >
                  <p className="text-gray-200">{suggestion}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Conversation view for when messages exist */}
      {messages.length > 0 && (
        <div className="flex flex-col h-full">
          {/* Messages Area - aligned to take up full height */}
          <div className="flex-grow overflow-y-auto pt-4 pb-36">
            <div className="flex flex-col w-full max-w-4xl mx-auto px-4 space-y-8">
              {messages.map(message => (
                <Message
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                  isNew={message.isNew}
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
            </div>
          </div>
          
          {/* Input Area - fixed at bottom with centered input like in Perplexity */}
          <div className="fixed bottom-0 left-0 right-0 pb-6 pt-10 bg-gradient-to-t from-[#111827] to-transparent">
            <div className="flex items-center justify-center">
              <div className={`w-full max-w-xl mx-auto px-4 ${showInputAnimation ? 'transform translate-y-10 opacity-0 transition-all duration-300' : 'transform translate-y-0 opacity-100 transition-all duration-300'}`}>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                  isFirstMessage={false}
                  onToggleUseInternet={setUseInternet}
                  onToggleUseCloud={setUseCloud}
                  onSpecialtyChange={setSpecialty}
                  onDocumentTypeChange={setDocumentType}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;