'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Loading } from '@/components/ui';  // Correctly imported Loading component
import { useToast } from '@/components/ui/ToastContainer';
import { useAuth } from '@/lib/auth-context';
import ProjectCreationModal from '@/components/projects/ProjectCreationModal';
import ProjectService, { Project } from '@/services/project-service';
import { HiOutlineFolder, HiOutlinePlusCircle, HiOutlineDocumentText, HiCalendar } from 'react-icons/hi';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userData, user } = useAuth();
  const { addToast, ToastContainer } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userProjects = await ProjectService.getUserProjects(user.uid);
      setProjects(userProjects);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setError(err.message || 'Failed to load projects');
      addToast('error', 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    if (!user) {
      addToast('error', 'You must be logged in to create a project');
      return;
    }
    
    try {
      const newProject = await ProjectService.createProject(user.uid, projectData);
      
      // Add the new project to the state
      setProjects(prev => [...prev, newProject]);
      
      // Redirect to the new project page
      router.push(`/dashboard/projects/${newProject.projectId}`);
      
      return newProject;
    } catch (err: any) {
      console.error('Failed to create project:', err);
      addToast('error', err.message || 'Failed to create project');
      throw err;
    }
  };

  // Format date as "Month Day, Year"
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <ProjectCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreate={handleCreateProject}
      />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage your engineering projects and their knowledge files.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          startIcon={<HiOutlinePlusCircle className="w-5 h-5 mr-1" />}
        >
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loading size="lg" text="Loading projects..." />
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Projects</h3>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <Button
            variant="outline"
            onClick={loadProjects}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create your first project to get started.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            startIcon={<HiOutlinePlusCircle className="w-5 h-5 mr-1" />}
          >
            Create New Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.projectId} href={`/dashboard/projects/${project.projectId}`} className="block h-full">
              <Card className="h-full hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <HiOutlineFolder className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <HiOutlineDocumentText className="mr-1.5 h-4 w-4" />
                    <span>
                      {project.knowledgeFiles?.length || 0} {(project.knowledgeFiles?.length || 0) === 1 ? 'file' : 'files'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    <HiCalendar className="mr-1.5 h-4 w-4" />
                    <span>Created {formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          
          {/* "New Project" card */}
          <Card 
            className="h-full border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors p-6 flex flex-col items-center justify-center text-center"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <HiOutlinePlusCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Create New Project</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Add a new engineering project with knowledge files
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}