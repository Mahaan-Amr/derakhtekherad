'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ResetPasswordFormProps {
  locale?: string;
  token: string;
  onSuccess?: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  locale = 'en',
  token,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ 
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { resetPassword, isLoading, error, success, clearError, clearSuccess } = useAuth();
  const router = useRouter();
  const isRtl = locale === 'fa';

  // Clear any messages when unmounting
  useEffect(() => {
    return () => {
      clearError();
      clearSuccess();
    };
  }, [clearError, clearSuccess]);

  // Redirect to login page if password reset was successful
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/${locale}/home`);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, onSuccess, router, locale]);

  const validateForm = () => {
    const errors: { 
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!password) {
      errors.password = locale === 'de' 
        ? 'Passwort ist erforderlich' 
        : 'رمز عبور الزامی است';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = locale === 'de'
        ? 'Passwort muss mindestens 6 Zeichen lang sein'
        : 'رمز عبور باید حداقل 6 کاراکتر باشد';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = locale === 'de'
        ? 'Passwörter stimmen nicht überein'
        : 'رمز عبور و تکرار آن مطابقت ندارند';
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
      await resetPassword(token, password);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Password reset failed:', err);
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
            <p className="text-sm mt-2">
              {locale === 'de' 
                ? 'Sie werden in Kürze zur Anmeldeseite weitergeleitet...' 
                : 'به زودی به صفحه ورود هدایت خواهید شد...'}
            </p>
          </div>
        )}
        
        {!success && (
          <>
            <div className="mb-4">
              <p className={`text-gray-700 dark:text-gray-300 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                {locale === 'de' 
                  ? 'Bitte geben Sie Ihr neues Passwort ein.' 
                  : 'لطفا رمز عبور جدید خود را وارد کنید.'}
              </p>
            </div>
            
            <Input
              label={locale === 'de' ? 'Neues Passwort' : 'رمز عبور جدید'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
              isRtl={isRtl}
              required
            />
            
            <Input
              label={locale === 'de' ? 'Passwort bestätigen' : 'تکرار رمز عبور'}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={formErrors.confirmPassword}
              isRtl={isRtl}
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {locale === 'de' ? 'Passwort zurücksetzen' : 'بازنشانی رمز عبور'}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordForm; 