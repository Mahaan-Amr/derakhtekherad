import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/options';
import * as jose from 'jose';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Helper function to verify JWT tokens
async function verifyToken(token: string): Promise<boolean> {
  try {
    // Remove 'Bearer ' prefix if present
    const actualToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;
    
    // Create a secret key from the JWT_SECRET environment variable
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    // Verify the JWT token
    await jose.jwtVerify(actualToken, secret);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

// GET /api/blog/posts/[id] - Get a specific blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch the post with author and categories
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                nameFa: true,
              },
            },
          },
        },
      },
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/:id - Update entire blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('[Blog API] Updating blog post with ID:', id);
    
    // Get any admin to work with
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      console.error('[Blog API] No admin found in the database');
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }
    
    console.log('[Blog API] Using admin:', admin.id);
    
    // Parse the request body
    const data = await request.json();
    console.log('[Blog API] Received update data:', {
      title: data.title,
      slug: data.slug,
      categoriesCount: data.categories?.length || 0
    });
    
    // Validate required fields
    if (!data.title || !data.titleFa || !data.slug || !data.content || !data.contentFa) {
      console.error('[Blog API] Missing required fields in update request');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if post exists - try both Post and BlogPost models
    let existingPost;
    let useNewModel = false;
    
    try {
      // First try the regular Post model
      existingPost = await prisma.post.findUnique({
        where: { id },
        include: {
          categories: true
        }
      });
      
      // If not found, try the BlogPost model
      if (!existingPost) {
        console.log('[Blog API] Post not found in Post model, trying BlogPost model');
        const blogPost = await prisma.blogPost.findUnique({
          where: { id }
        });
        
        if (blogPost) {
          useNewModel = true;
          existingPost = blogPost;
          console.log('[Blog API] Found post in BlogPost model');
        }
      }
    } catch (findError) {
      console.error('[Blog API] Error finding post:', findError);
    }
    
    if (!existingPost) {
      console.error('[Blog API] Post not found for ID:', id);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    console.log('[Blog API] Found existing post:', {
      id: existingPost.id,
      title: existingPost.title,
      slug: existingPost.slug,
      model: useNewModel ? 'BlogPost' : 'Post'
    });
    
    // Check if slug has changed and the new slug already exists
    if (data.slug !== existingPost.slug) {
      let slugExists = false;
      
      // Check in Post model
      const existingSlugPost = await prisma.post.findUnique({
        where: { slug: data.slug }
      });
      
      if (existingSlugPost && existingSlugPost.id !== id) {
        slugExists = true;
      }
      
      // Also check in BlogPost model
      if (!slugExists) {
        const existingSlugBlogPost = await prisma.blogPost.findUnique({
          where: { slug: data.slug }
        });
        
        if (existingSlugBlogPost && existingSlugBlogPost.id !== id) {
          slugExists = true;
        }
      }
      
      if (slugExists) {
        console.error('[Blog API] Slug already exists:', data.slug);
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }
    
    let updatedPost;
    
    try {
      // Update the post in the appropriate model
      if (useNewModel) {
        // Update in BlogPost model
        console.log('[Blog API] Updating post in BlogPost model');
        updatedPost = await prisma.blogPost.update({
          where: { id },
          data: {
            title: data.title,
            titleFa: data.titleFa,
            slug: data.slug,
            content: data.content,
            contentFa: data.contentFa,
            thumbnailUrl: data.thumbnail,
            isPublished: !!data.published,
            // If BlogPost has excerpt fields
            excerpt: data.excerpt || '',
            excerptFa: data.excerptFa || ''
          }
        });
      } else {
        // Update in Post model
        console.log('[Blog API] Updating post in Post model');
        updatedPost = await prisma.post.update({
          where: { id },
          data: {
            title: data.title,
            titleFa: data.titleFa,
            slug: data.slug,
            content: data.content,
            contentFa: data.contentFa,
            thumbnail: data.thumbnail,
            published: !!data.published
          }
        });
        
        // Update categories if provided
        if (data.categories && !useNewModel) {
          console.log('[Blog API] Updating categories:', data.categories);
          
          try {
            // Delete existing category connections
            const deletedConnections = await prisma.categoryPost.deleteMany({
              where: { postId: id }
            });
            
            console.log(`[Blog API] Deleted ${deletedConnections.count} existing category connections`);
            
            // Create new category connections
            if (data.categories.length > 0) {
              const categoryConnections = data.categories.map((categoryId: string) => ({
                categoryId,
                postId: id
              }));
              
              await prisma.categoryPost.createMany({
                data: categoryConnections
              });
              
              console.log(`[Blog API] Created ${categoryConnections.length} new category connections`);
            }
          } catch (categoryError) {
            console.error('[Blog API] Error updating categories:', categoryError);
            // Continue despite category errors
          }
        }
      }
      
      console.log('[Blog API] Post updated successfully');
      return NextResponse.json(updatedPost);
    } catch (updateError) {
      console.error('[Blog API] Error updating post:', updateError);
      return NextResponse.json(
        { error: 'Failed to update post: ' + (updateError instanceof Error ? updateError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Blog API] Error in PUT handler:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/:id - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[Blog API] Attempting to delete blog post with ID:', params.id);
    
    const { id } = params;
    
    // Check if post exists in either model
    let existingPost;
    let useNewModel = false;
    
    try {
      // First try the regular Post model
      existingPost = await prisma.post.findUnique({
        where: { id }
      });
      
      // If not found, try the BlogPost model
      if (!existingPost) {
        console.log('[Blog API] Post not found in Post model, trying BlogPost model');
        const blogPost = await prisma.blogPost.findUnique({
          where: { id }
        });
        
        if (blogPost) {
          useNewModel = true;
          existingPost = blogPost;
          console.log('[Blog API] Found post in BlogPost model');
        }
      }
    } catch (findError) {
      console.error('[Blog API] Error finding post:', findError);
    }
    
    if (!existingPost) {
      console.error('[Blog API] Post not found for ID:', id);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    console.log('[Blog API] Found post to delete:', {
      id: existingPost.id,
      title: existingPost.title,
      model: useNewModel ? 'BlogPost' : 'Post'
    });
    
    if (!useNewModel) {
      // If using Post model, delete category connections first
      console.log('[Blog API] Deleting category connections for Post model');
      await prisma.categoryPost.deleteMany({
        where: { postId: id }
      });
      
      // Delete the post from Post model
      console.log('[Blog API] Deleting from Post model');
      await prisma.post.delete({
        where: { id }
      });
    } else {
      // Delete the post from BlogPost model
      console.log('[Blog API] Deleting from BlogPost model');
      await prisma.blogPost.delete({
        where: { id }
      });
    }
    
    console.log('[Blog API] Post deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Blog API] Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

// PATCH /api/blog/posts/:id - Update partial blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[Blog API] Patching blog post with ID:', params.id);
    
    const { id } = params;
    const data = await request.json();
    console.log('[Blog API] Patch data:', data);
    
    // Check if post exists in either model
    let existingPost;
    let useNewModel = false;
    
    try {
      // First try the regular Post model
      existingPost = await prisma.post.findUnique({
        where: { id }
      });
      
      // If not found, try the BlogPost model
      if (!existingPost) {
        console.log('[Blog API] Post not found in Post model, trying BlogPost model');
        const blogPost = await prisma.blogPost.findUnique({
          where: { id }
        });
        
        if (blogPost) {
          useNewModel = true;
          existingPost = blogPost;
          console.log('[Blog API] Found post in BlogPost model');
        }
      }
    } catch (findError) {
      console.error('[Blog API] Error finding post:', findError);
    }
    
    if (!existingPost) {
      console.error('[Blog API] Post not found for ID:', id);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    console.log('[Blog API] Found post to patch:', {
      id: existingPost.id,
      title: existingPost.title,
      model: useNewModel ? 'BlogPost' : 'Post'
    });
    
    // Check slug uniqueness if provided
    if (data.slug && data.slug !== existingPost.slug) {
      const slugCheck = async (model: string) => {
        if (model === 'Post') {
          return prisma.post.findUnique({ where: { slug: data.slug } });
        } else {
          return prisma.blogPost.findUnique({ where: { slug: data.slug } });
        }
      };
      
      const existingSlugPost = await slugCheck('Post');
      const existingSlugBlogPost = await slugCheck('BlogPost');
      
      if ((existingSlugPost && existingSlugPost.id !== id) || 
          (existingSlugBlogPost && existingSlugBlogPost.id !== id)) {
        console.error('[Blog API] Slug already exists:', data.slug);
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update the post with only the provided fields
    let updatedPost;
    
    if (useNewModel) {
      // Map published to isPublished for BlogPost model
      const mappedData = { ...data };
      if ('published' in data) {
        mappedData.isPublished = data.published;
        delete mappedData.published;
      }
      
      console.log('[Blog API] Updating BlogPost model with:', mappedData);
      updatedPost = await prisma.blogPost.update({
        where: { id },
        data: mappedData
      });
    } else {
      console.log('[Blog API] Updating Post model with:', data);
      updatedPost = await prisma.post.update({
        where: { id },
        data
      });
    }
    
    console.log('[Blog API] Post patched successfully');
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('[Blog API] Error patching post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
} 