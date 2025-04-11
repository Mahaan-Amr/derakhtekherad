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

// GET /api/blog/categories/[id] - Get a specific blog category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch the category with posts
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/categories/[id] - Update a blog category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    let isAuthorized = false;
    
    if (authHeader) {
      const isValidToken = await verifyToken(authHeader);
      if (isValidToken) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const {
      name,
      nameFa,
      slug,
      description,
      descriptionFa,
    } = await request.json();
    
    // Validate required fields
    if (!name || !nameFa || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug is taken by another category
    if (slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug }
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        nameFa,
        slug,
        description,
        descriptionFa,
      },
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/categories/[id] - Delete a blog category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    let isAuthorized = false;
    
    if (authHeader) {
      const isValidToken = await verifyToken(authHeader);
      if (isValidToken) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // First delete all post connections
    await prisma.categoryPost.deleteMany({
      where: { categoryId: id }
    });
    
    // Then delete the category
    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 