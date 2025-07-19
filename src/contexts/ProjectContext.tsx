import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

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
  isHero: boolean;
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
  loading: boolean;
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateProject: (
    id: string,
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  updateCategory: (
    id: string,
    category: Omit<Category, "id" | "createdAt">,
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addProjectType: (
    projectType: Omit<ProjectType, "id" | "createdAt">,
  ) => Promise<void>;
  updateProjectType: (
    id: string,
    projectType: Omit<ProjectType, "id" | "createdAt">,
  ) => Promise<void>;
  deleteProjectType: (id: string) => Promise<void>;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount with a slight delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      loadInitialData();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading initial data from Supabase...");

      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from("projects")
        .select("count", { count: "exact", head: true });

      if (testError) {
        console.error("❌ Supabase connection test failed:", testError);
        console.error("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
        console.error(
          "Supabase Key exists:",
          !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        );
        return;
      }

      console.log("✅ Supabase connection successful");

      // Load categories
      console.log("📂 Loading categories...");
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("label");

      if (categoriesError) {
        console.error("❌ Error loading categories:", categoriesError);
      } else {
        console.log("✅ Categories loaded:", categoriesData?.length || 0);
        setCategories(
          (categoriesData || []).map((cat) => ({
            id: cat.id,
            value: cat.value,
            label: cat.label,
            createdAt: cat.created_at,
          })),
        );
      }

      // Load project types
      console.log("🏷️ Loading project types...");
      const { data: projectTypesData, error: projectTypesError } =
        await supabase.from("project_types").select("*").order("label");

      if (projectTypesError) {
        console.error("❌ Error loading project types:", projectTypesError);
      } else {
        console.log("✅ Project types loaded:", projectTypesData?.length || 0);
        setProjectTypes(
          (projectTypesData || []).map((type) => ({
            id: type.id,
            value: type.value,
            label: type.label,
            createdAt: type.created_at,
          })),
        );
      }

      // Load projects
      console.log("🏠 Loading projects...");
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("❌ Error loading projects:", projectsError);
      } else {
        console.log("✅ Projects loaded:", projectsData?.length || 0);
        console.log("📋 Project data:", projectsData);
        setProjects(
          (projectsData || []).map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            category: project.category,
            projectType: project.project_type,
            tags: project.tags || [],
            beforeImage1: project.before_image_1,
            afterImage1: project.after_image_1,
            beforeImage2: project.before_image_2 || "",
            afterImage2: project.after_image_2 || "",
            additionalImages: project.additional_images || [],
            duration: project.duration || "",
            budget: project.budget || "",
            materials: project.materials || [],
            isHero: project.is_hero || false,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
          })),
        );
      }
    } catch (error) {
      console.error("💥 Critical error loading initial data:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      });
    } finally {
      setLoading(false);
      console.log("🏁 Initial data loading completed");
    }
  };

  const addProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      console.log("💾 Adding project with materials:", projectData.materials);
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          project_type: projectData.projectType,
          tags: projectData.tags || [],
          before_image_1: projectData.beforeImage1,
          after_image_1: projectData.afterImage1,
          before_image_2: projectData.beforeImage2 || null,
          after_image_2: projectData.afterImage2 || null,
          additional_images: projectData.additionalImages || [],
          duration: projectData.duration || null,
          budget: projectData.budget || null,
          materials: projectData.materials || [],
          is_hero: projectData.isHero || false,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding project:", error);
        throw error;
      }

      const newProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        projectType: data.project_type,
        tags: data.tags || [],
        beforeImage1: data.before_image_1,
        afterImage1: data.after_image_1,
        beforeImage2: data.before_image_2 || "",
        afterImage2: data.after_image_2 || "",
        additionalImages: data.additional_images || [],
        duration: data.duration || "",
        budget: data.budget || "",
        materials: data.materials || [],
        isHero: data.is_hero || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProjects((prev) => [newProject, ...prev]);
      console.log("Project added successfully:", newProject);
    } catch (error) {
      console.error("Failed to add project:", error);
      throw error;
    }
  };

  const updateProject = async (
    id: string,
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      console.log("🔄 Updating project with materials:", projectData.materials);
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          project_type: projectData.projectType,
          tags: projectData.tags || [],
          before_image_1: projectData.beforeImage1,
          after_image_1: projectData.afterImage1,
          before_image_2: projectData.beforeImage2 || null,
          after_image_2: projectData.afterImage2 || null,
          additional_images: projectData.additionalImages || [],
          duration: projectData.duration || null,
          budget: projectData.budget || null,
          materials: projectData.materials || [],
          is_hero: projectData.isHero || false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating project:", error);
        throw error;
      }

      const updatedProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        projectType: data.project_type,
        tags: data.tags || [],
        beforeImage1: data.before_image_1,
        afterImage1: data.after_image_1,
        beforeImage2: data.before_image_2 || "",
        afterImage2: data.after_image_2 || "",
        additionalImages: data.additional_images || [],
        duration: data.duration || "",
        budget: data.budget || "",
        materials: data.materials || [],
        isHero: data.is_hero || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProjects((prev) =>
        prev.map((project) => (project.id === id ? updatedProject : project)),
      );
      console.log("Project updated successfully:", updatedProject);
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        console.error("Error deleting project:", error);
        throw error;
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
      console.log("Project deleted successfully:", id);
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const addCategory = async (
    categoryData: Omit<Category, "id" | "createdAt">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          value: categoryData.value,
          label: categoryData.label,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding category:", error);
        throw error;
      }

      const newCategory: Category = {
        id: data.id,
        value: data.value,
        label: data.label,
        createdAt: data.created_at,
      };

      setCategories((prev) =>
        [...prev, newCategory].sort((a, b) => a.label.localeCompare(b.label)),
      );
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: Omit<Category, "id" | "createdAt">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({
          value: categoryData.value,
          label: categoryData.label,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating category:", error);
        throw error;
      }

      const updatedCategory: Category = {
        id: data.id,
        value: data.value,
        label: data.label,
        createdAt: data.created_at,
      };

      setCategories((prev) =>
        prev
          .map((category) => (category.id === id ? updatedCategory : category))
          .sort((a, b) => a.label.localeCompare(b.label)),
      );
    } catch (error) {
      console.error("Failed to update category:", error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        console.error("Error deleting category:", error);
        throw error;
      }

      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
    }
  };

  const addProjectType = async (
    projectTypeData: Omit<ProjectType, "id" | "createdAt">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("project_types")
        .insert({
          value: projectTypeData.value,
          label: projectTypeData.label,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding project type:", error);
        throw error;
      }

      const newProjectType: ProjectType = {
        id: data.id,
        value: data.value,
        label: data.label,
        createdAt: data.created_at,
      };

      setProjectTypes((prev) => [...prev, newProjectType]);
    } catch (error) {
      console.error("Failed to add project type:", error);
      throw error;
    }
  };

  const updateProjectType = async (
    id: string,
    projectTypeData: Omit<ProjectType, "id" | "createdAt">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("project_types")
        .update({
          value: projectTypeData.value,
          label: projectTypeData.label,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating project type:", error);
        throw error;
      }

      const updatedProjectType: ProjectType = {
        id: data.id,
        value: data.value,
        label: data.label,
        createdAt: data.created_at,
      };

      setProjectTypes((prev) =>
        prev.map((projectType) =>
          projectType.id === id ? updatedProjectType : projectType,
        ),
      );
    } catch (error) {
      console.error("Failed to update project type:", error);
      throw error;
    }
  };

  const deleteProjectType = async (id: string) => {
    try {
      const { error } = await supabase
        .from("project_types")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting project type:", error);
        throw error;
      }

      setProjectTypes((prev) =>
        prev.filter((projectType) => projectType.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete project type:", error);
      throw error;
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      console.log("Raw database data:", data);

      // Transform database fields to match component expectations
      const transformedProjects = data.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        projectType: project.project_type,
        tags: project.tags || [],
        beforeImage1: project.before_image_1,
        afterImage1: project.after_image_1,
        beforeImage2: project.before_image_2,
        afterImage2: project.after_image_2,
        additionalImages: project.additional_images || [],
        duration: project.duration,
        budget: project.budget,
        materials: project.materials || [],
        isHero: project.is_hero || false,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }));

      console.log("Transformed projects:", transformedProjects);
      setProjects(transformedProjects);
    } catch (error) {
      console.error("Error in fetchProjects:", error);
    }
  };

  const value = {
    projects,
    categories,
    projectTypes,
    loading,
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
