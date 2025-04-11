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

// GET /api/blog/categories - Get all blog categories
export async function GET() {
  try {
    // Fetch all categories with post count
    const categories = await prisma.category.findMany({
      include: {
        posts: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories - Create a new blog category
export async function POST(request: NextRequest) {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions);
    console.log('Session check:', session ? 'Session exists' : 'No session');
    
    // Also support token-based authentication
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader || 'No auth header');
    
    // Proper JWT verification
    const hasValidToken = authHeader ? await verifyToken(authHeader) : false;
    
    console.log('Token validation:', hasValidToken ? 'Valid token' : 'Invalid token');
    console.log('Expected JWT_SECRET:', process.env.JWT_SECRET ? 'Secret is set' : 'Secret is not set');
    
    if (!session?.user && !hasValidToken) {
      console.log('Authentication failed: No valid session or token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    
    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        slug,
      },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }
    
    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        nameFa,
        slug,
        description,
        descriptionFa,
      },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/categories/:id - Update a blog category
export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.nameFa || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Check if slug is taken by another category
    if (body.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: body.slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update the category
    await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        nameFa: body.nameFa,
        slug: body.slug,
        description: body.description,
        descriptionFa: body.descriptionFa,
      }
    });

    // Fetch the updated category to return
    const updatedCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: true
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to update blog category' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/categories/:id - Delete a blog category
export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
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
    console.error('Error deleting blog category:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog category' },
      { status: 500 }
    );
  }
}