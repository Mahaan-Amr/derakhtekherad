# Derakht-e-Kherad Learning Management System

A modern learning management system built for Derakht-e-Kherad language institute. This platform facilitates online learning with features for students, teachers, and administrators.

## Key Features

- **Multi-language Support**: German, Farsi, and English with RTL support
- **Role-based Authentication**: Secure access for students, teachers, and administrators
- **Course Management**: Create, edit, and manage courses and related materials
- **Assignments & Grading**: Create assignments, enable student submissions, and provide grades and feedback
- **Student Roster**: Detailed student tracking with enrollment and performance metrics
- **Blog System**: Publish and manage blog posts with categories
- **Animated UI**: Interactive animations using Framer Motion for enhanced user experience
- **Responsive Design**: Fully responsive UI for all device sizes
- **Dark Mode**: Built-in dark mode support
- **Admin Analytics**: Real-time dashboard with key performance metrics and visualizations
- **SEO Optimization**: Comprehensive SEO with structured data and metadata for all public pages

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js and JWT
- **Styles**: Tailwind CSS with custom theming
- **Internationalization**: next-intl
- **Animations**: Framer Motion for smooth UI transitions
- **File Handling**: Server-side file processing for assignments and submissions
- **Data Visualization**: Recharts for analytics and reporting
- **SEO**: Schema.org structured data, Open Graph, and Twitter cards

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/derakht-e-kherad.git
   cd derakht-e-kherad
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`
   - Update the variables with your own values

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   # or
   yarn prisma migrate dev
   ```

5. Seed the database with sample data:
   ```bash
   npx prisma db seed
   # or
   yarn prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) (or the port specified in the console) in your browser.

## Deployment

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

### Deployment Options

The recommended deployment method is using Vercel, which offers seamless integration with Next.js applications. See [docs/deployment.md](docs/deployment.md) for comprehensive deployment instructions, including:

- CI/CD pipeline setup with GitHub Actions
- Database deployment and migration strategies
- Environment configuration for production
- Security considerations for production deployment
- Performance optimization techniques
- Scaling strategies for high traffic

### Quick Deployment with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fderakhtekherad)

1. Click the "Deploy with Vercel" button
2. Follow the setup instructions
3. Configure the required environment variables in the Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - A secret for NextAuth.js (can be generated with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Your production URL (e.g., https://your-domain.com)
   - Additional environment variables as needed

## Project Structure

```
derakht-e-kherad/
├── app/                  # Next.js app directory
│   ├── [locale]/         # Locale-specific routes
│   │   ├── admin/        # Admin dashboard
│   │   ├── auth/         # Authentication pages
│   │   ├── blog/         # Blog pages
│   │   ├── courses/      # Course pages
│   │   ├── consultation/ # Consultation page with animations
│   │   ├── student/      # Student dashboard
│   │   ├── teacher/      # Teacher dashboard with assignments and student roster
│   │   └── index.tsx     # Main entry point
│   ├── api/              # API routes
│   │   ├── assignments/  # Assignment management APIs
│   │   ├── blog/         # Blog APIs
│   │   ├── courses/      # Course management APIs
│   │   ├── dashboard/    # Dashboard analytics APIs
│   │   ├── students/     # Student management APIs
│   │   ├── submissions/  # Assignment submission and grading APIs
│   │   ├── teachers/     # Teacher management APIs
│   │   └── auth/         # Authentication APIs
├── components/           # Reusable components
├── contexts/             # React contexts
├── dictionaries/         # Translation files
├── lib/                  # Utility functions and configurations
│   └── seo.ts            # SEO utility functions
├── middleware.ts         # Next.js middleware
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
│   └── uploads/          # Uploaded files (images, assignments, submissions)
└── styles/               # Global styles
```

## Current Status

The project is approximately 95% complete. See [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md) for detailed progress tracking and future plans.

### Recently Completed

- ✅ **CRUD Functionality Fixes**: Fixed issues with blog post and course deletion
- ✅ **API Authentication**: Enhanced auth system with dual support for sessions and JWT tokens
- ✅ **Model Compatibility**: Improved system to handle different database models automatically
- ✅ **Error Handling**: Added comprehensive error handling and logging
- ✅ **SEO Optimization**: Added comprehensive SEO for all public pages including metadata, structured data, and Open Graph tags
- ✅ **Admin Analytics Dashboard**: Real-time data visualization for key metrics
- ✅ **Teacher Dashboard**: Complete management system for assignments, students, and grading

### In Progress

- 🔄 **Student Dashboard**: Implementation of the student view for assignments and submissions
- 🔄 **Visual Breadcrumb Component**: Creating a UI component to match the breadcrumb structured data
- 🔄 **Performance Optimization**: Running Lighthouse audits and optimizing Core Web Vitals

## Key Completed Features

- Core infrastructure and project setup
- Internationalization system with RTL support
- Authentication system with role-based access control
- Blog system with categories and image handling
- Admin dashboard with blog and course management
- Teacher management system with profile images
- Student management system with profile images
- Public frontend pages including landing page, about, courses, contact, and blog
- Course management system with modules
- Enhanced consultation page with multi-step animated form
- Interactive animations with Framer Motion
- **Assignments Management**: Create, edit, and delete assignments with file uploads
- **Student Roster Management**: View and manage students enrolled in courses
- **Grading Interface**: Grade student submissions with feedback and performance tracking
- **Admin Analytics Dashboard**: Real-time data visualization for key metrics
- **Database Seeding**: Comprehensive sample data for testing and development
- **SEO Optimization**: Complete metadata and structured data for all public pages

## Upcoming Features

1. **Visual Breadcrumb Component**: A user-facing breadcrumb navigation that matches the SEO structured data
2. **Student Assignment Submission**: Interface for students to view and submit assignments
3. **Performance Optimization**: Improved Core Web Vitals and page loading speed
4. **Comprehensive Testing**: Unit and integration tests for critical components
5. **Notification System**: Real-time notifications for assignments and grades

## Roadmap

### Short Term (2-4 Weeks)
- Implement visual breadcrumb component
- Complete student dashboard with assignment submission functionality
- Run Lighthouse audits and optimize performance
- Add form validation with Zod
- Begin adding unit tests for critical components

### Medium Term (1-2 Months)
- Implement notification system for grades and new assignments
- Develop student performance dashboard with visualization
- Optimize Core Web Vitals based on audit results
- Add comprehensive testing for critical user journeys
- Begin work on mobile app integration

### Long Term (3+ Months)
- Implement quiz and assessment system
- Create certificate generation
- Add comprehensive reporting and analytics for students
- Develop automated notifications
- Implement content recommendation system

## License

This project is proprietary and confidential. Unauthorized copying, reproduction, or distribution of any part of this project is strictly prohibited.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - ORM for database management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [Recharts](https://recharts.org/) - Charting library for data visualization
- [Vazirmatn](https://rastikerdar.github.io/vazirmatn/) - Persian font
- [jose](https://github.com/panva/jose) - JWT implementation for Edge runtime
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Project Overview](docs/project-overview.md)
- [Development Strategy](docs/development-strategy.md)
- [SEO Implementation](docs/seo-implementation.md)
- [SEO Summary](docs/seo-summary.md)
- [Next Steps](docs/next-steps.md)
- [Breadcrumb Implementation Plan](docs/breadcrumb-implementation-plan.md)

## Blog System

The blog system includes:

- Admin dashboard for creating, editing, and deleting posts and categories
- Public blog pages with listing, filtering, and single post views
- Category filtering with counts of posts in each category
- Multi-language content support (Persian and German)
- Rich text editor with image embedding support
- Related posts functionality
- Responsive design for all devices
- Robust image handling with fallback mechanisms for failed loads
- Image upload API with proper validation and authentication

## Consultation System

The consultation system includes:

- Multi-step form with smooth animations between steps
- Progress tracking for form completion
- Validation for each form step
- Attractive hero section with gradient background
- Benefits section with animated cards and icons
- Success confirmation screen with animations
- Fully responsive design for all screen sizes
- Complete RTL support for Farsi language

## Teacher Dashboard System

The teacher dashboard includes:

- Overview of assigned courses with key statistics
- Assignments management with creation, editing, and deletion capabilities
  - Create assignments with multilingual content (German and Farsi)
  - Upload supporting materials and attachments
  - Set due dates and course assignments
  - View submission statistics
  - Delete assignments with confirmation
- File upload support for assignment materials with secure validation
- View and grade student submissions with feedback functionality
- Student roster with filtering by course and search functionality
- Student detail view with performance metrics
- Grading interface for reviewing submissions and providing feedback
- Performance tracking with submission statistics
- Comprehensive error handling and loading states for better UX

## Admin Dashboard Analytics

The admin dashboard analytics provides:

- Real-time statistical overview of system activity
- User growth trends comparing current and previous periods
- Course enrollment and popularity metrics
- Revenue tracking and comparison with previous periods
- Visual charts for easy data interpretation
- Latest users and courses listings
- System settings management
- Notification preferences configuration
- Data management tools
- Fully responsive design with dark/light mode support
- Multilingual interface (German and Persian)

## Authentication

The application uses a dual authentication system:

1. **Session-based authentication** via NextAuth for the frontend
2. **Token-based authentication** for API requests

For API requests that require authentication (like creating/editing posts or categories), you need to:
- Be logged in as an admin user, or
- Include the authorization token in request headers:
  ```
  Authorization: Bearer [your-jwt-token]
  ```

The JWT tokens are properly validated using the `jose` library with secure verification.

## Environment Variables

Required environment variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Routes

The application provides the following API endpoints:

### Blog Posts

- `GET /api/blog/posts` - Get all posts (admin only)
- `POST /api/blog/posts` - Create a new post (admin only)
- `GET /api/blog/posts/:id` - Get a specific post (admin only)
- `PUT /api/blog/posts/:id` - Update a post (admin only)
- `DELETE /api/blog/posts/:id` - Delete a post (admin only)
- `GET /api/blog/published` - Get all published posts (public)
- `GET /api/blog/published/:slug` - Get a published post by slug (public)

### Teachers

- `GET /api/teachers` - Get all teachers (admin only)
- `POST /api/teachers` - Create a new teacher (admin only)
- `GET /api/teachers/:id` - Get a specific teacher (admin only)
- `PUT /api/teachers/:id` - Update a teacher (admin only)
- `DELETE /api/teachers/:id` - Delete a teacher (admin only)
- `POST /api/teachers/upload` - Upload a teacher profile image (admin only)

### Students

- `GET /api/students` - Get all students (admin only)
- `POST /api/students` - Create a new student (admin only)
- `GET /api/students/:id` - Get a specific student (admin only)
- `PUT /api/students/:id` - Update a student (admin only)
- `DELETE /api/students/:id` - Delete a student (admin only)
- `POST /api/students/upload` - Upload a student profile image (admin only)
- `GET /api/students/teacher` - Get students for teacher's courses (teacher only)

### Courses

- `GET /api/courses` - Get all courses (public/admin)
- `POST /api/courses` - Create a new course (admin only)
- `GET /api/courses/:id` - Get a specific course (public/admin)
- `PUT /api/courses/:id` - Update a course (admin only)
- `DELETE /api/courses/:id` - Delete a course (admin only)
- `GET /api/courses/teacher` - Get courses for a teacher (teacher only)

### Assignments

- `GET /api/assignments` - Get assignments (teacher/student)
- `POST /api/assignments` - Create a new assignment (teacher only)
- `PUT /api/assignments/:id` - Update an assignment (teacher only)
- `DELETE /api/assignments/:id` - Delete an assignment (teacher only)
- `POST /api/assignments/upload` - Upload assignment materials (teacher/student)

### Submissions

- `GET /api/submissions` - Get submissions (teacher/student)
- `POST /api/submissions` - Create a new submission (student only)
- `PUT /api/submissions/:id` - Update a submission or add grade (teacher/student)
- `DELETE /api/submissions/:id` - Delete a submission (teacher/student)
