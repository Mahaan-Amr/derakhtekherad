'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Locale } from '@/app/i18n/settings';
import PostEditor from './PostEditor';

// Define the blog post type
interface BlogPost {
  id: string;
  title: string;
  titleFa: string;
  slug: string;
  content: string;
  contentFa: string;
  thumbnail: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    user: {
      name: string;
    };
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
      nameFa: string;
    };
  }>;
}

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

interface PostsListProps {
  locale: Locale;
  translations: BlogTranslations;
}

const PostsList: React.FC<PostsListProps> = ({ locale, translations }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const isRtl = locale === 'fa';

  // Fetch posts from the API
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/posts?published=all');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (error: unknown) {
      console.error('Error fetching posts:', error);
      toast.error(locale === 'de' ? 'Fehler beim Laden der Beiträge' : 'خطا در بارگذاری پست‌ها');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    if (!window.confirm(translations.confirmDelete)) {
      return;
    }

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('token');
      
      console.log('[PostsList] Deleting post with ID:', id);
      
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken || ''}`,
        },
        credentials: 'include', // Include session cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PostsList] Error response:', errorData);
        throw new Error('Failed to delete post');
      }

      // Remove the deleted post from the state
      setPosts(posts.filter(post => post.id !== id));
      toast.success(locale === 'de' ? 'Beitrag erfolgreich gelöscht' : 'پست با موفقیت حذف شد');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(locale === 'de' ? 'Fehler beim Löschen des Beitrags' : 'خطا در حذف پست');
    }
  };

  // Handle post publishing status toggle
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('token');
      
      console.log('[PostsList] Toggling publish status for post:', id, 'Current status:', currentStatus);
      
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || ''}`,
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[PostsList] Error response:', errorData);
        throw new Error('Failed to update post status');
      }

      // Update the post status in the state
      setPosts(
        posts.map(post => 
          post.id === id 
            ? { ...post, published: !currentStatus } 
            : post
        )
      );

      toast.success(
        !currentStatus
          ? locale === 'de' ? 'Beitrag veröffentlicht' : 'پست منتشر شد'
          : locale === 'de' ? 'Beitrag als Entwurf gespeichert' : 'پست به حالت پیش‌نویس تغییر یافت'
      );
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error(locale === 'de' ? 'Fehler beim Aktualisieren des Beitragsstatus' : 'خطا در بروزرسانی وضعیت پست');
    }
  };

  // Filter posts based on search term and published status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.titleFa.includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.contentFa.includes(searchTerm);
    
    if (showOnlyPublished) {
      return matchesSearch && post.published;
    }
    
    return matchesSearch;
  });

  // Handle post creation or editing completion
  const handleEditorComplete = (success: boolean) => {
    if (success) {
      fetchPosts(); // Refresh the posts list
    }
    setIsEditing(false);
    setIsCreating(false);
    setSelectedPost(null);
  };

  if (isEditing || isCreating) {
    return (
      <PostEditor 
        locale={locale} 
        translations={translations} 
        post={selectedPost} 
        isNew={isCreating}
        onComplete={handleEditorComplete} 
      />
    );
  }

  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-grow max-w-md">
          <input
            type="text"
            placeholder={translations.search}
            className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              id="published-filter"
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
              checked={showOnlyPublished}
              onChange={() => setShowOnlyPublished(!showOnlyPublished)}
            />
            <label htmlFor="published-filter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {translations.published}
            </label>
          </div>
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            onClick={() => {
              setSelectedPost(null);
              setIsCreating(true);
            }}
          >
            {translations.newPost}
          </button>
        </div>
      </div>

      {/* Posts table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.titleLabel}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.slug}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.publishedStatus}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.createdAt}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {translations.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {locale === 'de' ? post.title : post.titleFa}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {post.published ? translations.published : translations.draft}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString(locale === 'de' ? 'de-DE' : 'fa-IR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`text-sm ${
                          post.published 
                            ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' 
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                      >
                        {post.published ? translations.draft : translations.published}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setIsEditing(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {translations.edit}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
      ) : (
        <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">{translations.noDataFound}</p>
        </div>
      )}
    </div>
  );
};

export default PostsList;