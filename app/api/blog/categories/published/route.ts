import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/blog/categories/published - Get categories from BlogPost model
export async function GET() {
  try {
    console.log('Fetching categories from published BlogPosts');
    
    // Get all BlogPosts and extract unique categories
    const posts = await prisma.$queryRaw`
      SELECT "category", "categoryFa", "isPublished" 
      FROM "BlogPost" 
      WHERE "isPublished" = true
    `;
    
    console.log(`Found ${(posts as any[]).length} published blog posts`);
    
    // Extract unique categories from posts
    const categoryMap = new Map();
    
    (posts as any[]).forEach(post => {
      if (post.category && !categoryMap.has(post.category)) {
        // Create a slug from the category name
        const slug = post.category.toLowerCase().replace(/\s+/g, '-');
        
        categoryMap.set(post.category, {
          id: slug, // Use slug as ID for simplicity
          name: post.category,
          nameFa: post.categoryFa,
          slug: slug,
          description: '',
          descriptionFa: '',
          postCount: 1
        });
      } else if (post.category) {
        // Increment post count for this category
        const category = categoryMap.get(post.category);
        category.postCount += 1;
        categoryMap.set(post.category, category);
      }
    });
    
    // Convert map to array
    const categories = Array.from(categoryMap.values());
    
    console.log(`Returning ${categories.length} unique categories`);
    console.log('Category data sample:', JSON.stringify(categories[0] || {}, null, 2));
    
    // Set content-type explicitly to ensure proper encoding
    return new NextResponse(JSON.stringify(categories), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 