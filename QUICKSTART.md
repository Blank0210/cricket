# Quick Start Guide - Role-Based Auth System

## 🚀 Quick Setup (5 minutes)

### Backend Setup

1. **Install & Configure**
```bash
cd backend
npm install
```

2. **Environment Variables** (Already created: `.env`)
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
```

3. **Start Server**
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment File** (Already created: `.env.local`)
```
VITE_API_URL=http://localhost:3000/api
```

3. **Update Main App** - Wrap with AuthProvider

In your `src/main.jsx` or `App.jsx`:
```javascript
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

4. **Start Frontend**
```bash
npm run dev
```
App runs on `http://localhost:5173`

## 📝 Testing Authentication

### 1. Signup (First Time)
- Navigate to login page
- Click "Sign Up" toggle
- Fill in details:
  - Full Name: `John Doe`
  - Email: `john@example.com`
  - Password: `password123`
  - Role: `Player` or `Organizer`
- Click "Sign Up"

### 2. Login
- Enter email and password from signup
- Click "Sign In"
- Should redirect to home/dashboard

### 3. Access Protected Routes
- Scores page requires authentication
- Admin routes require admin/organizer role

## 🔑 API Endpoints

### Authentication Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/auth/me` | Yes | Get current user |

### Protected Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/scores` | Yes | All | Get match scores |
| POST | `/api/scores/manage` | Yes | Admin/Organizer | Manage scores |
| GET | `/api/health` | No | - | Health check |

## 🧑 User Roles & Permissions

### Role: `user` (Player)
- ✅ Login/Signup
- ✅ View scores
- ❌ Manage scores
- ❌ Admin functions

### Role: `organizer`
- ✅ Login/Signup
- ✅ View scores
- ✅ Manage scores
- ❌ Admin functions

### Role: `admin`
- ✅ All permissions
- ✅ Admin functions
- ✅ User management
- ✅ Score management

## 🧩 Using Auth in Components

### Check Authentication Status
```javascript
import { useAuth } from "./context/AuthContext";

function MyComponent() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>You are logged in!</div>;
}
```

### Get Current User
```javascript
const { user } = useAuth();

return (
  <div>
    <h1>Welcome, {user.fullName}</h1>
    <p>Role: {user.role}</p>
  </div>
);
```

### Check User Role
```javascript
const { hasRole } = useAuth();

if (hasRole("admin")) {
  return <AdminPanel />;
}

if (hasRole(["admin", "organizer"])) {
  return <OrganizerPanel />;
}
```

### Login/Logout
```javascript
const { login, logout } = useAuth();

const handleLogin = async () => {
  await login("email@example.com", "password");
};

const handleLogout = async () => {
  await logout();
};
```

## 🛡️ Protected Routes

```javascript
import { ProtectedRoute } from "./components/ProtectedRoute";

<Routes>
  {/* Public routes */}
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protected - Any authenticated user */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  
  {/* Protected - Admin/Organizer only */}
  <Route
    path="/manage"
    element={
      <ProtectedRoute requiredRole={["admin", "organizer"]}>
        <ManageScores />
      </ProtectedRoute>
    }
  />
  
  {/* Protected - Admin only */}
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

## 🔌 API Service Usage

```javascript
import { apiService } from "./services/apiService";

// Auth
const loginResult = await apiService.auth.login(email, password);
const signupResult = await apiService.auth.signup(email, password, fullName, role);
await apiService.auth.logout();
const me = await apiService.auth.getMe();

// Scores
const scores = await apiService.scores.getScores();
await apiService.scores.manageScores({ matchId: 1, score: 150 });

// Health
const health = await apiService.health();
```

## 📱 Response Examples

### Login Response
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profilePicture": null
  }
}
```

### Get Scores Response
```json
{
  "success": true,
  "data": {
    "matches": [
      { "matchId": 1, "team1": "TeamA", "score1": 150 },
      { "matchId": 2, "team2": "TeamB", "score2": 145 }
    ],
    "updatedAt": "2026-02-05T10:30:00Z"
  },
  "userRole": "user"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

## 🐛 Troubleshooting

### CORS Error
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check that backend server is running on port 3000

### Login Not Working
- Check that credentials are correct
- Check browser console for error messages
- Verify backend is running (`npm run dev`)

### Protected Routes Not Working
- Ensure AuthProvider wraps the entire app
- Check user has required role
- Verify JWT_SECRET is set in `.env`

### Cookies Not Saving
- Check that `credentials: "include"` is used in fetch calls
- Verify `httpOnly` and `sameSite` cookie settings
- Check browser cookie settings (some browsers block cookies)

## 📚 Documentation Files

- `AUTHENTICATION.md` - Detailed auth system documentation
- `IMPROVEMENTS.md` - Summary of all improvements made
- This file - Quick start guide

## 🔐 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Setup MongoDB with production database
- [ ] Enable HTTPS
- [ ] Setup email verification
- [ ] Setup password reset
- [ ] Enable rate limiting
- [ ] Setup logging and monitoring
- [ ] Review CORS settings
- [ ] Setup SSL certificates
- [ ] Configure environment variables securely

## 🎓 Example Workflow

1. **User signs up** → POST `/api/auth/signup`
2. **JWT stored in cookie** → Backend sets httpOnly cookie
3. **User logs in** → POST `/api/auth/login`
4. **User navigates app** → ProtectedRoute checks auth
5. **User accesses scores** → GET `/api/scores` (JWT sent in cookie)
6. **Backend validates JWT** → protectRoute middleware validates
7. **User role checked** → authorizeRole middleware if needed
8. **Data returned** → Response includes user role info
9. **UI adapts to role** → Show role-specific content
10. **User logs out** → POST `/api/auth/logout` clears cookie

---

**For detailed documentation**, see `AUTHENTICATION.md`
