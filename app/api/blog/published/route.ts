import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/blog/published - Get all published posts
export async function GET(request: NextRequest) {
  try {
    console.log('[API] Fetching all published blog posts');
    
    // Execute a simpler query without pagination first to debug
    const posts = await prisma.$queryRaw`
      SELECT * FROM "BlogPost"
    `;
    
    console.log(`[API] Found ${(posts as any[]).length} total blog posts`);
    
    // Filter published posts in memory
    const publishedPosts = (posts as any[]).filter(post => post.isPublished === true);
    
    console.log(`[API] After filtering: ${publishedPosts.length} published posts`);
    
    // Prepare posts with minimal transformation
    const simplifiedPosts = publishedPosts.map(post => {
      return {
        id: post.id,
        title: post.title,
        titleFa: post.titleFa,
        slug: post.slug,
        content: post.content,
        contentFa: post.contentFa,
        thumbnail: post.thumbnailUrl || '/images/placeholder.jpg',
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        published: true,
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
      };
    });

    console.log(`[API] Returning ${simplifiedPosts.length} posts`);
    
    return NextResponse.json(simplifiedPosts);
  } catch (error) {
    console.error('Error in /api/blog/published route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch published posts',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 