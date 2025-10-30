# Backend Integration Guide

## Environment Variables

The following environment variables have been configured in `.env.local`:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://overstrong-shortsightedly-jakobe.ngrok-free.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID=444766138331-k604lsssa4sdjcrg8rbio6agnshdvjff.apps.googleusercontent.com
\`\`\`

## Changes Made

### 1. Created API Service (`lib/api.ts`)
- Centralized API communication with the backend
- Automatically includes `ngrok-skip-browser-warning` header for ngrok compatibility
- Handles authentication tokens in request headers
- Supports PDF downloads for tax certificates
- Implements all backend endpoints:
  - `/health` - Health check
  - `/auth/google` - Google OAuth authentication
  - `/submit` - Submit tax data to blockchain
  - `/verify` - Verify data integrity
  - `/record/:id` - Get specific record
  - `/records` - Get all records with pagination

### 2. Updated Google Authentication (`components/auth/google-auth.tsx`)
- Now sends Google ID token to backend API for verification
- Stores JWT token from backend for authenticated requests
- Uses environment variable for Google Client ID
- Includes proper error handling and user feedback

### 3. Updated Auth Hook (`hooks/use-auth.tsx`)
- Integrated with new API service
- Properly manages authentication state

### 4. Environment Configuration (`.env.local`)
- Created with backend API URL and Google Client ID
- Uses `NEXT_PUBLIC_` prefix for client-side access

## API Usage Examples

### Health Check
\`\`\`typescript
const health = await api.healthCheck()
console.log(health.status) // 'healthy'
\`\`\`

### Login with Google
\`\`\`typescript
// This is handled automatically by the GoogleAuth component
// The ID token is sent to the backend which returns a JWT
\`\`\`

### Submit Tax Data
\`\`\`typescript
const result = await api.submitData({
  name: "John Doe",
  income: 500000,
  tax: 50000
})
// Downloads PDF certificate automatically
\`\`\`

### Verify Data
\`\`\`typescript
const verification = await api.verifyData({
  name: "John Doe",
  income: 500000,
  tax: 50000
})
console.log(verification.match) // true/false
\`\`\`

### Get Records
\`\`\`typescript
const records = await api.getRecords(1, 10) // page 1, 10 items
console.log(records.records)
console.log(records.pagination)
\`\`\`

## Important Notes

1. **ngrok URL Changes**: The ngrok URL is temporary and will change when your backend teammate restarts ngrok. Update the `NEXT_PUBLIC_API_BASE_URL` in `.env.local` when this happens.

2. **Authentication Flow**: 
   - User clicks "Sign In with Google"
   - Google returns ID token
   - Frontend sends ID token to backend `/auth/google`
   - Backend verifies token and returns JWT + user data
   - JWT is stored and used for subsequent API calls

3. **CORS & ngrok**: All API calls include the `ngrok-skip-browser-warning: true` header to bypass ngrok's browser warning page.

4. **Environment Variables**: Make sure `.env.local` is in your `.gitignore` to keep credentials secure.
