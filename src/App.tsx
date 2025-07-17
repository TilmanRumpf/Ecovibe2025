import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ProjectDetail from "./components/ProjectDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import BottomNavBar from "./components/BottomNavBar";
import { ProjectProvider } from "./contexts/ProjectContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import routes from "tempo-routes";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
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
          <>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
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
            </Routes>
            <BottomNavBar />
          </>
        </Suspense>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
