'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isRtl?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label,
  error,
  helperText,
  isRtl = false,
  className = '',
  id,
  type,
  ...props 
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  return (
    <div className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error ? 'border-red-500 text-red-900 placeholder-red-300' : '',
          "dark:bg-gray-700 dark:text-white",
          className
        )}
        dir={isRtl ? 'rtl' : 'ltr'}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 