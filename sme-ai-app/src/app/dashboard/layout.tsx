'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button, ThemeToggle } from '@/components/ui';
import ProjectCreationModal, { ProjectData } from '@/components/projects/ProjectCreationModal';
import ProjectService from '@/services/project-service';

// Icons
import {
  HiOutlineChevronDown, HiOutlineChevronRight,
  HiOutlineChat, HiOutlineFolder, HiOutlineCloud,
  HiOutlineCog, HiOutlineLogout, HiOutlineUser,
  HiOutlinePlus, HiOutlineHome, HiOutlineX,
  HiOutlineMenuAlt2
} from 'react-icons/hi';

// Add interface for hover state management
interface SidebarState {
  isOpen: boolean;
  isHovering: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: (event?: React.MouseEvent) => void;
  compact?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, label, href, isActive, onClick, compact 
}) => {
  const content = (
    <div className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''} ${compact ? 'justify-center' : ''}`}>
      <span className="text-lg">{icon}</span>
      {!compact && <span>{label}</span>}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return <button className="w-full text-left" onClick={onClick}>{content}</button>;
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  compact?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, children, defaultOpen = false, compact = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 ${compact ? 'justify-center' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={compact ? '' : 'mr-2'}>
          {isOpen ? <HiOutlineChevronDown className="w-4 h-4" /> : <HiOutlineChevronRight className="w-4 h-4" />}
        </span>
        {!compact && <span>{title}</span>}
      </button>
      {isOpen && <div className={`mt-1 ${compact ? 'pl-0' : 'pl-4'}`}>{children}</div>}
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, signOut } = useAuth();
  const [sidebarState, setSidebarState] = useState<SidebarState>({ 
    isOpen: true, 
    isHovering: false 
  });
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Project creation modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Compute effective sidebar state
  const isEffectivelyClosed = !sidebarState.isOpen && !sidebarState.isHovering;

  // If not authenticated, redirect to login
  if (!user) {
    router.push('/login');
    return null;
  }

  // Sample projects data (to be replaced with actual data from Firestore)
  const projects = [
    { id: 'project-1', name: 'Process Control System' },
    { id: 'project-2', name: 'Electrical Design Review' },
  ];

  // Sample recent chats (to be replaced with actual data from Firestore)
  const recentChats = [
    { id: 'chat-1', name: 'PLC Logic Question' },
    { id: 'chat-2', name: 'Motor Sizing Calculation' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleMobileSidebar = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };

  // Handle mouse enter/leave for hover effect
  const handleMouseEnter = () => {
    setSidebarState(prev => ({ ...prev, isHovering: true }));
  };

  const handleMouseLeave = () => {
    setSidebarState(prev => ({ ...prev, isHovering: false }));
  };
  
  // Handle project creation
  const handleOpenProjectModal = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsProjectModalOpen(true);
  };
  
  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };
  
  const handleCreateProject = async (projectData: ProjectData) => {
    if (!user) return Promise.reject(new Error('You must be logged in to create a project'));
    
    try {
      const newProject = await ProjectService.createProject(user.uid, projectData);
      // Redirect to the new project page
      router.push(`/dashboard/projects/${newProject.projectId}`);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        onProjectCreate={handleCreateProject}
      />
      
      {/* Mobile sidebar overlay */}
      {sidebarMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sidebar-hover-expand ${
          isEffectivelyClosed ? 'w-16' : 'w-64'
        } ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="flex items-center">
              <h1 className={`text-lg font-bold gradient-text ${isEffectivelyClosed ? 'hidden' : 'block'}`}>SME.AI</h1>
              <h1 className={`text-lg font-bold gradient-text ${isEffectivelyClosed ? 'block' : 'hidden'}`}>S</h1>
            </Link>
            <button 
              onClick={toggleMobileSidebar} 
              className="lg:hidden p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-2">
            <SidebarItem
              icon={<HiOutlineHome />}
              label="Home"
              href="/dashboard"
              isActive={pathname === '/dashboard'}
              compact={isEffectivelyClosed}
            />

            <div className="mt-4 mb-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              <CollapsibleSection title="Projects" defaultOpen={true} compact={isEffectivelyClosed}>
                <div className="space-y-1">
                  {projects.map(project => (
                    <SidebarItem
                      key={project.id}
                      icon={<HiOutlineFolder />}
                      label={project.name}
                      href={`/dashboard/projects/${project.id}`}
                      isActive={pathname === `/dashboard/projects/${project.id}`}
                      compact={isEffectivelyClosed}
                    />
                  ))}
                  <SidebarItem
                    icon={<HiOutlinePlus />}
                    label="New Project"
                    onClick={handleOpenProjectModal}
                    compact={isEffectivelyClosed}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Chats" defaultOpen={true} compact={isEffectivelyClosed}>
                <div className="space-y-1">
                  {recentChats.map(chat => (
                    <SidebarItem
                      key={chat.id}
                      icon={<HiOutlineChat />}
                      label={chat.name}
                      href={`/dashboard/chats/${chat.id}`}
                      isActive={pathname === `/dashboard/chats/${chat.id}`}
                      compact={isEffectivelyClosed}
                    />
                  ))}
                  <SidebarItem
                    icon={<HiOutlinePlus />}
                    label="New Chat"
                    href="/dashboard/chats/new"
                    compact={isEffectivelyClosed}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Cloud Connections" compact={isEffectivelyClosed}>
                <div className="space-y-1">
                  <SidebarItem
                    icon={<HiOutlineCloud />}
                    label="Google Drive"
                    href="/dashboard/cloud/google-drive"
                    isActive={pathname === '/dashboard/cloud/google-drive'}
                    compact={isEffectivelyClosed}
                  />
                  <SidebarItem
                    icon={<HiOutlineCloud />}
                    label="OneDrive"
                    href="/dashboard/cloud/onedrive"
                    isActive={pathname === '/dashboard/cloud/onedrive'}
                    compact={isEffectivelyClosed}
                  />
                  <SidebarItem
                    icon={<HiOutlineCloud />}
                    label="Dropbox"
                    href="/dashboard/cloud/dropbox"
                    isActive={pathname === '/dashboard/cloud/dropbox'}
                    compact={isEffectivelyClosed}
                  />
                  <SidebarItem
                    icon={<HiOutlinePlus />}
                    label="Connect New"
                    href="/dashboard/cloud/connect"
                    compact={isEffectivelyClosed}
                  />
                </div>
              </CollapsibleSection>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className={`flex items-center mb-3 ${isEffectivelyClosed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {userData?.displayName ? userData.displayName[0].toUpperCase() : 'U'}
              </div>
              {!isEffectivelyClosed && (
                <div className="ml-2 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userData?.displayName || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <SidebarItem
                icon={<HiOutlineUser />}
                label="Profile"
                href="/dashboard/profile"
                isActive={pathname === '/dashboard/profile'}
                compact={isEffectivelyClosed}
              />
              <SidebarItem
                icon={<HiOutlineCog />}
                label="Settings"
                href="/dashboard/settings"
                isActive={pathname === '/dashboard/settings'}
                compact={isEffectivelyClosed}
              />
              <SidebarItem
                icon={<HiOutlineLogout />}
                label="Sign Out"
                onClick={handleSignOut}
                compact={isEffectivelyClosed}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isEffectivelyClosed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top nav */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14 flex items-center px-4">
          <button 
            onClick={toggleMobileSidebar} 
            className="lg:hidden mr-2 p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button>
          <button
            onClick={toggleSidebar}
            className="hidden lg:block mr-2 p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200">Dashboard</h1>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle variant="icon" />
            {/* Add any other header actions here */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}