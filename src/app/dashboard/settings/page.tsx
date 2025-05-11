'use client';

import React, { useState, useEffect } from 'react';
import { Card, Toggle, ThemeToggle, Button } from '@/components/ui';
import { useTheme } from '@/lib/theme-context';
import { useAnimation } from '@/lib/animation-context';
import { useToast } from '@/components/ui/ToastContainer';
import Image from 'next/image';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { animationsEnabled, toggleAnimations } = useAnimation();
  const { addToast, ToastContainer } = useToast();
  
  // Additional settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [rememberSpecialization, setRememberSpecialization] = useState(true);
  
  // Check for stored notification preferences on mount
  useEffect(() => {
    try {
      // Load push notification permission status
      if (window.Notification) {
        if (Notification.permission === 'granted') {
          setPushNotifications(true);
        }
      }
      
      // Load specialization folder preference
      const savedSpecializationPref = localStorage.getItem('rememberSpecialization');
      if (savedSpecializationPref !== null) {
        setRememberSpecialization(savedSpecializationPref === 'true');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);
  
  // Mock cloud connections (would come from an API in production)
  const [cloudConnections, setCloudConnections] = useState([
    { id: 1, type: 'google-drive', name: 'Google Drive', connected: true, lastSync: '2025-05-02T14:30:00Z' },
    { id: 2, type: 'onedrive', name: 'Microsoft OneDrive', connected: false, lastSync: null },
    { id: 3, type: 'dropbox', name: 'Dropbox', connected: false, lastSync: null }
  ]);
  
  // Function to request push notification permission
  const requestNotificationPermission = async () => {
    if (!window.Notification) {
      addToast('error', 'Push notifications are not supported in this browser');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushNotifications(true);
        // Send a test notification
        const notification = new Notification('SME.AI Notifications Enabled', {
          body: 'You will now receive important updates from SME.AI',
          icon: '/favicon.ico'
        });
        addToast('success', 'Push notifications enabled');
      } else {
        setPushNotifications(false);
        addToast('info', 'Permission for push notifications was denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      addToast('error', 'Failed to enable push notifications');
    }
  };
  
  // Handle toggle change for push notifications
  const handlePushNotificationToggle = (checked: boolean) => {
    if (checked && Notification.permission !== 'granted') {
      requestNotificationPermission();
    } else {
      setPushNotifications(checked);
    }
  };
  
  // Handle toggle change for specialization folder
  const handleSpecializationToggle = (checked: boolean) => {
    setRememberSpecialization(checked);
    localStorage.setItem('rememberSpecialization', String(checked));
  };
  
  // Save settings function (would connect to API in a real implementation)
  const saveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      addToast('success', 'Settings saved successfully');
    }, 500);
  };
  
  // Connect cloud service (would initiate OAuth flow in a real implementation)
  const connectCloudService = (serviceId: number) => {
    // Simulate OAuth flow
    addToast('info', 'Redirecting to authentication page...');
    
    // In a real implementation, this would redirect to the OAuth provider
    setTimeout(() => {
      setCloudConnections(cloudConnections.map(conn => 
        conn.id === serviceId 
          ? {...conn, connected: true, lastSync: new Date().toISOString()} 
          : conn
      ));
      addToast('success', 'Cloud service connected successfully');
    }, 2000);
  };
  
  // Disconnect cloud service
  const disconnectCloudService = (serviceId: number) => {
    // Simulate API call
    addToast('info', 'Disconnecting cloud service...');
    
    setTimeout(() => {
      setCloudConnections(cloudConnections.map(conn => 
        conn.id === serviceId 
          ? {...conn, connected: false, lastSync: null} 
          : conn
      ));
      addToast('success', 'Cloud service disconnected');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
      
      <div className="space-y-8">
        {/* Appearance Section */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">Appearance</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="theme-light" 
                    name="theme" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={theme === 'light'} 
                    onChange={() => setTheme('light')} 
                  />
                  <label htmlFor="theme-light" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Light
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="theme-dark" 
                    name="theme" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={theme === 'dark'} 
                    onChange={() => setTheme('dark')} 
                  />
                  <label htmlFor="theme-dark" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Dark
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="theme-system" 
                    name="theme" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={theme === 'system'} 
                    onChange={() => setTheme('system')} 
                  />
                  <label htmlFor="theme-system" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    System preference
                  </label>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="p-4 rounded-md bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Light/Dark Mode Preview</p>
                  </div>
                  <ThemeToggle variant="switch" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Animations
              </label>
              <div className="flex items-center">
                <Toggle 
                  checked={animationsEnabled}
                  onChange={(checked) => toggleAnimations(checked)} 
                  label="Enable animations"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Cloud Connections Section */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">Cloud Connections</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your cloud storage accounts to use files from these services directly in your SME.AI projects.
            </p>
            
            <div className="space-y-4">
              {cloudConnections.map(connection => (
                <div key={connection.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 relative">
                      {connection.type === 'google-drive' && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.71 3.5L1.15 15l3.43 5.99h6.56l-3.43-6h6.86L7.71 3.5zm9.58 0l6.56 11.5h-6.86l-6.56-11.5h6.86zm-3.43 11.5l3.43 6H7.71l3.43-6h6.72z" />
                          </svg>
                        </div>
                      )}
                      {connection.type === 'onedrive' && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.5 18h-7a1 1 0 01-.8-1.6l3-4a1 1 0 011.6 0l1.9 2.6 3-4a1 1 0 011.6 0l4.3 5.7c.2.3 0 .7-.4.7h-7.2z" />
                            <path d="M20.3 17.6l-2.8-3.7a1.5 1.5 0 00-2.4 0l-1.5 2h-3.3l3.7-5a1.5 1.5 0 012.4 0l4.3 5.8a1.5 1.5 0 01-1.4 2.4h-1l1-1.5z" />
                          </svg>
                        </div>
                      )}
                      {connection.type === 'dropbox' && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 14.56l4.3-3.19L24 15.62l-4.3 3.19L24 22l-7.7-4.25L8.6 22l4.3-3.19L8.6 15.62l7.7-4.25-7.7-4.24L4.2 11.37l4.3 3.19-4.3 3.19z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-gray-700 dark:text-gray-300">{connection.name}</p>
                        {connection.connected && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Connected
                          </span>
                        )}
                      </div>
                      {connection.connected && connection.lastSync && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last synchronized: {new Date(connection.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {connection.connected ? (
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {}}
                        >
                          Manage
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => disconnectCloudService(connection.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        variant="primary"
                        onClick={() => connectCloudService(connection.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                SME.AI will only access files and folders you explicitly authorize. You can revoke access at any time.
              </p>
              
              <div className="flex items-center space-x-2">
                <Toggle 
                  checked={rememberSpecialization}
                  onChange={handleSpecializationToggle} 
                  label="Remember authorized folders between sessions"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">Notifications</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email notifications</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive email updates about your activity
                </p>
              </div>
              <Toggle 
                checked={emailNotifications}
                onChange={(checked) => setEmailNotifications(checked)} 
              />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Push notifications</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Toggle 
                  checked={pushNotifications}
                  onChange={handlePushNotificationToggle} 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Application Section */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">Application</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-save drafts</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically save chat drafts
                </p>
              </div>
              <Toggle 
                checked={autoSave}
                onChange={(checked) => setAutoSave(checked)} 
              />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data sharing</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Share anonymous usage data to help us improve
                  </p>
                </div>
                <Toggle 
                  checked={true}
                  onChange={() => {}} 
                />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={saveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}