# Database Seed Commands for Testing

This document provides information about the database seeding functionality in the Derakhte Kherad application. The application includes a comprehensive seeding system that creates realistic sample data for testing and development.

## Prerequisites

- PostgreSQL database set up and running
- Database connection details configured in your `.env` file
- Next.js application installed and configured

## Running the Seed Command

To populate your database with sample data, run the following command:

```bash
npx prisma db seed
```

## What Data is Created

The seeding process creates the following sample data:

### Users
- **Admin**: `admin@derakhtekherad.com` (password: admin123)
- **Teachers**: 
  - `mueller@derakhtekherad.com` (password: teacher123)
  - `weber@derakhtekherad.com` (password: teacher123)
  - `bauer@derakhtekherad.com` (password: teacher123)
- **Students**:
  - `anna@example.com` (password: student123)
  - `mehdi@example.com` (password: student123)
  - `laura@example.com` (password: student123)
  - `ali@example.com` (password: student123)

### Courses
- **Deutschkurs A1**: Beginner German course
- **Deutschkurs B1**: Intermediate German course
- **Deutsche Literatur**: German literature course
- **Deutsche Konversation**: German conversation practice
- **TestDaF Vorbereitung**: TestDaF preparation course

### Course Modules
Each course contains multiple modules with lessons and materials, including:
- Text documents
- Video links
- PDF materials
- Practice exercises

### Assignments
Various assignments are created for each course with:
- Due dates
- Instructions in German and Persian
- Supporting materials

### Blog Posts
Multiple blog posts with:
- Different categories
- Publication dates
- Content in German and Persian

### Statistics
Sample statistics for dashboard analytics including:
- User growth metrics
- Course popularity data
- Assignment completion rates
- Revenue statistics

## Enhanced Seed Script

The application uses an enhanced Prisma seed script located at `prisma/seed.ts`. This script:

1. Creates users with different roles
2. Generates profile information for each user
3. Creates blog posts with varied categories
4. Generates courses with modules and lessons
5. Creates assignments for courses
6. Records enrollments for students
7. Generates submission data for assignments
8. Creates statistics for dashboard analytics

## Customizing the Seed Data

You can customize the seed data by modifying the `prisma/seed.ts` file. The script uses various helper functions to generate realistic data:

- `getRandomDate()`: Generates random dates within a specified range
- `getRandomPrice()`: Creates realistic price points for courses
- `createUsers()`: Handles user creation with proper password hashing
- `createCourses()`: Generates course data with appropriate relationships

## Sample Functions from Seed Script

```typescript
// Example of user creation function
async function createUsers() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@derakhtekherad.com' },
    update: {},
    create: {
      email: 'admin@derakhtekherad.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const admin = await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });

  // More user creation...
}

// Example of course creation
async function createCourses() {
  const admin = await prisma.admin.findFirst();
  const teacher = await prisma.teacher.findFirst();
  
  if (!admin || !teacher) {
    throw new Error('Admin or teacher not found');
  }
  
  const course = await prisma.course.create({
    data: {
      title: 'Deutschkurs A1',
      titleFa: 'دوره آلمانی A1',
      description: 'Beginner German course covering basics of the language.',
      descriptionFa: 'دوره مقدماتی زبان آلمانی شامل مبانی زبان.',
      price: 299.99,
      adminId: admin.id,
      teacherId: teacher.id,
      // Additional course data...
    },
  });

  // Module creation for course...
}
```

## Clearing Test Data

To remove all test data from your database and start fresh, you can use the Prisma migration reset command:

```bash
npx prisma migrate reset
```

This will delete all data and apply migrations from scratch. You can then run the seed command again if needed.

## Using Test Accounts

After running the seed command, you can log in with any of the created accounts to test different roles:

1. Use `admin@derakhtekherad.com` (password: admin123) to access the admin dashboard
2. Use any teacher account (e.g., `mueller@derakhtekherad.com`, password: teacher123) to access the teacher dashboard
3. Use any student account (e.g., `anna@example.com`, password: student123) to access the student features

## Benefits of Using Seeded Data

Using the seeded data provides several advantages during development:

1. Realistic testing environment with varied data
2. Ability to test different roles and permissions
3. Populated analytics dashboard with meaningful statistics
4. Relationships between different data entities (users, courses, assignments)
5. Consistent test data across development environments 