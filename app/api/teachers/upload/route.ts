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
  console.log('==== TEACHER IMAGE UPLOAD API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Verify authentication with both NextAuth and JWT token
    const session = await getServerSession(authOptions);
    console.log('Session data present:', !!session);
    if (session) {
      console.log('Session user:', session.user?.email, 'Role:', session.user?.role);
    }
    
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    if (authHeader) {
      console.log('Auth header:', authHeader.substring(0, 15) + '...');
    }
    
    let isAuthenticated = false;
    let isAdmin = false;
    
    // Try JWT token first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        console.log('Attempting JWT verification for token length:', token.length);
        const payload = await verifyToken(token);
        if (payload) {
          isAuthenticated = true;
          console.log('User authenticated via JWT token:', payload.id, payload.email);
          if (payload.role === 'ADMIN') {
            isAdmin = true;
            console.log('User is admin via JWT token');
          }
        }
      } catch (error: any) {
        console.log('JWT token verification error:', error.message);
        // Don't throw error here, we'll check session auth next
      }
    }
    
    // Then check session if JWT failed
    if (!isAuthenticated && session?.user) {
      isAuthenticated = true;
      console.log('User authenticated via session');
      if (session.user.role === 'ADMIN') {
        isAdmin = true;
        console.log('User is admin via session');
      }
    }

    // If still not authenticated or not admin, return appropriate error
    if (!isAuthenticated) {
      console.log('Upload attempt - no valid session or token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!isAdmin) {
      console.log('Upload attempt - user is not an admin');
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    console.log('Admin user authenticated, proceeding with upload');

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

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File size exceeds 2MB limit' }, { status: 400 });
    }

    // Generate unique filename to prevent overwrites
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `teacher_${timestamp}_${randomString}${path.extname(file.name)}`;

    // Save in the /public/uploads/teachers directory for direct access
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', 'teachers');
    
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

    // Format URL for frontend use
    const fileUrl = `/uploads/teachers/${filename}`;

    console.log(`[Upload] Teacher image saved successfully: ${fileUrl}`);

    return NextResponse.json({ 
      url: fileUrl,
      fileUrl: fileUrl,
      success: true 
    });
  } catch (error: any) {
    console.error('Error uploading teacher image:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'An error occurred while uploading the image' },
      { status: 500 }
    );
  } finally {
    console.log('==== TEACHER IMAGE UPLOAD API REQUEST COMPLETED ====');
  }
} 