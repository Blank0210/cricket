# Test Cases & Examples

## 🧪 Authentication Test Cases

### Test 1: User Signup
```javascript
// Test signup with new user
const response = await fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "testuser@example.com",
    password: "password123",
    fullName: "Test User",
    role: "user"
  })
});

const data = await response.json();
// Expected: { success: true, user: { ... } }
// Status: 201
```

### Test 2: Login with Valid Credentials
```javascript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "testuser@example.com",
    password: "password123"
  })
});

const data = await response.json();
// Expected: { success: true, user: { ..., role: "user" } }
// Status: 200
// Cookie: jwt=<token>
```

### Test 3: Login with Invalid Password
```javascript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "testuser@example.com",
    password: "wrongpassword"
  })
});

const data = await response.json();
// Expected: { success: false, error: "Invalid credentials" }
// Status: 401
```

### Test 4: Duplicate Email Signup
```javascript
// Try signup with existing email
const response = await fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "testuser@example.com",  // Already exists
    password: "password123",
    fullName: "Another User",
    role: "user"
  })
});

const data = await response.json();
// Expected: { success: false, error: "Email already exists" }
// Status: 409
```

### Test 5: Get Current User Profile
```javascript
// After login (JWT in cookie)
const response = await fetch("http://localhost:3000/api/auth/me", {
  method: "GET",
  credentials: "include"
});

const data = await response.json();
// Expected: { success: true, user: { ..., password NOT included } }
// Status: 200
```

### Test 6: Logout
```javascript
const response = await fetch("http://localhost:3000/api/auth/logout", {
  method: "POST",
  credentials: "include"
});

const data = await response.json();
// Expected: { success: true, message: "Logged out successfully" }
// Status: 200
// Cookie: jwt cleared
```

## 🔒 Authorization Test Cases

### Test 7: Access Protected Route Without Auth
```javascript
const response = await fetch("http://localhost:3000/api/scores", {
  method: "GET",
  // NO credentials: "include"
});

const data = await response.json();
// Expected: { error: "Unauthorized - No token provided" }
// Status: 401
```

### Test 8: Access Protected Route With Auth
```javascript
// After login
const response = await fetch("http://localhost:3000/api/scores", {
  method: "GET",
  credentials: "include"  // JWT in cookie
});

const data = await response.json();
// Expected: { success: true, data: { ... }, userRole: "user" }
// Status: 200
```

### Test 9: Admin Route With User Role
```javascript
// Login as user
const loginRes = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email: "user@example.com", password: "password" })
});

// Try to access organizer-only route
const response = await fetch("http://localhost:3000/api/scores/manage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ data: "..." })
});

const data = await response.json();
// Expected: { error: "Forbidden - Access denied for role: user" }
// Status: 403
```

### Test 10: Admin Route With Organizer Role
```javascript
// Login as organizer
const loginRes = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email: "organizer@example.com", password: "password" })
});

// Access organizer-only route
const response = await fetch("http://localhost:3000/api/scores/manage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ data: "..." })
});

const data = await response.json();
// Expected: { success: true, message: "...", userRole: "organizer" }
// Status: 200
```

## 🎯 Frontend Component Test Cases

### Test 11: useAuth Hook
```javascript
import { useAuth } from "../context/AuthContext";

function TestComponent() {
  const { user, isAuthenticated, hasRole, login, logout } = useAuth();

  // Test 1: Check initial state
  console.assert(isAuthenticated === false, "Should not be authenticated initially");

  // Test 2: Login
  await login("test@example.com", "password");
  console.assert(user.email === "test@example.com", "User email should match");
  console.assert(isAuthenticated === true, "Should be authenticated after login");

  // Test 3: Check role
  if (user.role === "organizer") {
    console.assert(hasRole("organizer") === true, "hasRole should return true");
    console.assert(hasRole("user") === false, "hasRole should return false for other roles");
  }

  // Test 4: Logout
  await logout();
  console.assert(isAuthenticated === false, "Should not be authenticated after logout");

  return <div>Tests passed</div>;
}
```

### Test 12: ProtectedRoute Component
```javascript
import { ProtectedRoute } from "../components/ProtectedRoute";

// Test 1: Without authentication, should redirect to login
// Test 2: With authentication, should render children
// Test 3: Without required role, should show access denied
// Test 4: With required role, should render children

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/protected"
    element={
      <ProtectedRoute>
        <ProtectedComponent />
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

## 🌐 Integration Test Cases

### Test 13: Complete Login Flow
```javascript
// 1. Signup
const signupRes = await apiService.auth.signup(
  "newuser@example.com",
  "password123",
  "New User",
  "user"
);
assert(signupRes.success === true);
assert(signupRes.user.role === "user");

// 2. Check localStorage
const stored = JSON.parse(localStorage.getItem("user"));
assert(stored.email === "newuser@example.com");

// 3. Fetch scores
const scoresRes = await apiService.scores.getScores();
assert(scoresRes.success === true);
assert(scoresRes.userRole === "user");

// 4. Logout
await apiService.auth.logout();

// 5. Check localStorage cleared
assert(localStorage.getItem("user") === null);

// 6. Try to access protected route
try {
  await apiService.scores.getScores();
} catch (error) {
  assert(error.message.includes("Unauthorized"));
}
```

### Test 14: Role-Based Access Control
```javascript
// Create test users with different roles
const users = {
  player: await signup("player@test.com", "pass", "Player", "user"),
  organizer: await signup("org@test.com", "pass", "Organizer", "organizer"),
  admin: await signup("admin@test.com", "pass", "Admin", "admin")
};

// Test 1: Player can view scores
const playerScores = await apiService.scores.getScores();
assert(playerScores.userRole === "user");

// Test 2: Player cannot manage scores
try {
  await apiService.scores.manageScores({ matchId: 1 });
  assert(false, "Should have failed");
} catch (error) {
  assert(error.message.includes("Forbidden"));
}

// Test 3: Organizer can manage scores
const orgManage = await apiService.scores.manageScores({ matchId: 1 });
assert(orgManage.success === true);

// Test 4: Admin can manage scores
const adminManage = await apiService.scores.manageScores({ matchId: 1 });
assert(adminManage.success === true);
```

## 📊 Test Data Scenarios

### Scenario 1: New User Registration
```javascript
const testUser = {
  email: "newplayer@cricket.com",
  password: "SecurePass123",
  fullName: "Cricket Player",
  role: "user"
};

// Expected behavior:
// - Account created
// - JWT token issued
// - User logged in automatically
// - Stored in localStorage
```

### Scenario 2: Multiple Organizers
```javascript
const organizers = [
  { email: "org1@cricket.com", fullName: "Organizer 1", role: "organizer" },
  { email: "org2@cricket.com", fullName: "Organizer 2", role: "organizer" }
];

// Expected behavior:
// - Both can create/manage matches
// - Both can update scores
// - Cannot access admin features
```

### Scenario 3: Session Persistence
```javascript
// 1. User logs in
// 2. Page refreshes
// 3. User should still be logged in (from localStorage)
// 4. Token should still be valid (in cookie)
// 5. Can access protected routes immediately
```

## 🚨 Error Handling Tests

### Test 15: Invalid Email Format
```javascript
const response = await apiService.auth.signup(
  "invalidemail",  // Missing @
  "password",
  "User",
  "user"
);

// Should fail validation
// Expected: Error message about invalid email
```

### Test 16: Short Password
```javascript
const response = await apiService.auth.signup(
  "user@example.com",
  "short",  // Less than 6 characters
  "User",
  "user"
);

// Expected: { error: "Password must be at least 6 characters long" }
// Status: 400
```

### Test 17: Missing Required Fields
```javascript
const response = await apiService.auth.login(
  "user@example.com"
  // Missing password
);

// Expected: { error: "Email and password are required!" }
// Status: 400
```

### Test 18: Account Deactivation
```javascript
// Manually deactivate user in database
user.isActive = false;
await user.save();

// Try to login
const response = await apiService.auth.login(
  "user@example.com",
  "password"
);

// Expected: { error: "Account is inactive" }
// Status: 403
```

## ✅ Test Execution Guide

### Run Tests with Postman/Insomnia
1. Import the API endpoints
2. Set environment variables
3. Create test collections for each user role
4. Run authorization tests
5. Verify error responses

### Run Frontend Tests
```bash
cd frontend
npm test  # (when test setup is added)
```

### Manual Testing Checklist
- [ ] Signup creates user with correct role
- [ ] Login returns user with role
- [ ] JWT token is set in cookie
- [ ] Protected routes block unauthenticated users
- [ ] Role-based routes check permissions
- [ ] Logout clears cookies and localStorage
- [ ] Organizer cannot access admin routes
- [ ] User cannot manage scores
- [ ] Multiple concurrent sessions work
- [ ] Token expiration works (7 days)
