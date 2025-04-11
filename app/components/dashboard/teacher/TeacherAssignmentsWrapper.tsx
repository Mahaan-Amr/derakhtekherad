'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Locale } from '@/app/i18n/settings';
import TeacherAssignmentsManagement from './TeacherAssignmentsManagement';

interface TeacherAssignmentsWrapperProps {
  locale: Locale;
  translations: any;
}

export default function TeacherAssignmentsWrapper({ locale, translations }: TeacherAssignmentsWrapperProps) {
  const { token } = useAuth();

  // Create a fetch interceptor to add the JWT token to all requests
  useEffect(() => {
    if (!token) return;

    // Store the original fetch function
    const originalFetch = window.fetch;

    // Define the new fetch function with token injection
    window.fetch = async (input, init) => {
      // Clone the init object to avoid modifying the original
      let newInit = { ...init };
      
      // If authorization header is not already set and token exists, add it
      if (
        newInit?.headers && 
        !(newInit.headers as Headers).has('Authorization') && 
        !((newInit.headers as Record<string, string>)?.Authorization) &&
        token
      ) {
        // Handle different headers formats
        if (newInit.headers instanceof Headers) {
          newInit.headers.set('Authorization', `Bearer ${token}`);
        } else if (typeof newInit.headers === 'object') {
          newInit.headers = {
            ...newInit.headers,
            'Authorization': `Bearer ${token}`
          };
        }
      } else if (!newInit?.headers && token) {
        // If no headers, create new ones with authorization
        newInit.headers = {
          'Authorization': `Bearer ${token}`
        };
      }
      
      // Call the original fetch with the modified init
      return originalFetch(input, newInit);
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);

  return (
    <TeacherAssignmentsManagement 
      locale={locale} 
      translations={translations} 
    />
  );
} 