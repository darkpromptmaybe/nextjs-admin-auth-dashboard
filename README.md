# NextJS Admin Dashboard

A comprehensive admin dashboard built with Next.js, featuring authentication, database-driven navigation, and a professional API structure.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-latest-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)

## 🚀 Features

### 🔐 Authentication
- **NextAuth.js Integration** with multiple providers
- **Google OAuth** (configurable)
- **GitHub OAuth** (configurable)  
- **Credentials Provider** with demo login
- **Session Management** with persistent authentication

### 🗂️ Database-Driven Navigation
- **Dynamic Navbar** with database storage
- **Public/Private Navigation** separation
- **Sections Support** for organized menu items
- **Real-time Updates** without page refresh

### 🏗️ Professional API Structure
- **Type-Safe Validation** with Zod schemas
- **Consistent Response Format** across all endpoints
- **Centralized Error Handling** with proper HTTP codes
- **Authentication Middleware** for protected routes
- **Comprehensive Documentation** with examples
- 🎨 **Modern UI** with Tailwind CSS
- 🚀 **Next.js 15** with App Router
- 📱 **Responsive Design**
- 🛡️ **Protected Routes** with middleware
- 🗄️ **Database Integration** (PostgreSQL via Neon)
- 📊 **Dual Auth System** - NextAuth + Stack Auth integration

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - The `.env.local` file is already configured
   - Generate a NextAuth secret: `openssl rand -base64 32`
   - Add your OAuth provider credentials (optional)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Demo credentials: `admin@example.com` / `admin123`

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API routes
│   ├── dashboard/page.tsx               # Protected admin dashboard
│   ├── login/page.tsx                   # Login page
│   ├── layout.tsx                       # Root layout with SessionProvider
│   └── page.tsx                         # Home page
├── components/
│   ├── auth/                           # Authentication components
│   │   ├── AuthButton.tsx              # Smart auth button
│   │   ├── SignInButton.tsx            # Sign in button
│   │   ├── SignOutButton.tsx           # Sign out button
│   │   ├── ProtectedRoute.tsx          # Route protection wrapper
│   │   └── index.ts                    # Auth components exports
│   └── SessionWrapper.tsx              # NextAuth session provider
├── lib/
│   └── auth.ts                         # NextAuth configuration
└── middleware.ts                       # Route protection middleware
```

## Authentication Providers

### Stack Auth (Primary)
- **Project ID**: `2f28597a-7d50-4ca0-81fe-9e05a93ee3cf`
- **Features**: Modern auth platform with built-in user management
- Automatically configured with your project credentials

### Credentials (Demo)
- Email: `admin@example.com`
- Password: `admin123`

### OAuth Providers (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Google+ API
3. Create OAuth 2.0 credentials
4. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Add to `.env.local`:
   ```
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

## Database Configuration

The project is configured with **PostgreSQL** via **Neon**:
- **Connection String**: Already configured in `.env.local`
- **Database URL**: `neondb` database on Neon cloud platform
- **Features**: SSL-enabled, pooled connections

## Routes

- `/` - Home page with authentication status
- `/login` - Sign in page
- `/dashboard` - Protected admin dashboard
- `/api/auth/*` - NextAuth API routes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
