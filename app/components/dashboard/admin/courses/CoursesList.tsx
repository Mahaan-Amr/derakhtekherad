'use client';

import { useState, useEffect, useCallback } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '@/app/components/ui/Button';
import CourseEditor from './CourseEditor';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import { Course, Teacher } from '@/app/types/course';

// Define the CourseTranslations interface
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
  priceLabel: string;
  featuredLabel: string;
  featuredStatus: string;
  featuredYes: string;
  featuredNo: string;
  [key: string]: string;
}

interface CoursesListProps {
  locale: Locale;
  translations: CourseTranslations;
  onSelectCourse: (courseId: string) => void;
}

const CoursesList: React.FC<CoursesListProps> = ({ locale, translations, onSelectCourse }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const isRtl = locale === 'fa';

  // Fetch courses with useCallback to memoize the function
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses?adminOnly=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      console.log('Courses fetched for admin dashboard:', data);
      
      if (data?.courses?.length > 0) {
        console.log('First course price:', data.courses[0].price, 'Type:', typeof data.courses[0].price);
      }
      
      const courseData = data?.courses || [];
      setCourses(courseData);
      setFilteredCourses(courseData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error(locale === 'de' ? 'Fehler beim Laden der Kurse' : 'خطا در بارگذاری دوره‌ها');
      // Ensure we always set these to arrays even on error
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  }, [token, locale]);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch('/api/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }, [token]);

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, [fetchCourses, fetchTeachers]);

  // Handle filtering and searching
  useEffect(() => {
    if (!courses) return;
    
    let result = [...courses];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchLower) || 
        course.titleFa.toLowerCase().includes(searchLower) ||
        (course.description && course.description.toLowerCase().includes(searchLower)) ||
        (course.descriptionFa && course.descriptionFa.toLowerCase().includes(searchLower)) ||
        course.level.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply teacher filter
    if (selectedTeacher) {
      result = result.filter(course => course.teacher?.id === selectedTeacher);
    }
    
    // Apply level filter
    if (selectedLevel) {
      result = result.filter(course => course.level === selectedLevel);
    }
    
    setFilteredCourses(result);
  }, [courses, search, selectedTeacher, selectedLevel]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle teacher filter change
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeacher(e.target.value);
  };

  // Handle level filter change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value);
  };

  // Open the editor for a new course
  const handleNewCourse = () => {
    setEditingCourse(null);
    setShowEditor(true);
  };

  // Open the editor for an existing course
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowEditor(true);
  };

  // Handle course deletion
  const handleDeleteCourse = async (id: string) => {
    try {
      console.log('[CoursesList] Deleting course with ID:', id);
      
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Include session cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[CoursesList] Error response:', errorData);
        throw new Error('Failed to delete course');
      }

      toast.success(
        locale === 'de' 
          ? 'Kurs erfolgreich gelöscht' 
          : 'دوره با موفقیت حذف شد'
      );
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Löschen des Kurses' 
          : 'خطا در حذف دوره'
      );
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // Handle course selection for modules view
  const handleViewModules = (courseId: string) => {
    onSelectCourse(courseId);
  };

  // Handle editor completion
  const handleEditorComplete = (success: boolean) => {
    setShowEditor(false);
    if (success) {
      fetchCourses();
    }
  };

  // Extract unique levels for filtering
  const levels = Array.from(new Set(courses?.map(course => course.level) || [])).sort();

  // Format date according to locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Prevent potential setState calls during render
  if (!filteredCourses) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
      {showEditor ? (
        <CourseEditor
          locale={locale}
          translations={translations}
          course={editingCourse}
          isNew={!editingCourse}
          onComplete={handleEditorComplete}
          teachers={teachers}
        />
      ) : (
        <>
          {/* Filters and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder={translations.search}
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full p-2 pr-8 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
              </div>
              
              {/* Teacher filter */}
              <div className="w-full sm:w-48">
                <select
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">{translations.teacher}</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Level filter */}
              <div className="w-full sm:w-36">
                <select
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">{translations.level}</option>
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* New course button */}
            <Button 
              variant="default"
              onClick={handleNewCourse}
              className="whitespace-nowrap"
            >
              {translations.newCourse}
            </Button>
          </div>
          
          {/* Courses list */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.titleLabel}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.teacher}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.level}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.priceLabel || 'Price'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.startDateLabel}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.activeStatus}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.featuredLabel || (locale === 'de' ? 'Empfohlen' : 'پیشنهاد ویژه')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {translations.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCourses.map(course => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <ImageWithFallback
                              src={course.thumbnail || '/images/placeholder.jpg'}
                              fallbackSrc="/images/placeholder.jpg"
                              alt={course.title}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {locale === 'de' ? course.title : course.titleFa}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course._count?.modules} {translations.modules}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{course.teacher?.user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'fa-IR', {
                          style: 'currency',
                          currency: locale === 'de' ? 'EUR' : 'IRR',
                          minimumFractionDigits: 0
                        }).format(course.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(course.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {course.isActive ? translations.active : translations.inactive}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.featured 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {course.featured 
                            ? (translations.featuredYes || (locale === 'de' ? 'Ja' : 'بله'))
                            : (translations.featuredNo || (locale === 'de' ? 'Nein' : 'خیر'))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewModules(course.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {translations.modules}
                          </button>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {translations.edit}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(course.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {translations.delete}
                          </button>
                          
                          {/* Delete confirmation dialog */}
                          {showDeleteConfirm === course.id && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                  {translations.confirmDelete}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                  {locale === 'de' 
                                    ? `Möchten Sie den Kurs "${course.title}" wirklich löschen?` 
                                    : `آیا از حذف دوره "${course.titleFa}" اطمینان دارید؟`}
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
                                    onClick={() => handleDeleteCourse(course.id)}
                                  >
                                    {translations.delete}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default CoursesList; 