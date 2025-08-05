'use client';

import { useTheme } from '@/app/context/ThemeContext';

interface ThemeLoaderProps {
  children: React.ReactNode;
}

export default function ThemeLoader({ children }: ThemeLoaderProps) {
  const { isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading theme...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 