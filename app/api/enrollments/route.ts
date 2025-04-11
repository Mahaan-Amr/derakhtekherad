import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// GET /api/enrollments - Get enrollments (filter by student or course)
export async function GET(request: NextRequest) {
  try {
    // Use nextUrl instead of request.url for static generation compatibility
    const { searchParams } = request.nextUrl;
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');

    // Build where clause based on query parameters
    const where: Prisma.EnrollmentWhereInput = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        course: {
          select: {
            title: true,
            titleFa: true,
            level: true,
            startDate: true,
            endDate: true,
            teacher: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Create a new enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student ID and Course ID are required' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if course exists and is active
    const course = await prisma.course.findUnique({
      where: { 
        id: courseId,
        isActive: true
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or inactive' },
        { status: 404 }
      );
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Student is already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'ACTIVE'
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        course: {
          select: {
            title: true,
            titleFa: true
          }
        }
      }
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}