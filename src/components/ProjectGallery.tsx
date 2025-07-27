import React, { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { useProjects, Project } from "@/contexts/ProjectContext";

interface ProjectGalleryProps {
  projects?: any[];
}

const ProjectGallery = ({ projects: propProjects }: ProjectGalleryProps) => {
  const { projects: contextProjects, categories, projectTypes } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Use actual projects from database, only show defaults if NO projects exist at all
  const projects = propProjects || contextProjects;
  const hasRealProjects = projects && projects.length > 0;

  const defaultProjects: Project[] = [];

  // Use projects from context/props or fallback to default projects
  const displayProjects = hasRealProjects
    ? propProjects || contextProjects
    : defaultProjects;

  // Memoize filters and filtered projects for better performance
  const allFilters = useMemo(() => {
    const categoryValues = categories.map((cat) => cat.value);
    const projectTypeValues = projectTypes.map((type) => type.value);
    return ["all", ...categoryValues, ...projectTypeValues];
  }, [categories, projectTypes]);

  const filteredProjects = useMemo(() => {
    return selectedCategory === "all"
      ? displayProjects
      : displayProjects.filter(
          (project) =>
            project.category === selectedCategory ||
            project.project_type === selectedCategory,
        );
  }, [displayProjects, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Category and Project Type filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-6 px-2">
          {allFilters.map((filter) => {
            // Get display name from context if available
            const categoryMatch = categories.find(
              (cat) => cat.value === filter,
            );
            const projectTypeMatch = projectTypes.find(
              (type) => type.value === filter,
            );
            const displayName =
              categoryMatch?.label ||
              projectTypeMatch?.label ||
              filter.charAt(0).toUpperCase() + filter.slice(1);

            return (
              <button
                key={filter}
                onClick={() => handleCategoryClick(filter)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  selectedCategory === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              category={project.category}
              projectType={project.projectType || project.project_type}
              description={project.description}
              thumbnailUrl={project.afterImage1 || project.after_image_1}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-base text-muted-foreground">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;
