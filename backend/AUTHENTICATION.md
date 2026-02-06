# Authentication & Authorization System Documentation

## Overview
This cricket application now features a comprehensive role-based authentication and authorization system with three user roles: `user`, `organizer`, and `admin`.

## User Roles

### 1. **User (Player)**
- Default role for regular players
- Can view match scores
- Limited access to scoring management

### 2. **Organizer**
- Can organize matches
- Can manage match scores
- Full access to match management endpoints

### 3. **Admin**
- Full system access
- Can manage all users and scores
- Can perform administrative tasks

## Backend Architecture

### Database Model (User Schema)

```javascript
{
  email: String (unique, required),
  fullName: String (required),
  password: String (hashed, required),
  role: String (enum: ["user", "organizer", "admin"], default: "user"),
  profilePicture: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Authentication Flow

#### 1. **Signup Endpoint** (`POST /api/auth/signup`)
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "user" // or "organizer"
}

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### 2. **Login Endpoint** (`POST /api/auth/login`)
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "profilePicture": null
  }
}
```

#### 3. **Logout Endpoint** (`POST /api/auth/logout`)
- Clears JWT cookie
- Returns success message

#### 4. **Get Current User** (`GET /api/auth/me`)
- Protected route (requires authentication)
- Returns current authenticated user profile

### Middleware

#### `protectRoute` Middleware
- Validates JWT token from cookies
- Checks if user is active
- Adds user object to request
- Required for all protected endpoints

```javascript
app.get("/api/protected-route", protectRoute, (req, res) => {
  // req.user contains authenticated user info
});
```

#### `authorizeRole` Middleware
- Checks if user has required role
- Used with `protectRoute`
- Supports multiple roles

```javascript
router.post(
  "/api/scores/manage",
  protectRoute,
  authorizeRole("admin", "organizer"),
  controller
);
```

### Protected Endpoints

#### 1. **Get Scores** (`GET /api/scores`)
- Required: Authenticated user (any role)
- Returns: Match scores with user role info
- Caching: 5-second cache TTL

```json
Response:
{
  "success": true,
  "data": {
    "matches": [...],
    "updatedAt": "2026-02-05T..."
  },
  "userRole": "user"
}
```

#### 2. **Manage Scores** (`POST /api/scores/manage`)
- Required: Admin or Organizer role
- Used for score updates and management
- Restricted to authorized users only

## Frontend Integration

### AuthContext Hook

The `useAuth()` hook provides authentication state and methods:

```javascript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const {
    user,              // Current user object
    isAuthenticated,   // Boolean
    loading,           // Boolean
    login,             // Function
    signup,            // Function
    logout,            // Function
    fetchUserProfile,  // Function
    hasRole            // Function to check role
  } = useAuth();
}
```

### ProtectedRoute Component

Wraps routes that require authentication:

```javascript
import { ProtectedRoute } from "./components/ProtectedRoute";

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminPanel />
      </ProtectedRoute>
    }
  />
</Routes>
```

### API Service

Centralized API calls through `apiService`:

```javascript
import { apiService } from "../services/apiService";

// Authentication
await apiService.auth.login(email, password);
await apiService.auth.signup(email, password, fullName, role);
await apiService.auth.logout();
await apiService.auth.getMe();

// Scores
await apiService.scores.getScores();
await apiService.scores.manageScores(scoreData);
```

## Security Features

1. **Password Hashing**: Using bcryptjs (10 salt rounds)
2. **JWT Authentication**: 7-day expiration
3. **HTTP-Only Cookies**: Prevents XSS attacks
4. **CORS Configuration**: Restricted to frontend origin
5. **Role-Based Access Control**: Route-level authorization
6. **Account Status**: Users can be deactivated

## Configuration

### Backend (.env)
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
MONGO_URI=mongodb+srv://...
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (no/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (email already exists)
- `500`: Internal Server Error

## Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file with required configuration

3. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local` file with API URL

3. Wrap your App with AuthProvider:
```javascript
import { AuthProvider } from "./context/AuthContext";

<AuthProvider>
  <App />
</AuthProvider>
```

4. Use in components:
```javascript
import { useAuth } from "./context/AuthContext";

function Component() {
  const { user, login, logout } = useAuth();
  // Use auth features...
}
```

## Response Flow Example

### Login Flow
```
1. User enters credentials → LoginPage
2. LoginPage calls useAuth.login()
3. AuthContext sends request to /api/auth/login
4. Backend validates & returns JWT (in cookie) + user data
5. AuthContext stores user in state + localStorage
6. App redirects to dashboard
7. Protected routes check useAuth.isAuthenticated
```

### Protected Route Access
```
1. User visits /api/scores
2. Frontend includes credentials: "include"
3. Backend receives request with JWT cookie
4. protectRoute middleware validates token
5. User object attached to req
6. Response includes user.role
7. Frontend can display role-specific UI
```

## Next Steps for Enhancement

1. Add email verification on signup
2. Implement password reset functionality
3. Add user profile update endpoints
4. Create admin panel for user management
5. Add activity logging
6. Implement 2FA (Two-Factor Authentication)
7. Add refresh token rotation
8. Create audit trails for score changes
