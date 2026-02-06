# System Architecture & Communication Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Cricket Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐          ┌──────────────────────┐     │
│  │   FRONTEND (React)   │          │  BACKEND (Express)   │     │
│  ├──────────────────────┤          ├──────────────────────┤     │
│  │ • LoginPage          │          │ • Auth Routes        │     │
│  │ • AuthContext        │◄────────►│ • Auth Middleware    │     │
│  │ • ProtectedRoute     │  HTTP    │ • Score Routes       │     │
│  │ • useAuth Hook       │          │ • User Model         │     │
│  │ • API Service        │          │ • Controllers        │     │
│  └──────────────────────┘          └──────────────────────┘     │
│           │                                    │                 │
│           │                            ┌───────┴────────┐       │
│           │                            │                │       │
│        localStorage                  MongoDB       Redis/Cache  │
│       (User & Token)               (Users, Scores)  (Sessions)  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
USER SIGNUP / LOGIN
│
├─► 1. User enters credentials in LoginPage
│
├─► 2. Frontend calls apiService.auth.login()
│        POST http://localhost:3000/api/auth/login
│        {
│          "email": "user@example.com",
│          "password": "password123"
│        }
│
├─► 3. Backend receives request
│   ├─► Fetch user from database
│   ├─► Verify password with bcryptjs
│   └─► Check account status
│
├─► 4. Password valid?
│   ├─► NO: Return 401 "Invalid credentials"
│   └─► YES: Continue...
│
├─► 5. Generate JWT Token
│   └─► jwt.sign({ userId }, SECRET, { expiresIn: "7d" })
│
├─► 6. Set JWT in HTTP-only cookie
│   └─► Set-Cookie: jwt=<token>; httpOnly; sameSite=lax
│
├─► 7. Return user data (without password)
│        {
│          "success": true,
│          "user": {
│            "_id": "...",
│            "email": "user@example.com",
│            "role": "user",
│            "fullName": "User Name"
│          }
│        }
│
├─► 8. Frontend receives response
│   ├─► Store user in AuthContext state
│   ├─► Store user in localStorage
│   └─► JWT automatically in cookies
│
├─► 9. Redirect to dashboard
│   └─► navigate("/")
│
└─► USER IS NOW AUTHENTICATED!
```

## 🛡️ Protected Route Access

```
USER REQUESTS PROTECTED RESOURCE
│
├─► 1. User navigates to /scores
│
├─► 2. Frontend checks useAuth.isAuthenticated
│   ├─► YES: Load ProtectedRoute wrapper
│   └─► NO: Redirect to /login
│
├─► 3. ProtectedRoute loads
│   └─► Fetches user from localStorage if available
│
├─► 4. Component makes API call
│        GET http://localhost:3000/api/scores
│        credentials: "include"  ◄─── IMPORTANT!
│
├─► 5. Browser automatically includes cookies
│   └─► Cookie: jwt=<token>
│
├─► 6. Backend receives request
│   └─► protectRoute middleware runs
│
├─► 7. Middleware validates JWT
│   ├─► Check if token exists in cookies
│   ├─► Verify JWT signature with SECRET
│   └─► Check if token expired
│
├─► 8. Token valid?
│   ├─► NO: Return 401 "Unauthorized - Token failed"
│   └─► YES: Continue...
│
├─► 9. Fetch user from database
│   └─► Find user by decoded userId
│
├─► 10. User found & active?
│    ├─► NO: Return 401 or 403
│    └─► YES: Continue...
│
├─► 11. Attach user to request
│     └─► req.user = { _id, email, role, ... }
│
├─► 12. Call next() to proceed
│
├─► 13. Route handler executes
│   └─► Has access to req.user
│
├─► 14. Return protected data
│        {
│          "success": true,
│          "data": { ... },
│          "userRole": "user"
│        }
│
└─► USER RECEIVES PROTECTED DATA!
```

## 👥 Role-Based Authorization Flow

```
USER REQUESTS ADMIN-ONLY RESOURCE
│
├─► 1. User (role: "user") calls /api/scores/manage
│
├─► 2. Request reaches backend
│   └─► protectRoute middleware validates JWT ✓
│
├─► 3. authorizeRole middleware checks
│        authorizeRole("admin", "organizer")
│
├─► 4. Check req.user.role
│        req.user.role = "user"
│
├─► 5. Is "user" in allowed roles?
│   ├─► NO: Return 403 Forbidden
│   │    {
│   │      "error": "Forbidden - Access denied for role: user"
│   │    }
│   └─► YES: Proceed to handler
│
├─► 6. Frontend receives error
│   └─► Show "Access Denied" message
│
└─► REQUEST BLOCKED DUE TO INSUFFICIENT ROLE!

---

ALTERNATIVE: USER WITH ORGANIZER ROLE
│
├─► 1. User (role: "organizer") calls /api/scores/manage
│
├─► 2. protectRoute middleware validates JWT ✓
│
├─► 3. authorizeRole checks role
│     Is "organizer" in ["admin", "organizer"]?
│
├─► 4. YES! Proceed to handler
│
├─► 5. Handler processes request
│   └─► Updates match scores
│
├─► 6. Return success
│        {
│          "success": true,
│          "message": "Scores updated",
│          "userRole": "organizer"
│        }
│
└─► REQUEST ALLOWED - ORGANIZER CAN MANAGE SCORES!
```

## 🔄 Session Management

```
SESSION LIFECYCLE
│
├─► LOGIN (t=0)
│   ├─► JWT created: expires at t+7days
│   ├─► Stored in HTTP-only cookie
│   └─► User in localStorage
│
├─► USER BROWSES APP (t=2days)
│   ├─► Each request includes JWT
│   ├─► Middleware validates token
│   └─► User can access protected routes
│
├─► PAGE REFRESH (t=3days)
│   ├─► localStorage loads user
│   ├─► AuthContext restores state
│   ├─► Cookies already in browser
│   └─► User stays logged in instantly
│
├─► LOGOUT (t=5days)
│   ├─► POST /api/auth/logout
│   ├─► Clear JWT cookie
│   ├─► Clear localStorage
│   └─► Redirect to /login
│
├─► TOKEN EXPIRY (t=7days)
│   ├─► User makes API call
│   ├─► Middleware validates JWT
│   ├─► Token expired!
│   ├─► Return 401 "Token failed"
│   ├─► Frontend catches error
│   └─► Redirect to /login
│
└─► SESSION ENDS!
```

## 💾 Data Flow in Frontend

```
User Input (LoginPage)
│
├─► 1. User fills form
│   ├─► email: "user@example.com"
│   ├─► password: "password123"
│   └─► fullName: "John Doe"
│
├─► 2. Calls useAuth.login() or .signup()
│
├─► 3. AuthContext sends API request
│   └─► apiService.auth.login(email, password)
│
├─► 4. Receives response with user data
│   ├─► Store in AuthContext state
│   ├─► Store in localStorage
│   └─► JWT in cookies (automatic)
│
├─► 5. Components can access via useAuth()
│   ├─► const { user, hasRole } = useAuth()
│   └─► Display user name, show role-based UI
│
├─► 6. Protected Routes check role
│   ├─► <ProtectedRoute requiredRole="admin">
│   ├─► hasRole("admin") checks req.user.role
│   └─► Allow or deny access
│
└─► ✓ Data flows through entire app!
```

## 🔌 API Response Formats

### Success Response
```
┌─────────────────────────────────────────┐
│ Status: 200 | 201                      │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": true,                      │
│   "user": {                             │
│     "_id": "507f1f77bcf86cd799439011",  │
│     "email": "user@example.com",        │
│     "fullName": "User Name",            │
│     "role": "user",                     │
│     "profilePicture": null,             │
│     "isActive": true                    │
│   },                                    │
│   "message": "Optional message"         │
│ }                                       │
└─────────────────────────────────────────┘
```

### Error Response
```
┌─────────────────────────────────────────┐
│ Status: 400 | 401 | 403 | 500          │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": false,                     │
│   "error": "Descriptive error message"  │
│ }                                       │
└─────────────────────────────────────────┘
```

## 📊 User State Management

```
AuthContext.jsx
│
├─► State Variables:
│   ├─► user: null | { _id, email, role, fullName, ... }
│   ├─► isAuthenticated: boolean
│   └─► loading: boolean
│
├─► Methods:
│   ├─► login(email, password)
│   ├─► signup(email, password, fullName, role)
│   ├─► logout()
│   ├─► fetchUserProfile()
│   └─► hasRole(roleOrRoles)
│
├─► Effects:
│   └─► useEffect(() => {
│        const stored = localStorage.getItem("user")
│        if (stored) setUser(JSON.parse(stored))
│       })
│
└─► Provider wraps entire app:
    <AuthProvider>
      <App />
    </AuthProvider>
```

## 🛣️ Route Protection Matrix

```
┌──────────────────┬─────────┬────────────┬──────────┐
│ Route            │ Auth    │ Roles      │ Status   │
├──────────────────┼─────────┼────────────┼──────────┤
│ /login           │ No      │ None       │ Public   │
│ /dashboard       │ Yes     │ Any        │ Protected│
│ /scores          │ Yes     │ Any        │ Protected│
│ /manage          │ Yes     │ org/admin  │ Restricted
│ /admin           │ Yes     │ admin      │ Restricted
│ /profile         │ Yes     │ Any        │ Protected│
└──────────────────┴─────────┴────────────┴──────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: HTTPS/TLS (Production)        │
│  • Encrypt data in transit               │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Layer 2: CORS Validation                │
│  • Only allow requests from frontend    │
│  • credentials: include enabled          │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Layer 3: JWT Validation                │
│  • Verify token signature               │
│  • Check expiration                     │
│  • Validate user exists                 │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Layer 4: Role Authorization            │
│  • Check user role                      │
│  • Enforce access control               │
│  • Log denied access attempts           │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Layer 5: Data Validation               │
│  • Sanitize inputs                      │
│  • Validate data types                  │
│  • Prevent SQL injection                │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  ✓ SECURED ACCESS TO RESOURCE           │
└─────────────────────────────────────────┘
```

## 📱 Component Hierarchy

```
<App>
  ├─► <AuthProvider>
  │   ├─► <Header />
  │   │   └─► (useAuth for logout)
  │   ├─► <Routes>
  │   │   ├─► <Route path="/login" element={<LoginPage />} />
  │   │   ├─► <Route path="/" element={
  │   │   │     <ProtectedRoute>
  │   │   │       <HomePage />
  │   │   │     </ProtectedRoute>
  │   │   │   } />
  │   │   ├─► <Route path="/scores" element={
  │   │   │     <ProtectedRoute>
  │   │   │       <ScoreBoardComponent />
  │   │   │     </ProtectedRoute>
  │   │   │   } />
  │   │   └─► <Route path="/admin" element={
  │   │        <ProtectedRoute requiredRole="admin">
  │   │          <AdminPanel />
  │   │        </ProtectedRoute>
  │   │      } />
  │   └─► <Footer />
  └─► </AuthProvider>
```

## 🎯 User Journey Map

```
START
  │
  ▼ ─────────────────────────
  Not Logged In?
  └─► See login page
      │
      ▼ ─────────────────────────
      First time?
      ├─► Click "Sign Up"
      │   ├─► Fill signup form
      │   ├─► Submit
      │   └─► Account created → Auto login
      │
      └─► Existing?
          ├─► Click "Sign In"
          ├─► Enter credentials
          ├─► Submit
          └─► Credentials verified → Login
  │
  ▼ ─────────────────────────
  Logged In!
  │
  ├─► useAuth().isAuthenticated = true
  ├─► User data in state & localStorage
  ├─► JWT in cookies
  │
  ▼ ─────────────────────────
  User can access app
  │
  ├─► View dashboard
  ├─► View scores
  ├─► Check role-based features
  │   ├─► Organizer? → See manage scores
  │   ├─► Admin? → See admin panel
  │   └─► Player? → See limited features
  │
  ▼ ─────────────────────────
  User clicks logout
  │
  ├─► Clear cookies
  ├─► Clear localStorage
  ├─► Clear AuthContext
  │
  ▼ ─────────────────────────
  Back to START (Not logged in)
```

---

**This architecture ensures:**
- ✅ Secure authentication
- ✅ Protected resources
- ✅ Role-based access
- ✅ Seamless frontend-backend communication
- ✅ Persistent sessions
- ✅ Scalable design
