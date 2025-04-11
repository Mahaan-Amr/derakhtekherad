import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind's class merge utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date for display in the appropriate locale
 */
export function formatDate(date: string | Date, locale: string) {
  return new Date(date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text The text to truncate
 * @param maxLength The maximum length before truncating
 * @returns Truncated text with ellipsis if longer than maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
} 