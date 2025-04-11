# Quick Start Guide for Derakhte Kherad

This guide provides step-by-step instructions to get started with testing the Derakhte Kherad language school platform.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/derakhtekherad.git
   cd derakhtekherad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/derakhtekherad"
   JWT_SECRET="derakhtekherad-secure-jwt-token-for-authentication"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed test accounts**
   The database now includes pre-configured test accounts for each user role. You can seed them using:
   ```bash
   npx prisma db seed
   ```
   This command will create three test accounts with different roles in your database, using the pre-hashed passwords.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Test Accounts

The following test accounts have been created by the seed script and are ready to use:

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@derakhtekherad.com | admin123    |
| Teacher | teacher@derakhtekherad.com | teacher123 |
| Student | student@derakhtekherad.com | student123 |

## Testing the Authentication System

1. **Login**
   - Navigate to the home page
   - Click the "Login" button in the navigation bar
   - Enter the email and password for one of the test accounts
   - Click "Login" to authenticate

2. **Password Reset**
   - On the login page, click "Forgot Password?"
   - Enter the email of one of the test accounts
   - You will receive a success message (Note: actual email sending is not implemented in development)
   - For testing purposes, check the console logs for the reset token

3. **Testing Role-Based Access**
   - **Admin**: Can access all areas including the admin dashboard, user management, and course management
   - **Teacher**: Can access the teacher dashboard, course materials, and student assignments
   - **Student**: Can access only student-specific areas such as enrolled courses and profile settings

4. **Multilingual Support**
   - Test the platform in different languages by using the language switcher in the navigation bar
   - Available languages include English (default), Persian (RTL), and German

## Common Issues and Solutions

- **Database Connection Errors**: Ensure PostgreSQL is running and the DATABASE_URL in your .env file is correct
- **JWT Token Issues**: Check that your JWT_SECRET is properly set in the .env file
- **"Page Not Found" Errors**: Make sure you're accessing the correct routes with locale prefixes (e.g., /fa/home)
- **Image Loading Issues**: If images fail to load, they will automatically fall back to placeholder images

## Next Steps

After successful login, you can explore:

1. The responsive design across different device sizes
2. The multilingual support with RTL layout for Persian
3. The role-specific permissions and access controls

For more detailed information about the project, refer to:

- `docs/authentication.md` - Details about the authentication system
- `docs/project-status.md` - Current development status and roadmap
- `docs/developer-guide.md` - Development guidelines and best practices

## Reporting Issues

If you encounter any issues while testing, please document them with:
- The exact steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or error messages (if applicable)
- Browser and operating system information

Submit issues through the project's issue tracking system or contact the development team directly. 