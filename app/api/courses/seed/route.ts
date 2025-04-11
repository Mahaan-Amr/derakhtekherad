import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if we have any admin users
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      return NextResponse.json({
        status: 'error',
        message: 'No admin users found'
      }, { status: 404 });
    }
    
    // Check if we have any teachers
    const teacher = await prisma.teacher.findFirst();
    
    if (!teacher) {
      return NextResponse.json({
        status: 'error',
        message: 'No teacher users found'
      }, { status: 404 });
    }
    
    // Create a sample featured course
    const course = await prisma.course.create({
      data: {
        title: 'Featured German Course A1',
        titleFa: 'دوره ویژه آلمانی A1',
        description: '<p>Learn German from the beginning with our special featured course.</p>',
        descriptionFa: '<p>یادگیری زبان آلمانی از ابتدا با دوره ویژه ما.</p>',
        level: 'A1',
        capacity: 15,
        price: 1000,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
        timeSlot: 'Mon, Wed 18:00-20:00',
        location: 'Online',
        isActive: true,
        featured: true, // Make it featured
        teacherId: teacher.id,
        adminId: admin.id
      }
    });
    
    return NextResponse.json({
      status: 'success',
      message: 'Featured course created successfully',
      course
    });
  } catch (error) {
    console.error('Error seeding featured course:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Error seeding featured course',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 