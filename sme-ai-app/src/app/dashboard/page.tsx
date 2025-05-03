'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Card } from '@/components/ui';
import { 
  HiOutlineChat, 
  HiOutlineFolder, 
  HiOutlineCloud, 
  HiOutlineLightningBolt, 
  HiOutlineDocumentText,
  HiOutlineDocumentDuplicate,
  HiOutlinePlusCircle
} from 'react-icons/hi';

export default function Dashboard() {
  const { userData } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userData?.displayName?.split(' ')[0] || 'there'}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Your specialized AI assistant for {userData?.industry || 'industrial'} expertise
        </p>
      </div>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/chats/new" className="block h-full">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <HiOutlineChat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-medium">New Chat</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  Start a new conversation with your AI assistant
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/projects/new" className="block h-full">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <HiOutlineFolder className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-base font-medium">New Project</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  Create a new project and upload your documents
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/documents/generate" className="block h-full">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <HiOutlineDocumentText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-base font-medium">Generate Document</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  Create a new Word, PowerPoint, or Excel document
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/cloud/connect" className="block h-full">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <HiOutlineCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-medium">Connect Cloud</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  Connect Google Drive, OneDrive, or Dropbox
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Recent Projects and Chats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Projects */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          <Card>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-t-lg">
                <Link href="/dashboard/projects/project-1" className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <HiOutlineFolder className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base font-medium">Process Control System</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      3 files · Last updated yesterday
                    </p>
                  </div>
                </Link>
              </div>
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                <Link href="/dashboard/projects/project-2" className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <HiOutlineFolder className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base font-medium">Electrical Design Review</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      5 files · Last updated 3 days ago
                    </p>
                  </div>
                </Link>
              </div>
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-b-lg">
                <Link href="/dashboard/projects/new" className="flex items-center text-blue-600">
                  <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                  <span>Create new project</span>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Recent Conversations */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Conversations</h2>
            <Link href="/dashboard/chats" className="text-sm text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          <Card>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-t-lg">
                <Link href="/dashboard/chats/chat-1" className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <HiOutlineChat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base font-medium">PLC Logic Question</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Last message 2 hours ago
                    </p>
                  </div>
                </Link>
              </div>
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                <Link href="/dashboard/chats/chat-2" className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <HiOutlineChat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base font-medium">Motor Sizing Calculation</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Last message yesterday
                    </p>
                  </div>
                </Link>
              </div>
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-b-lg">
                <Link href="/dashboard/chats/new" className="flex items-center text-blue-600">
                  <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                  <span>Start new conversation</span>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Industry Resources */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {userData?.industry || 'Industry'} Resources
          </h2>
          <Link href="/dashboard/resources" className="text-sm text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-start p-2">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <HiOutlineDocumentDuplicate className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium">Industrial Standards</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Access relevant codes and standards for your industry
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  href="/dashboard/resources/standards"
                >
                  Browse Standards
                </Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start p-2">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <HiOutlineLightningBolt className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium">Quick Templates</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Ready-made templates for common engineering tasks
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  href="/dashboard/resources/templates"
                >
                  View Templates
                </Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start p-2">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <HiOutlineDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-medium">Tutorials</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Learn how to get the most out of SME.AI
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
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
  );
}