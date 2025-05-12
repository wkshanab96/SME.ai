'use client';

import React, { useState, useEffect } from 'react';
import { Card, Toggle, Button, EnhancedThemeToggle } from '@/components/ui';
import { useTheme } from '@/lib/theme-context';
import { useAnimation } from '@/lib/animation-context';
import { useToast } from '@/components/ui/ToastContainer';
import Image from 'next/image';

// Type for color scheme
type ColorScheme = 'blue' | 'purple' | 'green' | 'amber' | 'rose';

export default function SettingsPage() {
  const { theme, setTheme, preferences, updatePreferences, colorScheme } = useTheme();
  const { animationsEnabled, toggleAnimations } = useAnimation();
  const { addToast, ToastContainer } = useToast();
  
  // Format hour function for time selection dropdowns
  const formatHour = (hour: number) => {
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${displayHour}:00 ${ampm}`;
  };
  
  // Get gradient color for color scheme preview
  const getColorSchemeGradient = (scheme: ColorScheme) => {
    const colorMap = {
      blue: 'linear-gradient(to right, #4F46E5, #3B82F6)',
      purple: 'linear-gradient(to right, #7C3AED, #8B5CF6)',
      green: 'linear-gradient(to right, #10B981, #34D399)',
      amber: 'linear-gradient(to right, #F59E0B, #FBBF24)',
      rose: 'linear-gradient(to right, #E11D48, #F43F5E)'
    };
    return colorMap[scheme];
  };
  
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

  return (    <div className="max-w-4xl mx-auto pb-12">
      <ToastContainer />
      
      <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-blue dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your preferences and customize your experience</p>
      </div>
      
      <div className="space-y-8 relative">{/* Appearance Section */}        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="px-6 py-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">Appearance</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Customize the look and feel of your SME.AI experience
              </p>
            </div>
          </div>
            <div className="p-6 space-y-6">
            {/* Theme Mode Selection */}            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Theme Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div 
                  className={`relative rounded-lg border-2 transition-all cursor-pointer p-4 flex flex-col items-center ${
                    theme === 'light' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                  }`}
                  onClick={() => setTheme('light')}
                >
                  <div className="w-10 h-10 bg-white rounded-full border border-gray-200 mb-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="block font-medium text-gray-800 dark:text-gray-200">Light</span>
                  <input 
                    type="radio" 
                    id="theme-light" 
                    name="theme" 
                    className="sr-only"
                    checked={theme === 'light'} 
                    onChange={() => setTheme('light')} 
                  />
                  {theme === 'light' && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`relative rounded-lg border-2 transition-all cursor-pointer p-4 flex flex-col items-center ${
                    theme === 'dark' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                  }`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full border border-gray-700 mb-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <span className="block font-medium text-gray-800 dark:text-gray-200">Dark</span>
                  <input 
                    type="radio" 
                    id="theme-dark" 
                    name="theme" 
                    className="sr-only"
                    checked={theme === 'dark'} 
                    onChange={() => setTheme('dark')} 
                  />
                  {theme === 'dark' && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`relative rounded-lg border-2 transition-all cursor-pointer p-4 flex flex-col items-center ${
                    theme === 'system' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                  }`}
                  onClick={() => setTheme('system')}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-white to-gray-800 rounded-full border border-gray-200 mb-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="block font-medium text-gray-800 dark:text-gray-200">System</span>
                  <input 
                    type="radio" 
                    id="theme-system" 
                    name="theme" 
                    className="sr-only"
                    checked={theme === 'system'} 
                    onChange={() => setTheme('system')} 
                  />
                  {theme === 'system' && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
                {/* Theme Preview */}              <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-inner">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </h3>
                <div className="flex items-center justify-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Light/Dark Mode Preview</p>
                    </div>
                    <EnhancedThemeToggle size="md" />
                </div>
              </div>
            </div>

            {/* Color Scheme Selection */}            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Color Scheme
              </label>
              
              <div className="grid grid-cols-5 gap-5 mb-4">
                {['blue', 'purple', 'green', 'amber', 'rose'].map((scheme) => (
                  <div key={scheme} className="flex flex-col items-center">
                    <button
                      className={`w-16 h-16 rounded-xl relative transition-all ${
                        preferences.colorScheme === scheme 
                          ? `ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ${
                              scheme === 'blue' ? 'ring-blue-500' : 
                              scheme === 'purple' ? 'ring-purple-500' : 
                              scheme === 'green' ? 'ring-green-500' : 
                              scheme === 'amber' ? 'ring-amber-500' : 'ring-rose-500'
                            } scale-110 shadow-lg` 
                          : 'hover:scale-105 shadow-md'
                      }`}
                      style={{ 
                        background: getColorSchemeGradient(scheme as ColorScheme)
                      }}
                      onClick={() => updatePreferences({ colorScheme: scheme as ColorScheme })}
                      aria-label={`${scheme} color scheme`}
                    >
                      {preferences.colorScheme === scheme && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                    <span className="mt-2 text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
                      {scheme}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Your selected color scheme will be applied throughout the application, affecting buttons, links, and other UI elements.
                </p>
              </div>
            </div>

            {/* Auto Theme Switching */}            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Auto Theme Switching
              </label>
              <div className="space-y-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center mb-3">
                    <Toggle 
                      checked={preferences.autoSwitch}
                      onChange={(checked) => updatePreferences({ autoSwitch: checked })} 
                      label="Automatically switch between light and dark mode based on time"
                    />
                  </div>
                  
                  {preferences.autoSwitch && (
                    <div className="mt-4 pl-2">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Switch to light mode at
                          </label>
                          <select
                            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={preferences.startHour}
                            onChange={(e) => updatePreferences({ startHour: parseInt(e.target.value) })}
                          >
                            {Array.from({ length: 24 }).map((_, i) => (
                              <option key={i} value={i}>
                                {formatHour(i)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Switch to dark mode at
                          </label>
                          <select
                            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={preferences.endHour}
                            onChange={(e) => updatePreferences({ endHour: parseInt(e.target.value) })}
                          >
                            {Array.from({ length: 24 }).map((_, i) => (
                              <option key={i} value={i}>
                                {formatHour(i)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Theme Effects Preview */}            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Theme Effects Preview
              </label>
              
              <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Button Elements</p>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">Interactive</span>
                    </div>
                    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                      <button className="px-4 py-2 bg-[rgb(var(--primary-blue))] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm">Primary</button>
                      <button className="px-4 py-2 bg-[rgb(var(--primary-purple))] hover:bg-purple-600 text-white font-medium rounded-lg transition-colors shadow-sm">Secondary</button>
                      <button className="px-4 py-2 border border-[rgb(var(--primary-blue))] text-[rgb(var(--primary-blue))] hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium rounded-lg transition-colors">Outline</button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Text & Elements</p>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">Color Scheme</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg space-y-3">
                      <h4 className="gradient-text text-lg font-bold">Gradient Text</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[rgb(var(--primary-blue))]"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[rgb(var(--primary-purple))]"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Secondary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[rgb(var(--accent-color))]"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">Accent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    These elements reflect your selected color scheme. Changes are applied in real-time throughout the application.
                  </p>
                </div>
              </div>
            </div>

            {/* Animations Toggle */}            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Animations & Motion
              </label>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">UI Animations</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                      Controls animations and transitions throughout the interface. Turning this off can improve performance on older devices.
                    </p>
                  </div>
                  <Toggle 
                    checked={preferences.animations}
                    onChange={(checked) => updatePreferences({ animations: checked })} 
                  />
                </div>
                
                <div className={`mt-4 flex items-center gap-3 p-3 rounded-lg border ${preferences.animations ? 'border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30'}`}>
                  <div className="flex-shrink-0">
                    {preferences.animations ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {preferences.animations ? 'Animations are currently enabled' : 'Animations are currently disabled'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Save Settings Button */}            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Changes are automatically saved
                </div>
              </div>
              <Button
                onClick={() => {
                  // No need for actual API call as settings are updated in real-time
                  addToast('success', 'Theme preferences saved successfully');
                }}
                className="btn-primary"
                size="md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply Preferences
              </Button>
            </div>
          </div>
        </Card>

        {/* Cloud Connections Section */}        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="px-6 py-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200">Cloud Connections</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Connect your cloud storage accounts for seamless file access
              </p>
            </div>
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

        {/* Notifications Section */}        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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

        {/* Application Section */}        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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