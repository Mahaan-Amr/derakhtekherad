'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface AdminDashboardAnalyticsProps {
  locale: Locale;
  translations: {
    title: string;
    loading?: string;
    error?: string;
    analyticsTitle: string;
    monthlyUsers: string;
    enrollmentsByMonth: string;
    submissionStatus: string;
    coursesByLevel: string;
    retryButton: string;
  };
}

interface ChartData {
  name: string;
  count?: number;
  value?: number;
}

interface DashboardAnalytics {
  monthlyUsers: ChartData[];
  enrollmentsByMonth: ChartData[];
  submissionStatus: ChartData[];
  coursesByLevel: ChartData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const AdminDashboardAnalytics = ({
  locale,
  translations 
}: AdminDashboardAnalyticsProps) => {
  const { theme, isDarkMode } = useTheme();
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get theme-specific colors for charts
  const getThemeColors = () => {
    const themeColors = {
      primary: '#dc2626', // Default theme primary
      secondary: '#8884d8',
      accent: '#82ca9d',
      chartColors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']
    };

    // Update colors based on selected theme
    switch (theme) {
      case 'emerald':
        themeColors.primary = 'rgb(var(--emerald))';
        break;
      case 'rose':
        themeColors.primary = '#f43f5e';
        break;
      case 'blue':
        themeColors.primary = '#3b82f6';
        break;
      case 'amber':
        themeColors.primary = '#f59e0b';
        break;
      case 'ocean':
        themeColors.primary = '#0EA5E9';
        break;
      case 'forest':
        themeColors.primary = '#059669';
        break;
      case 'olive':
        themeColors.primary = '#708238';
        break;
      case 'sunset':
        themeColors.primary = '#ff7e45';
        break;
      case 'midnight':
        themeColors.primary = '#8a2be2';
        break;
    }

    return themeColors;
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    fetchAnalytics();
  }, [locale]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch(`/api/dashboard/analytics?locale=${locale}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const renderLineChart = (data: ChartData[], title: string) => (
    <div className="h-[300px] w-full p-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#eee'} />
          <XAxis dataKey="name" stroke={isDarkMode ? '#ccc' : '#666'} />
          <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#333' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="count" stroke={themeColors.primary} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderBarChart = (data: ChartData[], title: string) => (
    <div className="h-[300px] w-full p-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#555' : '#eee'} />
          <XAxis dataKey="name" stroke={isDarkMode ? '#ccc' : '#666'} />
          <YAxis stroke={isDarkMode ? '#ccc' : '#666'} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#333' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`
            }}
          />
          <Legend />
          <Bar dataKey="count" fill={themeColors.primary} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieChart = (data: ChartData[], title: string) => (
    <div className="h-[300px] w-full p-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={themeColors.chartColors[index % themeColors.chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#333' : '#fff',
              color: isDarkMode ? '#fff' : '#333',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">{translations.loading || 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[600px]">
        <div className="text-destructive text-lg mb-4">
          {translations.error || 'Error'}: {error}
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          style={{ backgroundColor: themeColors.primary }}
        >
          {translations.retryButton || 'Retry'}
        </button>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="px-4 py-6 space-y-8">
      <h2 className="text-2xl font-bold">{translations.analyticsTitle || 'Analytics'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderLineChart(analytics.monthlyUsers, translations.monthlyUsers || 'Monthly Users')}
        {renderBarChart(analytics.enrollmentsByMonth, translations.enrollmentsByMonth || 'Enrollments By Month')}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPieChart(analytics.submissionStatus, translations.submissionStatus || 'Submission Status')}
        {renderBarChart(analytics.coursesByLevel, translations.coursesByLevel || 'Courses By Level')}
      </div>
    </div>
  );
}; 