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
  HiOutlinePlusCircle,
  HiOutlineChartBar,
  HiOutlineSparkles
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
    <div className="p-4 md:p-8 lg:p-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero section with gradient background */}
        <div className="relative mb-12 rounded-2xl bg-gradient-to-r from-primary-blue to-primary-purple p-8 md:p-10 overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-white/10 to-transparent opacity-20"></div>
          <div className="relative z-10">            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white dashboard-welcome">
              Welcome back, {userData?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Your specialized AI assistant for {userData?.industry || 'industrial'} expertise is ready to help you tackle today's challenges.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/chats/new">
                <Button 
                  variant="secondary"
                  size="lg"
                  startIcon={<HiOutlineSparkles className="w-5 h-5" />}
                  className="mr-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary-blue hover:bg-white/90"
                >
                  Start New Chat
                </Button>
              </Link>
              <Link href="/dashboard/projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Manage Projects
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Actions with improved hover effects */}
        <section className="mb-14">          <h2 className="text-xl font-bold mb-6 flex items-center dashboard-section-title">
            <HiOutlineLightningBolt className="w-6 h-6 mr-2 text-primary-blue dark:text-primary-purple" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-primary-purple">
              Quick Actions
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/chats/new" className="block h-full group outline-none">
              <Card className="h-full transition-all duration-300 hover:shadow-glow dark:bg-gray-800/80 border-2 border-transparent hover:border-primary-blue dark:hover:border-primary-purple rounded-xl overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-blue to-primary-purple bg-opacity-10 flex items-center justify-center mb-5 shadow-inner group-hover:animate-pulse-slow">
                    <HiOutlineChat className="w-8 h-8 text-primary-blue dark:text-primary-purple" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 card-heading">New Chat</h3>
                  <p className="text-sm text-center opacity-80">
                    Start a new conversation with your AI assistant
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/projects" className="block h-full group">
              <Card className="h-full transition-all duration-300 hover:shadow-glow dark:bg-gray-800/80 border-2 border-transparent hover:border-primary-purple rounded-xl overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-purple to-secondary-purple bg-opacity-10 flex items-center justify-center mb-5 shadow-inner group-hover:animate-pulse-slow">
                    <HiOutlineFolder className="w-8 h-8 text-primary-purple dark:text-secondary-purple" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 card-heading">Projects</h3>
                  <p className="text-sm text-center opacity-80">
                    View and manage your existing projects
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/documents/generate" className="block h-full group">
              <Card className="h-full transition-all duration-300 hover:shadow-glow dark:bg-gray-800/80 border-2 border-transparent hover:border-success rounded-xl overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-400 bg-opacity-10 flex items-center justify-center mb-5 shadow-inner group-hover:animate-pulse-slow">
                    <HiOutlineDocumentText className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 card-heading">Generate Document</h3>
                  <p className="text-sm text-center opacity-80">
                    Create a new Word, PowerPoint, or Excel document
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/settings" className="block h-full group">
              <Card className="h-full transition-all duration-300 hover:shadow-glow dark:bg-gray-800/80 border-2 border-transparent hover:border-accent rounded-xl overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-blue-400 bg-opacity-10 flex items-center justify-center mb-5 shadow-inner group-hover:animate-pulse-slow">
                    <HiOutlineCloud className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 card-heading">Connect Cloud</h3>
                  <p className="text-sm text-center opacity-80">
                    Connect Google Drive, OneDrive, or Dropbox
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Analytics Overview - New Section */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">            <h2 className="text-xl font-bold flex items-center dashboard-section-title">
              <HiOutlineChartBar className="w-6 h-6 mr-2 text-primary-blue dark:text-primary-purple" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-primary-purple">
                Analytics Overview
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-blue/10 flex items-center justify-center">
                    <HiOutlineChat className="w-6 h-6 text-primary-blue" />
                  </div>
                  <span className="text-2xl font-bold">{recentChats.length || 0}</span>
                </div>
                <h3 className="font-medium mb-1">Active Chats</h3>
                <p className="text-sm opacity-70">Recent conversations</p>
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-primary-blue dark:bg-primary-purple rounded-full animate-gradient-x" style={{ width: `${Math.min((recentChats.length || 0) * 10, 100)}%` }}></div>
                </div>
              </div>
            </Card>

            <Card className="dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-purple/10 flex items-center justify-center">
                    <HiOutlineFolder className="w-6 h-6 text-primary-purple" />
                  </div>
                  <span className="text-2xl font-bold">{recentProjects.length || 0}</span>
                </div>
                <h3 className="font-medium mb-1">Active Projects</h3>
                <p className="text-sm opacity-70">Project workspaces</p>
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-primary-purple dark:bg-secondary-purple rounded-full animate-gradient-x" style={{ width: `${Math.min((recentProjects.length || 0) * 10, 100)}%` }}></div>
                </div>
              </div>
            </Card>

            <Card className="dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <HiOutlineDocumentText className="w-6 h-6 text-success" />
                  </div>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <h3 className="font-medium mb-1">Generated Documents</h3>
                <p className="text-sm opacity-70">Documents created this week</p>
                <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-4">
                  <div className="h-full bg-success rounded-full w-0"></div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Projects and Chats with enhanced styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Recent Projects */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold flex items-center">
                <HiOutlineFolder className="w-6 h-6 mr-2 text-primary-purple" />
                <span>Recent Projects</span>
              </h2>
              <Link href="/dashboard/projects" className="text-sm text-primary-blue hover:text-primary-purple transition-colors duration-200 flex items-center">
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <Card className="dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {isLoadingProjects ? (
                <div className="p-6 flex justify-center items-center min-h-[260px]">
                  <Loading size="md" />
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="p-8 text-center min-h-[260px] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                    <HiOutlineFolder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-sm mb-4 opacity-70 max-w-xs mx-auto">
                    Create your first project to organize your work and enhance AI responses with context
                  </p>
                  <Link href="/dashboard/projects">
                    <Button
                      variant="primary"
                      size="md"
                      startIcon={<HiOutlinePlusCircle className="w-4 h-4" />}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      Create Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentProjects.map((project) => (
                    <div key={project.projectId} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <Link href={`/dashboard/projects/${project.projectId}`} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-purple to-secondary-purple/70 flex items-center justify-center shadow-sm">
                            <HiOutlineFolder className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-semibold">{project.name}</h3>
                          <p className="text-sm opacity-70 mt-1">
                            {project.knowledgeFiles?.length || 0} files · Created {formatDate(project.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 rounded-b-lg">
                    <Link href="/dashboard/projects" className="flex items-center text-primary-purple hover:text-secondary-purple transition-colors duration-200">
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
              <h2 className="text-xl font-bold flex items-center">
                <HiOutlineChat className="w-6 h-6 mr-2 text-primary-blue" />
                <span>Recent Conversations</span>
              </h2>
              <Link href="/dashboard/chats" className="text-sm text-primary-blue hover:text-primary-purple transition-colors duration-200 flex items-center">
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <Card className="dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {isLoadingChats ? (
                <div className="p-6 flex justify-center items-center min-h-[260px]">
                  <Loading size="md" />
                </div>
              ) : recentChats.length === 0 ? (
                <div className="p-8 text-center min-h-[260px] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                    <HiOutlineChat className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                  <p className="text-sm mb-4 opacity-70 max-w-xs mx-auto">
                    Start your first conversation with the AI to get expert assistance
                  </p>
                  <Link href="/dashboard/chats/new">
                    <Button
                      variant="primary"
                      size="md"
                      startIcon={<HiOutlinePlusCircle className="w-4 h-4" />}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      Start Conversation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentChats.map((chat) => (
                    <div key={chat.chatId} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <Link href={`/dashboard/chats/${chat.chatId}`} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-blue to-secondary-blue/70 flex items-center justify-center shadow-sm">
                            <HiOutlineChat className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-semibold">{chat.title}</h3>
                          <p className="text-sm opacity-70 mt-1">
                            Updated {formatDate(chat.updatedAt)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 rounded-b-lg">
                    <Link href="/dashboard/chats/new" className="flex items-center text-primary-blue hover:text-secondary-blue transition-colors duration-200">
                      <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                      <span>Start new conversation</span>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* Industry Resources - Enhanced with cards */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <HiOutlineDocumentText className="w-6 h-6 mr-2 text-primary-blue dark:text-primary-purple" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-primary-purple">
                {userData?.industry || 'Industry'} Resources
              </span>
            </h2>
            <Link href="/dashboard/resources" className="text-sm text-primary-blue hover:text-primary-purple transition-colors duration-200 flex items-center">
              View all
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-glow transition-shadow duration-300">
              <div className="h-3 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              <div className="flex items-start p-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm">
                    <HiOutlineDocumentDuplicate className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold mb-2">Industrial Standards</h3>
                  <p className="text-sm mb-3 opacity-70">
                    Access relevant codes and standards for your industry
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    href="/dashboard/resources/standards"
                    className="border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                  >
                    Browse Standards
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-glow transition-shadow duration-300">
              <div className="h-3 bg-gradient-to-r from-success to-green-400"></div>
              <div className="flex items-start p-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm">
                    <HiOutlineLightningBolt className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold mb-2">Quick Templates</h3>
                  <p className="text-sm mb-3 opacity-70">
                    Ready-made templates for common engineering tasks
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    href="/dashboard/resources/templates"
                    className="border-success text-success hover:bg-green-50 dark:hover:bg-green-900/10"
                  >
                    View Templates
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-glow transition-shadow duration-300">
              <div className="h-3 bg-gradient-to-r from-primary-blue to-secondary-blue"></div>
              <div className="flex items-start p-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                    <HiOutlineDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold mb-2">Tutorials</h3>
                  <p className="text-sm mb-3 opacity-70">
                    Learn how to get the most out of SME.AI
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    href="/dashboard/resources/tutorials"
                    className="border-primary-blue text-primary-blue hover:bg-blue-50 dark:hover:bg-blue-900/10"
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