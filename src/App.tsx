import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import BottomNavBar from "./components/BottomNavBar";
import { ProjectProvider } from "./contexts/ProjectContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Lazy load components that aren't immediately needed
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));

// Import tempo routes
let routes: any[] = [];
if (import.meta.env.VITE_TEMPO) {
  try {
    const tempoRoutes = await import("tempo-routes");
    routes = tempoRoutes.default || [];
  } catch (error) {
    console.warn("Tempo routes not available:", error);
    routes = [];
  }
}

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
          <Route
            path="/project/:id"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="loading-placeholder">
                      <img
                        src="/logo.png"
                        alt="Loading"
                        className="h-16 w-auto loading-logo"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                  </div>
                }
              >
                <ProjectDetail />
              </Suspense>
            }
          />
          <Route
            path="/shabnamona/login"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="loading-placeholder">
                      <img
                        src="/logo.png"
                        alt="Loading"
                        className="h-16 w-auto loading-logo"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                  </div>
                }
              >
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/shabnamona"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="loading-placeholder">
                        <img
                          src="/logo.png"
                          alt="Loading"
                          className="h-16 w-auto loading-logo"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      </div>
                    </div>
                  }
                >
                  <Admin />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Add tempo route protection before catchall */}

          {/* Redirect any unknown routes to home instead of 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNavBar />
        <Toaster />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
