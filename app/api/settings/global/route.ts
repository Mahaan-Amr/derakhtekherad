import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET global settings
export async function GET(request: NextRequest) {
  try {
    // Temporarily bypass Prisma client issue by using raw query
    const settings = await prisma.$queryRaw`
      SELECT key, value, description, "updatedBy", "createdAt", "updatedAt"
      FROM global_settings
    ` as any[];
    
    // Convert to key-value object
    const settingsObject = (settings as any[]).reduce((acc: Record<string, string>, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global settings' },
      { status: 500 }
    );
  }
}

// POST/PUT global settings (admin only)
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip session check for development
    console.log('Updating global setting bypassing authentication...');
    
    const data = await request.json();
    const { key, value, description } = data;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: key and value' },
        { status: 400 }
      );
    }

    // Use raw query to upsert the setting
    const result = await prisma.$executeRaw`
      INSERT INTO global_settings (id, key, value, description, "updatedBy", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${key}, ${value}, ${description || null}, ${'admin'}, NOW(), NOW())
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        description = EXCLUDED.description,
        "updatedBy" = EXCLUDED."updatedBy",
        "updatedAt" = NOW()
    `;

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error('Error updating global setting:', error);
    return NextResponse.json(
      { error: 'Failed to update global setting' },
      { status: 500 }
    );
  }
}

// DELETE global setting (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // TEMPORARY: Skip session check for development
    console.log('Deleting global setting bypassing authentication...');

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      DELETE FROM global_settings WHERE key = ${key}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting global setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete global setting' },
      { status: 500 }
    );
  }
} 