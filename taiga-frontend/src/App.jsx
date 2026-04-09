import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";


import LandingPage from "./components/LandingPage";

import Login from "./auth/Login";
import Register from "./auth/Register";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Sprints from "./pages/Sprints";
import Kanban from "./pages/Kanban";
import Issues from "./pages/Issues";
import TimeLogs from "./pages/TimeLogs";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/sprints" element={<Sprints />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/timelogs" element={<TimeLogs />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
