# Database Structure

Derakhte Kherad uses PostgreSQL with Prisma ORM for database management. This document outlines the database schema and models.

## Models Overview

### User
The base user model that stores authentication information.

```prisma
model User {
  id             String   @id @default(uuid())
  email          String   @unique
  name           String
  password       String
  role           Role     @default(STUDENT)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  adminProfile   Admin?
  teacherProfile Teacher?
  studentProfile Student?
}
```

### Admin
Administrators who manage the platform.

```prisma
model Admin {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  courses   Course[]
  posts     Post[]
}
```

### Teacher
Teachers who conduct courses.

```prisma
model Teacher {
  id          String       @id @default(uuid())
  userId      String       @unique
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio         String?
  bioFa       String?      // Farsi bio
  specialties String?
  photo       String?      // URL to photo
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  courses     Course[]
  assignments Assignment[]
}
```

### Student
Students who enroll in courses.

```prisma
model Student {
  id            String           @id @default(uuid())
  userId        String           @unique
  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  phone         String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  
  // Relations
  enrollments   Enrollment[]
  submissions   Submission[]
  quizResponses QuizResponse[]
}
```

### Course
Courses offered by the institute.

```prisma
model Course {
  id           String        @id @default(uuid())
  title        String
  titleFa      String        // Farsi title
  description  String?
  descriptionFa String?      // Farsi description
  level        String
  capacity     Int
  startDate    DateTime
  endDate      DateTime
  timeSlot     String        // Time of the day
  location     String
  teacherId    String
  adminId      String
  isActive     Boolean       @default(true)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  // Relations
  teacher      Teacher       @relation(fields: [teacherId], references: [id])
  admin        Admin         @relation(fields: [adminId], references: [id])
  enrollments  Enrollment[]
  assignments  Assignment[]
  quizzes      Quiz[]
}
```

### Enrollment
Student enrollments in courses.

```prisma
model Enrollment {
  id        String   @id @default(uuid())
  studentId String
  courseId  String
  enrollDate DateTime @default(now())
  status    EnrollmentStatus @default(ACTIVE)
  
  // Relations
  student   Student  @relation(fields: [studentId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])

  @@unique([studentId, courseId])
}
```

### Assignment
Course assignments created by teachers.

```prisma
model Assignment {
  id          String       @id @default(uuid())
  title       String
  titleFa     String       // Farsi title
  description String?
  descriptionFa String?    // Farsi description
  dueDate     DateTime
  courseId    String
  teacherId   String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  course      Course       @relation(fields: [courseId], references: [id])
  teacher     Teacher      @relation(fields: [teacherId], references: [id])
  submissions Submission[]
}
```

### Submission
Student submissions for assignments.

```prisma
model Submission {
  id           String     @id @default(uuid())
  content      String
  submittedAt  DateTime   @default(now())
  grade        Float?
  feedback     String?
  studentId    String
  assignmentId String
  
  // Relations
  student      Student    @relation(fields: [studentId], references: [id])
  assignment   Assignment @relation(fields: [assignmentId], references: [id])
}
```

### Quiz
Quizzes created for courses.

```prisma
model Quiz {
  id          String        @id @default(uuid())
  title       String
  titleFa     String        // Farsi title
  description String?
  descriptionFa String?     // Farsi description
  dueDate     DateTime
  courseId    String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relations
  course      Course        @relation(fields: [courseId], references: [id])
  questions   Question[]
  responses   QuizResponse[]
}
```

### Question
Quiz questions with answers.

```prisma
model Question {
  id       String   @id @default(uuid())
  text     String
  textFa   String   // Farsi text
  options  Json?    // Array of choices for multiple choice
  answer   String   // Correct answer
  points   Int      @default(1)
  quizId   String
  
  // Relations
  quiz     Quiz     @relation(fields: [quizId], references: [id])
}
```

### QuizResponse
Student responses to quizzes.

```prisma
model QuizResponse {
  id         String   @id @default(uuid())
  answers    Json     // Student's answers
  score      Float?
  submittedAt DateTime @default(now())
  studentId  String
  quizId     String
  
  // Relations
  student    Student  @relation(fields: [studentId], references: [id])
  quiz       Quiz     @relation(fields: [quizId], references: [id])
}
```

### Post
Blog posts for the website.

```prisma
model Post {
  id          String   @id @default(uuid())
  title       String
  titleFa     String   // Farsi title
  content     String
  contentFa   String   // Farsi content
  slug        String   @unique
  thumbnail   String?  // URL to image
  published   Boolean  @default(false)
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  author      Admin    @relation(fields: [authorId], references: [id])
  categories  CategoryPost[]
}
```

### Category
Blog post categories.

```prisma
model Category {
  id          String   @id @default(uuid())
  name        String
  nameFa      String   // Farsi name
  slug        String   @unique
  description String?
  descriptionFa String? // Farsi description
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  posts       CategoryPost[]
}
```

### CategoryPost
Junction table for categories and posts.

```prisma
model CategoryPost {
  categoryId String
  postId     String
  
  // Relations
  category   Category @relation(fields: [categoryId], references: [id])
  post       Post     @relation(fields: [postId], references: [id])

  @@id([categoryId, postId])
}
```

## Enums

### Role
User roles in the system.

```prisma
enum Role {
  ADMIN
  TEACHER
  STUDENT
}
```

### EnrollmentStatus
Status of a student's enrollment.

```prisma
enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
}
```

## API Integration

The database models are accessible through the API endpoints defined in the [API Endpoints Documentation](api-endpoints.md). The API provides CRUD operations for most models, with appropriate authentication and authorization checks.

## Data Relationships

- Users can have one of three profiles: Admin, Teacher, or Student
- Courses are created by Admins and taught by Teachers
- Students enroll in Courses through Enrollments
- Teachers create Assignments and Quizzes for their Courses
- Students submit Submissions for Assignments and QuizResponses for Quizzes
- Admins create Posts which can belong to multiple Categories

## Database Management

Prisma is used for schema management and database migrations. The following commands are useful for database operations:

```bash
# Generate Prisma client
npx prisma generate

# Create a migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset the database (dev only)
npx prisma migrate reset

# View the database with Prisma Studio
npx prisma studio
``` 