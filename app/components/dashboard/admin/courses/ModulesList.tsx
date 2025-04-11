'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/ui/Button';
import { CourseModule } from '@/app/types/course';
import ModuleEditor from './ModuleEditor';

interface ModulesListProps {
  locale: Locale;
  courseId: string;
  translations: {
    title: string;
    courses: string;
    modules: string;
    newModule: string;
    edit: string;
    delete: string;
    confirmDelete: string;
    save: string;
    cancel: string;
    noDataFound: string;
    moduleTitle: string;
    moduleTitleFa: string;
    orderIndex: string;
    descriptionLabel: string;
    descriptionFaLabel: string;
    [key: string]: string;
  };
}

const ModulesList: React.FC<ModulesListProps> = ({ 
  locale, 
  courseId, 
  translations 
}) => {
  const { token } = useAuth();
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const isRtl = locale === 'fa';

  // Fetch modules for the course
  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/modules?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }

      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error(
        locale === 'de' ? 'Fehler beim Laden der Module' : 'خطا در بارگذاری ماژول‌ها'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load modules on component mount
  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId, token]);

  // Handle creating a new module
  const handleNewModule = () => {
    setEditingModule(null);
    setShowEditor(true);
  };

  // Handle editing an existing module
  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setShowEditor(true);
  };

  // Handle module deletion
  const handleDeleteModule = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/modules/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }

      toast.success(
        locale === 'de' 
          ? 'Modul erfolgreich gelöscht' 
          : 'ماژول با موفقیت حذف شد'
      );
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Löschen des Moduls' 
          : 'خطا در حذف ماژول'
      );
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // Handle editor completion
  const handleEditorComplete = (success: boolean) => {
    setShowEditor(false);
    if (success) {
      fetchModules();
    }
  };

  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
      {showEditor ? (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {editingModule 
              ? locale === 'de' ? 'Modul bearbeiten' : 'ویرایش ماژول' 
              : locale === 'de' ? 'Neues Modul erstellen' : 'ایجاد ماژول جدید'
            }
          </h2>
          {/* Use the ModuleEditor component */}
          <ModuleEditor
            locale={locale}
            translations={translations}
            courseId={courseId}
            module={editingModule}
            onComplete={handleEditorComplete}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {translations.modules}
            </h2>
            <Button
              variant="default"
              onClick={handleNewModule}
            >
              {translations.newModule}
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module, index) => (
                <div 
                  key={module.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 mr-2">
                          {index + 1}.
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {locale === 'de' ? module.title : module.titleFa}
                        </h3>
                      </div>
                      {module.description && (
                        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                          {locale === 'de' ? module.description : module.descriptionFa}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {module._count?.lessons || 0} {locale === 'de' ? 'Lektionen' : 'درس'}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {translations.edit}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(module.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {translations.delete}
                      </button>
                    </div>
                  </div>
                  
                  {/* Delete confirmation dialog */}
                  {showDeleteConfirm === module.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                          {translations.confirmDelete}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                          {locale === 'de' 
                            ? `Möchten Sie das Modul "${module.title}" wirklich löschen?` 
                            : `آیا از حذف ماژول "${module.titleFa}" اطمینان دارید؟`}
                        </p>
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            {translations.cancel}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteModule(module.id)}
                          >
                            {translations.delete}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {translations.noDataFound}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModulesList; 