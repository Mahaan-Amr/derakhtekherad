'use client';

import { Locale } from '@/app/i18n/settings';
import { format } from 'date-fns';
import { de, enUS, faIR } from 'date-fns/locale';

// Define component props
interface UsersListProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }>;
  locale: Locale;
  translations: any;
  onEditUser: (user: any) => void;
  onDeleteUser: (userId: string) => void;
}

// Define the users list component
export default function UsersList({ users, locale, translations, onEditUser, onDeleteUser }: UsersListProps) {
  // Helper function to format dates based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Select locale for date formatting
    const dateLocale = locale === 'de' ? de : locale === 'fa' ? faIR : enUS;
    
    // Format pattern based on locale
    const pattern = locale === 'fa' 
      ? 'yyyy/MM/dd HH:mm' 
      : 'dd.MM.yyyy HH:mm';
    
    return format(date, pattern, { locale: dateLocale });
  };
  
  // Helper function to get role display text
  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return translations.admin;
      case 'TEACHER':
        return translations.teacher;
      case 'STUDENT':
        return translations.student;
      default:
        return role;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">{translations.name}</th>
            <th className="px-4 py-2 text-left">{translations.email}</th>
            <th className="px-4 py-2 text-left">{translations.role}</th>
            <th className="px-4 py-2 text-left">{translations.createdAt}</th>
            <th className="px-4 py-2 text-left">{translations.actions}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.role === 'ADMIN' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : user.role === 'TEACHER' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {getRoleText(user.role)}
                </span>
              </td>
              <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditUser(user)}
                    className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
                  >
                    {translations.edit}
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm"
                  >
                    {translations.delete}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 