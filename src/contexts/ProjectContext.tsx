import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  projectType: string;
  tags: string[];
  beforeImage1: string;
  afterImage1: string;
  beforeImage2: string;
  afterImage2: string;
  additionalImages: string[];
  duration: string;
  budget: string;
  materials: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  value: string;
  label: string;
  createdAt: string;
}

export interface ProjectType {
  id: string;
  value: string;
  label: string;
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  categories: Category[];
  projectTypes: ProjectType[];
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateProject: (
    id: string,
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (
    id: string,
    category: Omit<Category, "id" | "createdAt">,
  ) => void;
  deleteCategory: (id: string) => void;
  addProjectType: (projectType: Omit<ProjectType, "id" | "createdAt">) => void;
  updateProjectType: (
    id: string,
    projectType: Omit<ProjectType, "id" | "createdAt">,
  ) => void;
  deleteProjectType: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [categories, setCategories] = useState<Category[]>(
    [
      {
        id: "2",
        value: "bathroom",
        label: "Bathroom",
        createdAt: "2024-01-01",
      },
      { id: "4", value: "bedroom", label: "Bedroom", createdAt: "2024-01-01" },
      { id: "1", value: "kitchen", label: "Kitchen", createdAt: "2024-01-01" },
      {
        id: "3",
        value: "living",
        label: "Living Room",
        createdAt: "2024-01-01",
      },
      { id: "5", value: "office", label: "Office", createdAt: "2024-01-01" },
      { id: "6", value: "outdoor", label: "Outdoor", createdAt: "2024-01-01" },
    ].sort((a, b) => a.label.localeCompare(b.label)),
  );

  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([
    {
      id: "1",
      value: "residential",
      label: "Residential",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      value: "commercial",
      label: "Commercial",
      createdAt: "2024-01-01",
    },
    {
      id: "3",
      value: "outdoor-living",
      label: "Outdoor Living",
      createdAt: "2024-01-01",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Modern Kitchen Renovation",
      description:
        "Complete transformation of an outdated kitchen into a modern, functional space with custom cabinetry, quartz countertops, and new appliances.",
      category: "kitchen",
      projectType: "residential",
      tags: ["kitchen", "modern", "renovation"],
      beforeImage1:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      afterImage1:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      beforeImage2:
        "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80",
      afterImage2:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      ],
      duration: "8 weeks",
      budget: "$45,000 - $65,000",
      materials: [
        "Quartz countertops",
        "Custom oak cabinetry",
        "Stainless steel appliances",
        "Porcelain tile flooring",
        "LED recessed lighting",
      ],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Luxury Master Bathroom",
      description:
        "Spa-inspired bathroom renovation featuring natural stone, rainfall shower, and heated floors.",
      category: "bathroom",
      projectType: "residential",
      tags: ["bathroom", "luxury", "spa"],
      beforeImage1:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      afterImage1:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
      beforeImage2:
        "https://images.unsplash.com/photo-1584622781564-1d987ba4deb0?w=800&q=80",
      afterImage2:
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
        "https://images.unsplash.com/photo-1584622781564-1d987ba4deb0?w=800&q=80",
      ],
      duration: "6 weeks",
      budget: "$35,000 - $50,000",
      materials: [
        "Carrara marble tiles",
        "Rainfall shower system",
        "Heated floor tiles",
        "Custom vanity",
        "LED mirror lighting",
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: "3",
      title: "Contemporary Living Room",
      description:
        "Open-concept living space redesign with modern furniture, ambient lighting, and artistic elements.",
      category: "living",
      projectType: "residential",
      tags: ["living", "contemporary", "modern"],
      beforeImage1:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      afterImage1:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      beforeImage2:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      afterImage2:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      ],
      duration: "4 weeks",
      budget: "$25,000 - $35,000",
      materials: [
        "Hardwood flooring",
        "Custom built-ins",
        "Designer lighting fixtures",
        "Modern furniture",
        "Accent wall treatment",
      ],
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
    },
    {
      id: "4",
      title: "Home Office Makeover",
      description:
        "Productive workspace transformation with ergonomic furniture, smart storage, and natural lighting.",
      category: "office",
      projectType: "residential",
      tags: ["office", "workspace", "modern"],
      beforeImage1:
        "https://images.unsplash.com/photo-1558959356-2d5b6f35c6d0?w=800&q=80",
      afterImage1:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      beforeImage2:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
      afterImage2:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1558959356-2d5b6f35c6d0?w=800&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
      ],
      duration: "3 weeks",
      budget: "$15,000 - $25,000",
      materials: [
        "Built-in desk system",
        "Ergonomic furniture",
        "Smart lighting controls",
        "Custom storage solutions",
        "Sound dampening panels",
      ],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08",
    },
    {
      id: "5",
      title: "Cozy Bedroom Retreat",
      description:
        "Peaceful bedroom transformation with warm colors, luxurious textiles, and ambient lighting.",
      category: "bedroom",
      projectType: "residential",
      tags: ["bedroom", "cozy", "retreat"],
      beforeImage1:
        "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&q=80",
      afterImage1:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      beforeImage2:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      afterImage2:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      ],
      duration: "3 weeks",
      budget: "$12,000 - $18,000",
      materials: [
        "Custom headboard",
        "Luxury bedding",
        "Ambient lighting",
        "Built-in nightstands",
        "Blackout window treatments",
      ],
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05",
    },
    {
      id: "6",
      title: "Outdoor Patio Design",
      description:
        "Stunning outdoor living space with weather-resistant furniture, fire pit, and landscape design.",
      category: "outdoor",
      projectType: "residential",
      tags: ["outdoor", "patio", "landscape"],
      beforeImage1:
        "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?w=800&q=80",
      afterImage1:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      beforeImage2:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      afterImage2:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      ],
      duration: "2 weeks",
      budget: "$8,000 - $15,000",
      materials: [
        "Teak outdoor furniture",
        "Natural stone fire pit",
        "Weather-resistant fabrics",
        "Outdoor lighting system",
        "Drought-resistant plants",
      ],
      createdAt: "2024-01-03",
      updatedAt: "2024-01-03",
    },
  ]);

  const addProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (
    id: string,
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === id) {
          return {
            ...projectData,
            id,
            createdAt: project.createdAt,
            updatedAt: new Date().toISOString().split("T")[0],
          };
        }
        return project;
      }),
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const addCategory = (categoryData: Omit<Category, "id" | "createdAt">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCategories((prev) =>
      [...prev, newCategory].sort((a, b) => a.label.localeCompare(b.label)),
    );
  };

  const updateCategory = (
    id: string,
    categoryData: Omit<Category, "id" | "createdAt">,
  ) => {
    setCategories((prev) =>
      prev
        .map((category) => {
          if (category.id === id) {
            return {
              ...categoryData,
              id,
              createdAt: category.createdAt,
            };
          }
          return category;
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const addProjectType = (
    projectTypeData: Omit<ProjectType, "id" | "createdAt">,
  ) => {
    const newProjectType: ProjectType = {
      ...projectTypeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProjectTypes((prev) => [...prev, newProjectType]);
  };

  const updateProjectType = (
    id: string,
    projectTypeData: Omit<ProjectType, "id" | "createdAt">,
  ) => {
    setProjectTypes((prev) =>
      prev.map((projectType) => {
        if (projectType.id === id) {
          return {
            ...projectTypeData,
            id,
            createdAt: projectType.createdAt,
          };
        }
        return projectType;
      }),
    );
  };

  const deleteProjectType = (id: string) => {
    setProjectTypes((prev) =>
      prev.filter((projectType) => projectType.id !== id),
    );
  };

  const value = {
    projects,
    categories,
    projectTypes,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    addCategory,
    updateCategory,
    deleteCategory,
    addProjectType,
    updateProjectType,
    deleteProjectType,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
