'use client';

import { useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import Tab from '@/app/components/ui/Tab';
import CoursesList from './CoursesList';
import ModulesList from './ModulesList';

interface CourseTranslations {
  title: string;
  courses: string;
  modules: string;
  newCourse: string;
  newModule: string;
  activeStatus: string;
  active: string;
  inactive: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  thumbnailUpload: string;
  titleLabel: string;
  titleFaLabel: string;
  descriptionLabel: string;
  descriptionFaLabel: string;
  levelLabel: string;
  capacityLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  timeSlotLabel: string;
  locationLabel: string;
  teacherLabel: string;
  selectTeacher: string;
  save: string;
  cancel: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
  search: string;
  filterBy: string;
  teacher: string;
  level: string;
  noDataFound: string;
  moduleTitle: string;
  moduleTitleFa: string;
  orderIndex: string;
  lessonCount: string;
  dragToReorder: string;
  featuredStatus: string;
  [key: string]: string;
}

interface CourseManagementProps {
  locale: Locale;
  translations: CourseTranslations;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ locale, translations }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'modules'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const isRtl = locale === 'fa';

  const handleTabChange = (tab: 'courses' | 'modules') => {
    setActiveTab(tab);
    if (tab === 'courses') {
      setSelectedCourseId(null);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('modules');
  };

  return (
    <div className={`p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {translations.title}
        </h1>
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'courses'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => handleTabChange('courses')}
              >
                {translations.courses}
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'modules'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                } ${!selectedCourseId ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (selectedCourseId) handleTabChange('modules');
                }}
                disabled={!selectedCourseId}
              >
                {translations.modules}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'courses' ? (
        <CoursesList 
          locale={locale} 
          translations={translations} 
          onSelectCourse={handleSelectCourse} 
        />
      ) : (
        <ModulesList 
          locale={locale} 
          translations={translations} 
          courseId={selectedCourseId!}
        />
      )}
    </div>
  );
};

export default CourseManagement; 