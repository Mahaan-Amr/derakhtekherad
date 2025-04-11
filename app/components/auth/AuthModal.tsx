'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthModalProps {
  locale?: string;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  showRoleSelector?: boolean;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  locale = 'en',
  isOpen,
  onClose,
  initialMode = 'login',
  showRoleSelector = false,
  onSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isRtl = locale === 'fa';

  if (!isOpen) return null;

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  const switchToForgotPassword = () => setMode('forgotPassword');

  const handleSuccess = () => {
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return locale === 'de' ? 'Anmelden' : 'ورود';
      case 'register':
        return locale === 'de' ? 'Registrieren' : 'ثبت نام';
      case 'forgotPassword':
        return locale === 'de' ? 'Passwort vergessen' : 'فراموشی رمز عبور';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transition-all transform ${isRtl ? 'rtl text-right' : 'ltr text-left'}`}>
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {getTitle()}
        </h2>
        
        {mode === 'login' && (
          <>
            <LoginForm 
              locale={locale} 
              onSuccess={handleSuccess}
              onForgotPassword={switchToForgotPassword}
            />
            <div className={`mt-4 text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-gray-700 dark:text-gray-300">
                {locale === 'de' 
                  ? 'Noch kein Konto?' 
                  : 'حساب کاربری ندارید؟'} 
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="font-medium text-primary hover:text-primary-dark mr-1"
                >
                  {locale === 'de' ? 'Jetzt registrieren' : 'ثبت نام کنید'}
                </button>
              </p>
            </div>
          </>
        )}
        
        {mode === 'register' && (
          <>
            <RegisterForm 
              locale={locale} 
              showRoleSelector={showRoleSelector} 
              onSuccess={handleSuccess} 
            />
            <div className={`mt-4 text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-gray-700 dark:text-gray-300">
                {locale === 'de' 
                  ? 'Bereits ein Konto?' 
                  : 'حساب کاربری دارید؟'}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="font-medium text-primary hover:text-primary-dark mr-1"
                >
                  {locale === 'de' ? 'Anmelden' : 'وارد شوید'}
                </button>
              </p>
            </div>
          </>
        )}

        {mode === 'forgotPassword' && (
          <ForgotPasswordForm
            locale={locale}
            onSuccess={handleSuccess}
            onBackToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal; 