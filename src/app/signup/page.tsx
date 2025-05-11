'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, Dropdown } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { Industry } from '@/types';

type SignupStep = 'userDetails' | 'industrySelection';

export default function Signup() {
  const [step, setStep] = useState<SignupStep>('userDetails');
  
  // User details form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  // Industry selection form state
  const [industry, setIndustry] = useState<string>('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle, updateIndustry } = useAuth();

  const handleNextStep = () => {
    // Validate user details before proceeding
    if (!name || !email || !password || !passwordConfirm) {
      setError('All fields are required');
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setStep('industrySelection');
  };

  const handlePrevStep = () => {
    setStep('userDetails');
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // First create the user account
      await signUp(email, password, name);
      
      // If an industry was selected, update the user profile
      if (industry) {
        await updateIndustry(industry as Industry);
      }
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up');
      // If there was an error during industry selection, go back to first step
      setStep('userDetails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      setError(error.message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const industryOptions = [
    { id: '1', label: 'Electrical Engineering', value: 'Electrical Engineering' },
    { id: '2', label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
    { id: '3', label: 'Process Engineering', value: 'Process Engineering' },
    { id: '4', label: 'Process Control', value: 'Process Control' },
    { id: '5', label: 'Project Engineering', value: 'Project Engineering' },
    { id: '6', label: 'Other', value: 'Other' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold gradient-text inline-block">SME.AI</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to an existing account
            </Link>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center w-2/3">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'userDetails' ? 'bg-primary-blue text-white border-primary-blue' : 'bg-blue-100 text-blue-800 border-blue-100'
              }`}>
                1
              </div>
              <span className="text-xs mt-1">Account</span>
            </div>
            <div className={`h-1 flex-1 ${step === 'userDetails' ? 'bg-gray-300' : 'bg-primary-blue'}`}></div>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'industrySelection' ? 'bg-primary-blue text-white border-primary-blue' : 'bg-gray-200 text-gray-600 border-gray-200'
              }`}>
                2
              </div>
              <span className="text-xs mt-1">Industry</span>
            </div>
          </div>
        </div>
        
        <Card>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {step === 'userDetails' && (
            <div className="space-y-6">
              <Input 
                id="name" 
                name="name" 
                type="text" 
                autoComplete="name" 
                required 
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />

              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />

              <Input 
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              <Input 
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                label="Confirm password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                fullWidth
              />

              <div className="space-y-4">
                <Button
                  type="button"
                  fullWidth
                  onClick={handleNextStep}
                  isLoading={isLoading}
                >
                  Next
                </Button>

                <div className="flex items-center justify-center">
                  <div className="border-t border-gray-300 dark:border-gray-700 flex-1"></div>
                  <div className="mx-4 text-sm text-gray-500">or</div>
                  <div className="border-t border-gray-300 dark:border-gray-700 flex-1"></div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleGoogleSignUp}
                  isLoading={isLoading}
                  startIcon={
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                  }
                >
                  Sign up with Google
                </Button>
              </div>
            </div>
          )}

          {step === 'industrySelection' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select your primary industry</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This helps us personalize your experience with relevant knowledge and tools.
                </p>
                
                <Dropdown
                  label="Industry"
                  options={industryOptions}
                  value={industry}
                  onChange={setIndustry}
                  placeholder="Select your industry"
                  fullWidth
                />
                
                <p className="text-xs text-gray-500 mt-2">
                  You can change this later in your profile settings.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  fullWidth
                  onClick={handleSignUp}
                  isLoading={isLoading}
                >
                  Complete Sign Up
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}