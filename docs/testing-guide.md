# Derakhte Kherad Testing Guide

This document provides instructions for testing the Derakhte Kherad application, focusing on the authentication system and other key features.

## Prerequisites

Before beginning testing, make sure you have:

1. Node.js (v18 or higher) installed
2. PostgreSQL database set up and running
3. Project cloned and dependencies installed
4. Environment variables configured in `.env` file

## Starting the Development Server

1. Navigate to the project directory
2. Start the development server with:
   ```bash
   npm run dev
   ```
3. Open your browser to [http://localhost:3000](http://localhost:3000)

## Test Accounts

You can use the following test accounts for different roles:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@derakhtekherad.com | admin123 |
| Teacher | teacher@derakhtekherad.com | teacher123 |
| Student | student@derakhtekherad.com | student123 |

If these accounts don't exist in your database, you can create them through the registration form.

## Authentication Testing

### 1. Registration

1. Click on the "Login" button in the navigation bar
2. In the authentication modal, click "Register" to switch to the registration form
3. Fill out the form with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Register"
5. If successful, you should be logged in and redirected to the home page

**Expected Result**: Registration succeeds and you're automatically logged in.

### 2. Login

1. Click on the "Login" button in the navigation bar
2. Enter the email and password for one of the test accounts
3. Click "Login"

**Expected Result**: Login succeeds and you're redirected to the home page.

### 3. Password Reset

#### Request Reset

1. Click on the "Login" button in the navigation bar
2. Click on "Forgot Password?" link
3. Enter your email address
4. Click "Send Link"

**Expected Result**: Success message informing you that a password reset link has been sent.

#### Use Reset Link

In a real production environment, you would receive an email with a reset link. For testing in development:

1. Check the console output in your terminal where the server is running
2. Look for the debug information containing the reset token
3. Copy the reset link (e.g., `http://localhost:3000/reset-password?token=YOUR_TOKEN`)
4. Open the link in your browser
5. Enter a new password and confirm it
6. Click "Reset Password"

**Expected Result**: Success message indicating your password has been reset, followed by redirection to the login page.

### 4. Role-Based Access

After logging in with different roles, test access restrictions:

#### Admin
1. Log in with the admin account
2. Verify you can access `/admin/dashboard`
3. Check that you can manage courses, teachers, and students

#### Teacher
1. Log in with the teacher account
2. Verify you can access `/teacher/dashboard`
3. Check that you can manage your courses and assignments

#### Student
1. Log in with the student account
2. Verify you can access `/student/dashboard`
3. Check that you can view enrolled courses and submit assignments

### 5. Logout

1. After logging in, click on your profile name in the navigation bar
2. Click "Logout" in the dropdown menu

**Expected Result**: You are logged out and redirected to the home page.

## Multilingual Support Testing

### Language Switching

1. Visit the home page
2. Click on the language switcher in the navigation bar
3. Select a different language (German or Persian)

**Expected Result**: The UI language changes, and the layout adjusts for RTL if Persian is selected.

### Authentication Forms in Different Languages

1. Change the language to German or Persian
2. Open the authentication modal
3. Verify that all form labels, placeholders, and messages are displayed in the selected language

**Expected Result**: Authentication forms display correctly in the selected language.

## Mobile Responsiveness Testing

1. Open Developer Tools in your browser (F12 or Ctrl+Shift+I)
2. Enable device emulation (mobile view)
3. Test authentication flows on different screen sizes:
   - Small phone (e.g., iPhone SE)
   - Medium phone (e.g., iPhone X)
   - Tablet (e.g., iPad)

**Expected Result**: Authentication forms and navigation should adapt properly to different screen sizes.

## API Testing

You can directly test the authentication API endpoints using tools like Postman or curl:

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@derakhtekherad.com","password":"admin123"}'
```

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"STUDENT"}'
```

### Password Reset Request

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Known Issues and Limitations

- Email sending is not fully implemented in development mode; reset tokens are returned in the API response for testing
- Some dashboard views and role-specific functionality are still under development
- JWT tokens are stored in localStorage which could potentially be vulnerable to XSS attacks

## Reporting Issues

If you encounter any issues during testing, please document:

1. The specific feature or functionality being tested
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots or error messages (if applicable)
6. Environment information (browser, operating system, etc.) 