'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button, EnhancedThemeToggle } from '@/components/ui';
import ProjectCreationModal, { ProjectData } from '@/components/projects/ProjectCreationModal';
import ProjectService, { Project } from '@/services/project-service';
import ChatService, { Chat } from '@/services/chat-service';

// Icons
import {
  HiOutlineChevronDown, HiOutlineChevronRight,
  HiOutlineChat, HiOutlineFolder, HiOutlineCloud,
  HiOutlineCog, HiOutlineLogout, HiOutlineUser,
  HiOutlinePlus, HiOutlineHome, HiOutlineX,
  HiOutlineMenuAlt2, HiOutlinePaperClip
} from 'react-icons/hi';

// Add interface for hover state management
interface SidebarState {
  isOpen: boolean;
  isHovering: boolean;
  isPinned: boolean;
  width: number;
  isDragging: boolean;
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
      <div className={`sidebar-icon ${!compact ? 'mr-2' : ''}`}>{icon}</div>
      {!compact && (
        <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-200">
          {label}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  
  return <button className="w-full text-left" onClick={onClick}>{content}</button>;
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  compact?: boolean;
  titleHref?: string; // New prop for navigation
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, children, defaultOpen = false, compact = false, titleHref
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const router = useRouter();
  const handleTitleClick = (e: React.MouseEvent) => {
    if (titleHref) {
      e.preventDefault();
      router.push(titleHref);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className="collapsible-section">
      <div className="collapsible-section-title">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-shrink-0 mr-2 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          <HiOutlineChevronDown className="w-4 h-4" />
        </button>
        
        {titleHref ? (
          <Link 
            href={titleHref} 
            className="flex-grow hover:text-blue-500 transition-colors"
          >
            {title}
          </Link>
        ) : (
          <button
            className="flex-grow hover:text-blue-500 transition-colors text-left"
            onClick={() => setIsOpen(!isOpen)}
          >
            {title}
          </button>
        )}
      </div>
      {isOpen && <div className="collapsible-section-content">{children}</div>}
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
  const { resolvedTheme, colorScheme } = useTheme();
  const [sidebarState, setSidebarState] = useState<SidebarState>({ 
    isOpen: true, 
    isHovering: false,
    isPinned: false,
    width: 256, // Default width in pixels
    isDragging: false
  });
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  
  // Project creation modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // State for projects and chats
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  
  // Compute effective sidebar state
  const isEffectivelyClosed = !sidebarState.isOpen && !sidebarState.isHovering && !sidebarState.isPinned;

  // If not authenticated, redirect to login
  if (!user) {
    router.push('/login');
    return null;
  }

  // Fetch projects and chats data - now depends on pathname to refresh when navigating
  useEffect(() => {
    const fetchProjectsAndChats = async () => {
      if (user) {
        try {
          const fetchedProjects = await ProjectService.getUserProjects(user.uid);
          const fetchedChats = await ChatService.getUserChats(user.uid);
          setProjects(fetchedProjects);
          
          // For chat listings, only keep non-project chats for the sidebar
          const standaloneChats = fetchedChats.filter(chat => !chat.projectId);
          setRecentChats(standaloneChats);
        } catch (error) {
          console.error('Error fetching projects and chats:', error);
        }
      }
    };

    fetchProjectsAndChats();
  }, [user, pathname]); // Add pathname dependency to refresh when user navigates

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarState.isDragging && sidebarRef.current) {
        const minWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width'));
        const maxWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width'));
        
        // Calculate new width based on mouse position
        const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
        
        setSidebarState(prev => ({
          ...prev,
          width: newWidth,
          isOpen: true // Ensure sidebar is open when resizing
        }));
      }
    };

    const handleMouseUp = () => {
      if (sidebarState.isDragging) {
        setSidebarState(prev => ({
          ...prev,
          isDragging: false
        }));
        
        if (resizeHandleRef.current) {
          resizeHandleRef.current.classList.remove('active');
        }
        
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    if (sidebarState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarState.isDragging]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen 
    }));
  };

  const toggleMobileSidebar = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };

  // Handle mouse enter/leave for hover effect
  const handleMouseEnter = () => {
    if (!sidebarState.isPinned) {
      setSidebarState(prev => ({ ...prev, isHovering: true }));
    }
  };

  const handleMouseLeave = () => {
    if (!sidebarState.isPinned) {
      setSidebarState(prev => ({ ...prev, isHovering: false }));
    }
  };

  // Handle pin/unpin sidebar
  const handlePinSidebar = () => {
    setSidebarState(prev => ({ 
      ...prev, 
      isPinned: !prev.isPinned,
      isOpen: !prev.isPinned // Ensure it's open when pinned
    }));
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (resizeHandleRef.current) {
      resizeHandleRef.current.classList.add('active');
    }
    
    setSidebarState(prev => ({
      ...prev,
      isDragging: true
    }));
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
    <div className={`h-screen flex overflow-hidden ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} theme-${colorScheme}`}>
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

      {/* Sidebar */}      <div 
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-30 sidebar-hover-expand ${
          sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-gray-200 dark:border-gray-700`}
        style={{ 
          width: isEffectivelyClosed ? '4rem' : `${sidebarState.width}px`,
          backgroundColor: 'rgb(var(--sidebar-background))',
          backgroundImage: resolvedTheme === 'dark' ? 
            'linear-gradient(to bottom, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.95)), url(/sidebar-pattern.png)' : 
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98)), url(/sidebar-pattern.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Resize handle */}
        <div 
          ref={resizeHandleRef}
          className="sidebar-resize-handle"
          onMouseDown={handleResizeStart}
          title="Drag to resize sidebar"
        />
        
        {/* Pin button */}
        <button 
          onClick={handlePinSidebar}
          className={`pin-button ${sidebarState.isPinned ? 'pinned' : ''}`}
          title={sidebarState.isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
        >
          <HiOutlinePaperClip className="w-5 h-5" />
        </button>          <div className="h-full flex flex-col">
            {/* No SME.AI logo at the top as requested */}
            <div className="flex items-center justify-between h-14 px-4">
              <button 
                onClick={toggleMobileSidebar} 
                className="lg:hidden p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar">            <Link
              href="/dashboard"
              className={`flex items-center text-sm py-1.5 px-2 rounded-lg ${
                pathname === '/dashboard' 
                  ? 'bg-gray-200 dark:bg-gray-700 text-primary-blue dark:text-primary-purple' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              } ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
            >
              <div className={`sidebar-icon ${!isEffectivelyClosed ? 'mr-2' : ''}`}>
                <HiOutlineHome className="w-4 h-4" />
              </div>
              {!isEffectivelyClosed && <span>Dashboard</span>}
            </Link>

            <div className="my-6 border-b dark:border-gray-700 border-gray-200 opacity-70"></div>
              <CollapsibleSection 
                title="Projects" 
                defaultOpen={true} 
                compact={isEffectivelyClosed} 
                titleHref="/dashboard/projects"
              >
                <div className="space-y-1">
                  {projects.map(project => (
                    <SidebarItem
                      key={project.projectId}
                      icon={<HiOutlineFolder />}
                      label={project.name}
                      href={`/dashboard/projects/${project.projectId}`}
                      isActive={pathname === `/dashboard/projects/${project.projectId}`}
                      compact={isEffectivelyClosed}
                    />
                  ))}                  <div className={isEffectivelyClosed ? '' : 'pl-2 mt-1'}>
                    <Link 
                      href="#" 
                      onClick={handleOpenProjectModal}
                      className={`flex items-center text-sm py-1.5 px-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
                    >
                      <HiOutlinePlus className={`w-4 h-4 ${!isEffectivelyClosed ? 'mr-2' : ''}`} />
                      {!isEffectivelyClosed && <span>New Project</span>}
                    </Link>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection 
                title="Chats" 
                defaultOpen={true} 
                compact={isEffectivelyClosed}
                titleHref="/dashboard/chats"
              >
                <div className="space-y-1">
                  {recentChats.map(chat => (
                    <SidebarItem
                      key={chat.chatId}
                      icon={<HiOutlineChat />}
                      label={chat.title}
                      href={`/dashboard/chats/${chat.chatId}`}
                      isActive={pathname === `/dashboard/chats/${chat.chatId}`}
                      compact={isEffectivelyClosed}
                    />
                  ))}                  <div className={isEffectivelyClosed ? '' : 'pl-2 mt-1'}>
                    <Link 
                      href="/dashboard/chats/new"
                      className={`flex items-center text-sm py-1.5 px-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
                    >
                      <HiOutlinePlus className={`w-4 h-4 ${!isEffectivelyClosed ? 'mr-2' : ''}`} />
                      {!isEffectivelyClosed && <span>New Chat</span>}
                    </Link>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Cloud Connections" compact={isEffectivelyClosed}>
                <div className="space-y-1">                  <Link 
                    href="/dashboard/cloud/google-drive"
                    className={`flex items-center text-sm py-1.5 px-2 rounded-lg ${
                      pathname === '/dashboard/cloud/google-drive' 
                        ? 'bg-gray-200 dark:bg-gray-700 text-primary-blue dark:text-primary-purple' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
                  >
                    <div className={`sidebar-icon ${!isEffectivelyClosed ? 'mr-2' : ''}`}>
                      <HiOutlineCloud className="w-4 h-4" />
                    </div>
                    {!isEffectivelyClosed && <span>Google Drive</span>}
                  </Link>                  <Link 
                    href="/dashboard/cloud/onedrive"
                    className={`flex items-center text-sm py-1.5 px-2 rounded-lg ${
                      pathname === '/dashboard/cloud/onedrive' 
                        ? 'bg-gray-200 dark:bg-gray-700 text-primary-blue dark:text-primary-purple' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
                  >
                    <div className={`sidebar-icon ${!isEffectivelyClosed ? 'mr-2' : ''}`}>
                      <HiOutlineCloud className="w-4 h-4" />
                    </div>
                    {!isEffectivelyClosed && <span>OneDrive</span>}
                  </Link><Link 
                    href="/dashboard/cloud/dropbox"
                    className={`flex items-center text-sm py-1.5 px-2 rounded-lg ${
                      pathname === '/dashboard/cloud/dropbox' 
                        ? 'bg-gray-200 dark:bg-gray-700 text-primary-blue dark:text-primary-purple' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
                  >
                    <div className={`sidebar-icon ${!isEffectivelyClosed ? 'mr-2' : ''}`}>
                      <HiOutlineCloud className="w-4 h-4" />
                    </div>
                    {!isEffectivelyClosed && <span>Dropbox</span>}
                  </Link>                  <div className={isEffectivelyClosed ? '' : 'pl-2 mt-1'}>
                    <Link 
                      href="/dashboard/cloud/connect"
                      className={`flex items-center text-sm py-1.5 px-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${isEffectivelyClosed ? 'justify-center' : ''} transition-colors`}
                    >
                      <HiOutlinePlus className={`w-4 h-4 ${!isEffectivelyClosed ? 'mr-2' : ''}`} />
                      {!isEffectivelyClosed && <span>Connect New</span>}
                    </Link>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
          <div className="p-4">
            <div className="my-1 border-b dark:border-gray-700 border-gray-200 opacity-70 mb-6"></div>
            <div className={`flex items-center mb-4 ${isEffectivelyClosed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center text-white shadow-md">
                {userData?.displayName ? userData.displayName[0].toUpperCase() : 'U'}
              </div>
              {!isEffectivelyClosed && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{userData?.displayName || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email}</p>
                </div>
              )}
            </div>            <div className="space-y-1">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300" 
           style={{ marginLeft: isEffectivelyClosed ? '4rem' : `${sidebarState.width}px` }}>
        {/* Header for mobile */}
        <div className="lg:hidden flex items-center px-4 h-14 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={toggleMobileSidebar}
            className="p-1 mr-4 text-gray-500 focus:outline-none"
          >
            <HiOutlineMenuAlt2 className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold gradient-text">SME.AI</h1>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto pt-6 px-6 md:pt-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}