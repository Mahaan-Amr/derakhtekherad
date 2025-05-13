'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Locale, isRtl } from '../../i18n/settings';

interface FloatingContactButtonProps {
  locale: Locale;
  translations: {
    whatsapp: string;
    call: string;
    email: string;
  };
}

export default function FloatingContactButton({ locale, translations }: FloatingContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isRightToLeft = isRtl(locale);
  const pathname = usePathname();
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Don't show on contact page
  if (pathname?.includes('/contact')) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 ${isRightToLeft ? 'left-6' : 'right-6'} z-50`}>
      {/* Contact options */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-4 items-center">
          {/* WhatsApp */}
          <a
            href="https://wa.me/989360217684"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.6 6.32C16.8 5.5 15.8 4.9 14.7 4.5C13.6 4.1 12.5 4 11.3 4.1C10.1 4.2 9.0 4.5 8.0 5.1C7.0 5.6 6.1 6.4 5.5 7.3C4.8 8.2 4.3 9.3 4.1 10.4C3.8 11.5 3.9 12.7 4.1 13.8C4.4 14.9 4.9 15.9 5.6 16.8L4.0 20.5C3.9 20.7 3.9 20.9 4.0 21.2C4.1 21.4 4.3 21.5 4.5 21.6C4.7 21.7 4.9 21.7 5.1 21.6L9.0 20.0C9.9 20.6 10.8 21.0 11.8 21.3C12.8 21.5 13.7 21.6 14.7 21.5C15.7 21.4 16.7 21.1 17.6 20.6C18.5 20.1 19.3 19.4 19.9 18.6C20.6 17.6 21.0 16.6 21.3 15.5C21.5 14.4 21.6 13.3 21.4 12.2C21.3 11.1 20.9 10.0 20.4 9.1C19.8 8.0 18.8 7.1 17.6 6.32ZM16.8 15.6C16.6 16.0 16.3 16.3 16.0 16.6C15.7 16.8 15.4 16.9 15.0 16.9C14.6 16.9 14.3 16.8 13.9 16.6C13.1 16.2 12.3 15.6 11.5 15.0C11.1 14.7 10.8 14.3 10.4 14.0C10.1 13.7 9.8 13.3 9.5 12.9C9.2 12.5 8.9 12.1 8.6 11.7C8.3 11.3 8.1 10.9 7.9 10.5C7.7 10.1 7.6 9.7 7.6 9.3C7.6 8.9 7.7 8.5 7.9 8.2C8.1 7.9 8.4 7.6 8.7 7.4C9.1 7.2 9.5 7.1 9.9 7.2C10.1 7.2 10.3 7.3 10.4 7.4C10.5 7.5 10.6 7.7 10.7 7.9L11.5 9.4C11.6 9.6 11.6 9.8 11.6 9.9C11.6 10.0 11.6 10.1 11.5 10.2C11.5 10.3 11.4 10.4 11.3 10.5L11.0 10.8C10.9 10.9 10.8 11.0 10.8 11.1C10.8 11.2 10.8 11.3 10.9 11.4C11.0 11.6 11.2 11.8 11.4 12.0C11.6 12.2 11.8 12.4 12.0 12.6C12.2 12.8 12.4 13.0 12.6 13.2C12.8 13.4 13.0 13.6 13.2 13.7C13.3 13.8 13.4 13.8 13.5 13.8C13.6 13.8 13.7 13.7 13.8 13.6L14.1 13.3C14.2 13.2 14.3 13.1 14.4 13.1C14.5 13.1 14.6 13.1 14.7 13.1C14.9 13.1 15.0 13.1 15.2 13.2L16.7 14.0C16.9 14.1 17.1 14.2 17.2 14.3C17.3 14.4 17.4 14.6 17.4 14.8C17.2 15.0 17.1 15.3 16.8 15.6Z"/>
            </svg>
            {translations.whatsapp}
          </a>
          
          {/* Call */}
          <a
            href="tel:+987136386652"
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {translations.call}
          </a>
          
          {/* Email */}
          <a
            href="mailto:info@derakhtekherad.com"
            className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {translations.email}
          </a>
          
          {/* Close button */}
          <button
            onClick={toggleOpen}
            className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors"
            aria-label="Close contact options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Main button */}
      <button
        onClick={toggleOpen}
        className={`flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${isOpen ? 'transform rotate-45' : ''}`}
        aria-label="Contact options"
      >
        {!isOpen && (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
} 