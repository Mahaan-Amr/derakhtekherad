'use client';

import { useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import PostsList from './PostsList';
import CategoriesList from './CategoriesList';

interface BlogTranslations {
  title: string;
  posts: string;
  categories: string;
  newPost: string;
  newCategory: string;
  publishedStatus: string;
  published: string;
  draft: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  thumbnailUpload: string;
  titleLabel: string;
  titleFaLabel: string;
  contentLabel: string;
  contentFaLabel: string;
  selectCategories: string;
  save: string;
  cancel: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  actions: string;
  search: string;
  filterBy: string;
  author: string;
  category: string;
  nameLabel: string;
  nameFaLabel: string;
  descriptionLabel: string;
  descriptionFaLabel: string;
  postCount: string;
  noDataFound: string;
  requiredFieldsMissing: string;
  [key: string]: string;
}

interface BlogManagementProps {
  locale: Locale;
  translations: BlogTranslations;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ locale, translations }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const isRtl = locale === 'fa';

  const handleTabChange = (tab: 'posts' | 'categories') => {
    setActiveTab(tab);
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
                  activeTab === 'posts'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => handleTabChange('posts')}
              >
                {translations.posts}
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'categories'
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                onClick={() => handleTabChange('categories')}
              >
                {translations.categories}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'posts' ? (
        <PostsList locale={locale} translations={translations} />
      ) : (
        <CategoriesList locale={locale} translations={translations} />
      )}
    </div>
  );
};

export default BlogManagement;
