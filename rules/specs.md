# CCC Evaluation Form System - Simplified Technical Specification

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Authentication**: NextAuth.js

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite (simpler) or PostgreSQL
- **ORM**: Prisma
- **Password Hashing**: bcrypt

---

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // or "postgresql"
  url      = env("DATABASE_URL")
}

// User accounts
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // Hashed with bcrypt
  role      String   // "admin" or "volunteer"
  createdAt DateTime @default(now())
  
  @@index([username])
}

// Form responses
model Response {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  enteredBy String   // Username of volunteer who entered it
  
  // Section A: Personal Information
  ageGroup           String
  gender             String
  serviceAttendance  String
  isMember           Boolean
  membershipCode     String?
  isRegularVisitor   Boolean?
  hasChildren        Boolean
  childrenDepartments String  // JSON string array
  
  // Section B: Service Experience
  overallRating      String
  transitionSmooth   String
  enjoyMost          String   @default("")
  improveAspects     String   @default("")
  timesConvenient    Boolean
  timeSuggestions    String?
  
  // Section C: Departmental Involvement
  departmentsInvolved String @default("")
  departmentActivity  String
  departmentEffectiveness String
  departmentImprovements String @default("")
  
  // Section D: Ministry Functionality
  ministriesServing  String @default("")
  ministryTeamwork   String
  ministrySupport    String
  ministryImprovements String @default("")
  
  // Section E: Overall Feedback
  spiritualAtmosphere String
  exceptionalAreas    String @default("")
  urgentImprovements  String @default("")
  additionalThoughts  String @default("")
  
  @@index([createdAt])
  @@index([enteredBy])
}
```

---

## User Roles & Permissions

### Admin Account
- **Username**: Set during setup (e.g., "admin" or "pastor")
- **Password**: Strong, unique password
- **Capabilities**:
  - View all responses
  - Generate reports
  - Export data (CSV/Excel)
  - View analytics dashboard
  - Cannot enter form data (to prevent bias)
  - **Credentials**: Private, not shared

### Volunteer Accounts
- **Username**: Simple (e.g., "volunteer1", "volunteer2", or "dataentry")
- **Password**: Shared password (same for all volunteers)
- **Capabilities**:
  - Enter form responses only
  - View confirmation after submission
  - Cannot view other responses
  - Cannot access reports or export
  - **Credentials**: Can be shared across multiple PCs

---

## Authentication Flow

```
┌─────────────────┐
│   Login Page    │
│ /login          │
└────────┬────────┘
         │
         ├──[Admin]──────────► Admin Dashboard (/admin)
         │                     - View Reports
         │                     - Export Data
         │                     - Analytics
         │
         └──[Volunteer]──────► Data Entry Form (/form)
                               - Enter responses
                               - Submit only
```

---

## Project Structure

```
ccc-evaluation-form/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Landing/Login redirect
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── form/
│   │   └── page.tsx                  # Data entry form (volunteers only)
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── reports/
│   │   │   └── page.tsx             # Simple reports view
│   │   └── export/
│   │       └── page.tsx             # Export data page
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts       # POST login
│       │   └── logout/route.ts      # POST logout
│       ├── responses/
│       │   ├── route.ts             # GET all (admin), POST new (volunteer)
│       │   └── stats/route.ts       # GET statistics (admin)
│       └── export/
│           └── route.ts             # GET CSV export (admin)
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── form/
│   │   ├── SectionA.tsx
│   │   ├── SectionB.tsx
│   │   ├── SectionC.tsx
│   │   ├── SectionD.tsx
│   │   ├── SectionE.tsx
│   │   └── ProgressBar.tsx
│   ├── admin/
│   │   ├── StatsCard.tsx
│   │   ├── SimpleChart.tsx
│   │   └── DataTable.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── lib/
│   ├── auth.ts                      # Auth utilities
│   ├── db.ts                        # Prisma client
│   └── validations.ts               # Zod schemas
├── middleware.ts                    # Route protection
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                      # Create initial admin account
└── .env
```

---

## Setup Instructions

### 1. Initialize Project
```bash
npx create-next-app@latest ccc-evaluation-form
cd ccc-evaluation-form

# Install dependencies
npm install prisma @prisma/client
npm install react-hook-form zod @hookform/resolvers
npm install bcryptjs
npm install jose  # For JWT tokens
npm install @types/bcryptjs -D
```

### 2. Setup Database
```bash
# Initialize Prisma
npx prisma init --datasource-provider sqlite

# Copy the schema above to prisma/schema.prisma

# Create and apply migration
npx prisma migrate dev --name init
```

### 3. Create Initial Admin Account
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin account
  const hashedPassword = await bcrypt.hash('YourStrongAdminPassword123!', 10);
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Create volunteer account (shared credentials)
  const volunteerPassword = await bcrypt.hash('volunteer2024', 10);
  
  await prisma.user.upsert({
    where: { username: 'volunteer' },
    update: {},
    create: {
      username: 'volunteer',
      password: volunteerPassword,
      role: 'volunteer',
    },
  });

  console.log('✅ Admin and Volunteer accounts created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

### 4. Environment Variables
```env
# .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

---

## Key Implementation Files

### Middleware for Route Protection
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const verified = await verifyAuth(token);
    if (!verified || verified.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Protect /form route
  if (request.nextUrl.pathname.startsWith('/form')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const verified = await verifyAuth(token);
    if (!verified || verified.role !== 'volunteer') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/form/:path*'],
};
```

### Login API
```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      username: user.username, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(secret);
    
    // Set cookie
    const response = NextResponse.json({
      success: true,
      role: user.role,
      username: user.username,
    });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

---

## Simplified Admin Features

### 1. Dashboard Overview
- Total responses count
- Responses today
- Most recent entries
- Quick stats cards

### 2. Simple Reports
- **Demographics Summary**: Pie charts for age, gender, service attendance
- **Satisfaction Scores**: Bar charts for ratings
- **Department List**: Table showing all departments mentioned
- **Ministry List**: Table showing all ministries mentioned

### 3. Data Export
- Download all responses as CSV
- Filter by date range
- One-click export button

### 4. View All Responses
- Paginated table of all responses
- Search functionality
- Sort by date

---

## Volunteer Features

### 1. Data Entry Form
- Clean, multi-step form (5 sections)
- Progress indicator
- Form validation
- Success confirmation message

### 2. Entry Counter
- Shows how many forms they've entered today
- Motivational counter

---

## Network Setup (Same PC Access)

### 1. Find Host PC IP
```bash
# Windows Command Prompt
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

### 2. Start Server
```bash
# Development
npm run dev -- -H 0.0.0.0 -p 3000

# Production (recommended for church use)
npm run build
npm start -- -H 0.0.0.0 -p 3000
```

### 3. Access from Other PCs
```
Admin Access:     http://192.168.1.100:3000/admin
Volunteer Access: http://192.168.1.100:3000/form
```

### 4. Volunteer Instructions (Print & Share)
```
CCC DATA ENTRY INSTRUCTIONS

1. Open browser (Chrome, Firefox, Edge)
2. Go to: http://192.168.1.100:3000/login
3. Login:
   Username: volunteer
   Password: volunteer2024
4. Fill form carefully from paper questionnaire
5. Click Submit when complete
6. Start next form

⚠️ Do NOT share admin password
```

---

## Security Best Practices

1. **Admin Password**: Strong, unique, never share
2. **Volunteer Password**: Simple but not obvious, can be shared
3. **Session Timeout**: 8 hours (volunteers stay logged in during shift)
4. **HTTPS**: Not critical for local network, but recommended if exposed
5. **Database Backup**: Daily backups of SQLite file

---

## Timeline

- **Setup & Installation**: 1-2 hours
- **Authentication System**: 2-3 hours
- **Data Entry Form**: 4-5 hours
- **Admin Dashboard**: 3-4 hours
- **Testing & Polish**: 2 hours

**Total**: 1-2 days development time

---

## Next Steps for Cursor

1. ✅ Set up Next.js project with Tailwind
2. ✅ Configure Prisma with SQLite
3. ✅ Create database schema
4. ✅ Build authentication system
5. Build login page
6. Build data entry form (volunteers)
7. Build admin dashboard
8. Test on local network
9. Deploy to church PC

Ready to start coding? Which component should I create first?