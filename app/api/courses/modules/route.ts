import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/courses/modules - Get all modules for a course
export async function GET(req: Request) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get('authorization');
    
    let isAuthenticated = false;
    
    if (session?.user) {
      isAuthenticated = true;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        await verifyToken(token);
        isAuthenticated = true;
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const courseId = url.searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Missing courseId parameter' },
        { status: 400 }
      );
    }
    
    // Fetch modules for the course
    const modules = await prisma.courseModule.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });
    
    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/courses/modules - Create a new module
export async function POST(req: Request) {
  try {
    // Authentication check
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
        { error: 'Only admins can create modules' },
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
    
    // Parse request body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'titleFa', 'courseId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Create module
    const module = await prisma.courseModule.create({
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        orderIndex: data.orderIndex || 0,
        courseId: data.courseId,
      },
    });
    
    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 