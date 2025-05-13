// This script runs in the browser to refresh favicons with a cache-busting timestamp
(function() {
  try {
    // Only run once when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      // Create a timestamp to force cache refresh
      const timestamp = new Date().getTime();
      
      // Add fresh favicon links without removing existing ones
      const iconUrls = [
        { rel: 'icon', type: 'image/x-icon', href: `/favicon.ico?v=${timestamp}` },
        { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg?v=${timestamp}` },
        { rel: 'apple-touch-icon', href: `/site-logo/logo.svg?v=${timestamp}` }
      ];
      
      iconUrls.forEach(icon => {
        // Create new link elements instead of modifying existing ones
        const link = document.createElement('link');
        link.rel = icon.rel;
        if (icon.type) link.type = icon.type;
        link.href = icon.href;
        document.head.appendChild(link);
      });
    });
  } catch (error) {
    console.error('Error in favicon refresh script:', error);
  }
})(); 