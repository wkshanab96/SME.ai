'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ProjectService, { Project, KnowledgeFile } from '@/services/project-service';
import ChatView from '@/components/chat/ChatView';
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
      {/* Main chat area */}
      <div className="flex-grow">
        <ChatView projectId={projectId as string} />
      </div>
      
      {/* Right panel with project details */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Project name */}
          <div>
            <h2 className="text-2xl font-bold gradient-text">{project.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Created: {project.createdAt.toLocaleDateString()}
            </p>
          </div>
          
          {/* Project description */}
          {project.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-200">{project.description}</p>
            </div>
          )}
          
          {/* Project instructions - editable */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Instructions
              </h3>
              {!editingInstructions ? (
                <button 
                  onClick={() => setEditingInstructions(true)}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <HiOutlinePencilAlt className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-1">
                  <button 
                    onClick={handleUpdateInstructions}
                    className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <HiOutlineCheck className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setEditingInstructions(false);
                      setInstructions(project.instructions || '');
                    }}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <HiOutlineX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {editingInstructions ? (
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
                placeholder="Enter instructions for the AI..."
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-200">
                {project.instructions || 'No instructions provided.'}
              </p>
            )}
          </div>
          
          {/* Knowledge files */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
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
                className="flex items-center space-x-1 text-xs"
              >
                {uploading ? (
                  <Loading size="sm" type="spinner" />
                ) : (
                  <HiOutlineUpload className="w-4 h-4" />
                )}
                <span>Add Files</span>
              </Button>
            </div>
            
            {project.knowledgeFiles && project.knowledgeFiles.length > 0 ? (
              <div className="space-y-2">
                {project.knowledgeFiles.map((file) => (
                  <FileCard 
                    key={file.fileId} 
                    file={file} 
                    onRemove={handleRemoveFile} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                No files uploaded yet.
              </p>
            )}
          </div>
        </div>
      </div>
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
      case 'pdf': return 'bg-red-500';
      case 'doc':
      case 'docx': return 'bg-blue-500';
      case 'xls':
      case 'xlsx': return 'bg-green-500';
      case 'txt': return 'bg-gray-500';
      default: return 'bg-purple-500';
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

  return (
    <Card className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-medium text-xs ${iconColorClass}`}>
          {extension}
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[180px]">
            {file.fileName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.sizeBytes)} • {file.indexingStatus}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleRemove}
        disabled={removing}
        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1"
      >
        {removing ? (
          <Loading size="sm" type="spinner" />
        ) : (
          <HiOutlineX className="w-4 h-4" />
        )}
      </button>
    </Card>
  );
};