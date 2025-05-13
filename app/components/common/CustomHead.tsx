'use client';

import { useEffect } from 'react';

export default function CustomHead() {
  // Force favicon refresh
  useEffect(() => {
    try {
      // Create a timestamp to force cache refresh
      const timestamp = new Date().getTime();
      
      // Safely remove any existing favicon links
      const existingLinks = document.querySelectorAll('link[rel*="icon"]');
      existingLinks.forEach(link => {
        try {
          if (link && link.parentNode) {
            link.parentNode.removeChild(link);
          }
        } catch (err) {
          console.error('Error removing favicon link:', err);
        }
      });
      
      // Add fresh favicon links
      const iconTypes = [
        { rel: 'icon', type: 'image/x-icon', href: `/favicon.ico?v=${timestamp}` },
        { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg?v=${timestamp}` },
        { rel: 'apple-touch-icon', href: `/site-logo/logo.svg?v=${timestamp}` }
      ];
      
      iconTypes.forEach(icon => {
        try {
          const link = document.createElement('link');
          link.rel = icon.rel;
          if (icon.type) link.type = icon.type;
          link.href = icon.href;
          if (document.head) {
            document.head.appendChild(link);
          }
        } catch (err) {
          console.error('Error adding favicon link:', err);
        }
      });
    } catch (error) {
      console.error('Error updating favicon links:', error);
    }
  }, []);
  
  return null;
} 