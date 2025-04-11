# Admin Dashboard Analytics

This document provides detailed information about the Admin Dashboard Analytics implementation in the Derakhte Kherad Learning Management System.

## Overview

The Admin Dashboard Analytics feature provides real-time data visualization and statistical analysis for administrators. It displays key metrics about the platform's usage, user growth, course popularity, and revenue trends.

## Components

The analytics dashboard consists of the following key components:

### 1. AdminDashboardContent

The main container component that orchestrates the fetching and display of analytics data.

**Key features:**
- Fetches real-time statistics from the dedicated API endpoint
- Manages loading and error states
- Displays the overall layout of the analytics dashboard
- Renders statistical cards and charts for data visualization

### 2. StatCard

A reusable component for displaying individual metrics:

**Key features:**
- Displays a metric with title, value, and percentage change
- Shows proper trend indicators (up/down arrows)
- Supports different color schemes based on positive/negative trends
- Formats numbers according to locale settings (German/Persian)

### 3. AdminSettingsContent

Provides system configuration and notification preferences:

**Key features:**
- System settings management interface
- Notification preferences configuration
- Data management tools
- Multilingual support for settings labels

## API Endpoints

### GET /api/dashboard/stats

This endpoint retrieves real-time analytics data from the database:

**Functionality:**
- Authenticates the request using JWT tokens
- Authorizes access (admin-only endpoint)
- Aggregates user statistics (total, new, growth rates)
- Calculates course engagement metrics
- Computes financial data (revenue, growth)
- Returns formatted statistics for frontend visualization

**Response format:**
```typescript
interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
    growth: number;
    latest: Array<{id: string; name: string; email: string; createdAt: string}>;
  };
  courses: {
    total: number;
    active: number;
    growth: number;
    latest: Array<{id: string; title: string; enrollments: number}>;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  assignments: {
    total: number;
    completed: number;
    pending: number;
  };
}
```

## Implementation Details

### Data Fetching

The analytics dashboard fetches data using the following approach:

1. On component mount, an API request is made to `/api/dashboard/stats`
2. JWT authentication token is included in the request headers
3. Error handling for failed requests is implemented
4. Loading states are displayed during data fetching
5. Data is refreshed when the locale is changed

### Authentication & Authorization

Access to the analytics dashboard is restricted to administrators:

1. Session-based authentication checks if the user is logged in
2. Role-based authorization verifies the user has ADMIN privileges
3. API endpoints implement similar checks on the server-side
4. Unauthorized requests are redirected to the login page

### Data Visualization

Data is visualized using a combination of:

1. Statistical cards for individual metrics
2. Growth percentages with trend indicators
3. Lists of recent activities (new users, popular courses)
4. Proper number formatting based on locale (German/Persian)

### Localization

The analytics dashboard is fully localized:

1. All labels and titles are translated (German/Persian)
2. Numbers are formatted according to locale conventions
3. Dates are displayed in the appropriate format for each language
4. RTL support for Persian language is implemented

## Technical Implementation

### Database Queries

The analytics API endpoint performs several optimized database queries:

1. User count and growth calculation:
   ```typescript
   const totalUsers = await prisma.user.count();
   const newUsersThisMonth = await prisma.user.count({
     where: { createdAt: { gte: startOfCurrentMonth } }
   });
   ```

2. Revenue calculation:
   ```typescript
   const totalRevenue = await prisma.enrollment.aggregate({
     _sum: { price: true }
   });
   ```

3. Latest users:
   ```typescript
   const latestUsers = await prisma.user.findMany({
     orderBy: { createdAt: 'desc' },
     take: 5,
     select: {
       id: true,
       name: true,
       email: true,
       createdAt: true
     }
   });
   ```

### Performance Optimization

To ensure good performance:

1. Database queries use proper indexes
2. Response data is structured efficiently
3. Client-side caching is implemented where appropriate
4. Data is only refreshed when necessary

## Future Enhancements

Planned enhancements for the analytics dashboard:

1. More detailed user demographics
2. Advanced filtering options for statistics
3. Exportable reports in CSV/PDF formats
4. Custom date range selection
5. More granular revenue breakdown by course category

## Usage

Administrators can access the analytics dashboard by:

1. Logging in with administrator credentials
2. Navigating to the Admin Dashboard
3. Selecting the "Analytics" tab from the sidebar
4. Viewing the real-time statistics and charts 