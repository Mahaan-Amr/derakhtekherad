import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/courses/modules/lessons - Get all lessons for a module
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
    const moduleId = url.searchParams.get('moduleId');
    
    if (!moduleId) {
      return NextResponse.json(
        { error: 'Missing moduleId parameter' },
        { status: 400 }
      );
    }
    
    // Fetch lessons for the module
    const lessons = await prisma.lesson.findMany({
      where: {
        moduleId: moduleId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
      include: {
        materials: true,
        _count: {
          select: {
            materials: true,
          },
        },
      },
    });
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/courses/modules/lessons - Create a new lesson
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
        { error: 'Only admins can create lessons' },
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
    const requiredFields = ['title', 'titleFa', 'moduleId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate module exists
    const module = await prisma.courseModule.findUnique({
      where: { id: data.moduleId },
    });
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    // Get the current highest order index for this module
    const maxOrderIndex = await prisma.lesson.findFirst({
      where: { moduleId: data.moduleId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    
    const nextOrderIndex = maxOrderIndex ? maxOrderIndex.orderIndex + 1 : 0;
    
    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        titleFa: data.titleFa,
        content: data.content || '',
        contentFa: data.contentFa || '',
        duration: data.duration,
        orderIndex: data.orderIndex ?? nextOrderIndex,
        moduleId: data.moduleId,
      },
    });
    
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 