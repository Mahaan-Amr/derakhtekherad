import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { authOptions } from '@/app/api/auth/options';

const prisma = new PrismaClient();

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Helper function to check auth - returns user id and role
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
    console.log('Attempting JWT verification for token');
    try {
      const payload = await verifyToken(token);
      if (payload && payload.id) {
        console.log(`User authenticated via JWT token: ${payload.email}`);
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
          console.log('User is not a teacher or student via JWT token');
        }
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
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
          console.log('User is not a teacher or student via session');
        }
      }
    } catch (error) {
      console.error('NextAuth session check failed:', error);
    }
  }
  
  return { isAuthenticated, isTeacher, isStudent, userId, teacherId, studentId };
}

// Helper function to get a specific submission
async function fetchSubmissionById(id: string, teacherId: string | null = null, studentId: string | null = null) {
  const whereClause: any = { id };
  
  // If teacherId is provided, ensure the submission is for an assignment that belongs to this teacher
  if (teacherId) {
    whereClause.assignment = {
      teacherId
    };
  }
  
  // If studentId is provided, ensure the submission belongs to this student
  if (studentId) {
    whereClause.studentId = studentId;
  }
  
  const submission = await prisma.submission.findFirst({
    where: whereClause,
    include: {
      assignment: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              titleFa: true,
            }
          }
        }
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!submission) {
    return { error: 'Submission not found', status: 404 };
  }

  return { submission };
}

// GET /api/submissions - Get submissions
export async function GET(request: NextRequest) {
  console.log('==== SUBMISSIONS API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Get submissions attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');
    
    // If ID is provided, return that specific submission
    if (id) {
      const result = await fetchSubmissionById(
        id, 
        auth.isTeacher ? auth.teacherId : null,
        auth.isStudent ? auth.studentId : null
      );
      
      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: result.status }
        );
      }

      return NextResponse.json(result.submission);
    }
    
    // Otherwise, return submissions based on filters
    const whereClause: any = {};
    
    // If teacher, only show submissions for their assignments
    if (auth.isTeacher && auth.teacherId) {
      whereClause.assignment = {
        teacherId: auth.teacherId
      };
      
      // If courseId is provided, further filter by course
      if (courseId) {
        whereClause.assignment.courseId = courseId;
      }
    }
    
    // If student, only show their own submissions
    if (auth.isStudent && auth.studentId) {
      whereClause.studentId = auth.studentId;
      
      // If courseId is provided, filter by course
      if (courseId) {
        whereClause.assignment = {
          courseId
        };
      }
    }
    
    // If assignmentId is provided, filter by assignment
    if (assignmentId) {
      whereClause.assignmentId = assignmentId;
    }
    
    // If studentId is provided and user is a teacher, filter by student
    if (studentId && auth.isTeacher) {
      whereClause.studentId = studentId;
    }
    
    // Fetch submissions
    const submissions = await prisma.submission.findMany({
      where: whereClause,
      orderBy: {
        submittedAt: 'desc'
      },
      include: {
        assignment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                titleFa: true,
              }
            }
          }
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    console.log(`Found ${submissions.length} submissions`);
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  } finally {
    console.log('==== SUBMISSIONS API REQUEST COMPLETED ====');
  }
}

// POST /api/submissions - Create a new submission
export async function POST(request: NextRequest) {
  console.log('==== CREATE SUBMISSION API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Create submission attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow students to create submissions
    if (!auth.isStudent || !auth.studentId) {
      console.log('Create submission attempt - not a student');
      return NextResponse.json(
        { error: 'Not authorized - student access required' },
        { status: 403 }
      );
    }
    
    console.log(`Student authenticated, proceeding with submission creation`);
    
    // Parse request body
    const data = await request.json();
    const { 
      assignmentId, 
      content, 
      attachmentUrl 
    } = data;
    
    // Validate required fields
    if (!assignmentId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify the assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          include: {
            enrollments: {
              where: {
                studentId: auth.studentId,
                status: 'ACTIVE'
              }
            }
          }
        }
      }
    });
    
    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }
    
    // Check if the student is enrolled in the course
    if (assignment.course.enrollments.length === 0) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 403 }
      );
    }
    
    // Check if submission is past due date
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isLate = now > dueDate;
    
    // Check if student already has a submission for this assignment
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId: auth.studentId
      }
    });
    
    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this assignment', existingSubmissionId: existingSubmission.id },
        { status: 400 }
      );
    }
    
    // Create the submission
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: auth.studentId,
        content,
        attachmentUrl,
        submittedAt: now,
        isLate,
        status: 'SUBMITTED',
        grade: null,
        feedback: null
      },
      include: {
        assignment: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                titleFa: true
              }
            }
          }
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    console.log('Submission created successfully:', submission.id);
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  } finally {
    console.log('==== CREATE SUBMISSION API REQUEST COMPLETED ====');
  }
}

// PUT /api/submissions?id=... - Update a submission (teacher grading or student updating)
export async function PUT(request: NextRequest) {
  console.log('==== UPDATE SUBMISSION API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Update submission attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get submission ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    
    // Check if the submission exists
    const existingSubmission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: true
      }
    });
    
    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Different handling based on user role
    if (auth.isTeacher && auth.teacherId) {
      // Teacher is grading the submission
      
      // Verify teacher owns the assignment
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: existingSubmission.assignmentId,
          teacherId: auth.teacherId
        }
      });
      
      if (!assignment) {
        return NextResponse.json(
          { error: 'Assignment not found or does not belong to this teacher' },
          { status: 404 }
        );
      }
      
      const { grade, feedback, status } = data;
      
      // Validate grade if provided
      if (grade !== undefined && (grade < 0 || grade > 100)) {
        return NextResponse.json(
          { error: 'Grade must be between 0 and 100' },
          { status: 400 }
        );
      }
      
      // Update the submission with grade and feedback
      const updatedSubmission = await prisma.submission.update({
        where: { id },
        data: {
          ...(grade !== undefined && { grade }),
          ...(feedback !== undefined && { feedback }),
          ...(status && { status }),
          gradedAt: grade !== undefined ? new Date() : undefined
        },
        include: {
          assignment: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  titleFa: true
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      console.log('Submission graded successfully:', id);
      return NextResponse.json(updatedSubmission);
    } else if (auth.isStudent && auth.studentId) {
      // Student is updating their submission
      
      // Verify student owns the submission
      if (existingSubmission.studentId !== auth.studentId) {
        return NextResponse.json(
          { error: 'You do not have permission to update this submission' },
          { status: 403 }
        );
      }
      
      // Only allow updates to submissions that haven't been graded yet
      if (existingSubmission.grade !== null) {
        return NextResponse.json(
          { error: 'Cannot update a submission that has already been graded' },
          { status: 400 }
        );
      }
      
      const { content, attachmentUrl } = data;
      
      // Check if we're past the due date
      const now = new Date();
      const dueDate = new Date(existingSubmission.assignment.dueDate);
      const isLate = now > dueDate;
      
      // Update the submission
      const updatedSubmission = await prisma.submission.update({
        where: { id },
        data: {
          ...(content && { content }),
          ...(attachmentUrl !== undefined && { attachmentUrl }),
          isLate,
          updatedAt: now
        },
        include: {
          assignment: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  titleFa: true
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      console.log('Submission updated successfully by student:', id);
      return NextResponse.json(updatedSubmission);
    } else {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  } finally {
    console.log('==== UPDATE SUBMISSION API REQUEST COMPLETED ====');
  }
}

// DELETE /api/submissions?id=... - Delete a submission
export async function DELETE(request: NextRequest) {
  console.log('==== DELETE SUBMISSION API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Delete submission attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get submission ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the submission exists
    const existingSubmission = await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: true
      }
    });
    
    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Different handling based on user role
    if (auth.isTeacher && auth.teacherId) {
      // Teacher is deleting the submission
      
      // Verify teacher owns the assignment
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: existingSubmission.assignmentId,
          teacherId: auth.teacherId
        }
      });
      
      if (!assignment) {
        return NextResponse.json(
          { error: 'Assignment not found or does not belong to this teacher' },
          { status: 404 }
        );
      }
    } else if (auth.isStudent && auth.studentId) {
      // Student is deleting their submission
      
      // Verify student owns the submission
      if (existingSubmission.studentId !== auth.studentId) {
        return NextResponse.json(
          { error: 'You do not have permission to delete this submission' },
          { status: 403 }
        );
      }
      
      // Only allow deletion of submissions that haven't been graded yet
      if (existingSubmission.grade !== null) {
        return NextResponse.json(
          { error: 'Cannot delete a submission that has already been graded' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Delete the submission
    await prisma.submission.delete({
      where: { id }
    });
    
    console.log('Submission deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  } finally {
    console.log('==== DELETE SUBMISSION API REQUEST COMPLETED ====');
  }
} 