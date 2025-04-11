'use client';

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  isRtl?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  isRtl = false,
  className = '',
  id,
  onChange,
  value,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm appearance-none
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            ${className}
          `}
          dir={isRtl ? 'rtl' : 'ltr'}
          value={value}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 