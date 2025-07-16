import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ProjectDetail from "./components/ProjectDetail";
import Admin from "./pages/Admin";
import BottomNavBar from "./components/BottomNavBar";
import { ProjectProvider } from "./contexts/ProjectContext";
import routes from "tempo-routes";

function App() {
  return (
    <ProjectProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/shabnamona" element={<Admin />} />
          </Routes>
          <BottomNavBar />
        </>
      </Suspense>
    </ProjectProvider>
  );
}

export default App;
