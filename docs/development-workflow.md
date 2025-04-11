# Development Workflow

## Overview

This document outlines the development workflow for the Derakhte Kherad project, covering the process from setting up the development environment to deploying changes to production. The workflow is designed to ensure code quality, maintain a consistent development experience, and support efficient collaboration.

## Development Environment Setup

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Git
- PostgreSQL (v14 or higher)
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourorganization/derakhtekherad.git
   cd derakhtekherad
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/derakhtekherad"
   NEXTAUTH_SECRET="yoursecretkey"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:3000

## Code Structure

The project follows the Next.js 13+ App Router structure:

```
derakhtekherad/
├── app/                  # Main application code
│   ├── [locale]/         # Locale-specific routes
│   ├── api/              # API routes
│   ├── components/       # Reusable components
│   └── i18n/             # Internationalization setup
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## Git Workflow

The project follows a feature branch workflow:

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit them**

   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. **Push your feature branch**

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request**

   Create a pull request on GitHub for code review and discussion.

5. **Merge to main after approval**

   Once the pull request is approved, it can be merged to the main branch.

## Development Practices

### Code Style

The project uses ESLint and Prettier for code formatting and linting:

- **Run linting**

  ```bash
  npm run lint
  ```

- **Fix linting issues**

  ```bash
  npm run lint:fix
  ```

- **Format code**

  ```bash
  npm run format
  ```

VSCode users should install the ESLint and Prettier extensions and enable "Format on Save" for automatic formatting.

### Commit Message Format

The project follows the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

Example:

```
feat(auth): add login functionality

- Implement login form
- Add session management
- Create protected routes
```

### Bilingual Development

When adding new features, always consider both languages (Farsi and German):

1. Add translations for all user-facing text in both `fa.json` and `de.json`
2. Test the UI in both RTL (Farsi) and LTR (German) layouts
3. Ensure that database models have fields for both languages where appropriate

Example of adding translations:

```json
// app/i18n/locales/fa/common.json
{
  "buttons": {
    "submit": "ارسال",
    "cancel": "لغو"
  }
}

// app/i18n/locales/de/common.json
{
  "buttons": {
    "submit": "Absenden",
    "cancel": "Abbrechen"
  }
}
```

### Testing

The project uses Jest and React Testing Library for testing:

- **Run all tests**

  ```bash
  npm test
  ```

- **Run tests in watch mode**

  ```bash
  npm test:watch
  ```

- **Run tests with coverage**

  ```bash
  npm test:coverage
  ```

When adding new features, write tests for:
- Component rendering
- User interactions
- API endpoints
- Database utilities

Example test file:

```tsx
// app/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Continuous Integration

The project uses GitHub Actions for CI/CD:

1. **Linting**: Runs on all pull requests to ensure code quality
2. **Testing**: Runs all tests to ensure nothing breaks
3. **Build**: Verifies that the application builds correctly
4. **Deployment**: Deploys to staging or production environments (based on branch)

The CI configuration is defined in `.github/workflows/ci.yml`.

## Deployment

### Staging Deployment

Staging deployment happens automatically when changes are merged to the `develop` branch:

1. Build the application
2. Run database migrations
3. Deploy to the staging server

The staging environment is available at https://staging.derakhtekherad.com

### Production Deployment

Production deployment happens when changes are merged to the `main` branch:

1. Build the application
2. Run database migrations
3. Deploy to the production server

The production environment is available at https://derakhtekherad.com

### Manual Deployment

For manual deployment to the production Ubuntu server:

1. **Connect to the server**

   ```bash
   ssh user@derakhtekherad.com
   ```

2. **Navigate to the project directory**

   ```bash
   cd /var/www/derakhtekherad
   ```

3. **Pull the latest changes**

   ```bash
   git pull origin main
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Build the application**

   ```bash
   npm run build
   ```

6. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   ```

7. **Restart the application**

   ```bash
   pm2 restart derakhtekherad
   ```

## Database Migrations

When making changes to the database schema:

1. **Update the Prisma schema** in `prisma/schema.prisma`

2. **Create a migration**

   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

3. **Apply the migration**

   ```bash
   npx prisma migrate deploy
   ```

## Adding New Features

When adding new features, follow these steps:

1. **Create a new feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement the feature**
   - Add components in the appropriate directories
   - Add translations for all user-facing text
   - Update the database schema if necessary
   - Write tests for the new feature

3. **Test the feature**
   - Test in both Farsi and German
   - Test on different screen sizes
   - Run all tests to ensure nothing breaks

4. **Submit a pull request**
   - Provide a clear description of the feature
   - Include screenshots or videos if appropriate
   - Request reviews from team members

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check that PostgreSQL is running
   - Verify the `DATABASE_URL` in the `.env` file

2. **Missing translations**
   - Check that all keys exist in both `fa.json` and `de.json`
   - Restart the development server

3. **Styling issues in RTL/LTR modes**
   - Check the `dir` attribute on HTML elements
   - Use the appropriate conditional classes based on the locale

### Development Tools

- **Database Explorer**: Access Prisma Studio to view and edit the database

  ```bash
  npx prisma studio
  ```

- **i18n Helper**: Check for missing translations

  ```bash
  npm run i18n:check
  ```

## Performance Monitoring

The production application uses the following tools for monitoring:

- **Next.js Analytics**: For page performance metrics
- **Sentry**: For error tracking
- **Google Analytics**: For user behavior analytics

## Security Considerations

- Always use parameterized queries with Prisma to prevent SQL injection
- Use Next.js middleware for authentication checks
- Keep all dependencies updated to patch security vulnerabilities
- Store sensitive information in environment variables, never in the code

## Conclusion

Following this development workflow will help maintain a consistent, high-quality codebase for the Derakhte Kherad project. If you have any questions or suggestions for improving the workflow, please discuss them with the team. 