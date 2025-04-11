'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import MainLayout from '@/app/components/layouts/MainLayout';
import { Locale } from '@/app/i18n/settings';
import AuthModal from './AuthModal';

interface LoginPageProps {
  locale: Locale;
  translations: {
    navigation: {
      home: string;
      about: string;
      courses: string;
      teachers: string;
      blog: string;
      contact: string;
      login: string;
      darkMode: string;
      lightMode: string;
    };
    footer: {
      address: string;
      phone: string;
      email: string;
      rights: string;
    };
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      remember: string;
      forgot: string;
      login: string;
      noAccount: string;
      register: string;
      back: string;
    };
  };
  callbackUrl?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ locale, translations, callbackUrl }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to callbackUrl or home if already logged in
  useEffect(() => {
    console.log('LoginPage: Checking if user is already logged in');
    console.log('LoginPage: User state:', user);
    
    if (user) {
      console.log('LoginPage: User is logged in, redirecting');
      if (callbackUrl) {
        console.log('LoginPage: Redirecting to callback URL:', callbackUrl);
        router.push(callbackUrl);
      } else {
        console.log(`LoginPage: Redirecting to /${locale}/home`);
        router.push(`/${locale}/home`);
      }
    } else {
      console.log('LoginPage: User is not logged in, showing login form');
    }
  }, [user, callbackUrl, locale, router]);

  const closeAuthModal = () => {
    console.log('LoginPage: Closing auth modal and redirecting to home');
    setIsAuthModalOpen(false);
    router.push(`/${locale}/home`);
  };
  
  const handleAuthSuccess = () => {
    console.log('LoginPage: Auth success callback triggered');
    setIsAuthModalOpen(false);
    
    // Use callbackUrl if available, otherwise redirect to home
    if (callbackUrl) {
      console.log('LoginPage: Redirecting to callback URL after successful auth:', callbackUrl);
      router.push(callbackUrl);
    } else {
      console.log(`LoginPage: Redirecting to /${locale}/home after successful auth`);
      router.push(`/${locale}/home`);
    }
  };

  return (
    <MainLayout locale={locale} navItems={translations.navigation}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {translations.login.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {translations.login.subtitle}
          </p>
          <div className="mt-5">
            <Link
              href={`/${locale}/home`}
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {translations.login.back}
            </Link>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode="login"
        locale={locale}
        onSuccess={handleAuthSuccess}
      />
    </MainLayout>
  );
};

export default LoginPage; 