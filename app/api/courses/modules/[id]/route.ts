import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Authentication helper function
async function authenticate(req: Request) {
  const session = await getServerSession(authOptions);
  const authHeader = req.headers.get('authorization');
  
  let isAuthenticated = false;
  let userId = null;
  
  if (session?.user) {
    isAuthenticated = true;
    userId = session.user.id;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = await verifyToken(token);
      isAuthenticated = true;
      userId = payload.id;
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }
  
  if (!isAuthenticated) {
    return { isAuthenticated: false, userId: null };
  }
  
  return { isAuthenticated, userId };
}

// GET /api/courses/modules/[id] - Get a specific module
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated } = await authenticate(req);
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const moduleId = params.id;
    
    // Fetch module
    const module = await prisma.courseModule.findUnique({
      where: {
        id: moduleId,
      },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/modules/[id] - Update a module
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, userId } = await authenticate(req);
    
    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update modules' },
        { status: 403 }
      );
    }
    
    // Check for admin profile
    const adminProfile = await prisma.admin.findFirst({
      where: { userId: user.id }
    });
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 403 }
      );
    }
    
    const moduleId = params.id;
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'titleFa'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if module exists
    const existingModule = await prisma.courseModule.findUnique({
      where: { id: moduleId },
    });
    
    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    // Update module
    const updatedModule = await prisma.courseModule.update({
      where: { id: moduleId },
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        orderIndex: data.orderIndex !== undefined ? data.orderIndex : existingModule.orderIndex,
      },
    });
    
    return NextResponse.json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/modules/[id] - Delete a module
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, userId } = await authenticate(req);
    
    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can delete modules' },
        { status: 403 }
      );
    }
    
    // Check for admin profile
    const adminProfile = await prisma.admin.findFirst({
      where: { userId: user.id }
    });
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 403 }
      );
    }
    
    const moduleId = params.id;
    
    // Check if module exists
    const existingModule = await prisma.courseModule.findUnique({
      where: { id: moduleId },
    });
    
    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    // Delete module
    await prisma.courseModule.delete({
      where: { id: moduleId },
    });
    
    return NextResponse.json(
      { message: 'Module deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 