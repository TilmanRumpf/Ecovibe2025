import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash2,
  Search,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { Project } from "@/contexts/ProjectContext";
import { useProjects } from "@/contexts/ProjectContext";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
  const { categories: contextCategories, projectTypes } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");

  const categories = [
    { value: "all", label: "All Categories" },
    ...contextCategories.map((cat) => ({ value: cat.value, label: cat.label })),
  ];

  const sortOptions = [
    { value: "updatedAt", label: "Last Updated" },
    { value: "createdAt", label: "Date Created" },
    { value: "title", label: "Title" },
    { value: "category", label: "Category" },
  ];

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesCategory =
        filterCategory === "all" || project.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "updatedAt":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

  const handleDelete = (project: Project) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      )
    ) {
      onDelete(project.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedProjects.map((project) => (
          <Card
            key={project.id}
            className="bg-white hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 mb-2">
                    {project.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {project.category}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {projectTypes.find(
                        (type) => type.value === project.projectType,
                      )?.label || project.projectType}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Images Preview */}
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={project.beforeImage1}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={project.afterImage1}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Project Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {project.description}
              </p>

              {/* Project Details */}
              <div className="space-y-2 text-xs text-gray-500">
                {project.duration && (
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>{project.duration}</span>
                  </div>
                )}
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign size={12} />
                    <span>{project.budget}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                <span>{project.additionalImages.length} additional photos</span>
                <span>{project.materials.length} materials</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProjects.length === 0 && (
        <Card className="bg-white">
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first project to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectList;
