import { InputHTMLAttributes } from 'react';

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export default function InputWithLabel({
  label,
  id,
  error,
  helpText,
  required,
  ...props
}: InputWithLabelProps) {
  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={id}
        className={`
          w-full rounded-md border-gray-300 shadow-sm 
          focus:border-primary focus:ring-primary 
          dark:bg-gray-800 dark:border-gray-700 dark:text-white
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${props.dir === 'rtl' ? 'text-right' : ''}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
} 