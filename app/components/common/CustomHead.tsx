'use client';

import Head from 'next/head';
import { useEffect } from 'react';

export default function CustomHead() {
  // Force favicon refresh
  useEffect(() => {
    // Create a timestamp to force cache refresh
    const timestamp = new Date().getTime();
    
    // Remove any existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => {
      document.head.removeChild(link);
    });
    
    // Add fresh favicon links
    const iconTypes = [
      { rel: 'icon', type: 'image/x-icon', href: `/favicon.ico?v=${timestamp}` },
      { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg?v=${timestamp}` },
      { rel: 'icon', type: 'image/svg+xml', href: `/site-logo/logo.svg?v=${timestamp}` },
      { rel: 'apple-touch-icon', href: `/site-logo/logo.svg?v=${timestamp}` }
    ];
    
    iconTypes.forEach(icon => {
      const link = document.createElement('link');
      link.rel = icon.rel;
      if (icon.type) link.type = icon.type;
      link.href = icon.href;
      document.head.appendChild(link);
    });
  }, []);
  
  return null;
} 