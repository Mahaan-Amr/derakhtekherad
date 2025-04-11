// Check dark mode preference from cookies or system preference
export function isDarkMode(): boolean {
  // When running on the server, we can't access window/document
  // In a full implementation, we would check cookies here
  return false;
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
} 