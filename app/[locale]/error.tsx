'use client';

import { useEffect } from 'react';
import Button from '@/app/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
      <div className="text-center px-6 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="mb-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Something went wrong!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
        </p>
        
        <div className="space-x-3 rtl:space-x-reverse">
          <Button onClick={() => reset()} variant="default" size="lg">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  );
} 