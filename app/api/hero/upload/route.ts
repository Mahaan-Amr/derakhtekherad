import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log('==== HERO UPLOAD API REQUEST STARTED ====');
  
  try {
    // TEMPORARY: Skip session check for testing (consistent with other APIs)
    console.log('Uploading hero image bypassing authentication...');

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, file.type, `${file.size} bytes`);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Invalid file type. Only jpeg, png, webp, and gif images are allowed.' }, { status: 400 });
    }

    // Validate file size (5MB max for hero slides since they're large)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Generate unique filename to prevent overwrites
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `hero_${timestamp}_${randomString}${path.extname(file.name)}`;

    // Save in the /public/uploads/hero directory for direct access
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', 'hero');
    
    // Ensure the upload directory exists
    try {
      await fs.access(publicUploadDir);
    } catch (error) {
      console.log('Creating upload directory:', publicUploadDir);
      await mkdir(publicUploadDir, { recursive: true });
    }

    // Save the file to the upload directory
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(publicUploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Format URL for frontend use with cache busting
    const fileUrl = `/uploads/hero/${filename}?v=${Date.now()}`;

    console.log(`[Upload] Hero slide image saved successfully: ${fileUrl}`);

    return NextResponse.json({ 
      url: fileUrl,
      fileUrl: fileUrl,
      success: true 
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('Error uploading hero slide image:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'An error occurred while uploading the image' },
      { status: 500 }
    );
  } finally {
    console.log('==== HERO UPLOAD API REQUEST COMPLETED ====');
  }
} 