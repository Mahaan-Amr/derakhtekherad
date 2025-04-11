'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import UsersList from './UsersList';
import UserEditor from './UserEditor';

// Define component props
interface UsersManagementProps {
  locale: Locale;
  translations: any;
}

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  adminProfile?: { id: string } | null;
  teacherProfile?: { id: string } | null;
  studentProfile?: { id: string } | null;
}

// Define the users management component
export default function UsersManagement({ locale, translations }: UsersManagementProps) {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for editor
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  
  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Handle filtering users by role
  const filteredUsers = users.filter(user => {
    if (roleFilter && user.role !== roleFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditor(true);
  };
  
  // Handle create new user
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowEditor(true);
  };
  
  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(translations.confirmDelete)) {
      try {
        console.log(`Attempting to delete user with ID: ${userId}`);
        
        const response = await fetch(`/api/users?id=${userId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error(`Delete user error: ${response.status}`, data);
          // Extract the detailed error message from the response
          const errorMessage = data.error || `Failed to delete user: ${response.status}`;
          throw new Error(errorMessage);
        }
        
        toast.success(translations.deleteSuccess);
        fetchUsers(); // Refresh the list
      } catch (err: any) {
        console.error(`Error deleting user ${userId}:`, err);
        toast.error(err.message || translations.deleteFailed);
      }
    }
  };
  
  // Handle save user
  const handleSaveUser = async (userData: any) => {
    try {
      if (editingUser) {
        // Update existing user
        const response = await fetch(`/api/users?id=${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.status}`);
        }
        
        toast.success(translations.updateSuccess);
      } else {
        // Create new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create user: ${response.status}`);
        }
        
        toast.success(translations.createSuccess);
      }
      
      setShowEditor(false);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || translations.saveFailed);
    }
  };
  
  // Handle close editor
  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{translations.title}</h1>
      
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder={translations.search}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">{translations.all}</option>
            <option value="ADMIN">{translations.admin}</option>
            <option value="TEACHER">{translations.teacher}</option>
            <option value="STUDENT">{translations.student}</option>
          </select>
        </div>
        
        <div>
          <button
            onClick={handleCreateUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {translations.newUser}
          </button>
        </div>
      </div>
      
      {/* Users list */}
      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          {translations.noDataFound}
        </div>
      ) : (
        <UsersList
          users={filteredUsers}
          locale={locale}
          translations={translations}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
      
      {/* User editor */}
      {showEditor && (
        <UserEditor
          user={editingUser}
          locale={locale}
          translations={translations}
          onSave={handleSaveUser}
          onCancel={handleCloseEditor}
        />
      )}
    </div>
  );
} 