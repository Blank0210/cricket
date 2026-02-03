import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import NavbarComponent from "./components/NavbarComponent";
import HomePage from "./pages/HomePage";
import MyMatches from "./pages/MyMatches";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <div className="pb-16">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/mymatches" element={<MyMatches />} />
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/rewards" element={<HistoryPage />}/>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
