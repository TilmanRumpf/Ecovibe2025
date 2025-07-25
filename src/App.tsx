import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ProjectDetail from "./components/ProjectDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./components/NotFound";
import BottomNavBar from "./components/BottomNavBar";
import { ProjectProvider } from "./contexts/ProjectContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  // Don't show loading for protected routes - just redirect
  if (loading) {
    return <Navigate to="/shabnamona/login" replace />;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/shabnamona/login" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        {/* Tempo routes - only when VITE_TEMPO is enabled */}
        {import.meta.env.VITE_TEMPO && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/shabnamona/login" element={<Login />} />
          <Route
            path="/shabnamona"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Add tempo route protection before catchall */}

          {/* Redirect any unknown routes to home instead of 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNavBar />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
