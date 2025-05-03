// Type definitions for SME.AI application

// User types
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  industry: Industry | null;
  createdAt: Date;
  lastLogin: Date;
}

// Industry specialties
export type Industry = 
  | 'Electrical Engineering' 
  | 'Mechanical Engineering' 
  | 'Process Engineering' 
  | 'Process Control' 
  | 'Project Engineering'
  | 'Other';

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  knowledgeFiles: KnowledgeFile[];
}

// Knowledge file types
export interface KnowledgeFile {
  id: string;
  name: string;
  description?: string;
  fileType: FileType;
  fileSize: number; // in bytes
  url: string;
  projectId: string;
  userId: string;
  uploadedAt: Date;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export type FileType = 
  | 'pdf' 
  | 'docx' 
  | 'txt' 
  | 'xlsx' 
  | 'pptx' 
  | 'csv' 
  | 'json' 
  | 'image';

// Chat and messages
export interface Chat {
  id: string;
  title: string;
  userId: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
  sources?: Source[];
}

export interface Attachment {
  id: string;
  name: string;
  type: FileType;
  url: string;
  messageId: string;
}

export interface Source {
  title: string;
  snippet?: string;
  url?: string;
  fileName?: string;
  pageNumber?: number;
}

// Cloud storage connections
export interface CloudConnection {
  id: string;
  userId: string;
  provider: 'google-drive' | 'onedrive' | 'dropbox';
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  email: string;
  connected: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Document generation
export interface DocumentGenerationRequest {
  type: 'docx' | 'pptx' | 'xlsx';
  title: string;
  content: string;
  chatId?: string;
  userId: string;
}

// Assistant specialty
export type AssistantSpecialty = Industry | 'General';