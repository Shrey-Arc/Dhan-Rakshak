# DhanRakshak - Complete Project Documentation

## Executive Summary

**DhanRakshak** is an AI-powered Income Tax Return (ITR) filing platform designed to simplify the tax filing process for Indian taxpayers. The platform combines intelligent automation, interactive visualizations, and secure backend integration to provide a comprehensive tax filing solution.

**Project Type:** Full-Stack Web Application  
**Assessment Year:** 2025-26  
**Target Form:** ITR-1 (Sahaj)  
**Tech Stack:** Next.js 15, React, TypeScript, Node.js Backend, Google OAuth

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Feature Overview](#feature-overview)
4. [User Flow & Journey](#user-flow--journey)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Integration](#backend-integration)
7. [Authentication System](#authentication-system)
8. [API Documentation](#api-documentation)
9. [Environment Configuration](#environment-configuration)
10. [Security & Privacy](#security--privacy)
11. [Deployment Guide](#deployment-guide)

---

## System Architecture

### High-Level Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Landing │  │   Auth   │  │Dashboard │  │  AI Copilot  │   │
│  │   Page   │  │  Modal   │  │   Page   │  │     Page     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│  ┌──────────┐                                                   │
│  │ Mind Map │                                                   │
│  │   Page   │                                                   │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Components  │  │    Hooks     │  │    API Service       │ │
│  │  - UI Lib    │  │  - useAuth   │  │  - apiCall()         │ │
│  │  - Auth      │  │  - useMobile │  │  - loginWithGoogle() │ │
│  │  - Custom    │  │  - useToast  │  │  - submitData()      │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Google OAuth 2.0 Provider                   │  │
│  │  Client ID: 444766138331-k604lsssa4sdjcrg8rbio6agn...   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Node.js)                        │
│  Base URL: https://overstrong-shortsightedly-jakobe.ngrok-...  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   /health    │  │ /auth/google │  │     /submit          │ │
│  │   /verify    │  │   /records   │  │  /record/:id         │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Database   │  │  Blockchain  │  │   File Storage       │ │
│  │   (MongoDB)  │  │  (Ethereum)  │  │   (PDF Certs)        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling framework |
| **shadcn/ui** | Latest | Component library |
| **Lucide React** | Latest | Icon library |
| **Geist Font** | Latest | Typography |

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| **Node.js** | Backend runtime |
| **Express.js** | API framework |
| **MongoDB** | Database |
| **Ethereum** | Blockchain for data integrity |
| **ngrok** | Development tunneling |

### Authentication & Security

| Technology | Purpose |
|------------|---------|
| **Google OAuth 2.0** | User authentication |
| **JWT** | Session management |
| **AES-256** | Data encryption |

---

## Feature Overview

### 1. Landing Page
- **Hero Section** with animated background (Hyperspeed effect)
- **Feature Grid** showcasing 6 core capabilities
- **How It Works** section with 4-step process
- **Call-to-Action** sections
- **Responsive Navigation** with authentication

### 2. Authentication System
- **Google Sign-In** integration
- **Modal-based** authentication flow
- **JWT token** management
- **Persistent sessions** via localStorage
- **Protected routes** for dashboard access

### 3. AI Copilot
- **Chat interface** for tax queries
- **Pre-trained responses** on ITR-1 topics
- **Quick action buttons** for common questions
- **Real-time messaging** with typing indicators
- **Context-aware** responses

### 4. Interactive Mind Map
- **Hierarchical visualization** of ITR-1 process
- **8 main categories** with sub-items
- **Status tracking** (Complete, In Progress, Pending)
- **Expandable nodes** with detailed information
- **Progress statistics** display

### 5. Tax Filing Dashboard
- **Progress tracking** with visual indicators
- **Tax summary** calculations
- **Document management** system
- **Recent activity** feed
- **Quick action** shortcuts
- **Multi-tab interface** (Overview, Documents, Calculations, Actions)

---

## User Flow & Journey

### Complete User Journey Flowchart

\`\`\`
START
  ↓
┌─────────────────────┐
│  Visit Landing Page │
└─────────────────────┘
  ↓
┌─────────────────────┐
│ Browse Features &   │
│ Information         │
└─────────────────────┘
  ↓
┌─────────────────────┐
│ Click "Get Started" │
│ or "Sign In"        │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Google Authentication Modal    │
│  ┌───────────────────────────┐  │
│  │ 1. User clicks Google btn │  │
│  │ 2. Google OAuth popup     │  │
│  │ 3. User grants permission │  │
│  │ 4. Receive ID token       │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Backend Verification           │
│  ┌───────────────────────────┐  │
│  │ 1. Send token to backend  │  │
│  │ 2. Verify with Google     │  │
│  │ 3. Create/fetch user      │  │
│  │ 4. Generate JWT           │  │
│  │ 5. Return user + token    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ Store JWT & User    │
│ in localStorage     │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Redirect to Dashboard          │
│  ┌───────────────────────────┐  │
│  │ - View filing progress    │  │
│  │ - See tax summary         │  │
│  │ - Upload documents        │  │
│  │ - Access quick actions    │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  User Actions (Choose One)      │
│  ┌───────────────────────────┐  │
│  │ A. Ask AI Copilot         │  │
│  │ B. View Mind Map          │  │
│  │ C. Upload Documents       │  │
│  │ D. Review Calculations    │  │
│  │ E. Submit ITR             │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ A. AI Copilot Flow  │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  1. Navigate to /copilot        │
│  2. View quick action buttons   │
│  3. Click or type question      │
│  4. Receive AI response         │
│  5. Continue conversation       │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ B. Mind Map Flow    │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  1. Navigate to /mindmap        │
│  2. View hierarchical structure │
│  3. Click nodes to expand       │
│  4. Read detailed info          │
│  5. Track progress status       │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ C. Document Upload  │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  1. Click upload button         │
│  2. Select file (Form-16, etc.) │
│  3. AI extracts data            │
│  4. Auto-fill form fields       │
│  5. Review extracted data       │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ D. Tax Calculation  │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  1. View income breakdown       │
│  2. Review deductions           │
│  3. Compare tax regimes         │
│  4. See final tax liability     │
│  5. Check refund amount         │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ E. Submit ITR       │
└─────────────────────┘
  ↓
┌─────────────────────────────────┐
│  1. Review all information      │
│  2. Validate data               │
│  3. Submit to blockchain        │
│  4. Receive transaction hash    │
│  5. Download PDF certificate    │
│  6. e-Verify with OTP           │
└─────────────────────────────────┘
  ↓
┌─────────────────────┐
│ Track Refund Status │
└─────────────────────┘
  ↓
END
\`\`\`

---

## Frontend Architecture

### Project Structure

\`\`\`
dhanrakshak/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles & theme
│   ├── copilot/
│   │   └── page.tsx            # AI Copilot interface
│   ├── mindmap/
│   │   └── page.tsx            # Interactive mind map
│   └── dashboard/
│       └── page.tsx            # User dashboard
├── components/
│   ├── auth/
│   │   └── google-auth.tsx     # Google OAuth components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── scroll-area.tsx
│   │   ├── blur-text.tsx       # Animated text
│   │   └── hyperspeed.tsx      # Background animation
│   └── theme-provider.tsx
├── hooks/
│   ├── use-auth.tsx            # Authentication hook
│   ├── use-mobile.ts           # Mobile detection
│   └── use-toast.ts            # Toast notifications
├── lib/
│   ├── api.ts                  # API service layer
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
└── next.config.mjs
\`\`\`

### Key Components

#### 1. Google Authentication (`components/auth/google-auth.tsx`)

**Purpose:** Handles Google OAuth integration with modal and inline variants

**Features:**
- Google OAuth button integration
- Modal popup for authentication
- Token exchange with backend
- User session management
- Error handling and feedback

**Usage:**
\`\`\`tsx
// Inline button
<GoogleAuth />

// Modal variant
<GoogleAuthModal isOpen={true} onClose={() => {}} />
\`\`\`

#### 2. API Service (`lib/api.ts`)

**Purpose:** Centralized API communication layer

**Key Functions:**
- `apiCall()` - Base HTTP request handler
- `loginWithGoogle()` - Authentication endpoint
- `submitData()` - Submit tax data to blockchain
- `verifyData()` - Verify data integrity
- `getRecords()` - Fetch user records
- `healthCheck()` - Backend health status

**Features:**
- Automatic JWT token injection
- ngrok header handling
- PDF download support
- Error handling
- Response normalization

#### 3. Auth Hook (`hooks/use-auth.tsx`)

**Purpose:** Global authentication state management

**Provides:**
- `user` - Current user object
- `isLoading` - Loading state
- `login()` - Login function
- `logout()` - Logout function
- `isAuthenticated` - Auth status

---

## Backend Integration

### API Base URL

\`\`\`
Development: https://overstrong-shortsightedly-jakobe.ngrok-free.dev
Production: [To be configured]
\`\`\`

### API Endpoints

#### 1. Health Check

**Endpoint:** `GET /health`

**Purpose:** Verify backend availability

**Response:**
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z"
}
\`\`\`

#### 2. Google Authentication

**Endpoint:** `POST /auth/google`

**Purpose:** Verify Google ID token and create session

**Request:**
\`\`\`json
{
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68e258150e48188e6c885773",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
\`\`\`

#### 3. Submit Tax Data

**Endpoint:** `POST /submit`

**Purpose:** Submit tax data to blockchain and generate certificate

**Headers:**
\`\`\`
Authorization: Bearer <JWT_TOKEN>
\`\`\`

**Request:**
\`\`\`json
{
  "extractedData": {
    "name": "John Doe",
    "pan": "ABCDE1234F",
    "income": 1250000,
    "deductions": 150000,
    "tax": 78000
  }
}
\`\`\`

**Response:** PDF file (application/pdf)

**Headers:**
\`\`\`
x-record-id: 507f1f77bcf86cd799439011
x-tx-hash: 0x1234567890abcdef...
\`\`\`

#### 4. Verify Data

**Endpoint:** `POST /verify`

**Purpose:** Verify data integrity on blockchain

**Request:**
\`\`\`json
{
  "extractedData": {
    "name": "John Doe",
    "income": 1250000,
    "tax": 78000
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "match": true,
  "dataHash": "0xabcdef1234567890...",
  "timestamp": 1705315200,
  "submitter": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "transactionHash": "0x1234567890abcdef..."
}
\`\`\`

#### 5. Get Records

**Endpoint:** `GET /records?page=1&limit=10`

**Purpose:** Fetch user's tax filing records

**Response:**
\`\`\`json
{
  "success": true,
  "records": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "dataHash": "0xabcdef...",
      "txHash": "0x123456...",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 47,
    "hasMore": true
  }
}
\`\`\`

#### 6. Get Single Record

**Endpoint:** `GET /record/:id`

**Purpose:** Fetch specific record details

**Response:**
\`\`\`json
{
  "success": true,
  "record": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "68e258150e48188e6c885773",
    "dataHash": "0xabcdef...",
    "txHash": "0x123456...",
    "data": {
      "name": "John Doe",
      "income": 1250000
    },
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
\`\`\`

---

## Authentication System

### Authentication Flow Diagram

\`\`\`
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Click "Sign In with Google"
     ↓
┌─────────────────────┐
│  Google OAuth       │
│  Consent Screen     │
└─────────┬───────────┘
          │ 2. User grants permission
          ↓
┌─────────────────────┐
│  Google Returns     │
│  ID Token           │
└─────────┬───────────┘
          │ 3. Send ID token to backend
          ↓
┌─────────────────────────────────┐
│  Backend API                    │
│  ┌───────────────────────────┐  │
│  │ 1. Verify token with      │  │
│  │    Google API             │  │
│  │ 2. Extract user info      │  │
│  │ 3. Create/update user     │  │
│  │    in database            │  │
│  │ 4. Generate JWT token     │  │
│  └───────────────────────────┘  │
└─────────┬───────────────────────┘
          │ 4. Return JWT + user data
          ↓
┌─────────────────────┐
│  Frontend           │
│  ┌───────────────┐  │
│  │ Store in      │  │
│  │ localStorage: │  │
│  │ - authToken   │  │
│  │ - user        │  │
│  └───────────────┘  │
└─────────┬───────────┘
          │ 5. Update AuthContext
          ↓
┌─────────────────────┐
│  Redirect to        │
│  Dashboard          │
└─────────────────────┘
\`\`\`

### Session Management

**Storage:** localStorage (client-side)

**Stored Data:**
\`\`\`javascript
{
  authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "68e258150e48188e6c885773",
    email: "user@example.com",
    name: "John Doe",
    picture: "https://..."
  }
}
\`\`\`

**Token Usage:**
- Automatically included in all API requests
- Added to `Authorization` header as `Bearer <token>`
- Validated on backend for protected routes

**Logout Process:**
1. Remove `authToken` from localStorage
2. Remove `user` from localStorage
3. Clear AuthContext state
4. Redirect to landing page

---

## Environment Configuration

### Environment Variables

**File:** `.env.local`

\`\`\`env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://overstrong-shortsightedly-jakobe.ngrok-free.dev

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=444766138331-k604lsssa4sdjcrg8rbio6agnshdvjff.apps.googleusercontent.com
\`\`\`

### Configuration Notes

1. **NEXT_PUBLIC_ Prefix**
   - Required for client-side access in Next.js
   - Variables are embedded at build time
   - Visible in browser (don't store secrets)

2. **ngrok URL**
   - Temporary development URL
   - Changes when backend restarts ngrok
   - Update `.env.local` when URL changes

3. **Google Client ID**
   - Obtained from Google Cloud Console
   - Must match authorized origins
   - Used for OAuth authentication

### Setting Up Environment Variables

1. Create `.env.local` in project root
2. Add required variables
3. Restart Next.js development server
4. Verify variables are loaded:
   \`\`\`javascript
   console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
   \`\`\`

---

## Security & Privacy

### Security Measures

#### 1. Authentication Security
- **Google OAuth 2.0** - Industry-standard authentication
- **JWT Tokens** - Secure session management
- **Token Expiration** - Automatic session timeout
- **HTTPS Only** - Encrypted communication

#### 2. Data Protection
- **AES-256 Encryption** - Data at rest
- **TLS/SSL** - Data in transit
- **Blockchain Integrity** - Immutable records
- **No Plain Text Storage** - Sensitive data encrypted

#### 3. API Security
- **Bearer Token Authentication** - Protected endpoints
- **CORS Configuration** - Restricted origins
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Sanitize user input

#### 4. Frontend Security
- **XSS Prevention** - React's built-in protection
- **CSRF Protection** - Token-based validation
- **Secure Storage** - localStorage with encryption
- **Content Security Policy** - Restrict resource loading

### Privacy Considerations

1. **Data Minimization**
   - Only collect necessary information
   - No tracking without consent
   - Clear data retention policies

2. **User Control**
   - Access to personal data
   - Ability to delete account
   - Export data functionality

3. **Compliance**
   - GDPR considerations
   - Indian IT Act compliance
   - Tax data handling regulations

---

## Deployment Guide

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Vercel account (for deployment)
- Google Cloud Console project

### Local Development Setup

1. **Clone Repository**
   \`\`\`bash
   git clone <repository-url>
   cd dhanrakshak
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Configure Environment**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your values
   \`\`\`

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`

5. **Access Application**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Production Deployment (Vercel)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Visit vercel.com
   - Import GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   - Add `NEXT_PUBLIC_API_BASE_URL`
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

4. **Deploy**
   - Vercel auto-deploys on push
   - Monitor build logs
   - Verify deployment

### Backend Deployment

1. **Deploy Node.js Backend**
   - Use Heroku, Railway, or AWS
   - Configure MongoDB connection
   - Set up Ethereum node connection

2. **Update Frontend**
   - Replace ngrok URL with production URL
   - Update environment variables
   - Redeploy frontend

---

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   - Next.js automatic code splitting
   - Dynamic imports for heavy components
   - Route-based splitting

2. **Image Optimization**
   - Next.js Image component
   - Lazy loading
   - WebP format support

3. **Caching Strategy**
   - Static page generation
   - API response caching
   - Browser caching headers

4. **Bundle Size**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

### Backend Optimizations

1. **Database Indexing**
   - Index frequently queried fields
   - Compound indexes for complex queries

2. **API Response Time**
   - Query optimization
   - Connection pooling
   - Caching layer (Redis)

3. **Blockchain Interaction**
   - Batch transactions
   - Gas optimization
   - Event listening

---

## Testing Strategy

### Frontend Testing

1. **Unit Tests**
   - Component testing with Jest
   - Hook testing with React Testing Library
   - Utility function tests

2. **Integration Tests**
   - API integration tests
   - Authentication flow tests
   - Form submission tests

3. **E2E Tests**
   - Playwright or Cypress
   - Critical user journeys
   - Cross-browser testing

### Backend Testing

1. **API Tests**
   - Endpoint testing
   - Authentication tests
   - Error handling tests

2. **Database Tests**
   - CRUD operations
   - Data integrity
   - Migration tests

3. **Blockchain Tests**
   - Smart contract tests
   - Transaction verification
   - Gas estimation

---

## Monitoring & Analytics

### Application Monitoring

1. **Error Tracking**
   - Sentry integration
   - Error logging
   - Stack trace analysis

2. **Performance Monitoring**
   - Vercel Analytics
   - Core Web Vitals
   - API response times

3. **User Analytics**
   - Google Analytics
   - User flow tracking
   - Conversion tracking

### Backend Monitoring

1. **Server Health**
   - Uptime monitoring
   - Resource usage
   - Error rates

2. **Database Monitoring**
   - Query performance
   - Connection pool status
   - Storage usage

3. **Blockchain Monitoring**
   - Transaction status
   - Gas prices
   - Network congestion

---

## Future Enhancements

### Planned Features

1. **Multi-Form Support**
   - ITR-2, ITR-3, ITR-4 support
   - Form selection wizard
   - Auto-detection of applicable form

2. **Advanced AI Features**
   - Document OCR
   - Intelligent form filling
   - Tax optimization suggestions
   - Anomaly detection

3. **Collaboration Features**
   - CA/Tax consultant access
   - Family account linking
   - Document sharing

4. **Mobile Application**
   - React Native app
   - Offline support
   - Push notifications

5. **Enhanced Reporting**
   - Custom reports
   - Multi-year comparison
   - Export to Excel/PDF

6. **Integration Expansion**
   - Bank statement import
   - Investment platform integration
   - Government portal direct filing

---

## Support & Maintenance

### Getting Help

- **Documentation:** This file and BACKEND_INTEGRATION.md
- **Issues:** GitHub Issues
- **Email:** support@dhanrakshak.com
- **Community:** Discord/Slack channel

### Maintenance Schedule

- **Security Updates:** Weekly
- **Feature Updates:** Monthly
- **Bug Fixes:** As needed
- **Dependency Updates:** Quarterly

---

## License & Credits

### License
[Specify license - MIT, Apache, etc.]

### Credits

**Development Team:**
- Frontend: [Team members]
- Backend: [Team members]
- Design: [Team members]

**Technologies:**
- Next.js by Vercel
- shadcn/ui by shadcn
- Tailwind CSS
- React by Meta

---

## Appendix

### Glossary

- **ITR:** Income Tax Return
- **AY:** Assessment Year
- **PAN:** Permanent Account Number
- **TDS:** Tax Deducted at Source
- **JWT:** JSON Web Token
- **OAuth:** Open Authorization
- **API:** Application Programming Interface

### References

- [Income Tax Department](https://www.incometax.gov.in/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)

---

**Document Version:** 1.0  
**Last Updated:** January 15, 2025  
**Maintained By:** DhanRakshak Development Team
