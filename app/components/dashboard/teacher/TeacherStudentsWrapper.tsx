'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Locale } from '@/app/i18n/settings';
import TeacherStudentsManagement from './TeacherStudentsManagement';

interface TeacherStudentsWrapperProps {
  locale: Locale;
  translations: any;
}

export default function TeacherStudentsWrapper({ locale, translations }: TeacherStudentsWrapperProps) {
  const { token } = useAuth();
  
  // Set up fetch interceptor to inject token
  useEffect(() => {
    if (!token) return;
    
    // Save the original fetch function
    const originalFetch = window.fetch;
    
    // Override the fetch function
    window.fetch = async (input, init) => {
      // If we have a token, inject it into the Authorization header
      if (token) {
        init = init || {};
        init.headers = init.headers || {};
        
        // Add token to Authorization header if not already present
        if (!(init.headers as Record<string, string>)['Authorization'] && 
            !(init.headers as Record<string, string>)['authorization']) {
          (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
      }
      
      // Call the original fetch with the modified init object
      return originalFetch(input, init);
    };
    
    // Restore the original fetch when the component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);
  
  return <TeacherStudentsManagement locale={locale} translations={translations} />;
} 