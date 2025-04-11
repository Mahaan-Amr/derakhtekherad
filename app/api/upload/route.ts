import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Uploading file bypassing authentication...');
    
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    // Validate the file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Make sure it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }
    
    // Read the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
    const fileName = `${timestamp}-${originalName}`;
    
    // Define the upload path (in public directory)
    const uploadDir = join(process.cwd(), 'public', 'images', 'uploads');
    const filePath = join(uploadDir, fileName);
    
    // Ensure the directory exists
    const { mkdir } = require('fs/promises');
    await mkdir(uploadDir, { recursive: true });
    
    // Write the file
    await writeFile(filePath, buffer);
    
    // Return the URL
    const fileUrl = `/images/uploads/${fileName}`;
    
    return NextResponse.json({ 
      url: fileUrl,
      success: true
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 