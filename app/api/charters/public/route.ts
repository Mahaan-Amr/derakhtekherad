import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/charters/public - Get all active charters (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Find all active charters
    const charters = await prisma.charter.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        title: true,
        titleFa: true,
        description: true,
        descriptionFa: true,
        iconName: true,
        orderIndex: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(charters);
  } catch (error) {
    console.error('Error fetching public charters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charters' },
      { status: 500 }
    );
  }
} 