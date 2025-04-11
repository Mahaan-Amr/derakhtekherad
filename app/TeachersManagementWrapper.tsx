'use client';

import { useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import TeachersManagement from '@/app/components/dashboard/admin/teachers/TeachersManagement';

// This is a wrapper component that ensures the JWT token is added to fetch requests
export default function TeachersManagementWrapper({
  locale,
  translations
}: {
  locale: Locale;
  translations: any;
}) {
  const { token, refreshToken } = useAuth();
  
  // Create a global fetch interceptor to add the token to API requests
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      // Only intercept requests to our API
      let request = new Request(input, init);
      const url = new URL(request.url, window.location.origin);
      
      if (url.pathname.startsWith('/api/')) {
        // Deep clone init to avoid modifying the original object
        const newInit = {
          ...init,
          headers: {
            ...init?.headers,
          }
        };
        
        if (token) {
          // Add authorization header
          newInit.headers = {
            ...newInit.headers,
            'Authorization': `Bearer ${token}`
          };
        }
        
        // Make the request with the token
        return originalFetch(input, newInit);
      }
      
      // For non-API requests, use the original fetch
      return originalFetch(input, init);
    };
    
    // Clean up by restoring the original fetch when component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, [token]);
  
  return <TeachersManagement locale={locale} translations={translations} />;
} 