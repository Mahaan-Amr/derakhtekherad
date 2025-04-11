'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '../../i18n/settings';

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
  const [shouldRender, setShouldRender] = useState(true);
  const isRightToLeft = locale === 'fa';
  const pathname = usePathname();
  
  useEffect(() => {
    // Don't show on contact page
    if (pathname?.includes('/contact')) {
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, [pathname]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 ${isRightToLeft ? 'left-6' : 'right-6'} z-50`}>
      {/* Main button */}
      <motion.button
        className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg focus:outline-none"
        style={{ 
          backgroundColor: 'var(--color-primary-dark)', 
          color: 'white' 
        }}
        onClick={toggleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Contact options */}
      <AnimatePresence>
        {isOpen && (
          <div className={`absolute ${isRightToLeft ? 'left-0 rtl' : 'right-0 ltr'} bottom-16 space-y-3 min-w-max`}>
            {/* WhatsApp Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0 }}
            >
              <Link href="https://wa.me/989360217684" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6 6.31999C16.8 5.49999 15.8 4.89999 14.7 4.49999C13.6 4.09999 12.5 3.99999 11.3 4.09999C10.1 4.19999 9.00001 4.49999 8.00001 5.09999C7.00001 5.59999 6.10001 6.39999 5.50001 7.29999C4.80001 8.19999 4.30001 9.29999 4.10001 10.4C3.80001 11.5 3.90001 12.7 4.10001 13.8C4.40001 14.9 4.90001 15.9 5.60001 16.8L4.00001 20.5C3.90001 20.7 3.90001 20.9 4.00001 21.2C4.10001 21.4 4.30001 21.5 4.50001 21.6C4.70001 21.7 4.90001 21.7 5.10001 21.6L9.00001 20C9.90001 20.6 10.8 21 11.8 21.3C12.8 21.5 13.7 21.6 14.7 21.5C15.7 21.4 16.7 21.1 17.6 20.6C18.5 20.1 19.3 19.4 19.9 18.6C20.6 17.6 21 16.6 21.3 15.5C21.5 14.4 21.6 13.3 21.4 12.2C21.3 11.1 20.9 10 20.4 9.09999C19.8 7.99999 18.8 7.09999 17.6 6.31999ZM16.8 15.6C16.6 16 16.3 16.3 16 16.6C15.7 16.8 15.4 16.9 15 16.9C14.6 16.9 14.3 16.8 13.9 16.6C13.1 16.2 12.3 15.6 11.5 15C11.1 14.7 10.8 14.3 10.4 14C10.1 13.7 9.80001 13.3 9.50001 12.9C9.20001 12.5 8.90001 12.1 8.60001 11.7C8.30001 11.3 8.10001 10.9 7.90001 10.5C7.70001 10.1 7.60001 9.69999 7.60001 9.29999C7.60001 8.89999 7.70001 8.49999 7.90001 8.19999C8.10001 7.89999 8.40001 7.59999 8.70001 7.39999C9.10001 7.19999 9.50001 7.09999 9.90001 7.19999C10.1 7.19999 10.3 7.29999 10.4 7.39999C10.5 7.49999 10.6 7.69999 10.7 7.89999L11.5 9.39999C11.6 9.59999 11.6 9.79999 11.6 9.89999C11.6 9.99999 11.6 10.1 11.5 10.2C11.5 10.3 11.4 10.4 11.3 10.5L11 10.8C10.9 10.9 10.8 11 10.8 11.1C10.8 11.2 10.8 11.3 10.9 11.4C11 11.6 11.2 11.8 11.4 12C11.6 12.2 11.8 12.4 12 12.6C12.2 12.8 12.4 13 12.6 13.2C12.8 13.4 13 13.6 13.2 13.7C13.3 13.8 13.4 13.8 13.5 13.8C13.6 13.8 13.7 13.7 13.8 13.6L14.1 13.3C14.2 13.2 14.3 13.1 14.4 13.1C14.5 13.1 14.6 13.1 14.7 13.1C14.9 13.1 15 13.1 15.2 13.2L16.7 14C16.9 14.1 17.1 14.2 17.2 14.3C17.3 14.4 17.4 14.6 17.4 14.8C17.2 15 17.1 15.3 16.8 15.6Z" />
                </svg>
                {translations.whatsapp}
              </Link>
            </motion.div>

            {/* Phone Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Link href="tel:+989360217684"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: '#3b82f6', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {translations.call}
              </Link>
            </motion.div>

            {/* Email Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Link href="mailto:info@derakhtekherad.ir"
                className="flex items-center gap-2 text-white px-4 py-2 rounded-full shadow-md transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {translations.email}
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 