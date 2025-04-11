'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '@/app/context/AuthContext';

interface LoginFormProps {
  locale?: string;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  locale = 'en',
  onSuccess,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const isRtl = locale === 'fa';

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = locale === 'de' 
        ? 'E-Mail ist erforderlich' 
        : 'ایمیل الزامی است';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = locale === 'de' 
        ? 'Ungültiges E-Mail-Format' 
        : 'فرمت ایمیل نامعتبر است';
      isValid = false;
    }

    if (!password) {
      errors.password = locale === 'de' 
        ? 'Passwort ist erforderlich' 
        : 'رمز عبور الزامی است';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    console.log('Login form submitted');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Attempting to login with email:', email);
    
    try {
      console.log('Calling login function from auth context');
      // Call login and wait for the promise to resolve
      const loginResult = await login(email, password);
      
      // Use the return value from login to determine success
      if (loginResult) {
        console.log('Login successful, handling redirection');
        
        if (onSuccess) {
          console.log('Calling onSuccess callback');
          onSuccess();
        } else {
          // Default redirect to home page
          console.log(`Redirecting to /${locale}/home`);
          router.push(`/${locale}/home`);
          router.refresh(); // Force a refresh to update the UI
        }
      } else {
        console.log('Login was not successful, no redirect performed');
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login submission error:', err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <Input
          label={locale === 'de' ? 'E-Mail' : 'ایمیل'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          isRtl={isRtl}
          required
        />
        
        <Input
          label={locale === 'de' ? 'Passwort' : 'رمز عبور'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          isRtl={isRtl}
          required
        />
        
        {onForgotPassword && (
          <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
            <button 
              type="button" 
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-primary-dark focus:outline-none"
            >
              {locale === 'de' ? 'Passwort vergessen?' : 'رمز عبور خود را فراموش کرده‌اید؟'}
            </button>
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...'}
            </span>
          ) : (
            <>{locale === 'de' ? 'Anmelden' : 'ورود'}</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm; 