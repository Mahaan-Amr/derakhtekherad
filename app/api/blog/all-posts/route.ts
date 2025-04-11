import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/blog/all-posts - Alternative endpoint to get all blog posts
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Fetching all blog posts (alternative endpoint)');
    
    // Execute a simple query to get all blog posts
    const posts = await prisma.$queryRaw`
      SELECT * FROM "BlogPost"
    `;
    
    console.log(`[API] Found ${(posts as any[]).length} total blog posts`);
    
    // Return all posts with minimal transformation
    const allPosts = (posts as any[]).map(post => ({
      id: post.id,
      title: post.title,
      titleFa: post.titleFa,
      slug: post.slug,
      thumbnail: post.thumbnailUrl || '/images/placeholder.jpg',
      published: post.isPublished,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        name: post.author || 'Unknown'
      },
      categories: [
        {
          id: '1',
          name: post.category || 'Uncategorized',
          nameFa: post.categoryFa || 'دسته‌بندی نشده',
          slug: (post.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-')
        }
      ]
    }));
    
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 