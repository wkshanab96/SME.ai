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
  }, [user]);  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950/50 transition-all duration-500 p-4 md:p-6 lg:p-8">
      <div className="w-full">
        {/* Hero section with enhanced gradient background */}
        <div className="relative mb-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 p-8 md:p-10 overflow-hidden animate-fadeIn shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/40">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-purple/10 opacity-30"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <HiOutlineSparkles className="w-8 h-8 text-yellow-300 mr-3 animate-pulse" />
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white/90">
                AI-Powered Assistant
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {userData?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there'}
              </span>
              !
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
              Your specialized AI assistant for{' '}
              <span className="font-semibold text-yellow-200">
                {userData?.industry || 'industrial'}
              </span>{' '}
              expertise is ready to help you tackle today's challenges with precision and intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard/chats/new">
                <Button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg">
                  <HiOutlineChat className="w-5 h-5 mr-2" />
                  Start New Chat
                </Button>
              </Link>
              <Link href="/dashboard/projects">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  <HiOutlineFolder className="w-5 h-5 mr-2" />
                  View Projects
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        </div>        {/* Quick Actions with enhanced design */}        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                <HiOutlineLightningBolt className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Actions
              </span>
            </h2>
            <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Choose an action to get started</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/chats/new" className="block h-full group outline-none">
              <div className="relative h-full transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
                <Card className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 group-hover:border-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center justify-center p-8 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                      <HiOutlineChat className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">New Chat</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      Start a conversation with your AI assistant for expert guidance
                    </p>
                    <div className="mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Get Started →</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>

            <Link href="/dashboard/projects" className="block h-full group outline-none">
              <div className="relative h-full transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
                <Card className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 group-hover:border-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center justify-center p-8 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                      <HiOutlineFolder className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Projects</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      Organize and manage your projects with enhanced AI context
                    </p>
                    <div className="mt-4 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">Manage →</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>

            <Link href="/dashboard/documents/generate" className="block h-full group outline-none">
              <div className="relative h-full transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
                <Card className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 group-hover:border-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center justify-center p-8 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                      <HiOutlineDocumentText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Generate Document</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      Create professional documents with AI assistance
                    </p>
                    <div className="mt-4 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Create →</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>

            <Link href="/dashboard/settings" className="block h-full group outline-none">
              <div className="relative h-full transform transition-all duration-300 hover:scale-105">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
                <Card className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 group-hover:border-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center justify-center p-8 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
                      <HiOutlineCloud className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Connect Cloud</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      Integrate with Google Drive, OneDrive, or Dropbox
                    </p>
                    <div className="mt-4 px-4 py-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">Connect →</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          </div>
        </section>        {/* Analytics Overview - Enhanced Section */}        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                <HiOutlineChartBar className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analytics Overview
              </span>
            </h2>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <HiOutlineChat className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{recentChats.length || 0}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Chat Sessions</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Recent conversations with AI</p>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.min((recentChats.length || 0) * 25, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {Math.min((recentChats.length || 0) * 25, 100)}% of target
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <HiOutlineFolder className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{recentProjects.length || 0}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Projects</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Organized workspaces</p>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.min((recentProjects.length || 0) * 25, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {Math.min((recentProjects.length || 0) * 25, 100)}% of target
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <HiOutlineDocumentText className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">This week</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Documents</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Generated content</p>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-0"></div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Ready to start
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>        {/* Recent Projects and Chats with enhanced styling */}        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Projects */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mr-3 shadow-lg">
                  <HiOutlineFolder className="w-5 h-5 text-white" />
                </div>
                <span>Recent Projects</span>
              </h2>
              <Link href="/dashboard/projects" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200">
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {isLoadingProjects ? (
                  <div className="p-8 flex justify-center items-center min-h-[300px]">
                    <Loading size="md" />
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <HiOutlineFolder className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">No projects yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto leading-relaxed">
                      Create your first project to organize your work and enhance AI responses with context
                    </p>
                    <Link href="/dashboard/projects">
                      <Button
                        variant="primary"
                        size="md"
                        startIcon={<HiOutlinePlusCircle className="w-4 h-4" />}
                        className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      >
                        Create Project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {recentProjects.map((project) => (
                      <div key={project.projectId} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                        <Link href={`/dashboard/projects/${project.projectId}`} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                              <HiOutlineFolder className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{project.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {project.knowledgeFiles?.length || 0} files · Created {formatDate(project.createdAt)}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                    <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                      <Link href="/dashboard/projects" className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 font-medium">
                        <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                        <span>Create new project</span>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </section>

          {/* Recent Conversations */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
                  <HiOutlineChat className="w-5 h-5 text-white" />
                </div>
                <span>Recent Conversations</span>
              </h2>
              <Link href="/dashboard/chats" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200">
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {isLoadingChats ? (
                  <div className="p-8 flex justify-center items-center min-h-[300px]">
                    <Loading size="md" />
                  </div>
                ) : recentChats.length === 0 ? (
                  <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <HiOutlineChat className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">No conversations yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto leading-relaxed">
                      Start your first conversation with the AI to get expert assistance
                    </p>
                    <Link href="/dashboard/chats/new">
                      <Button
                        variant="primary"
                        size="md"
                        startIcon={<HiOutlinePlusCircle className="w-4 h-4" />}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        Start Conversation
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {recentChats.map((chat) => (
                      <div key={chat.chatId} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                        <Link href={`/dashboard/chats/${chat.chatId}`} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                              <HiOutlineChat className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{chat.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              Updated {formatDate(chat.updatedAt)}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                    <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                      <Link href="/dashboard/chats/new" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-medium">
                        <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                        <span>Start new conversation</span>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </section>
        </div>        {/* Industry Resources - Premium Enhanced Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-4 shadow-lg">
                <HiOutlineDocumentText className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {userData?.industry || 'Industry'} Resources
              </span>
            </h2>
            <Link href="/dashboard/resources" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200">
              View all
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-lg mb-4">
                        <HiOutlineDocumentDuplicate className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Industrial Standards</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Access comprehensive codes, standards, and regulations relevant to your industry
                      </p>
                      <div className="flex items-center mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                          Updated Daily
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        href="/dashboard/resources/standards"
                        className="w-full border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300"
                      >
                        Browse Standards
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"></div>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center shadow-lg mb-4">
                        <HiOutlineLightningBolt className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Quick Templates</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Ready-made templates for common engineering tasks and documentation
                      </p>
                      <div className="flex items-center mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          50+ Templates
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        href="/dashboard/resources/templates"
                        className="w-full border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                      >
                        View Templates
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm"></div>
              <Card className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-lg mb-4">
                        <HiOutlineDocumentText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Tutorials</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        Comprehensive guides to maximize your productivity with SME.AI
                      </p>
                      <div className="flex items-center mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Interactive
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        href="/dashboard/resources/tutorials"
                        className="w-full border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                      >
                        View Tutorials
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}