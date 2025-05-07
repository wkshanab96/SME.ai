'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, Button, Input, Loading } from '@/components/ui';
import { HiUser, HiOfficeBuilding, HiMail, HiBriefcase, HiPhone } from 'react-icons/hi';

export default function ProfilePage() {
  const { user, userData, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    role: '',
    phoneNumber: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Load user data into form when component mounts
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        company: userData.company || '',
        role: userData.role || '',
        phoneNumber: userData.phoneNumber || ''
      });
      setIsLoading(false);
    }
  }, [userData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success/error messages when user starts typing again
    setSaveSuccess(false);
    setSaveError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      await updateUserProfile({
        ...formData
      });
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loading size="lg" type="spinner" />
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-8">My Profile</h1>
      
      <Card className="p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-medium mr-6">
                {userData?.firstName?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold">{userData?.email}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {userData?.emailVerified ? '✓ Email verified' : '⚠️ Email not verified'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                startIcon={<HiUser />}
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName" 
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                startIcon={<HiUser />}
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company
              </label>
              <Input
                id="company"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                startIcon={<HiOfficeBuilding />}
                fullWidth
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Role
              </label>
              <Input
                id="role"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                startIcon={<HiBriefcase />}
                fullWidth
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                startIcon={<HiPhone />}
                fullWidth
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              {saveSuccess && (
                <p className="text-green-500 dark:text-green-400">
                  Profile updated successfully!
                </p>
              )}
              
              {saveError && (
                <p className="text-red-500 dark:text-red-400">
                  {saveError}
                </p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => {
                  if (userData) {
                    setFormData({
                      firstName: userData.firstName || '',
                      lastName: userData.lastName || '',
                      company: userData.company || '',
                      role: userData.role || '',
                      phoneNumber: userData.phoneNumber || ''
                    });
                  }
                  setSaveSuccess(false);
                  setSaveError('');
                }}
              >
                Reset
              </Button>
              
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSaving}
              >
                {isSaving ? <Loading size="sm" type="spinner" className="mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Card>
      
      <Card className="p-6 md:p-8 shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-2">Change Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Update your password to keep your account secure.
            </p>
            <Button 
              variant="secondary"
              onClick={() => window.location.href = '/forgot-password'}
            >
              Change Password
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Permanently delete your account and all associated data.
            </p>
            <Button 
              variant="destructive"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Implement account deletion logic
                  alert('Account deletion functionality will be implemented in a future update.');
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}