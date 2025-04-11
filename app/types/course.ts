// Define the Teacher interface
export interface Teacher {
  id: string;
  user: {
    name: string;
  };
}

// Define the Course interface
export interface Course {
  id: string;
  title: string;
  titleFa: string;
  description: string | null;
  descriptionFa: string | null;
  level: string;
  capacity: number;
  price: number;
  startDate: string;
  endDate: string;
  timeSlot: string;
  location: string;
  thumbnail: string | null;
  isActive: boolean;
  featured: boolean;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: string;
    user: {
      name: string;
    };
  };
  _count?: {
    enrollments: number;
    modules: number;
    assignments: number;
    quizzes: number;
  };
}

// Define the Module interface
export interface CourseModule {
  id: string;
  title: string;
  titleFa: string;
  description: string | null;
  descriptionFa: string | null;
  orderIndex: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    lessons: number;
  };
}

// Define the Lesson interface
export interface Lesson {
  id: string;
  title: string;
  titleFa: string;
  content: string;
  contentFa: string;
  duration: number | null;
  orderIndex: number;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
  materials?: Material[];
  _count?: {
    materials: number;
  };
}

// Define the Material interface
export interface Material {
  id: string;
  title: string;
  titleFa: string;
  description: string | null;
  descriptionFa: string | null;
  type: 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'LINK' | 'OTHER';
  url: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
} 