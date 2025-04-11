'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import CharterItem from './CharterItem';

interface Charter {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  iconName?: string;
  orderIndex: number;
  isActive: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

interface ChartersListProps {
  locale: string;
  translations: {
    title: string;
    description: string;
    addNew: string;
    noCharters: string;
    deleteConfirm: string;
    actions: string;
    edit: string;
    delete: string;
    active: string;
    inactive: string;
    confirmDelete: string;
    cancel: string;
    retryButton: string;
  };
}

const ChartersList: React.FC<ChartersListProps> = ({ locale, translations }) => {
  const [charters, setCharters] = useState<Charter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [charterToDelete, setCharterToDelete] = useState<string | null>(null);
  const router = useRouter();

  const fetchCharters = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/charters', {
        headers,
        credentials: 'include' // Include cookies for NextAuth session
      });
      
      if (!response.ok) {
        // If authentication fails, check auth status to debug
        if (response.status === 401 || response.status === 403) {
          await checkAuthStatus();
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setCharters(data);
    } catch (err) {
      setError('Failed to load charters');
      console.error('Error fetching charters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to check auth status for debugging
  const checkAuthStatus = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/auth/status', {
        headers,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth Status Debug:', data);
        
        // If no admin profile found, display a more specific error
        if (data.sessionAuth?.role === 'ADMIN' && !data.sessionAuth?.adminProfile?.exists) {
          setError('Your admin account is missing an admin profile. Please contact the system administrator.');
        } else if (data.tokenAuth?.role === 'ADMIN' && !data.tokenAuth?.adminProfile?.exists) {
          setError('Your admin account is missing an admin profile. Please contact the system administrator.');
        }
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  };

  useEffect(() => {
    fetchCharters();
  }, []);

  const handleAddCharter = () => {
    router.push(`/${locale}/admin/charters/new`);
  };

  const handleEditCharter = (id: string) => {
    router.push(`/${locale}/admin/charters/edit/${id}`);
  };

  const openDeleteModal = (id: string) => {
    setCharterToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCharterToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteCharter = async () => {
    if (!charterToDelete) return;

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/charters?id=${charterToDelete}`, {
        method: 'DELETE',
        headers,
        credentials: 'include' // Include cookies for NextAuth session
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setCharters(charters.filter(charter => charter.id !== charterToDelete));
      toast.success(locale === 'de' ? 'Prinzip erfolgreich gelöscht' : 'منشور با موفقیت حذف شد');
      closeDeleteModal();
    } catch (err) {
      toast.error(locale === 'de' ? 'Fehler beim Löschen des Prinzips' : 'خطا در حذف منشور');
      console.error('Error deleting charter:', err);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/charters', {
        method: 'PUT',
        headers,
        credentials: 'include', // Include cookies for NextAuth session
        body: JSON.stringify({
          id,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedCharter = await response.json();
      
      setCharters(charters.map(charter => 
        charter.id === id ? { ...charter, isActive: updatedCharter.isActive } : charter
      ));
      
      toast.success(
        locale === 'de' 
          ? `Prinzip ${updatedCharter.isActive ? 'aktiviert' : 'deaktiviert'}` 
          : `منشور ${updatedCharter.isActive ? 'فعال' : 'غیرفعال'} شد`
      );
    } catch (err) {
      toast.error(locale === 'de' ? 'Fehler beim Aktualisieren des Status' : 'خطا در بروزرسانی وضعیت');
      console.error('Error toggling charter status:', err);
    }
  };

  const handleReorderCharters = async (id: string, newIndex: number) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/charters', {
        method: 'PUT',
        headers,
        credentials: 'include', // Include cookies for NextAuth session
        body: JSON.stringify({
          id,
          orderIndex: newIndex,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      fetchCharters(); // Refresh the list after reordering
    } catch (err) {
      toast.error(locale === 'de' ? 'Fehler beim Ändern der Reihenfolge' : 'خطا در تغییر ترتیب');
      console.error('Error reordering charters:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchCharters}>{translations.retryButton}</Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {translations.title}
        </h2>
        <Button onClick={handleAddCharter} className="bg-primary text-white">
          {translations.addNew}
        </Button>
      </div>

      {charters.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>{translations.noCharters}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {charters.map(charter => (
            <CharterItem
              key={charter.id}
              charter={charter}
              locale={locale}
              translations={translations}
              onEdit={() => handleEditCharter(charter.id)}
              onDelete={() => openDeleteModal(charter.id)}
              onToggleActive={() => handleToggleActive(charter.id, charter.isActive)}
              onReorder={handleReorderCharters}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {translations.deleteConfirm}
            </h3>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                className="border-gray-300 text-gray-700 dark:text-gray-300"
              >
                {translations.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCharter}
                className="bg-red-600 text-white"
              >
                {translations.confirmDelete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartersList; 