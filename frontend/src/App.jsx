import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import NavbarComponent from "./components/NavbarComponent";
import HomePage from "./pages/HomePage";
import MyMatches from "./pages/MyMatches";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div className="pb-16">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/mybets" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
          <Route path="/rewards" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}/> */}

          <Route path="/" element={<HomePage />}/>
          <Route path="/mybets" element={<MyMatches />}/>
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/rewards" element={<HistoryPage />}/>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
