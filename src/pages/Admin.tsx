import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import ProjectForm from "@/components/Admin/ProjectForm";
import ProjectList from "@/components/Admin/ProjectList";
import {
  useProjects,
  Project,
  Category,
  ProjectType,
} from "@/contexts/ProjectContext";

const Admin = () => {
  const { logout, createAdminUser } = useAuth();
  const { toast } = useToast();
  const {
    projects,
    categories,
    projectTypes,
    addProject,
    updateProject,
    deleteProject,
    addCategory,
    updateCategory,
    deleteCategory,
    addProjectType,
    updateProjectType,
    deleteProjectType,
  } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Category management state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryValue, setNewCategoryValue] = useState("");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");

  // Project type management state
  const [editingProjectType, setEditingProjectType] =
    useState<ProjectType | null>(null);
  const [newProjectTypeValue, setNewProjectTypeValue] = useState("");
  const [newProjectTypeLabel, setNewProjectTypeLabel] = useState("");

  // User management state
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreationMessage, setUserCreationMessage] = useState("");

  const handleCreateProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      console.log("Creating project with data:", projectData);
      await addProject(projectData);
      setShowForm(false);
      console.log("Project created successfully");
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleUpdateProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingProject) return;
    try {
      await updateProject(editingProject.id, projectData);
      setEditingProject(null);
      setShowForm(false);
      console.log("Project updated successfully");
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      console.log("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  // Category management functions
  const handleAddCategory = async () => {
    console.log("=== handleAddCategory called ===");
    console.log("newCategoryValue:", newCategoryValue);
    console.log("newCategoryLabel:", newCategoryLabel);

    // Check if fields are empty
    if (!newCategoryValue.trim() || !newCategoryLabel.trim()) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in both Value and Label fields before adding a category.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Adding category:", {
        value: newCategoryValue.trim(),
        label: newCategoryLabel.trim(),
      });
      await addCategory({
        value: newCategoryValue.trim(),
        label: newCategoryLabel.trim(),
      });
      setNewCategoryValue("");
      setNewCategoryLabel("");
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error("Failed to add category:", error);
      toast({
        title: "Error",
        description: `Failed to add category: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && newCategoryValue.trim() && newCategoryLabel.trim()) {
      try {
        await updateCategory(editingCategory.id, {
          value: newCategoryValue.trim(),
          label: newCategoryLabel.trim(),
        });
        setEditingCategory(null);
        setNewCategoryValue("");
        setNewCategoryLabel("");
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } catch (error) {
        console.error("Failed to update category:", error);
        toast({
          title: "Error",
          description: "Failed to update category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryValue(category.value);
    setNewCategoryLabel(category.label);
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setNewCategoryValue("");
    setNewCategoryLabel("");
  };

  // Project type management functions
  const handleAddProjectType = async () => {
    console.log("=== handleAddProjectType called ===");
    console.log("newProjectTypeValue:", newProjectTypeValue);
    console.log("newProjectTypeLabel:", newProjectTypeLabel);

    // Check if fields are empty
    if (!newProjectTypeValue.trim() || !newProjectTypeLabel.trim()) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in both Value and Label fields before adding a project type.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Adding project type:", {
        value: newProjectTypeValue.trim(),
        label: newProjectTypeLabel.trim(),
      });
      await addProjectType({
        value: newProjectTypeValue.trim(),
        label: newProjectTypeLabel.trim(),
      });
      setNewProjectTypeValue("");
      setNewProjectTypeLabel("");
      toast({
        title: "Success",
        description: "Project type added successfully",
      });
    } catch (error) {
      console.error("Failed to add project type:", error);
      toast({
        title: "Error",
        description: `Failed to add project type: ${error.message || "Please try again."}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProjectType = async () => {
    if (
      editingProjectType &&
      newProjectTypeValue.trim() &&
      newProjectTypeLabel.trim()
    ) {
      try {
        await updateProjectType(editingProjectType.id, {
          value: newProjectTypeValue.trim(),
          label: newProjectTypeLabel.trim(),
        });
        setEditingProjectType(null);
        setNewProjectTypeValue("");
        setNewProjectTypeLabel("");
        toast({
          title: "Success",
          description: "Project type updated successfully",
        });
      } catch (error) {
        console.error("Failed to update project type:", error);
        toast({
          title: "Error",
          description: "Failed to update project type. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditProjectType = (projectType: ProjectType) => {
    setEditingProjectType(projectType);
    setNewProjectTypeValue(projectType.value);
    setNewProjectTypeLabel(projectType.label);
  };

  const handleCancelProjectTypeEdit = () => {
    setEditingProjectType(null);
    setNewProjectTypeValue("");
    setNewProjectTypeLabel("");
  };

  // User management functions
  const handleCreateAdminUser = async () => {
    if (!newUserEmail.trim() || !newUserPassword.trim()) {
      setUserCreationMessage("Please enter both email and password.");
      return;
    }

    setIsCreatingUser(true);
    setUserCreationMessage("");

    const result = await createAdminUser(
      newUserEmail.trim(),
      newUserPassword.trim(),
    );

    if (result.success) {
      setUserCreationMessage(
        `Administrator account created successfully for ${newUserEmail}`,
      );
      setNewUserEmail("");
      setNewUserPassword("");
    } else {
      setUserCreationMessage(`Error: ${result.error}`);
    }

    setIsCreatingUser(false);
  };

  const handleToggleHero = async (projectId: string, isHero: boolean) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_hero: isHero })
        .eq("id", projectId);

      if (error) throw error;

      // Update the local state immediately to reflect the change
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, isHero } : project,
      );

      // Since we don't have setProjects from context, we'll trigger a re-fetch
      // by calling updateProject with the current project data
      const projectToUpdate = projects.find((p) => p.id === projectId);
      if (projectToUpdate) {
        await updateProject(projectId, {
          ...projectToUpdate,
          isHero,
        });
      }

      toast({
        title: "Success",
        description: `Project ${isHero ? "marked as hero" : "removed from hero"}`,
      });
    } catch (error) {
      console.error("Error toggling hero status:", error);
      toast({
        title: "Error",
        description: "Failed to update hero status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Back to Site
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-3xl font-bold text-gray-900">
              EcoVibe Administration
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New Project
              </Button>
            )}
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Category and Project Type Management Section */}
        {!showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Categories Management */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="categoryValue">Value</Label>
                    <Input
                      id="categoryValue"
                      placeholder="e.g., kitchen"
                      value={newCategoryValue}
                      onChange={(e) => setNewCategoryValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryLabel">Label</Label>
                    <Input
                      id="categoryLabel"
                      placeholder="e.g., Kitchen"
                      value={newCategoryLabel}
                      onChange={(e) => setNewCategoryLabel(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      console.log("Category button clicked!");
                      if (editingCategory) {
                        handleUpdateCategory();
                      } else {
                        handleAddCategory();
                      }
                    }}
                    size="sm"
                  >
                    {editingCategory ? <Save size={16} /> : <Plus size={16} />}
                    {editingCategory ? "Update" : "Add"} Category
                  </Button>
                  {editingCategory && (
                    <Button
                      onClick={handleCancelCategoryEdit}
                      variant="outline"
                      size="sm"
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <div>
                        <span className="font-medium">{category.label}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({category.value})
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete the category "${category.label}"?`,
                              )
                            ) {
                              try {
                                await deleteCategory(category.id);
                                toast({
                                  title: "Success",
                                  description: "Category deleted successfully",
                                });
                              } catch (error) {
                                console.error(
                                  "Failed to delete category:",
                                  error,
                                );
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to delete category. Please try again.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Types Management */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Manage Project Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="projectTypeValue">Value</Label>
                    <Input
                      id="projectTypeValue"
                      placeholder="e.g., residential"
                      value={newProjectTypeValue}
                      onChange={(e) => setNewProjectTypeValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectTypeLabel">Label</Label>
                    <Input
                      id="projectTypeLabel"
                      placeholder="e.g., Residential"
                      value={newProjectTypeLabel}
                      onChange={(e) => setNewProjectTypeLabel(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      console.log("Project type button clicked!");
                      if (editingProjectType) {
                        handleUpdateProjectType();
                      } else {
                        handleAddProjectType();
                      }
                    }}
                    size="sm"
                  >
                    {editingProjectType ? (
                      <Save size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                    {editingProjectType ? "Update" : "Add"} Project Type
                  </Button>
                  {editingProjectType && (
                    <Button
                      onClick={handleCancelProjectTypeEdit}
                      variant="outline"
                      size="sm"
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                  )}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {projectTypes.map((projectType) => (
                    <div
                      key={projectType.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <div>
                        <span className="font-medium">{projectType.label}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({projectType.value})
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProjectType(projectType)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete the project type "${projectType.label}"?`,
                              )
                            ) {
                              try {
                                await deleteProjectType(projectType.id);
                                toast({
                                  title: "Success",
                                  description:
                                    "Project type deleted successfully",
                                });
                              } catch (error) {
                                console.error(
                                  "Failed to delete project type:",
                                  error,
                                );
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to delete project type. Please try again.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showForm ? (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>
                {editingProject ? "Edit Project" : "Create New Project"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectForm
                project={editingProject}
                onSubmit={
                  editingProject ? handleUpdateProject : handleCreateProject
                }
                onCancel={handleCancelForm}
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList>
              <TabsTrigger value="projects">
                All Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <ProjectList
                projects={projects}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onToggleHero={handleToggleHero}
              />
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus size={20} />
                    Create Administrator Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email Address</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="admin@example.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        disabled={isCreatingUser}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Password</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        placeholder="Enter secure password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        disabled={isCreatingUser}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateAdminUser}
                      disabled={
                        isCreatingUser ||
                        !newUserEmail.trim() ||
                        !newUserPassword.trim()
                      }
                      className="flex items-center gap-2"
                    >
                      {isCreatingUser ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <UserPlus size={16} />
                      )}
                      {isCreatingUser ? "Creating..." : "Create Administrator"}
                    </Button>
                  </div>
                  {userCreationMessage && (
                    <div
                      className={`p-3 rounded-md text-sm ${
                        userCreationMessage.includes("Error")
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {userCreationMessage}
                    </div>
                  )}
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Quick Create
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Create the requested administrator account:
                    </p>
                    <Button
                      onClick={() => {
                        setNewUserEmail("tilman.rumpf@gmail.com");
                        setNewUserPassword("TempPassword123!");
                      }}
                      variant="outline"
                      size="sm"
                      disabled={isCreatingUser}
                    >
                      Fill tilman.rumpf@gmail.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Project Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {projects.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Projects
                      </div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {new Set(projects.map((p) => p.category)).size}
                      </div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {projects.reduce(
                          (acc, p) => acc + p.additionalImages.length,
                          0,
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Total Images</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;
