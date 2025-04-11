import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/blog/published/[slug] - Get a single published post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log(`[API] Fetching blog post with slug: ${slug}`);
    
    // Get the post from BlogPost table
    const post = await prisma.$queryRaw`
      SELECT * FROM "BlogPost"
      WHERE "slug" = ${slug} AND "isPublished" = true
    `;
    
    // Check if post exists
    if (!post || (post as any[]).length === 0) {
      console.log(`[API] Post with slug ${slug} not found`);
      return NextResponse.json(
        { error: 'Post not found or not published' },
        { status: 404 }
      );
    }
    
    const blogPost = (post as any[])[0];
    console.log(`[API] Found post: ${blogPost.title}`);
    
    // Find related posts (posts with the same category)
    const relatedPosts = await prisma.$queryRaw`
      SELECT * FROM "BlogPost"
      WHERE "id" != ${blogPost.id}
        AND "isPublished" = true
        AND "category" = ${blogPost.category}
      LIMIT 3
    `;
    
    console.log(`[API] Found ${(relatedPosts as any[]).length} related posts`);
    
    // Transform post data for the frontend
    const transformedPost = {
      id: blogPost.id,
      title: blogPost.title,
      titleFa: blogPost.titleFa,
      slug: blogPost.slug,
      content: blogPost.content,
      contentFa: blogPost.contentFa,
      thumbnailUrl: blogPost.thumbnailUrl || '/images/placeholder.jpg',
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      published: true,
      author: {
        id: '1',
        name: blogPost.author || 'Unknown Author'
      },
      categories: [
        {
          id: '1',
          name: blogPost.category || 'Uncategorized',
          nameFa: blogPost.categoryFa || 'دسته‌بندی نشده',
          slug: (blogPost.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-')
        }
      ]
    };
    
    // Transform related posts
    const transformedRelatedPosts = (relatedPosts as any[]).map(relatedPost => ({
      id: relatedPost.id,
      title: relatedPost.title,
      titleFa: relatedPost.titleFa,
      slug: relatedPost.slug,
      thumbnailUrl: relatedPost.thumbnailUrl || '/images/placeholder.jpg',
      createdAt: relatedPost.createdAt
    }));
    
    return NextResponse.json({
      post: transformedPost,
      relatedPosts: transformedRelatedPosts
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
} 