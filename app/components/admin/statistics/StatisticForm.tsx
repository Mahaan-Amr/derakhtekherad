'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/app/i18n/settings';
import toast from 'react-hot-toast';
import Button from '@/app/components/ui/Button';
import InputWithLabel from '@/app/components/ui/InputWithLabel';
import Toggle from '@/app/components/ui/Toggle';

interface StatisticFormProps {
  locale: Locale;
  translations: any;
  mode: 'create' | 'edit';
  statisticId?: string;
}

interface FormData {
  title: string;
  titleFa: string;
  value: string;
  orderIndex: number;
  isActive: boolean;
}

interface FormErrors {
  title?: string;
  titleFa?: string;
  value?: string;
  orderIndex?: string;
}

export default function StatisticForm({ locale, translations, mode, statisticId }: StatisticFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    titleFa: '',
    value: '',
    orderIndex: 0,
    isActive: true
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');

  // Fetch existing statistic data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && statisticId) {
      const fetchStatistic = async () => {
        try {
          const response = await fetch(`/api/statistics/${statisticId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch statistic');
          }
          const data = await response.json();
          setFormData({
            title: data.title || '',
            titleFa: data.titleFa || '',
            value: data.value || '',
            orderIndex: data.orderIndex || 0,
            isActive: data.isActive !== undefined ? data.isActive : true
          });
        } catch (error) {
          console.error('Error fetching statistic:', error);
          toast.error('Failed to load statistic data');
        } finally {
          setLoading(false);
        }
      };

      fetchStatistic();
    }
  }, [mode, statisticId]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = translations.form.required;
    }
    
    if (!formData.titleFa.trim()) {
      newErrors.titleFa = translations.form.required;
    }
    
    if (!formData.value.trim()) {
      newErrors.value = translations.form.required;
    }
    
    if (isNaN(formData.orderIndex)) {
      newErrors.orderIndex = translations.form.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleToggleChange = (isActive: boolean) => {
    setFormData({
      ...formData,
      isActive
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const url = mode === 'create' 
        ? '/api/statistics' 
        : `/api/statistics/${statisticId}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        
        if (response.status === 401) {
          throw new Error('You are not authenticated. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to perform this action.');
        } else {
          throw new Error(errorData?.error || 'Failed to save statistic');
        }
      }
      
      toast.success(
        mode === 'create' 
          ? translations.form.createSuccess 
          : translations.form.updateSuccess
      );
      
      // Redirect back to statistics list
      router.push(`/${locale}/admin/statistics`);
      router.refresh();
    } catch (error: any) {
      console.error('Error saving statistic:', error);
      toast.error(error.message || translations.form.saveFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title (DE) */}
        <div>
          <InputWithLabel
            id="title"
            name="title"
            label={translations.form.title}
            placeholder={translations.form.titlePlaceholder}
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            required
          />
        </div>
        
        {/* Title (FA) */}
        <div>
          <InputWithLabel
            id="titleFa"
            name="titleFa"
            label={translations.form.titleFa}
            placeholder={translations.form.titleFaPlaceholder}
            value={formData.titleFa}
            onChange={handleInputChange}
            error={errors.titleFa}
            required
          />
        </div>
      </div>
      
      {/* Value */}
      <div className="mt-6">
        <InputWithLabel
          id="value"
          name="value"
          label={translations.form.value}
          placeholder={translations.form.valuePlaceholder}
          value={formData.value}
          onChange={handleInputChange}
          error={errors.value}
          helpText={translations.form.valueHelp}
          required
        />
      </div>
      
      {/* Order Index */}
      <div className="mt-6">
        <InputWithLabel
          id="orderIndex"
          name="orderIndex"
          type="number"
          label={translations.form.orderIndex}
          value={formData.orderIndex.toString()}
          onChange={handleInputChange}
          error={errors.orderIndex}
          helpText={translations.form.orderIndexHelp}
          required
        />
      </div>
      
      {/* Is Active */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {translations.form.isActive}
        </label>
        <Toggle 
          checked={formData.isActive}
          onChange={handleToggleChange}
        />
      </div>
      
      {/* Form Actions */}
      <div className="mt-8 flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/admin/statistics`)}
        >
          {translations.form.cancel}
        </Button>
        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting ? translations.form.saving : (
            mode === 'create' ? translations.form.create : translations.form.update
          )}
        </Button>
      </div>
    </form>
  );
} 