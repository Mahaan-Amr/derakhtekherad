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

// GET /api/courses/modules/lessons/[id] - Get a specific lesson
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
    
    const lessonId = params.id;
    
    // Fetch lesson with related data
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        materials: true,
        module: {
          select: {
            id: true,
            title: true,
            titleFa: true,
            course: {
              select: {
                id: true,
                title: true,
                titleFa: true,
              },
            },
          },
        },
      },
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/modules/lessons/[id] - Update a lesson
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
      where: { id: userId },
      include: { admin: true },
    });
    
    if (!user || !user.admin) {
      return NextResponse.json(
        { error: 'Only admins can update lessons' },
        { status: 403 }
      );
    }
    
    const lessonId = params.id;
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'titleFa', 'content', 'contentFa', 'moduleId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    
    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Check if module exists
    const module = await prisma.courseModule.findUnique({
      where: { id: data.moduleId },
    });
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.title,
        titleFa: data.titleFa,
        content: data.content,
        contentFa: data.contentFa,
        duration: data.duration,
        orderIndex: data.orderIndex !== undefined ? data.orderIndex : existingLesson.orderIndex,
        moduleId: data.moduleId,
      },
    });
    
    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/modules/lessons/[id] - Delete a lesson
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
      where: { id: userId },
      include: { admin: true },
    });
    
    if (!user || !user.admin) {
      return NextResponse.json(
        { error: 'Only admins can delete lessons' },
        { status: 403 }
      );
    }
    
    const lessonId = params.id;
    
    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    
    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Delete lesson (this will cascade delete materials as defined in the schema)
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
    
    return NextResponse.json(
      { message: 'Lesson deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 