import React, { useState, useRef, useEffect } from 'react';
import Message, { MessageRole } from './Message';
import ChatInput from './ChatInput';
import { Card, Loading } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import ChatService, { ChatMessage as DbChatMessage } from '@/services/chat-service';
import ProjectService from '@/services/project-service';

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  isNew?: boolean;
}

export interface ChatViewProps {
  projectId?: string;
  initialMessages?: ChatMessage[];
}

const ChatView: React.FC<ChatViewProps> = ({ 
  projectId,
  initialMessages = [] 
}) => {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const [useCloud, setUseCloud] = useState(false);
  const [specialty, setSpecialty] = useState('general');
  const [documentType, setDocumentType] = useState('');
  const [showInputAnimation, setShowInputAnimation] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
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

  // Load chat history for project
  useEffect(() => {
    if (!user || !projectId) return;
    
    const loadChatHistory = async () => {
      try {
        setIsLoadingHistory(true);
        
        // Get project chats
        const projectChats = await ChatService.getProjectChats(projectId);
        
        // Use most recent chat or create a new one
        let activeChat = projectChats[0];
        
        if (!activeChat) {
          // Create a new chat for this project
          const project = await ProjectService.getProject(projectId);
          const chatTitle = project ? `${project.name} Chat` : 'New Project Chat';
          activeChat = await ChatService.createChat(user.uid, chatTitle, projectId);
        }
        
        setChatId(activeChat.chatId);
        
        // Load messages if available
        if (activeChat.chatId) {
          const chatMessages = await ChatService.getChatMessages(activeChat.chatId);
          
          // Map database messages to component format
          const formattedMessages: ChatMessage[] = chatMessages.map(msg => ({
            id: msg.id,
            content: msg.content,
            role: msg.role,
            timestamp: msg.timestamp
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadChatHistory();
  }, [user, projectId]);

  // Sample prompt suggestions
  const promptSuggestions = [
    "What are the key requirements in ASME B31.3 for pipe stress analysis?",
    "Can you help me understand API 570 inspection requirements?",
    "What's the difference between a full bore and reduced bore ball valve?",
    "How do I calculate minimum wall thickness for a pressure vessel?"
  ];

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!user) return;
    
    // Generate a temporary ID for the message
    const tempMessageId = `temp-${Date.now()}`;
    const timestamp = new Date();
    
    // Add user message to the chat with isNew flag
    const userMessage: ChatMessage = {
      id: tempMessageId,
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
      let activeChatId = chatId;
      
      // Create a new chat if none exists
      if (!activeChatId) {
        const newChat = await ChatService.createChat(
          user.uid, 
          content.substring(0, 30) + '...',
          projectId
        );
        activeChatId = newChat.chatId;
        setChatId(activeChatId);
      }
      
      // Save the user message to the database
      const savedUserMessage = await ChatService.addMessage(activeChatId, {
        content,
        role: 'user',
        timestamp: new Date(),
        userId: user.uid,
        projectId
      });
      
      // In a real implementation, this would call your AI service
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
      
      if (projectId) {
        responseContent += `\n\nI'm responding in the context of your current project.`;
      }
      
      // Add document creation context if selected
      if (documentType) {
        responseContent += `\n\nI'll prepare a ${documentType} document based on your request.`;
      }
      
      // Save the AI response to the database
      const savedAiMessage = await ChatService.addMessage(activeChatId, {
        content: responseContent,
        role: 'ai',
        timestamp: new Date(),
        userId: user.uid,
        projectId
      });
      
      // Add AI response to the chat with isNew flag
      const aiMessage: ChatMessage = {
        id: savedAiMessage.id,
        content: responseContent,
        role: 'ai',
        timestamp: new Date(),
        isNew: true
      };
      
      // Update messages, replacing the temp user message with the saved one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessageId ? { ...msg, id: savedUserMessage.id } : msg)
          .concat([aiMessage])
      );
      
      // Reset isNew flag after animation completes
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            (msg.id === savedUserMessage.id || msg.id === savedAiMessage.id) 
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

  if (isLoadingHistory) {
    return (
      <div className="h-full flex items-center justify-center" style={{ 
        backgroundColor: resolvedTheme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(249, 250, 251)' 
      }}>
        <div className="text-center">
          <Loading size="lg" type="spinner" className="mb-4" />
          <p style={{ color: `rgb(var(--foreground-rgb))` }}>Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative" style={{ 
      backgroundColor: resolvedTheme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(249, 250, 251)'
    }}>
      {/* Centered content with welcome message for empty state */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {projectId ? 'Project Assistant' : 'Welcome to SME.AI'}
            </h1>
            <p className="text-xl" style={{ 
              color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' 
            }}>
              {projectId 
                ? 'Ask questions related to this project' 
                : 'Your intelligent assistant for engineering knowledge'
              }
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
            <h2 className="text-lg font-semibold mb-3 text-center" style={{ 
              color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'
            }}>
              Try asking about:
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {promptSuggestions.map((suggestion, index) => (
                <Card 
                  key={index}
                  variant="outline"
                  padding="sm"
                  className="cursor-pointer hover:border-blue-500 transition-colors duration-200"
                  onClick={() => handleSendMessage(suggestion)}
                >
                  <p style={{ color: `rgb(var(--foreground-rgb))` }}>{suggestion}</p>
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
          <div className="fixed bottom-0 left-0 right-0 pb-6 pt-10" style={{
            background: resolvedTheme === 'dark' 
              ? 'linear-gradient(to top, rgb(17, 24, 39), transparent)'
              : 'linear-gradient(to top, rgb(249, 250, 251), transparent)'
          }}>
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