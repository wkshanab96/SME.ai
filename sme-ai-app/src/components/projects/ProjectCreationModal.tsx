import React, { useState, useRef } from 'react';
import { Modal, Loading } from '@/components/ui';
import { useToast } from '@/components/ui/ToastContainer';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreate: (projectData: ProjectData) => Promise<any>;
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
    const validFileTypes = ['application/pdf', 'text/plain', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    const invalidFiles = newFiles.filter(file => !validFileTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      addToast('error', `Some files are not supported. Please upload PDF, TXT, or Office documents.`);
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
      size="lg"
      titleClassName="text-purple-400"
    >
      <form onSubmit={handleSubmit} className="text-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name
            </label>
            <input
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              AI Instructions (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide specific instructions for the AI when working in this project context"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Upload Knowledge Files
            </label>
            <div
              className={`border border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-900/20' 
                  : 'border-gray-600 hover:border-blue-500'
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
              <div className="space-y-1 text-center py-4">
                <svg
                  className="mx-auto h-10 w-10 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
                  />
                </svg>
                <div className="text-sm text-blue-400 font-medium">
                  Upload files
                </div>
                <p className="text-xs text-gray-400">
                  PDF, TXT, DOC, DOCX, XLS, XLSX up to 50MB each
                </p>
              </div>
            </div>
          </div>
          
          {files.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Files to upload ({files.length})</h4>
              <ul className="divide-y divide-gray-700 rounded-md border border-gray-700 bg-gray-800 overflow-hidden">
                {files.map((file, index) => (
                  <li key={index} className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-blue-400 mr-2"
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
                        <p className="text-sm font-medium text-white truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
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
          
          <div className="flex justify-end pt-4 space-x-3 border-t border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className={`px-5 py-2 rounded-md text-white font-medium ${
                name.trim() && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loading size="sm" type="spinner" className="mr-2" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectCreationModal;