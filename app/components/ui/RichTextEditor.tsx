'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// Import CSS styles for the editor
import 'react-quill/dist/quill.snow.css';
import { Locale } from '@/app/i18n/settings';

// Use dynamic import for React Quill since it's a client component 
// This avoids SSR hydration issues since Quill requires the browser environment
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="border rounded p-4 animate-pulse h-64 bg-gray-100 dark:bg-gray-800"></div>
});

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  locale?: Locale;
  label?: string;
  required?: boolean;
  height?: string;
  className?: string;
  error?: string;
}

// Update the imageHandler to support both blog and course uploads
const imageHandler = async () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    if (!input.files) return;
    const file = input.files[0];

    // Create a FormData instance
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('token');

      // Determine which endpoint to use based on the current URL
      const isCoursesPage = window.location.pathname.includes('/courses/') || 
                            window.location.pathname.includes('/admin/courses');
      
      const uploadEndpoint = isCoursesPage ? '/api/courses/upload' : '/api/blog/upload';
      console.log(`Using upload endpoint: ${uploadEndpoint}`);

      // Use fetch to upload the image
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      // Get the file URL from the response
      const fileUrl = data.url || data.fileUrl;
      
      if (!fileUrl) {
        throw new Error('No file URL returned from server');
      }
      
      // Get the Quill instance
      const quill = (window as any).quillInstance;
      
      // Get current cursor position
      const range = quill.getSelection(true);
      
      // Insert image at current position
      quill.insertEmbed(range.index, 'image', fileUrl);
      
      // Move cursor after image
      quill.setSelection(range.index + 1);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
};

// Configure the Quill modules (toolbar and other functionalities)
const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: imageHandler
    }
  },
  clipboard: {
    // Allow pasting HTML content
    matchVisual: false
  }
};

// Define available formats
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'align',
  'color', 'background',
  'link', 'image'
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something...',
  locale = 'de',
  label,
  required = false,
  height = '300px',
  className = '',
  error
}) => {
  const [mounted, setMounted] = useState(false);
  const isRtl = locale === 'fa';

  // Only render the editor on the client to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Store the Quill instance globally for the image handler to access
  const saveQuillReference = (quill: any) => {
    if (quill && typeof window !== 'undefined') {
      (window as any).quillInstance = quill.getEditor();
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="border rounded p-4 animate-pulse h-64 bg-gray-100 dark:bg-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`${isRtl ? 'rtl' : 'ltr'} ${className}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          onBlur={(_, quill) => saveQuillReference(quill)}
          style={{ 
            height, 
            direction: isRtl ? 'rtl' : 'ltr', 
            fontFamily: isRtl ? 'Vazirmatn, sans-serif' : 'inherit' 
          }}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor; 