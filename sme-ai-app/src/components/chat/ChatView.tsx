import React, { useState, useRef, useEffect } from 'react';
import Message, { MessageRole } from './Message';
import ChatInput from './ChatInput';
import ChatLayout from './ChatLayout';
import { Card, Loading } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import ChatService, { ChatMessage as DbChatMessage } from '@/services/chat-service';
import ProjectService from '@/services/project-service';
import ProjectChatHistory from './ProjectChatHistory';

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

// Chat suggestions for regular chat view
const chatSuggestions = [
  {
    title: "Engineering Assistance",
    items: [
      { content: "How do I calculate the pressure drop in a pipe system?", icon: "🔧" },
      { content: "What are the best practices for electrical grounding in industrial settings?", icon: "⚡" },
      { content: "Explain PID control systems with examples", icon: "🔄" }
    ]
  },
  {
    title: "Documentation Help",
    items: [
      { content: "Create a technical specification template for a pump system", icon: "📝" },
      { content: "Help me draft safety procedures for chemical handling", icon: "🧪" },
      { content: "Generate an equipment maintenance checklist", icon: "📋" }
    ]
  },
  {
    title: "Project Management",
    items: [
      { content: "What are common risks in engineering projects?", icon: "⚠️" },
      { content: "How to estimate project timeline for mechanical installation?", icon: "⏱️" },
      { content: "Best practices for managing contractor relationships", icon: "🤝" }
    ]
  }
];

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
  const [projectName, setProjectName] = useState('');
  
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

  // Check for pending message in sessionStorage when component mounts
  useEffect(() => {
    const pendingMessage = sessionStorage.getItem('pendingChatMessage');
    if (pendingMessage && user && projectId) {
      // Clear the pending message right away to prevent duplicate processing
      sessionStorage.removeItem('pendingChatMessage');
      // Process the pending message
      handleSendMessage(pendingMessage);
    }
  }, [user, projectId]);

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
          setProjectName(project?.name || '');
        } else {
          const project = await ProjectService.getProject(projectId);
          setProjectName(project?.name || '');
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
    
    // Only trigger input animation if this is the first message (empty state to conversation state)
    if (messages.length === 0) {
      setShowInputAnimation(true);
    }
    
    // Add the user message
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      let activeChatId = chatId;
      
      // Create a new chat if none exists
      if (!activeChatId) {
        // Create message with or without projectId based on context
        const newChat = await ChatService.createChat(
          user.uid, 
          content.substring(0, 30) + '...',
          projectId || null // Use null instead of undefined for Firestore
        );
        activeChatId = newChat.chatId;
        setChatId(activeChatId);
      }
      
      // Create user message object with common fields
      const messageData: any = {
        content,
        role: 'user',
        timestamp: new Date(),
        userId: user.uid
      };
      
      // Only add projectId if it's defined (to avoid Firebase errors with undefined values)
      if (projectId) {
        messageData.projectId = projectId;
      }
      
      // Save the user message to the database
      const savedUserMessage = await ChatService.addMessage(activeChatId, messageData);
      
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
      
      // Create AI message object with common fields
      const aiMessageData: any = {
        content: responseContent,
        role: 'ai',
        timestamp: new Date(),
        userId: user.uid
      };
      
      // Only add projectId if it's defined (to avoid Firebase errors with undefined values)
      if (projectId) {
        aiMessageData.projectId = projectId;
      }
      
      // Save the AI response to the database
      const savedAiMessage = await ChatService.addMessage(activeChatId, aiMessageData);
      
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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" type="spinner" className="mb-4" />
          <p style={{ color: `rgb(var(--foreground-rgb))` }}>Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Back to Project button - matches the design in the screenshot */}
      {projectId && (
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => window.location.href = `/dashboard/projects/${projectId}`}
            className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-gray-200 py-2 px-3 rounded-lg transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            
          </button>
        </div>
      )}
      
      {/* Centered content with welcome message for empty state */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {projectId ? 'Project Assistant' : 'Welcome to SME.AI'}
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ 
              color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' 
            }}>
              {projectId 
                ? 'Ask questions related to this project' 
                : 'Your intelligent assistant for engineering knowledge'
              }
            </p>
          </div>
          
          {/* Input box for empty state - centered and with max width */}
          <div className={`w-full max-w-xl mx-auto ${showInputAnimation ? 'transform translate-y-10 opacity-0 transition-all duration-300' : ''}`}>
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
          
          {/* Display different content based on whether this is a project view or normal chat view */}
          <div className="w-full max-w-5xl mt-12">
            {projectId ? (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center" style={{ 
                  color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'
                }}>
                  Project Chat History
                </h2>
                
                <div className="space-y-3 max-w-2xl mx-auto">
                  <ProjectChatHistory 
                  projectId={projectId as string} 
                  onSelectChat={(content: string) => handleSendMessage(content)} 
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-6 text-center" style={{ 
                  color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'
                }}>
                  Try asking about
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {chatSuggestions.map((category, idx) => (
                    <Card key={idx} className="p-5 border-t-4 hover:shadow-md transition-shadow" style={{
                      borderTopColor: idx === 0 ? '#3B82F6' : idx === 1 ? '#8B5CF6' : '#EC4899'
                    }}>
                      <h3 className="text-lg font-semibold mb-3" style={{ 
                        color: resolvedTheme === 'dark' ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)'
                      }}>
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((item, i) => (
                          <button 
                            key={i}
                            onClick={() => handleSendMessage(item.content)}
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                          >
                            <span className="mr-3 text-xl">{item.icon}</span>
                            <span className="text-sm leading-tight" style={{ 
                              color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)'
                            }}>
                              {item.content}
                            </span>
                          </button>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Conversation view for when messages exist - using the new ChatLayout */}
      {messages.length > 0 && (
        <ChatLayout 
          inputComponent={
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              isFirstMessage={false}
              onToggleUseInternet={setUseInternet}
              onToggleUseCloud={setUseCloud}
              onSpecialtyChange={setSpecialty}
              onDocumentTypeChange={setDocumentType}
            />
          }
          showInputAnimation={showInputAnimation}
          isLoading={isLoading}
        >
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
        </ChatLayout>
      )}
    </div>
  );
};

export default ChatView;