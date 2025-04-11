'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ForgotPasswordFormProps {
  locale?: string;
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  locale = 'en',
  onSuccess,
  onBackToLogin
}) => {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});
  
  const { forgotPassword, isLoading, error, success, clearError, clearSuccess } = useAuth();
  const isRtl = locale === 'fa';

  // Clear any messages when unmounting
  useEffect(() => {
    return () => {
      clearError();
      clearSuccess();
    };
  }, [clearError, clearSuccess]);

  const validateForm = () => {
    const errors: { email?: string } = {};
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

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearSuccess();
    
    if (!validateForm()) {
      return;
    }

    try {
      await forgotPassword(email);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error('Password reset request failed:', err);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        <div className="mb-4">
          <p className={`text-gray-700 dark:text-gray-300 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            {locale === 'de' 
              ? 'Geben Sie Ihre E-Mail-Adresse ein, und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.' 
              : 'ایمیل خود را وارد کنید تا لینک بازنشانی رمز عبور برای شما ارسال شود.'}
          </p>
        </div>
        
        <Input
          label={locale === 'de' ? 'E-Mail' : 'ایمیل'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          isRtl={isRtl}
          required
        />
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {locale === 'de' ? 'Link senden' : 'ارسال لینک'}
        </Button>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={onBackToLogin}
            className={`text-primary hover:text-primary-dark text-sm font-medium ${isRtl ? 'text-right w-full' : 'text-left'}`}
          >
            {locale === 'de' ? '← Zurück zur Anmeldung' : '← بازگشت به صفحه ورود'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm; 