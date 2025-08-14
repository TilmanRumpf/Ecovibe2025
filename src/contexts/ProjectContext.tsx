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
  sortOrder: number;
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

export interface Founder {
  id: string;
  name: string;
  photoUrl: string;
  background: string;
  moreInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  categories: Category[];
  projectTypes: ProjectType[];
  founder: Founder | null;
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
  deleteProjectImage: (
    projectId: string,
    imageUrl: string,
    imageType: "additional" | "beforeImage2" | "afterImage2",
  ) => Promise<void>;
  updateFounder: (
    founder: Omit<Founder, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateProjectOrder: (projectIds: string[]) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  categories: [],
  projectTypes: [],
  founder: null,
  loading: true,
  addProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  getProject: () => undefined,
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  addProjectType: async () => {},
  updateProjectType: async () => {},
  deleteProjectType: async () => {},
  deleteProjectImage: async () => {},
  updateFounder: async () => {},
  updateProjectOrder: async () => {},
});

// Change this from const arrow function to regular function declaration
export function useProjects() {
  return useContext(ProjectContext);
}

interface ProjectProviderProps {
  children: ReactNode;
}

// Change this to a regular function declaration and default export
function ProjectProvider({ children }: ProjectProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [founder, setFounder] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    console.log("🚀 ProjectContext useEffect triggered - starting data load");
    loadInitialData();
  }, []);

  // Add debugging effect to track projects state changes
  useEffect(() => {
    console.log("📊 PROJECTS STATE CHANGED:", {
      count: projects.length,
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
      })),
      loading,
    });
  }, [projects, loading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading initial data from Supabase...");
      console.log("🔗 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("🔑 Has Anon Key:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      console.log("📡 Supabase client:", supabase);

      // Test basic connectivity first
      console.log("🧪 Testing Supabase connectivity...");
      const connectivityTest = await supabase
        .from("projects")
        .select("count", { count: "exact", head: true });
      console.log("🧪 Connectivity test result:", connectivityTest);

      // Load all data in parallel for better performance
      console.log("📦 Starting parallel data fetch...");
      const [
        categoriesResult,
        projectTypesResult,
        founderResult,
        projectsResult,
      ] = await Promise.allSettled([
        supabase.from("categories").select("*").order("label"),
        supabase.from("project_types").select("*").order("label"),
        supabase.from("founder").select("*").single(),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      console.log("📦 All Promise.allSettled results:", {
        categoriesResult,
        projectTypesResult,
        founderResult,
        projectsResult,
      });

      // Process categories
      if (
        categoriesResult.status === "fulfilled" &&
        !categoriesResult.value.error
      ) {
        const categoriesData = categoriesResult.value.data || [];
        console.log("📋 Categories loaded:", categoriesData.length);
        setCategories(
          categoriesData.map((cat) => ({
            id: cat.id,
            value: cat.value,
            label: cat.label,
            createdAt: cat.created_at,
          })),
        );
      } else {
        console.error("❌ Failed to load categories:", categoriesResult);
      }

      // Process project types
      if (
        projectTypesResult.status === "fulfilled" &&
        !projectTypesResult.value.error
      ) {
        const projectTypesData = projectTypesResult.value.data || [];
        console.log("🏗️ Project types loaded:", projectTypesData.length);
        setProjectTypes(
          projectTypesData.map((type) => ({
            id: type.id,
            value: type.value,
            label: type.label,
            createdAt: type.created_at,
          })),
        );
      } else {
        console.error("❌ Failed to load project types:", projectTypesResult);
      }

      // Process founder
      if (founderResult.status === "fulfilled" && !founderResult.value.error) {
        const founderData = founderResult.value.data;
        console.log("👤 Founder loaded:", founderData?.name);
        setFounder({
          id: founderData.id,
          name: founderData.name,
          photoUrl: founderData.photo_url || "",
          background: founderData.background || "",
          moreInfo: founderData.more_info || "",
          createdAt: founderData.created_at,
          updatedAt: founderData.updated_at,
        });
      } else {
        console.error("❌ Failed to load founder:", founderResult);
      }

      // Process projects - THIS IS THE CRITICAL PART
      console.log("🎯 PROCESSING PROJECTS RESULT:");
      console.log("   - Status:", projectsResult.status);
      console.log("   - Full result:", projectsResult);

      if (projectsResult.status === "fulfilled") {
        console.log("   - Value:", projectsResult.value);
        console.log("   - Error:", projectsResult.value.error);
        console.log("   - Data:", projectsResult.value.data);

        if (!projectsResult.value.error) {
          const projectsData = projectsResult.value.data || [];
          console.log(
            "🎯 RAW PROJECTS FROM DATABASE:",
            "Count:",
            projectsData.length,
            "Data:",
            projectsData,
          );

          if (projectsData.length === 0) {
            console.warn("⚠️ NO PROJECTS FOUND IN DATABASE!");
            console.log(
              "🔍 Let's check if the projects table exists and has data...",
            );

            // Additional debugging query
            const debugQuery = await supabase.from("projects").select("*");
            console.log("🔍 Debug query result:", debugQuery);
          }

          const transformedProjects = projectsData.map((project, index) => {
            console.log(
              `🔄 Transforming project ${index + 1}/${projectsData.length}:`,
              project,
            );
            const transformed = {
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
              sortOrder: project.sort_order || 0,
              createdAt: project.created_at,
              updatedAt: project.updated_at,
            };
            console.log(
              "   ✅ Transformed:",
              transformed.title,
              "ID:",
              transformed.id,
              "Category:",
              transformed.category,
            );
            return transformed;
          });

          console.log(
            "✅ ABOUT TO SET PROJECTS STATE:",
            "Count:",
            transformedProjects.length,
            "Projects:",
            transformedProjects.map((p) => ({ id: p.id, title: p.title })),
          );
          setProjects(transformedProjects);
          console.log("✅ setProjects() called successfully");
        } else {
          console.error("❌ DATABASE ERROR:", projectsResult.value.error);
          console.error("   - Code:", projectsResult.value.error.code);
          console.error("   - Message:", projectsResult.value.error.message);
          console.error("   - Details:", projectsResult.value.error.details);
        }
      } else {
        console.error("❌ PROMISE REJECTED:", projectsResult);
        if (projectsResult.status === "rejected") {
          console.error("   - Reason:", projectsResult.reason);
        }
      }
    } catch (error) {
      console.error("💥 CRITICAL ERROR loading initial data:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
      });

      // Try to provide more specific error information
      if (error?.message?.includes("fetch")) {
        console.error("🌐 This appears to be a network/fetch error");
      }
      if (error?.message?.includes("CORS")) {
        console.error("🚫 This appears to be a CORS error");
      }
      if (error?.message?.includes("auth")) {
        console.error("🔐 This appears to be an authentication error");
      }
    } finally {
      console.log("🏁 FINALLY BLOCK - setting loading to false");
      console.log(
        "   - Current projects count before setLoading(false):",
        projects.length,
      );
      setLoading(false);
      console.log("   - Loading set to false");

      // Add a small delay and then log the final state
      setTimeout(() => {
        console.log("🏁 FINAL STATE CHECK:", {
          projectsCount: projects.length,
          loading: false,
          categoriesCount: categories.length,
          projectTypesCount: projectTypes.length,
        });
      }, 100);
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
          sort_order: Date.now(),
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
        sortOrder: data.sort_order || 0,
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

      // Add timeout and retry logic
      const updateWithRetry = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
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
                sort_order: projectData.sortOrder || 0,
                updated_at: new Date().toISOString(),
              })
              .eq("id", id)
              .select()
              .single();

            if (error) {
              if (error.code === "57014" && i < retries - 1) {
                console.log(`Retry ${i + 1}/${retries} for project update...`);
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * (i + 1)),
                );
                continue;
              }
              throw error;
            }
            return data;
          } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`Retry ${i + 1}/${retries} for project update...`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      };

      const data = await updateWithRetry();

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
        sortOrder: data.sort_order || 0,
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
      console.log("🏷️ Adding category to database:", categoryData);
      const { data, error } = await supabase
        .from("categories")
        .insert({
          value: categoryData.value,
          label: categoryData.label,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error adding category:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log("✅ Category added to database:", data);

      const newCategory: Category = {
        id: data.id,
        value: data.value,
        label: data.label,
        createdAt: data.created_at,
      };

      setCategories((prev) => {
        const updated = [...prev, newCategory].sort((a, b) =>
          a.label.localeCompare(b.label),
        );
        console.log("📋 Updated categories list:", updated);
        return updated;
      });
    } catch (error) {
      console.error("💥 Failed to add category:", error);
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
      console.log("🏗️ Adding project type to database:", projectTypeData);
      const { data, error } = await supabase
        .from("project_types")
        .insert({
          value: projectTypeData.value,
          label: projectTypeData.label,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error adding project type:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log("✅ Project type added to database:", data);

      const newProjectType: ProjectType = {
        id: data.id,
        value: data.value,
        label: data.label,
        createdAt: data.created_at,
      };

      setProjectTypes((prev) => {
        const updated = [...prev, newProjectType].sort((a, b) =>
          a.label.localeCompare(b.label),
        );
        console.log("📋 Updated project types list:", updated);
        return updated;
      });
    } catch (error) {
      console.error("💥 Failed to add project type:", error);
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
        sortOrder: project.sort_order || 0,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }));

      console.log("Transformed projects:", transformedProjects);
      setProjects(transformedProjects);
    } catch (error) {
      console.error("Error in fetchProjects:", error);
    }
  };

  const deleteProjectImage = async (
    projectId: string,
    imageUrl: string,
    imageType: "additional" | "beforeImage2" | "afterImage2",
  ) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      let updatedProject = { ...project };

      if (imageType === "additional") {
        updatedProject.additionalImages = project.additionalImages.filter(
          (img) => img !== imageUrl,
        );
      } else if (imageType === "beforeImage2") {
        updatedProject.beforeImage2 = "";
      } else if (imageType === "afterImage2") {
        updatedProject.afterImage2 = "";
      }

      // Update in database
      const { error } = await supabase
        .from("projects")
        .update({
          additional_images: updatedProject.additionalImages,
          before_image_2: updatedProject.beforeImage2 || null,
          after_image_2: updatedProject.afterImage2 || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) {
        console.error("Error deleting image from database:", error);
        throw error;
      }

      // Delete from storage
      try {
        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `projects/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from("project-images")
          .remove([filePath]);

        if (storageError) {
          console.warn(
            "Warning: Could not delete image from storage:",
            storageError,
          );
        }
      } catch (storageError) {
        console.warn(
          "Warning: Could not delete image from storage:",
          storageError,
        );
      }

      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p)),
      );

      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Failed to delete image:", error);
      throw error;
    }
  };

  const updateFounder = async (
    founderData: Omit<Founder, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      console.log("🔄 Updating founder:", founderData);
      const { data, error } = await supabase
        .from("founder")
        .update({
          name: founderData.name,
          photo_url: founderData.photoUrl || null,
          background: founderData.background || null,
          more_info: founderData.moreInfo || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", founder?.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating founder:", error);
        throw error;
      }

      const updatedFounder: Founder = {
        id: data.id,
        name: data.name,
        photoUrl: data.photo_url || "",
        background: data.background || "",
        moreInfo: data.more_info || "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setFounder(updatedFounder);
      console.log("Founder updated successfully:", updatedFounder);
    } catch (error) {
      console.error("Failed to update founder:", error);
      throw error;
    }
  };

  const updateProjectOrder = async (projectIds: string[]) => {
    try {
      console.log("🔄 Updating project order:", projectIds);

      // Update each project with its new sort order
      const updates = projectIds.map((id, index) => {
        const sortOrder = Date.now() - index * 1000; // Descending order
        return supabase
          .from("projects")
          .update({ sort_order: sortOrder })
          .eq("id", id);
      });

      await Promise.all(updates);

      // Update local state
      setProjects((prev) => {
        const reorderedProjects = projectIds
          .map((id) => prev.find((p) => p.id === id))
          .filter(Boolean) as Project[];

        // Update sort order in local state
        reorderedProjects.forEach((project, index) => {
          project.sortOrder = Date.now() - index * 1000;
        });

        return reorderedProjects;
      });

      console.log("✅ Project order updated successfully");
    } catch (error) {
      console.error("💥 Failed to update project order:", error);
      throw error;
    }
  };

  const value = {
    projects,
    categories,
    projectTypes,
    founder,
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
    deleteProjectImage,
    updateFounder,
    updateProjectOrder,
  };
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

// Export the provider as both named and default export
export { ProjectProvider };
export default ProjectProvider;
