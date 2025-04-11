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

    return NextResponse.json(charters);
  } catch (error) {
    console.error('Error fetching charters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charters' },
      { status: 500 }
    );
  }
}