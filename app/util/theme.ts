// Check dark mode preference from cookies or system preference
export function isDarkMode(): boolean {
  // When running on the server, we can't access window/document
  if (typeof window === 'undefined') return false;
  
  // Check for localStorage first
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;
  
  // If no localStorage setting, check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Toggle function for use in client components
export function toggleDarkMode(): void {
  if (typeof window === 'undefined') return;
  
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Initialize dark mode based on localStorage or system preference
export function initializeDarkMode(): void {
  if (typeof window === 'undefined') return;
  
  // This adds a small delay to avoid hydration mismatch
  // Will run after initial render to ensure consistent state
  setTimeout(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (
      savedTheme === 'dark' || 
      (!savedTheme && systemPrefersDark)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, 0);
} 