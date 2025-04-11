import { PrismaClient } from '@prisma/client';

// Create a single instance of the Prisma client with log option to fix enableTracing issue
const prisma = new PrismaClient({
  log: ['query'],
});

/**
 * User related functions
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}

/**
 * Admin related functions
 */
export async function getAdminProfile(userId: string) {
  return prisma.admin.findUnique({
    where: { userId },
    include: {
      user: true
    }
  });
}

/**
 * Teacher related functions
 */
export async function getTeacherProfile(userId: string) {
  return prisma.teacher.findUnique({
    where: { userId },
    include: {
      user: true
    }
  });
}

export async function getAllTeachers() {
  return prisma.teacher.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
}

/**
 * Student related functions
 */
export async function getStudentProfile(userId: string) {
  return prisma.student.findUnique({
    where: { userId },
    include: {
      user: true,
      enrollments: {
        include: {
          course: true
        }
      }
    }
  });
}

/**
 * Course related functions
 */
export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}

export async function getAllCourses({ active = true }: { active?: boolean } = {}) {
  return prisma.course.findMany({
    where: { isActive: active },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      startDate: 'asc'
    }
  });
}

export async function getCoursesByTeacher(teacherId: string) {
  return prisma.course.findMany({
    where: { teacherId },
    orderBy: {
      startDate: 'asc'
    }
  });
}

/**
 * Enrollment related functions
 */
export async function enrollStudentInCourse(studentId: string, courseId: string) {
  return prisma.enrollment.create({
    data: {
      studentId,
      courseId
    }
  });
}

export async function getStudentEnrollments(studentId: string) {
  return prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: true
    }
  });
}

/**
 * Assignment related functions
 */
export async function getAssignmentById(id: string) {
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      course: true,
      teacher: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
}

export async function getCourseAssignments(courseId: string) {
  return prisma.assignment.findMany({
    where: { courseId },
    orderBy: {
      dueDate: 'asc'
    }
  });
}

/**
 * Blog related functions
 */
export async function getAllPosts({ published = true }: { published?: boolean } = {}) {
  return prisma.post.findMany({
    where: { published },
    include: {
      author: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      posts: {
        select: {
          postId: true
        }
      }
    }
  });
}

export default prisma; 