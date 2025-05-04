import { collection, addDoc, query, where, orderBy, getDocs, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
  userId: string;
  projectId?: string; // Optional project ID for project-specific chats
}

export interface Chat {
  chatId: string;
  title: string;
  userId: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: ChatMessage[];
}

// Chat Service
export const ChatService = {
  
  // Create a new chat
  async createChat(userId: string, title: string, projectId?: string): Promise<Chat> {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        userId,
        title,
        projectId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        chatId: chatRef.id,
        title,
        userId,
        projectId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Failed to create chat:', error);
      throw error;
    }
  },
  
  // Get a specific chat by ID
  async getChat(chatId: string): Promise<Chat | null> {
    try {
      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      
      if (!chatDoc.exists()) {
        return null;
      }
      
      const data = chatDoc.data();
      const messages = await this.getChatMessages(chatId);
      
      return {
        chatId,
        title: data.title,
        userId: data.userId,
        projectId: data.projectId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        messages
      };
    } catch (error) {
      console.error('Failed to get chat:', error);
      throw error;
    }
  },
  
  // Get all chats for a user
  async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(chatsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          chatId: doc.id,
          title: data.title,
          userId: data.userId,
          projectId: data.projectId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Failed to get user chats:', error);
      throw error;
    }
  },
  
  // Get all chats for a project
  async getProjectChats(projectId: string): Promise<Chat[]> {
    try {
      const chatsQuery = query(
        collection(db, 'chats'),
        where('projectId', '==', projectId),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(chatsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          chatId: doc.id,
          title: data.title,
          userId: data.userId,
          projectId: data.projectId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Failed to get project chats:', error);
      throw error;
    }
  },
  
  // Get messages for a specific chat
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      
      const snapshot = await getDocs(messagesQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          role: data.role,
          userId: data.userId,
          projectId: data.projectId,
          timestamp: data.timestamp?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Failed to get chat messages:', error);
      throw error;
    }
  },
  
  // Add a message to a chat
  async addMessage(chatId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    try {
      const messageRef = await addDoc(
        collection(db, 'chats', chatId, 'messages'),
        {
          ...message,
          timestamp: serverTimestamp()
        }
      );
      
      // Update the chat's updatedAt timestamp
      await this.updateChatTimestamp(chatId);
      
      return {
        ...message,
        id: messageRef.id
      };
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  },
  
  // Update a chat's timestamp
  async updateChatTimestamp(chatId: string): Promise<void> {
    try {
      const docRef = doc(db, 'chats', chatId);
      await updateDoc(docRef, {
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to update chat timestamp:', error);
      throw error;
    }
  }
};

export default ChatService;