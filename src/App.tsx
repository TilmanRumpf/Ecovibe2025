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
import routes from "tempo-routes";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
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
        <Suspense fallback={<p>Loading...</p>}>
          {/* Tempo routes */}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavBar />
        </Suspense>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;