import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/courses/modules/lessons/materials - Get all materials for a lesson
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
    const lessonId = url.searchParams.get('lessonId');
    
    if (!lessonId) {
      return NextResponse.json(
        { error: 'Missing lessonId parameter' },
        { status: 400 }
      );
    }
    
    // Fetch materials for the lesson
    const materials = await prisma.material.findMany({
      where: {
        lessonId: lessonId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/courses/modules/lessons/materials - Create a new material
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
        { error: 'Only admins can create materials' },
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
    const requiredFields = ['title', 'titleFa', 'type', 'url', 'lessonId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Validate material type
    const validTypes = ['DOCUMENT', 'VIDEO', 'AUDIO', 'LINK', 'OTHER'];
    if (!validTypes.includes(data.type)) {
      return NextResponse.json(
        { error: `Invalid material type. Valid types are: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create material
    const material = await prisma.material.create({
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        type: data.type,
        url: data.url,
        lessonId: data.lessonId,
      },
    });
    
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 