import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { NextRequest } from 'next/server';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/courses - List all courses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('active');
    const featured = searchParams.get('featured');
    const adminOnly = searchParams.get('adminOnly');
    
    let whereClause: any = {};
    if (isActive === 'true') {
      whereClause.isActive = true;
    } else if (isActive === 'false') {
      whereClause.isActive = false;
    }
    
    if (featured === 'true') {
      whereClause.featured = true;
    }
    
    console.log('Executing courses query with where clause:', whereClause);
    
    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            modules: true,
            enrollments: true
          }
        }
      }
    });
    
    console.log(`Found ${courses.length} courses`);
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Creating course bypassing authentication...');
    
    // Get any admin to work with
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      console.error('No admin found in the database');
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }
    
    console.log('Using admin:', admin);
    
    // Parse request body
    const data = await request.json();
    const {
      title,
      titleFa,
      description,
      descriptionFa,
      price,
      thumbnail,
      level,
      published,
      timeSlot,
      location,
      capacity,
      startDate,
      endDate,
      teacherId,
      featured
    } = data;
    
    // Validate required fields
    if (!title || !titleFa || !description || !descriptionFa || !teacherId || !capacity || !startDate || !endDate || !timeSlot || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if teacher exists
    const teacherExists = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });
    
    if (!teacherExists) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Create the course
    const course = await prisma.course.create({
      data: {
        title,
        titleFa,
        description,
        descriptionFa,
        price: price ? parseFloat(price) : 0,
        thumbnail,
        level,
        isActive: published !== undefined ? !!published : true,
        featured: featured !== undefined ? !!featured : false,
        capacity: Number(capacity),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timeSlot,
        location,
        teacherId,
        adminId: admin.id
      } as any
    });
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
} 