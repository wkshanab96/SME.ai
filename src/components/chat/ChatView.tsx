import React, { useState, useRef, useEffect } from 'react';
import Message, { MessageRole } from './Message';
import ChatInput from './ChatInput';
import ChatLayout from './ChatLayout';
import { Card, Loading } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import ChatService, { ChatMessage as DbChatMessage, Chat } from '@/services/chat-service';
import ProjectService from '@/services/project-service';
import ProjectChatHistory from './ProjectChatHistory';
import N8NService from '@/services/n8n-service';

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
  initialChat?: Chat;
  onUpdateChat?: (updatedChat: Chat) => void;
}

// Chat suggestions for regular chat view
const chatSuggestions = [
  {
    title: 'Engineering Assistance',
    items: [
      { content: 'How do I calculate the pressure drop in a pipe system?', icon: '🔧' },
      { content: 'What are the best practices for electrical grounding in industrial settings?', icon: '⚡' },
      { content: 'Explain PID control systems with examples', icon: '🔄' }
    ]
  },
  {
    title: 'Documentation Help',
    items: [
      { content: 'Create a technical specification template for a pump system', icon: '📄' },
      { content: 'Help me draft safety procedures for chemical handling', icon: '🧪' },
      { content: 'Generate an equipment maintenance checklist', icon: '✅' }
    ]
  },
  {
    title: 'Project Management',
    items: [
      { content: 'What are common risks in engineering projects?', icon: '⚠️' },
      { content: 'How to estimate project timeline for mechanical installation?', icon: '⏱️' },
      { content: 'Best practices for managing contractor relationships', icon: '👥' }
    ]
  }
];

const ChatView: React.FC<ChatViewProps> = ({ 
  projectId,
  initialMessages = [],
  initialChat,
  onUpdateChat
}) => {  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const [useCloud, setUseCloud] = useState(false);
  const [specialty, setSpecialty] = useState('general');
  const [documentType, setDocumentType] = useState('');
  const [showInputAnimation, setShowInputAnimation] = useState(false);
  const [chatId, setChatId] = useState<string | null>(initialChat ? initialChat.chatId : null);
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

  // Load messages from initialChat if provided
  useEffect(() => {
    // Skip if we already have messages or no initial chat
    if (messages.length > 0 || !initialChat || !user) return;
    
    const loadInitialChatMessages = async () => {
      try {
        setIsLoadingHistory(true);
        
        setChatId(initialChat.chatId);
        
        // Load messages from the chat
        const chatMessages = await ChatService.getChatMessages(initialChat.chatId);
        
        // Map database messages to component format
        const formattedMessages: ChatMessage[] = chatMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: msg.timestamp
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading chat messages:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadInitialChatMessages();
  }, [initialChat, messages.length, user]);

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
  const handleSendMessage = async (content: string, attachments?: File[]) => {
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
      isNew: messages.length === 0 // Only mark as new for the first message
    };
    
    // Animation for transitioning from empty state to conversation
    if (messages.length === 0) {
      setShowInputAnimation(true);
      // Add message immediately for better synchronization
      setMessages(prev => [...prev, userMessage]);
    } else {
      // Add the message immediately if not the first message
      setMessages(prev => [...prev, userMessage]);
    }
    
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
          projectId || undefined // Pass undefined when projectId doesn't exist
        );
        activeChatId = newChat.chatId;
        setChatId(activeChatId);
        if (onUpdateChat) {
          onUpdateChat(newChat);
        }
      }
        // Create user message object with common fields
      const messageData: any = {
        content,
        role: 'user',
        timestamp: new Date(),
        userId: user.uid
      };
      
      // Only add projectId if it's defined and not null (to avoid Firebase errors with undefined values)
      if (projectId && projectId !== undefined) {
        messageData.projectId = projectId;
      }
      
      // Save the user message to the database
      const savedUserMessage = await ChatService.addMessage(activeChatId, messageData);      // Prepare data for N8N webhook
      const n8nRequest = {
        userMessage: content,
        attachments: attachments || [],
        settings: {
          useInternet,
          useCloud,
          specialty,
          documentType
        },
        userId: user.uid,
        projectId: projectId || undefined, // Send undefined if projectId is falsy
        chatId: activeChatId
      };

      // Send request to N8N webhook
      let responseContent = '';
        if (N8NService.isConfigured()) {
        try {
          console.log('Sending request to N8N:', n8nRequest);
          const n8nResponse = await N8NService.sendChatRequest(n8nRequest);
          
          console.log('N8N Response received:', n8nResponse);
          console.log('N8N Response success:', n8nResponse.success);
          console.log('N8N Response response:', n8nResponse.response);
          console.log('N8N Response error:', n8nResponse.error);
          
          if (n8nResponse.success) {
            if (n8nResponse.response && n8nResponse.response.trim()) {
              responseContent = n8nResponse.response;
            } else {
              responseContent = 'N8N webhook responded successfully but returned empty content.';
              console.warn('N8N returned empty response:', n8nResponse);
            }
          } else {
            const errorMsg = n8nResponse.error || 'Unknown error - N8N returned success=false but no error message';
            responseContent = `Error from N8N: ${errorMsg}`;
            console.error('N8N Error Details:', {
              success: n8nResponse.success,
              error: n8nResponse.error,
              response: n8nResponse.response,
              rawResponse: n8nResponse.rawResponse
            });
          }
        } catch (error) {
          console.error('Error calling N8N webhook:', error);
          responseContent = 'Sorry, there was an error processing your request. Please try again.';
        }
      } else {
        // Fallback response when N8N is not configured
        responseContent = `This is a simulated response to your query about "${content}".`;
        
        // Add context about which features were used
        const contextSources = [];
        if (useInternet) contextSources.push('internet');
        if (useCloud) contextSources.push('cloud');
        if (specialty !== 'general') contextSources.push(`${specialty} specialty`);
        
        if (contextSources.length > 0) {
          responseContent += `\n\nI used the following sources for context: ${contextSources.join(', ')}.`;
        }
        
        if (projectId) {
          responseContent += '\n\nI\'m responding in the context of your current project.';
        }
        
        // Add document creation context if selected
        if (documentType) {
          responseContent += `\n\nI'll prepare a ${documentType} document based on your request.`;
        }

        if (attachments && attachments.length > 0) {
          responseContent += `\n\nI received ${attachments.length} attachment(s): ${attachments.map(f => f.name).join(', ')}.`;
        }

        // Simulate delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
        // Create AI message object with common fields
      const aiMessageData: any = {
        content: responseContent,
        role: 'ai',
        timestamp: new Date(),
        userId: user.uid
      };
      
      // Only add projectId if it's defined and not null (to avoid Firebase errors with undefined values)
      if (projectId && projectId !== undefined) {
        aiMessageData.projectId = projectId;
      }
      
      // Save the AI response to the database
      const savedAiMessage = await ChatService.addMessage(activeChatId, aiMessageData);
      
      // Add AI response to the chat with isNew flag only for the first message
      const aiMessage: ChatMessage = {
        id: savedAiMessage.id,
        content: responseContent,
        role: 'ai',
        timestamp: new Date(),
        isNew: messages.length <= 1 // Only animate for the first conversation
      };
      
      // Update messages, replacing the temp user message with the saved one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessageId ? { ...msg, id: savedUserMessage.id } : msg)
          .concat([aiMessage])
      );
      
      // Reset animations only for the first message exchange
      if (messages.length <= 1) {
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              (msg.id === savedUserMessage.id || msg.id === savedAiMessage.id) 
                ? { ...msg, isNew: false } 
                : msg
            )
          );
          // Reset animation state to complete the transition
          setShowInputAnimation(false);
        }, 1000);
      }
      
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
          <p style={{ color: 'rgb(var(--foreground-rgb))' }}>Loading chat history...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full relative">
      {/* Top clearance space and back button container */}
      <div className="relative pt-6 pb-4">
        {/* Back to Project button - improved styling */}
        {projectId && (
          <div className="absolute top-6 left-6 z-10">
            <button 
              onClick={() => window.location.href = `/dashboard/projects/${projectId}`}
              className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium text-sm">Back to Project</span>
            </button>
          </div>
        )}
      </div>
        {/* Centered content with welcome message for empty state */}
      {messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center max-w-6xl mx-auto px-4 md:px-8" style={{ paddingTop: projectId ? '80px' : '40px' }}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-2 hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {projectId ? 'Project Assistant' : 'Welcome to SME.AI'}
            </h1>            <p className="text-xl max-w-2xl mx-auto" style={{ 
              color: resolvedTheme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)' 
            }}>
              {projectId 
                ? 'Ask questions related to this project' 
                : 'Your intelligent assistant for engineering knowledge'
              }
            </p>
  
          </div>
          
          {/* Input box for empty state - centered and with max width */}
          <div className={`w-full max-w-xl mx-auto ${showInputAnimation ? 'transform translate-y-[-20px] opacity-0 transition-all duration-500 ease-out' : ''}`}>
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
                    <Card key={idx} className="p-5 border-t-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" style={{
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
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transform hover:scale-[1.02]"
                          >
                            <span className="mr-3 text-xl transform transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
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
      )}      {/* Conversation view for when messages exist - using the new ChatLayout */}
      {messages.length > 0 && (
        <div className="pt-8">
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
        </div>
      )}
    </div>
  );
};

export default ChatView;