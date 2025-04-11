# API Endpoints

## Authentication

- `POST /api/auth/login` - Authenticate a user and get a JWT token
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/reset-password` - Request a password reset
- `POST /api/auth/reset-password-confirm` - Confirm a password reset

## Blog

### Posts

- `GET /api/blog/posts` - Get all posts (admin only)
- `POST /api/blog/posts` - Create a new post (admin only)
- `GET /api/blog/posts/:id` - Get a specific post (admin only)
- `PUT /api/blog/posts/:id` - Update a post (admin only)
- `DELETE /api/blog/posts/:id` - Delete a post (admin only)
- `GET /api/blog/published` - Get all published posts (public)
- `GET /api/blog/published/:slug` - Get a published post by slug (public)

### Categories

- `GET /api/blog/categories` - Get all categories (admin only)
- `POST /api/blog/categories` - Create a new category (admin only)
- `GET /api/blog/categories/:id` - Get a specific category (admin only)
- `PUT /api/blog/categories/:id` - Update a category (admin only)
- `DELETE /api/blog/categories/:id` - Delete a category (admin only)
- `GET /api/blog/categories/published` - Get categories with published posts (public)

### Upload

- `POST /api/blog/upload` - Upload images with validation and authentication (admin only)

## Courses

### Courses

- `GET /api/courses` - Get all courses (admin only)
  - Response includes course details including price
- `POST /api/courses` - Create a new course (admin only)
  - Request body must include price field (numerical value, defaults to 0)
- `GET /api/courses/:id` - Get a specific course (admin only)
  - Response includes price as part of course details
- `PUT /api/courses/:id` - Update a course (admin only)
  - Request body includes price field for updating course price
- `DELETE /api/courses/:id` - Delete a course (admin only)
- `GET /api/courses/published` - Get all published/active courses (public)
  - Response includes formatted price for public display
- `GET /api/courses/published/:id` - Get a published/active course by id (public)
  - Response includes formatted price for public display
- `GET /api/courses/teacher` - Get all courses assigned to the authenticated teacher (teacher only)
  - Returns course details for courses taught by the currently authenticated teacher

### Modules

- `GET /api/courses/modules` - Get all modules for a course (admin/teacher only)
- `POST /api/courses/modules` - Create a new module (admin/teacher only)
- `GET /api/courses/modules/:id` - Get a specific module (admin/teacher only)
- `PUT /api/courses/modules/:id` - Update a module (admin/teacher only)
- `DELETE /api/courses/modules/:id` - Delete a module (admin/teacher only)

### Lessons

- `GET /api/courses/lessons` - Get all lessons for a module (admin/teacher only)
- `POST /api/courses/lessons` - Create a new lesson (admin/teacher only)
- `GET /api/courses/lessons/:id` - Get a specific lesson (admin/teacher only)
- `PUT /api/courses/lessons/:id` - Update a lesson (admin/teacher only)
- `DELETE /api/courses/lessons/:id` - Delete a lesson (admin/teacher only)

## Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a specific user (admin only)
- `PUT /api/users/:id` - Update a user (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)
- `GET /api/users/me` - Get the current user's profile
- `PUT /api/users/me` - Update the current user's profile

## Teachers

- `GET /api/teachers` - Get all teachers (admin only)
  - Returns all teachers with user information and assigned courses
- `POST /api/teachers` - Create a new teacher (admin only)
  - Request body: `{ userId, bio, bioFa, specialties, photo }`
  - Validates user exists and converts role to TEACHER if needed
- `GET /api/teachers/:id` - Get a specific teacher (admin only)
  - Returns detailed teacher information with user data and assigned courses
- `PUT /api/teachers/:id` - Update a teacher (admin only)
  - Request body: `{ bio, bioFa, specialties, photo }`
  - Updates teacher profile information
- `DELETE /api/teachers/:id` - Delete a teacher (admin only)
  - Checks for assigned courses and prevents deletion if courses exist
  - Converts user role back to STUDENT if user was only a TEACHER (not ADMIN)
- `POST /api/teachers/upload` - Upload teacher profile image (admin only)
  - Accepts multipart/form-data with image file
  - Validates file type and size
  - Returns URL path to uploaded image
- `GET /api/teachers/public` - Get all teachers for public display

## Students

- `GET /api/students` - Get all students (admin only)
  - Returns all students with user information and enrollment status
- `POST /api/students` - Create a new student (admin only)
  - Request body: `{ userId, phone, photo }`
  - Validates user exists and converts role to STUDENT if needed
- `GET /api/students/:id` - Get a specific student (admin/teacher only)
  - Returns detailed student information with user data and enrollments
- `PUT /api/students/:id` - Update a student (admin only)
  - Request body: `{ phone, photo }`
  - Updates student profile information
- `DELETE /api/students/:id` - Delete a student (admin only)
  - Checks for active enrollments and prevents deletion if enrollments exist
  - Converts user role back to basic USER if user was only a STUDENT (not TEACHER/ADMIN)
- `POST /api/students/upload` - Upload student profile image (admin only)
  - Accepts multipart/form-data with image file
  - Validates file type (JPEG, PNG, WEBP, GIF) and size (max 2MB)
  - Returns URL path to uploaded image
- `GET /api/students/me` - Get the current student's profile
- `GET /api/students/teacher` - Get all students enrolled in courses taught by the authenticated teacher (teacher only)
  - Returns students with enrollment information, course details, and submission statistics
  - Supports filtering by courseId and search by student name/email

## Enrollments

- `GET /api/enrollments` - Get all enrollments (admin only)
- `POST /api/enrollments` - Create a new enrollment (admin/student only)
- `GET /api/enrollments/:id` - Get a specific enrollment (admin/teacher/student only)
- `PUT /api/enrollments/:id` - Update an enrollment (admin only)
- `DELETE /api/enrollments/:id` - Delete an enrollment (admin only)
- `GET /api/enrollments/course/:courseId` - Get all enrollments for a course (admin/teacher only)
- `GET /api/enrollments/student/:studentId` - Get all enrollments for a student (admin/student only)

## Assignments

- `GET /api/assignments` - Get assignments (teacher/student)
  - For teachers: Returns assignments created by the teacher
  - For students: Returns assignments for enrolled courses
  - Supports filtering by courseId
- `POST /api/assignments` - Create a new assignment (teacher only)
  - Request body: `{ title, description, titleFa, descriptionFa, courseId, dueDate, attachmentUrl }`
  - Creates a new assignment for a course taught by the teacher
- `PUT /api/assignments/:id` - Update an assignment (teacher only)
  - Updates assignment details for a specific assignment created by the teacher
- `DELETE /api/assignments/:id` - Delete an assignment (teacher only)
  - Deletes an assignment created by the teacher if no submissions exist
- `POST /api/assignments/upload` - Upload assignment materials (teacher only)
  - Accepts multipart/form-data with file attachment
  - Validates file type and size
  - Returns URL path to uploaded file

## Submissions

- `GET /api/submissions` - Get submissions (teacher/student)
  - For teachers: Returns submissions for assignments created by the teacher
  - For students: Returns the student's own submissions
  - Supports filtering by assignmentId, studentId, and graded status
- `POST /api/submissions` - Create a new submission (student only)
  - Request body: `{ assignmentId, content, attachmentUrl }`
  - Creates a new submission for an assignment
- `PUT /api/submissions/:id` - Update a submission or add grade (teacher/student)
  - For teachers: Updates grade and feedback
  - For students: Updates submission content before deadline
- `DELETE /api/submissions/:id` - Delete a submission (teacher/student)
  - Deletes a submission if permitted by role and submission status
- `POST /api/submissions/upload` - Upload submission materials (student/teacher)
  - Accepts multipart/form-data with file attachment
  - Validates file type and size
  - Returns URL path to uploaded file 