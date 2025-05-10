'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button, Card } from '@/components/ui';
import { Loading } from '@/components/ui';
import ProjectService, { Project } from '@/services/project-service';
import ChatService, { Chat } from '@/services/chat-service';
import { 
  HiOutlineChat, 
  HiOutlineFolder, 
  HiOutlineCloud, 
  HiOutlineLightningBolt, 
  HiOutlineDocumentText,
  HiOutlineDocumentDuplicate,
  HiOutlinePlusCircle
} from 'react-icons/hi';

// Format date as "Month Day, Year"
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default function Dashboard() {
  const { userData, user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  
  useEffect(() => {
    if (user) {
      // Load recent projects
      const loadProjects = async () => {
        try {
          setIsLoadingProjects(true);
          const projects = await ProjectService.getUserProjects(user.uid);
          setRecentProjects(projects.slice(0, 3)); // Get up to 3 recent projects
        } catch (err) {
          console.error('Failed to load recent projects:', err);
        } finally {
          setIsLoadingProjects(false);
        }
      };
      
      // Load recent chats
      const loadChats = async () => {
        try {
          setIsLoadingChats(true);
          const chats = await ChatService.getUserChats(user.uid);
          setRecentChats(chats.slice(0, 3)); // Get up to 3 recent chats
        } catch (err) {
          console.error('Failed to load recent chats:', err);
        } finally {
          setIsLoadingChats(false);
        }
      };
      
      loadProjects();
      loadChats();
    }
  }, [user]);

  return (
    <div className="p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 mt-4">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>
            Welcome back, {userData?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-lg" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
            Your specialized AI assistant for {userData?.industry || 'industrial'} expertise
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'rgb(var(--foreground-rgb))' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/chats/new" className="block h-full">
              <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <HiOutlineChat className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>New Chat</h3>
                  <p className="text-sm text-center" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Start a new conversation with your AI assistant
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/projects" className="block h-full">
              <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <HiOutlineFolder className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>Projects</h3>
                  <p className="text-sm text-center" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    View and manage your existing projects
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/documents/generate" className="block h-full">
              <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <HiOutlineDocumentText className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>Generate Document</h3>
                  <p className="text-sm text-center" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Create a new Word, PowerPoint, or Excel document
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/cloud/connect" className="block h-full">
              <Card className="h-full hover:shadow-lg transition-shadow dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <HiOutlineCloud className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>Connect Cloud</h3>
                  <p className="text-sm text-center" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Connect Google Drive, OneDrive, or Dropbox
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Recent Projects and Chats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Projects */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--foreground-rgb))' }}>Recent Projects</h2>
              <Link href="/dashboard/projects" className="text-sm text-blue-500 hover:text-blue-600">
                View all
              </Link>
            </div>
            <Card className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {isLoadingProjects ? (
                <div className="p-6 flex justify-center items-center">
                  <Loading size="md" />
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <HiOutlineFolder className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>No projects yet</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Create your first project to get started
                  </p>
                  <Link href="/dashboard/projects">
                    <Button
                      variant="primary"
                      size="sm"
                      startIcon={<HiOutlinePlusCircle className="w-4 h-4" />}
                    >
                      Create Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentProjects.map((project) => (
                    <div key={project.projectId} className="p-4 dashboard-item-hover">
                      <Link href={`/dashboard/projects/${project.projectId}`} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <HiOutlineFolder className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-medium" style={{ color: 'rgb(var(--foreground-rgb))' }}>{project.name}</h3>
                          <p className="text-sm" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                            {project.knowledgeFiles?.length || 0} files · Created {formatDate(project.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                  <div className="p-4 dashboard-item-hover rounded-b-lg">
                    <Link href="/dashboard/projects" className="flex items-center text-blue-500 hover:text-blue-600">
                      <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                      <span>Create new project</span>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </section>

          {/* Recent Conversations */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--foreground-rgb))' }}>Recent Conversations</h2>
              <Link href="/dashboard/chats" className="text-sm text-blue-500 hover:text-blue-600">
                View all
              </Link>
            </div>
            <Card className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {isLoadingChats ? (
                <div className="p-6 flex justify-center items-center">
                  <Loading size="md" />
                </div>
              ) : recentChats.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <HiOutlineChat className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>No conversations yet</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Start your first conversation to get started
                  </p>
                  <Link href="/dashboard/chats/new">
                    <Button
                      variant="primary"
                      size="sm"
                      startIcon={<HiOutlinePlusCircle className="w-4 h-4" />}
                    >
                      Start Conversation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentChats.map((chat) => (
                    <div key={chat.chatId} className="p-4 dashboard-item-hover">
                      <Link href={`/dashboard/chats/${chat.chatId}`} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <HiOutlineChat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-medium" style={{ color: 'rgb(var(--foreground-rgb))' }}>{chat.title}</h3>
                          <p className="text-sm" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                            Updated {formatDate(chat.updatedAt)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                  <div className="p-4 dashboard-item-hover rounded-b-lg">
                    <Link href="/dashboard/chats/new" className="flex items-center text-blue-500 hover:text-blue-600">
                      <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                      <span>Start new conversation</span>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* Industry Resources */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--foreground-rgb))' }}>
              {userData?.industry || 'Industry'} Resources
            </h2>
            <Link href="/dashboard/resources" className="text-sm text-blue-500 hover:text-blue-600">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start p-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <HiOutlineDocumentDuplicate className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>Industrial Standards</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Access relevant codes and standards for your industry
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    href="/dashboard/resources/standards"
                  >
                    Browse Standards
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start p-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <HiOutlineLightningBolt className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>Quick Templates</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Ready-made templates for common engineering tasks
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    href="/dashboard/resources/templates"
                  >
                    View Templates
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start p-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <HiOutlineDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium mb-2" style={{ color: 'rgb(var(--foreground-rgb))' }}>Tutorials</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}>
                    Learn how to get the most out of SME.AI
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    href="/dashboard/resources/tutorials"
                  >
                    View Tutorials
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}