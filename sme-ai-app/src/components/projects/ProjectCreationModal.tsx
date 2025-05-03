import React, { useState, useRef } from 'react';
import { Modal, Input, Button, Loading } from '@/components/ui';
import { useToast } from '@/components/ui/ToastContainer';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreate: (projectData: ProjectData) => Promise<any>; // Changed return type to Promise<any> instead of Promise<void>
}

export interface ProjectData {
  name: string;
  description: string;
  instructions: string;
  files: File[];
}

const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onProjectCreate
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Convert FileList to array and add to state
      const newFiles = Array.from(e.dataTransfer.files);
      handleFilesSelected(newFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      handleFilesSelected(newFiles);
    }
  };

  const handleFilesSelected = (newFiles: File[]) => {
    // Check for valid file types - this is a basic check
    // In a real app, we'd have more thorough validation based on the backend's capabilities
    const validFileTypes = ['application/pdf', 'text/plain', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    const invalidFiles = newFiles.filter(file => !validFileTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      addToast('error', `Some files are not supported. Please upload PDF, TXT, or Office documents.`);
      // Filter out invalid files
      const validFiles = newFiles.filter(file => validFileTypes.includes(file.type));
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    } else {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      addToast('error', 'Project name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onProjectCreate({
        name,
        description,
        instructions,
        files
      });
      
      addToast('success', `Project "${name}" created successfully`);
      
      // Reset form
      setName('');
      setDescription('');
      setInstructions('');
      setFiles([]);
      
      onClose();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      addToast('error', error.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isSubmitting ? onClose : () => {}}
      title="Create a New Project"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            required
            disabled={isSubmitting}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Instructions (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide specific instructions for the AI when working in this project context"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Knowledge Files
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Upload files
                  </span>{' '}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-500">
                  PDF, TXT, DOC, DOCX, XLS, XLSX up to 50MB each
                </p>
              </div>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Files to upload ({files.length})</h4>
              <ul className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={isSubmitting}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end pt-4 space-x-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loading size="sm" type="spinner" className="mr-2" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectCreationModal;