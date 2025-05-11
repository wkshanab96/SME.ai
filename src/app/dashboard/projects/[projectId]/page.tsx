'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ProjectService, { Project, KnowledgeFile } from '@/services/project-service';
import ChatView from '@/components/chat/ChatView';
import ProjectChatHistory from '@/components/chat/ProjectChatHistory';
import ChatInput from '@/components/chat/ChatInput';
import { Button, Card, Loading } from '@/components/ui';
import { HiOutlineUpload, HiOutlinePencilAlt, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { useToast } from '@/components/ui/ToastContainer';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Instructions editing state
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [instructions, setInstructions] = useState('');

  // File upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch project data on component mount
  useEffect(() => {
    if (!user) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const projectData = await ProjectService.getProject(projectId as string);

        if (projectData) {
          setProject(projectData);
          setInstructions(projectData.instructions || '');
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, user]);

  // Add click outside handler to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  // Handle instructions update
  const handleUpdateInstructions = async () => {
    if (!project) return;

    try {
      await ProjectService.updateProject(project.projectId, { instructions });
      setEditingInstructions(false);
      addToast('success', 'Instructions updated successfully');

      // Update local project state
      setProject(prev => prev ? { ...prev, instructions } : null);
    } catch (err) {
      console.error('Error updating instructions:', err);
      addToast('error', 'Failed to update instructions');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !project || !user) return;

    setUploading(true);

    try {
      const newFiles = Array.from(e.target.files);
      const uploadPromises = newFiles.map(file =>
        ProjectService.uploadKnowledgeFile(user.uid, project.projectId, file)
      );

      const uploadedFiles = await Promise.all(uploadPromises);

      // Update project with new files
      setProject(prevProject => {
        if (!prevProject) return null;

        const updatedFiles = [
          ...(prevProject.knowledgeFiles || []),
          ...uploadedFiles
        ];

        return {
          ...prevProject,
          knowledgeFiles: updatedFiles
        };
      });

      addToast('success', `${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (err) {
      console.error('Error uploading files:', err);
      addToast('error', 'Failed to upload files');
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file removal
  const handleRemoveFile = async (fileId: string) => {
    if (!project) return;

    try {
      await ProjectService.deleteKnowledgeFile(fileId);

      // Update project with removed file
      setProject(prevProject => {
        if (!prevProject) return null;

        return {
          ...prevProject,
          knowledgeFiles: prevProject.knowledgeFiles?.filter(file => file.fileId !== fileId)
        };
      });

      addToast('success', 'File removed successfully');
    } catch (err) {
      console.error('Error removing file:', err);
      addToast('error', 'Failed to remove file');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading size="lg" type="spinner" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error || 'Failed to load project'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Chat Mode */}
      {chatMode ? (
        <div className="flex-grow relative">
          <div className="absolute top-4 left-4 z-10">
           
          </div>
          <ChatView projectId={projectId as string} />
        </div>
      ) : (
        /* Project View Mode */
        <>
          <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  {project.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Project Chat Space
                </p>
              </div>
              
              {/* Chat Starter */}
              <div className="mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Start a new chat</h2>
                  <div className="mb-6">
                    <ChatInput
                      onSendMessage={(message) => {
                        // Store the message to pass it to the ChatView when it mounts
                        sessionStorage.setItem('pendingChatMessage', message);
                        setChatMode(true); // Enter chat mode
                      }}
                      isFirstMessage={true}
                      disabled={false}
                      onToggleUseInternet={() => {}}
                      onToggleUseCloud={() => {}}
                      onSpecialtyChange={() => {}}
                      onDocumentTypeChange={() => {}}
                    />
                  </div>
                </div>
              </div>
              
              {/* Project Chat History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Project Chat History</h2>
                </div>
                
                <div className="space-y-3">
                  <ProjectChatHistory 
                    projectId={projectId as string}
                    onSelectChat={() => setChatMode(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Toggle button styled like Notion - arrow that opens panel */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700"
              aria-label="Toggle project details"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-gray-500 dark:text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                />
              </svg>
            </button>
          </div>
          
          {/* Notion-style floating panel */}
          {isPanelOpen && (
            <div 
              ref={panelRef}
              className="fixed right-4 top-12 w-80 max-h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-20 transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar"
              style={{
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >              
              <div className="p-4 space-y-6">
                {/* Project header with gradient background */}
                <div className="rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm p-3 border border-blue-500/20 shadow-inner">
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{project.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                    </svg>
                    Created: {project.createdAt.toLocaleDateString()}
                  </p>
                </div>
                
                {/* Project description */}
                {project.description && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-blue-500">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                      Description
                    </h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{project.description}</p>
                    </div>
                  </div>
                )}
                
                {/* Project instructions - editable */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-blue-500">
                        <path d="M10 2a.75.75 0 01.75.75v5.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 7.26a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" />
                        <path d="M5.273 4.5a1.25 1.25 0 00-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 01.894.553l.448.894a1 1 0 00.894.553h3.438a1 1 0 00.86-.49l.606-1.02A1 1 0 0114 11h3.47a1.318 1.318 0 00-.015-.062l-1.523-5.52a1.25 1.25 0 00-1.205-.918h-.977a.75.75 0 010-1.5h.977a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h.977a.75.75 0 010 1.5h-.977z" />
                      </svg>
                      Instructions
                    </h3>
                    {!editingInstructions ? (
                      <button 
                        onClick={() => setEditingInstructions(true)}
                        className="text-blue-500 hover:text-blue-600 p-1 rounded-md transition-colors flex items-center gap-1 text-xs"
                      >
                        <HiOutlinePencilAlt className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleUpdateInstructions}
                          className="text-green-500 hover:text-green-600 p-1 rounded-md transition-colors flex items-center gap-1 text-xs"
                        >
                          <HiOutlineCheck className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button 
                          onClick={() => {
                            setEditingInstructions(false);
                            setInstructions(project.instructions || '');
                          }}
                          className="text-red-500 hover:text-red-600 p-1 rounded-md transition-colors flex items-center gap-1 text-xs"
                        >
                          <HiOutlineX className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingInstructions ? (
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                      rows={4}
                      placeholder="Enter instructions for the AI..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[60px]">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {project.instructions || 'No instructions provided. Click "Edit" to add instructions for the AI.'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Knowledge files */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-blue-500">
                        <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                      </svg>
                      Knowledge Files
                    </h3>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                      disabled={uploading}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      disabled={uploading}
                      className="text-blue-500 border-blue-400/50 text-xs py-1 px-2 rounded"
                    >
                      {uploading ? (
                        <Loading size="sm" type="spinner" className="mr-1" />
                      ) : (
                        <HiOutlineUpload className="w-3.5 h-3.5 mr-1 inline" />
                      )}
                      <span>Upload</span>
                    </Button>
                  </div>
                  
                  {project.knowledgeFiles && project.knowledgeFiles.length > 0 ? (
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {project.knowledgeFiles.map((file) => (
                        <FileCard 
                          key={file.fileId} 
                          file={file} 
                          onRemove={handleRemoveFile} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                      <p className="text-gray-500 text-sm">
                        No files uploaded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface FileCardProps {
  file: KnowledgeFile;
  onRemove: (fileId: string) => Promise<void>;
}

const FileCard: React.FC<FileCardProps> = ({ file, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(file.fileId);
    } catch (err) {
      console.error('Error removing file:', err);
    } finally {
      setRemoving(false);
    }
  };

  // Get file extension
  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
  };

  // Get file icon color based on extension
  const getIconColorClass = (ext: string) => {
    switch(ext.toLowerCase()) {
      case 'pdf': return 'from-red-600 to-red-700';
      case 'doc':
      case 'docx': return 'from-blue-600 to-blue-700';
      case 'xls':
      case 'xlsx': return 'from-green-600 to-green-700';
      case 'ppt':
      case 'pptx': return 'from-orange-600 to-orange-700';
      case 'txt': return 'from-gray-600 to-gray-700';
      case 'json': return 'from-yellow-600 to-yellow-700';
      case 'csv': return 'from-emerald-600 to-emerald-700';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif': return 'from-pink-600 to-purple-700';
      default: return 'from-indigo-600 to-purple-700';
    }
  };

  const extension = getFileExtension(file.fileName);
  const iconColorClass = getIconColorClass(extension);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get status badge style based on indexing status
  const getStatusBadge = () => {
    switch(file.indexingStatus.toLowerCase()) {
      case 'indexed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'indexing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 bg-gray-800/40 border border-gray-700/50 rounded-lg group hover:bg-gray-800/60 transition-colors">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded bg-gradient-to-br ${iconColorClass} flex items-center justify-center text-white font-medium text-xs shadow-inner`}>
          {extension}
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium text-gray-200 truncate max-w-[170px]">
            {file.fileName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">
              {formatFileSize(file.sizeBytes)}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-sm border ${getStatusBadge()}`}>
              {file.indexingStatus}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleRemove}
        disabled={removing}
        className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-1.5 rounded-md transition-all duration-200"
        title="Remove file"
      >
        {removing ? (
          <Loading size="sm" type="spinner" />
        ) : (
          <HiOutlineX className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};