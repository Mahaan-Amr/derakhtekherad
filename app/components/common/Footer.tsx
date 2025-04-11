'use client';

import Link from 'next/link';
import { Locale, isRtl } from '../../i18n/settings';

interface FooterProps {
  locale: Locale;
  translations: {
    address: string;
    phone: string;
    email: string;
    rights: string;
  };
  about: {
    title: string;
    description: string;
  };
  quickLinks: {
    title: string;
    links: {
      title: string;
      href: string;
    }[];
  };
  contact: {
    title: string;
    address: string;
    email: string;
    phone: string;
  };
}

export default function Footer({ locale, translations, about, quickLinks, contact }: FooterProps) {
  const isRightToLeft = isRtl(locale);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">{about.title}</h3>
            <p className="text-gray-300 mb-4">{about.description}</p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a 
                href="https://instagram.com/derakhtekherad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/derakhtekherad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.139.658-.651.818-1.319.508l-3.66-2.696-1.761 1.695c-.195.195-.358.358-.734.358l.263-3.724 6.768-6.111c.293-.262-.064-.408-.458-.146l-8.366 5.266-3.601-1.126c-.782-.245-.796-.782.165-1.157l14.091-5.417c.651-.245 1.222.147 1.02 1.157z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/989360217684" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.6 6.32C16.8 5.5 15.8 4.9 14.7 4.5C13.6 4.1 12.5 4 11.3 4.1C10.1 4.2 9.0 4.5 8.0 5.1C7.0 5.6 6.1 6.4 5.5 7.3C4.8 8.2 4.3 9.3 4.1 10.4C3.8 11.5 3.9 12.7 4.1 13.8C4.4 14.9 4.9 15.9 5.6 16.8L4.0 20.5C3.9 20.7 3.9 20.9 4.0 21.2C4.1 21.4 4.3 21.5 4.5 21.6C4.7 21.7 4.9 21.7 5.1 21.6L9.0 20.0C9.9 20.6 10.8 21.0 11.8 21.3C12.8 21.5 13.7 21.6 14.7 21.5C15.7 21.4 16.7 21.1 17.6 20.6C18.5 20.1 19.3 19.4 19.9 18.6C20.6 17.6 21.0 16.6 21.3 15.5C21.5 14.4 21.6 13.3 21.4 12.2C21.3 11.1 20.9 10.0 20.4 9.1C19.8 8.0 18.8 7.1 17.6 6.32ZM16.8 15.6C16.6 16.0 16.3 16.3 16.0 16.6C15.7 16.8 15.4 16.9 15.0 16.9C14.6 16.9 14.3 16.8 13.9 16.6C13.1 16.2 12.3 15.6 11.5 15.0C11.1 14.7 10.8 14.3 10.4 14.0C10.1 13.7 9.8 13.3 9.5 12.9C9.2 12.5 8.9 12.1 8.6 11.7C8.3 11.3 8.1 10.9 7.9 10.5C7.7 10.1 7.6 9.7 7.6 9.3C7.6 8.9 7.7 8.5 7.9 8.2C8.1 7.9 8.4 7.6 8.7 7.4C9.1 7.2 9.5 7.1 9.9 7.2C10.1 7.2 10.3 7.3 10.4 7.4C10.5 7.5 10.6 7.7 10.7 7.9L11.5 9.4C11.6 9.6 11.6 9.8 11.6 9.9C11.6 10.0 11.6 10.1 11.5 10.2C11.5 10.3 11.4 10.4 11.3 10.5L11.0 10.8C10.9 10.9 10.8 11.0 10.8 11.1C10.8 11.2 10.8 11.3 10.9 11.4C11.0 11.6 11.2 11.8 11.4 12.0C11.6 12.2 11.8 12.4 12.0 12.6C12.2 12.8 12.4 13.0 12.6 13.2C12.8 13.4 13.0 13.6 13.2 13.7C13.3 13.8 13.4 13.8 13.5 13.8C13.6 13.8 13.7 13.7 13.8 13.6L14.1 13.3C14.2 13.2 14.3 13.1 14.4 13.1C14.5 13.1 14.6 13.1 14.7 13.1C14.9 13.1 15.0 13.1 15.2 13.2L16.7 14.0C16.9 14.1 17.1 14.2 17.2 14.3C17.3 14.4 17.4 14.6 17.4 14.8C17.2 15.0 17.1 15.3 16.8 15.6Z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">{quickLinks.title}</h3>
            <ul className="space-y-2">
              {quickLinks.links.map((link, index) => (
                <li key={index} className="flex items-center">
                  <svg 
                    className={`w-3 h-3 text-primary ${isRightToLeft ? 'ml-2 transform rotate-180' : 'mr-2'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">{contact.title}</h3>
            <div className="text-gray-300 space-y-3">
              <div className={`flex items-start`}>
                <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`${isRightToLeft ? 'mr-2' : 'ml-2'}`}>
                  {contact.address}
                </span>
              </div>
              
              <div className={`flex items-start`}>
                <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className={`${isRightToLeft ? 'mr-2' : 'ml-2'}`}>
                  {contact.phone}
                </span>
              </div>
              
              <div className={`flex items-start`}>
                <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={`${isRightToLeft ? 'mr-2' : 'ml-2'}`}>
                  {contact.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom - Copyright and Links */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-sm">
            <p className="text-gray-400">
              &copy; {currentYear} Derakhte Kherad. {translations.rights}.
            </p>
          </div>
          
          <div className="flex gap-4 text-sm">
            <Link 
              href={`/${locale}/privacy`} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              {locale === 'de' ? 'Datenschutz' : 'حریم خصوصی'}
            </Link>
            <Link 
              href={`/${locale}/terms`} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              {locale === 'de' ? 'AGB' : 'شرایط استفاده'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 