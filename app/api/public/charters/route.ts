import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const charters = await prisma.charter.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        orderIndex: 'asc',
      },
      select: {
        id: true,
        title: true,
        titleFa: true,
        description: true,
        descriptionFa: true,
        iconName: true,
        orderIndex: true,
      },
    });

    // Create response with cache control headers to prevent browser caching
    const response = NextResponse.json(charters);
    
    // Set cache control headers to ensure fresh data is always fetched
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching charters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charters' },
      { status: 500 }
    );
  }
}