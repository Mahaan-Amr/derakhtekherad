import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { authOptions } from '@/app/api/auth/options';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Function to check authentication - dual system with JWT token and NextAuth session
async function checkAuth(request: NextRequest) {
  console.log('Checking authentication...');
  
  // Initialize return values
  let isAuthenticated = false;
  let isTeacher = false;
  let isStudent = false;
  let userId = null;
  let teacherId = null;
  let studentId = null;
  
  // Check for Bearer token in Authorization header
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('Auth header present: true');
    console.log(`Auth header: Bearer ${token.substring(0, 10)}...`);
    
    if (token) {
      console.log(`Attempting JWT verification for token length: ${token.length}`);
      try {
        const payload = await verifyToken(token);
        
        if (payload && payload.id) {
          console.log(`User authenticated via JWT token: ${payload.id} ${payload.email}`);
          userId = payload.id;
          isAuthenticated = true;
          isTeacher = payload.role === 'TEACHER';
          isStudent = payload.role === 'STUDENT';
          
          if (isTeacher) {
            // Fetch the teacher ID for the authenticated user
            const teacher = await prisma.teacher.findFirst({
              where: { userId }
            });
            
            if (teacher) {
              teacherId = teacher.id;
              console.log(`Teacher ID found: ${teacherId}`);
            } else {
              console.log('User is marked as teacher but no teacher profile found');
              isTeacher = false;
            }
          } else if (isStudent) {
            // Fetch the student ID for the authenticated user
            const student = await prisma.student.findFirst({
              where: { userId }
            });
            
            if (student) {
              studentId = student.id;
              console.log(`Student ID found: ${studentId}`);
            } else {
              console.log('User is marked as student but no student profile found');
              isStudent = false;
            }
          } else {
            console.log(`User is ${payload.role} via JWT token`);
          }
        }
      } catch (error) {
        console.error('JWT verification failed:', error);
      }
    }
  }
  
  // If not authenticated via token, try session
  if (!isAuthenticated) {
    try {
      console.log('[next-auth][warn][DEBUG_ENABLED]');
      console.log('https://next-auth.js.org/warnings#debug_enabled');
      
      const session = await getServerSession(authOptions);
      console.log('Session data present:', !!session);
      
      if (session && session.user) {
        console.log(`User authenticated via NextAuth session: ${session.user.email}`);
        userId = session.user.id;
        isAuthenticated = true;
        isTeacher = session.user.role === 'TEACHER';
        isStudent = session.user.role === 'STUDENT';
        
        if (isTeacher) {
          // Fetch the teacher ID for the authenticated user
          const teacher = await prisma.teacher.findFirst({
            where: { userId }
          });
          
          if (teacher) {
            teacherId = teacher.id;
            console.log(`Teacher ID found: ${teacherId}`);
          } else {
            console.log('User is marked as teacher but no teacher profile found');
            isTeacher = false;
          }
        } else if (isStudent) {
          // Fetch the student ID for the authenticated user
          const student = await prisma.student.findFirst({
            where: { userId }
          });
          
          if (student) {
            studentId = student.id;
            console.log(`Student ID found: ${studentId}`);
          } else {
            console.log('User is marked as student but no student profile found');
            isStudent = false;
          }
        } else {
          console.log(`User is ${session.user.role} via session`);
        }
      }
    } catch (error) {
      console.error('NextAuth session check failed:', error);
    }
  }
  
  return { 
    isAuthenticated, 
    isTeacher, 
    isStudent, 
    userId, 
    teacherId, 
    studentId 
  };
}

// POST /api/assignments/upload - Upload assignment materials
export async function POST(request: NextRequest) {
  console.log('==== ASSIGNMENT MATERIALS UPLOAD API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Assignment upload attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Both teachers and students can upload files
    if (!auth.isTeacher && !auth.isStudent) {
      console.log('Assignment upload attempt - not authorized');
      return NextResponse.json(
        { error: 'Not authorized - must be a teacher or student' },
        { status: 403 }
      );
    }
    
    console.log(`User authenticated as ${auth.isTeacher ? 'teacher' : 'student'}, proceeding with file upload`);
    
    // Process the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Create a byte array from the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check file type (only allow certain file types)
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/webp', 
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }
    
    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'assignments');
    console.log(`Creating upload directory: ${uploadDir}`);
    
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      return NextResponse.json(
        { error: 'Failed to create upload directory' },
        { status: 500 }
      );
    }
    
    // Generate a unique filename to prevent overwrites
    const fileExtension = path.extname(file.name);
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const role = auth.isTeacher ? 'teacher' : 'student';
    const fileName = `assignment_${role}_${timestamp}_${randomId}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Write the file to the server
    try {
      await fs.promises.writeFile(filePath, buffer);
      console.log(`[Upload] Assignment file saved successfully: /uploads/assignments/${fileName}`);
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }
    
    // Return the file URL for use in the frontend
    const fileUrl = `/uploads/assignments/${fileName}`;
    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading assignment file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  } finally {
    console.log('==== ASSIGNMENT MATERIALS UPLOAD API REQUEST COMPLETED ====');
  }
} 