'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { AuthService } from '@/services/auth-service';
import { useToast } from '@/components/ui/ToastContainer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { addToast, ToastContainer } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      addToast('error', 'Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await AuthService.sendPasswordReset(email);
      setEmailSent(true);
      addToast('success', 'Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        addToast('error', 'No account found with this email.');
      } else if (error.code === 'auth/invalid-email') {
        addToast('error', 'Please enter a valid email address.');
      } else {
        addToast('error', 'Failed to send reset email. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer />
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </h1>
          {!emailSent ? (
            <p className="mt-3 text-gray-600">
              Enter your email address, and we&apos;ll send you a link to reset your password.
            </p>
          ) : (
            <p className="mt-3 text-gray-600">
              Check your email for a link to reset your password. If it doesn&apos;t appear within a few minutes, check your spam folder.
            </p>
          )}
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Business Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
              autoFocus
              disabled={isSubmitting}
            />
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Return to login
          </Link>
        </div>
      </Card>
    </div>
  );
}