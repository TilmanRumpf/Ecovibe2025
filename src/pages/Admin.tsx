import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, Edit, Trash2, Save, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProjectForm from "@/components/Admin/ProjectForm";
import ProjectList from "@/components/Admin/ProjectList";
import {
  useProjects,
  Project,
  Category,
  ProjectType,
} from "@/contexts/ProjectContext";

const Admin = () => {
  const { logout } = useAuth();
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

  const handleCreateProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    addProject(projectData);
    setShowForm(false);
  };

  const handleUpdateProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!editingProject) return;
    updateProject(editingProject.id, projectData);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
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
  const handleAddCategory = () => {
    if (newCategoryValue.trim() && newCategoryLabel.trim()) {
      addCategory({
        value: newCategoryValue.trim(),
        label: newCategoryLabel.trim(),
      });
      setNewCategoryValue("");
      setNewCategoryLabel("");
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategoryValue.trim() && newCategoryLabel.trim()) {
      updateCategory(editingCategory.id, {
        value: newCategoryValue.trim(),
        label: newCategoryLabel.trim(),
      });
      setEditingCategory(null);
      setNewCategoryValue("");
      setNewCategoryLabel("");
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
  const handleAddProjectType = () => {
    if (newProjectTypeValue.trim() && newProjectTypeLabel.trim()) {
      addProjectType({
        value: newProjectTypeValue.trim(),
        label: newProjectTypeLabel.trim(),
      });
      setNewProjectTypeValue("");
      setNewProjectTypeLabel("");
    }
  };

  const handleUpdateProjectType = () => {
    if (
      editingProjectType &&
      newProjectTypeValue.trim() &&
      newProjectTypeLabel.trim()
    ) {
      updateProjectType(editingProjectType.id, {
        value: newProjectTypeValue.trim(),
        label: newProjectTypeLabel.trim(),
      });
      setEditingProjectType(null);
      setNewProjectTypeValue("");
      setNewProjectTypeLabel("");
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
                    onClick={
                      editingCategory ? handleUpdateCategory : handleAddCategory
                    }
                    disabled={
                      !newCategoryValue.trim() || !newCategoryLabel.trim()
                    }
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
                          onClick={() => deleteCategory(category.id)}
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
                    onClick={
                      editingProjectType
                        ? handleUpdateProjectType
                        : handleAddProjectType
                    }
                    disabled={
                      !newProjectTypeValue.trim() || !newProjectTypeLabel.trim()
                    }
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
                          onClick={() => deleteProjectType(projectType.id)}
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
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <ProjectList
                projects={projects}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
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
