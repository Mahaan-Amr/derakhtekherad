'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/ui/Button';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import { Course, Teacher } from '@/app/types/course';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

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
  featuredStatus: string;
  [key: string]: string;
}

interface CourseEditorProps {
  locale: Locale;
  translations: CourseTranslations;
  course: Course | null;
  isNew: boolean;
  onComplete: (success: boolean) => void;
  teachers: Teacher[];
}

const CourseEditor: React.FC<CourseEditorProps> = ({
  locale,
  translations,
  course,
  isNew,
  onComplete,
  teachers
}) => {
  const { token, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleFa: '',
    description: '',
    descriptionFa: '',
    level: 'A1',
    capacity: 10,
    price: 0,
    startDate: '',
    endDate: '',
    timeSlot: '',
    location: '',
    thumbnail: '',
    isActive: true,
    featured: false,
    teacherId: ''
  });

  // For file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isRtl = locale === 'fa';

  // Initialize form data if editing an existing course
  useEffect(() => {
    if (course) {
      const startDateStr = new Date(course.startDate).toISOString().substring(0, 10);
      const endDateStr = new Date(course.endDate).toISOString().substring(0, 10);
      
      console.log('Course price from props:', course.price, 'Type:', typeof course.price);
      
      setFormData({
        title: course.title,
        titleFa: course.titleFa,
        description: course.description || '',
        descriptionFa: course.descriptionFa || '',
        level: course.level,
        capacity: course.capacity,
        price: course.price || 0,
        startDate: startDateStr,
        endDate: endDateStr,
        timeSlot: course.timeSlot,
        location: course.location,
        thumbnail: course.thumbnail || '',
        isActive: course.isActive,
        featured: course.featured || false,
        teacherId: course.teacherId
      });

      // Set preview for existing thumbnail
      if (course.thumbnail) {
        setPreviewUrl(course.thumbnail);
      }
    }
  }, [course]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle price as a float, other numeric fields as integers
    if (name === 'price') {
      console.log('Price input changed:', value, 'Parsed value:', parseFloat(value) || 0);
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    }
  };

  // Handle file change for thumbnail upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'de' ? 'Die Datei muss ein Bild sein' : 'فایل باید تصویر باشد');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(locale === 'de' ? 'Die Bildgröße darf 2MB nicht überschreiten' : 'اندازه تصویر نباید از 2 مگابایت بیشتر باشد');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload thumbnail file
  const uploadThumbnail = async (): Promise<string | null> => {
    if (!selectedFile) {
      return formData.thumbnail || null;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Check if token is valid
      if (!token) {
        console.error('No authentication token available');
        toast.error(
          locale === 'de'
            ? 'Keine Authentifizierung. Bitte melden Sie sich erneut an.'
            : 'بدون احراز هویت. لطفا دوباره وارد شوید.'
        );
        return null;
      }
      
      // Check token expiration and refresh if needed
      let currentToken = token;
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = payload.exp - now;
            console.log(`Token expires in ${timeLeft} seconds (${timeLeft / 60} minutes)`);
            
            if (timeLeft <= 300) { // Less than 5 minutes remaining or expired
              console.log('Token is about to expire or already expired, refreshing...');
              const refreshed = await refreshToken();
              if (refreshed) {
                console.log('Token refreshed successfully');
                // useAuth will update the token state automatically
              } else {
                console.error('Failed to refresh token');
                if (timeLeft <= 0) {
                  toast.error(
                    locale === 'de'
                      ? 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
                      : 'نشست شما منقضی شده است. لطفا دوباره وارد شوید.'
                  );
                  return null;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);
      
      console.log('Uploading thumbnail - Auth token length:', token ? token.length : 'No token');
      console.log('Uploading to:', '/api/courses/upload');
      
      // Use the course-specific upload endpoint
      const response = await fetch('/api/courses/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        console.error('Upload failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        if (response.status === 401) {
          toast.error(
            locale === 'de'
              ? 'Nicht autorisiert. Bitte melden Sie sich erneut an.'
              : 'غیرمجاز. لطفا دوباره وارد شوید.'
          );
        }
        
        throw new Error('Failed to upload thumbnail');
      }
      
      const data = await response.json();
      console.log('Upload success, received URL:', data.url);
      
      // Make sure we have a valid URL
      if (!data.url) {
        console.error('Invalid upload response:', data);
        toast.error('Invalid upload response from server');
        return null;
      }
      
      return data.url;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error(
        locale === 'de'
          ? 'Fehler beim Hochladen des Bildes'
          : 'خطا در آپلود تصویر'
      );
      // Return empty string instead of null to prevent undefined errors
      return '';
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting form with price:', formData.price, 'Type:', typeof formData.price);
    
    // Check if token is valid
    if (!token) {
      console.error('No authentication token available');
      toast.error(
        locale === 'de'
          ? 'Keine Authentifizierung. Bitte melden Sie sich erneut an.'
          : 'بدون احراز هویت. لطفا دوباره وارد شوید.'
      );
      return;
    }
    
    // Check token expiration and refresh if needed
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = payload.exp - now;
          console.log(`Token expires in ${timeLeft} seconds (${timeLeft / 60} minutes)`);
          
          if (timeLeft <= 300) { // Less than 5 minutes remaining or expired
            console.log('Token is about to expire or already expired, refreshing...');
            const refreshed = await refreshToken();
            if (refreshed) {
              console.log('Token refreshed successfully');
            } else {
              console.error('Failed to refresh token');
              if (timeLeft <= 0) {
                toast.error(
                  locale === 'de'
                    ? 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
                    : 'نشست شما منقضی شده است. لطفا دوباره وارد شوید.'
                );
                return;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
    
    // Validate required fields
    const requiredFields = ['title', 'titleFa', 'level', 'capacity', 'startDate', 'endDate', 'timeSlot', 'location', 'teacherId'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(
        locale === 'de'
          ? 'Bitte füllen Sie alle erforderlichen Felder aus'
          : 'لطفاً تمام فیلدهای الزامی را پر کنید'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload thumbnail if selected
      let thumbnailUrl = formData.thumbnail;
      if (selectedFile) {
        console.log('Uploading thumbnail before course creation');
        thumbnailUrl = await uploadThumbnail() || '';
        console.log('Thumbnail upload completed, URL:', thumbnailUrl);
        
        // If thumbnail upload failed due to auth issues, stop the form submission
        if (!thumbnailUrl && selectedFile) {
          setLoading(false);
          return;
        }
      }
      
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/courses' : `/api/courses/${course?.id}`;
      
      console.log('Submitting course data to', url);
      console.log('Auth token length:', token ? token.length : 'No token');
      console.log('Form data:', { ...formData, thumbnail: thumbnailUrl });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          thumbnail: thumbnailUrl,
          // adminId is now handled automatically by the API based on the authenticated user
        }),
      });
      
      console.log('Course submission response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error data from API:', errorData);
        
        if (response.status === 401) {
          toast.error(
            locale === 'de'
              ? 'Nicht autorisiert. Bitte melden Sie sich erneut an.'
              : 'غیرمجاز. لطفا دوباره وارد شوید.'
          );
          throw new Error('Authentication failed');
        }
        
        throw new Error(`Failed to save course: ${response.status} ${errorData?.error || ''}`);
      }
      
      const courseData = await response.json();
      console.log('Course saved successfully:', courseData);
      
      toast.success(
        isNew
          ? locale === 'de' ? 'Kurs erfolgreich erstellt' : 'دوره با موفقیت ایجاد شد'
          : locale === 'de' ? 'Kurs erfolgreich aktualisiert' : 'دوره با موفقیت بروزرسانی شد'
      );
      
      onComplete(true);
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(
        locale === 'de'
          ? 'Fehler beim Speichern des Kurses'
          : 'خطا در ذخیره دوره'
      );
      onComplete(false);
    } finally {
      setLoading(false);
    }
  };

  // Common level options for language courses
  const levelOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className={`w-full max-w-4xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {isNew ? translations.newCourse : translations.edit}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.titleLabel} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Title (Farsi) */}
            <div className="space-y-2">
              <label htmlFor="titleFa" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.titleFaLabel} *
              </label>
              <input
                type="text"
                id="titleFa"
                name="titleFa"
                value={formData.titleFa}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
                dir="rtl"
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <RichTextEditor
                label={translations.descriptionLabel}
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                locale="de"
                height="200px"
              />
            </div>
            
            {/* Description (Farsi) */}
            <div className="space-y-2">
              <RichTextEditor
                label={translations.descriptionFaLabel}
                value={formData.descriptionFa}
                onChange={(value) => setFormData(prev => ({ ...prev, descriptionFa: value }))}
                locale="fa"
                height="200px"
              />
            </div>
            
            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.thumbnailUpload}
              </label>
              <div className="flex items-center space-x-4">
                {previewUrl && (
                  <div className="relative h-24 w-24 overflow-hidden rounded-md">
                    <ImageWithFallback
                      src={previewUrl}
                      fallbackSrc="/images/placeholder.jpg"
                      alt="Thumbnail preview"
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:bg-opacity-10 file:text-primary hover:file:bg-opacity-20"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {locale === 'de' ? 'PNG, JPG oder GIF bis zu 2MB' : 'PNG، JPG یا GIF تا 2 مگابایت'}
                  </p>
                </div>
              </div>
              {isUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Level */}
            <div className="space-y-2">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.levelLabel} *
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              >
                <option value="">{locale === 'de' ? 'Wählen Sie ein Level' : 'یک سطح انتخاب کنید'}</option>
                {levelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            {/* Capacity */}
            <div className="space-y-2">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.capacityLabel} *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleNumberChange}
                min="1"
                max="50"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.priceLabel || 'Price'} *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                min="0"
                step="1"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Teacher */}
            <div className="space-y-2">
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.teacherLabel} *
              </label>
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              >
                <option value="">{translations.selectTeacher}</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.user.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Start Date */}
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.startDateLabel} *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* End Date */}
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.endDateLabel} *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Time Slot */}
            <div className="space-y-2">
              <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.timeSlotLabel} *
              </label>
              <input
                type="text"
                id="timeSlot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                placeholder={locale === 'de' ? 'z.B. Montag 18:00-20:00' : 'مثلاً دوشنبه ۱۸:۰۰-۲۰:۰۰'}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.locationLabel} *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Active Status */}
            <div className="flex items-center pt-4">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-700"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {translations.activeStatus}
              </label>
            </div>
            
            {/* Featured Status */}
            <div className="flex items-center pt-4">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-700"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {translations.featuredStatus || (locale === 'de' ? 'Auf der Startseite präsentieren' : 'نمایش در صفحه اصلی')}
              </label>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onComplete(false)}
            type="button"
          >
            {translations.cancel}
          </Button>
          <Button
            variant="default"
            type="submit"
            disabled={loading || isUploading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {locale === 'de' ? 'Speichern...' : 'در حال ذخیره...'}
              </span>
            ) : (
              translations.save
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor; 