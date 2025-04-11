import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database connection
    const courses = await prisma.course.findMany({
      take: 5
    });
    
    // Get the column names to see if 'featured' exists
    const columnInfo = {
      courseSample: courses.length > 0 ? courses[0] : null,
      courseKeys: courses.length > 0 ? Object.keys(courses[0]) : [],
      courseCount: courses.length
    };
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection is working',
      columnInfo
    });
  } catch (error) {
    console.error('Debug route error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Error connecting to database',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 