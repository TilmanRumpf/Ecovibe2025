import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { useProjects, Project } from "@/contexts/ProjectContext";

interface ProjectGalleryProps {
  projects?: any[];
}

const ProjectGallery = ({ projects: propProjects }: ProjectGalleryProps) => {
  const { projects: contextProjects, categories, projectTypes } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const defaultProjects: Project[] = [
    {
      id: "1",
      title: "Modern Kitchen Renovation",
      category: "kitchen",
      projectType: "residential",
      description:
        "Complete transformation of a dated kitchen into a sleek, modern space with custom cabinetry and premium appliances.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      duration: "8 weeks",
      budget: "$45,000 - $65,000",
      materials: [
        "Quartz countertops",
        "Custom oak cabinetry",
        "Stainless steel appliances",
      ],
    },
    {
      id: "2",
      title: "Luxury Master Bathroom",
      category: "bathroom",
      projectType: "residential",
      description:
        "Spa-inspired bathroom renovation featuring natural stone, rainfall shower, and heated floors.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
      duration: "6 weeks",
      budget: "$35,000 - $50,000",
      materials: [
        "Carrara marble tiles",
        "Rainfall shower system",
        "Heated floor tiles",
      ],
    },
    {
      id: "3",
      title: "Contemporary Living Room",
      category: "living",
      projectType: "residential",
      description:
        "Open-concept living space redesign with modern furniture, ambient lighting, and artistic elements.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      duration: "4 weeks",
      budget: "$25,000 - $35,000",
      materials: [
        "Hardwood flooring",
        "Custom built-ins",
        "Designer lighting fixtures",
      ],
    },
    {
      id: "4",
      title: "Home Office Makeover",
      category: "office",
      projectType: "residential",
      description:
        "Productive workspace transformation with ergonomic furniture, smart storage, and natural lighting.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1558959356-2d5b6f35c6d0?w=800&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      duration: "3 weeks",
      budget: "$15,000 - $25,000",
      materials: [
        "Built-in desk system",
        "Ergonomic furniture",
        "Smart lighting controls",
      ],
    },
    {
      id: "5",
      title: "Cozy Bedroom Retreat",
      category: "bedroom",
      projectType: "residential",
      description:
        "Peaceful bedroom transformation with warm colors, luxurious textiles, and ambient lighting.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      duration: "3 weeks",
      budget: "$12,000 - $18,000",
      materials: ["Custom headboard", "Luxury bedding", "Ambient lighting"],
    },
    {
      id: "6",
      title: "Outdoor Patio Design",
      category: "outdoor",
      projectType: "residential",
      description:
        "Stunning outdoor living space with weather-resistant furniture, fire pit, and landscape design.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?w=800&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      duration: "2 weeks",
      budget: "$8,000 - $15,000",
      materials: [
        "Teak outdoor furniture",
        "Natural stone fire pit",
        "Weather-resistant fabrics",
      ],
    },
  ];

  // Use projects from context/props or fallback to default projects
  const displayProjects =
    (propProjects || contextProjects).length > 0
      ? propProjects || contextProjects
      : defaultProjects;

  // Create combined filters from categories and project types
  const categoryValues = categories.map((cat) => cat.value);
  const projectTypeValues = projectTypes.map((type) => type.value);
  const allFilters = ["all", ...categoryValues, ...projectTypeValues];

  // Debug logging
  console.log("🔍 Display projects:", displayProjects);
  console.log("Available categories:", categories);
  console.log("Available project types:", projectTypes);
  console.log("All filters:", allFilters);

  // Filter projects based on selected category or project type
  const filteredProjects =
    selectedCategory === "all"
      ? displayProjects
      : displayProjects.filter(
          (project) =>
            project.category === selectedCategory ||
            project.projectType === selectedCategory,
        );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Our Projects
        </h2>

        {/* Category and Project Type filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
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

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            // Handle both property naming conventions safely
            const thumbnailImage = project.afterImage1 || project.thumbnailUrl || project.afterImageUrl || "";
            const projectTypeLabel = projectTypes.find((type) => type.value === project.projectType)?.label || project.projectType || "";
            
            console.log("🖼️ Project thumbnail for", project.title, ":", thumbnailImage);
            
            return (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title || ""}
                category={project.category || ""}
                projectType={projectTypeLabel}
                description={project.description || ""}
                thumbnailUrl={thumbnailImage}
              />
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;