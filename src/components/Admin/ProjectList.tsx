import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  Star,
  GripVertical,
  ArrowUpDown,
} from "lucide-react";
import { Project } from "@/contexts/ProjectContext";
import { useProjects } from "@/contexts/ProjectContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleHero?: (id: string, isHero: boolean) => Promise<void>;
}

const DragHandle = ({ isDragMode }: { isDragMode: boolean }) => (
  <div
    className={`p-1 text-gray-400 hover:text-gray-600 ${
      isDragMode ? "cursor-grab active:cursor-grabbing" : "cursor-default"
    }`}
  >
    <GripVertical size={16} />
  </div>
);

const ProjectList = ({
  projects,
  onEdit,
  onDelete,
  onToggleHero,
}: ProjectListProps) => {
  const {
    categories: contextCategories,
    projectTypes,
    updateProjectOrder,
  } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("userDefined");
  const [isDragMode, setIsDragMode] = useState(false);

  console.log("📋 ProjectList render:", {
    projectsCount: projects.length,
    projects: projects.map((p) => ({ id: p.id, title: p.title })),
    contextCategories: contextCategories.length,
    projectTypes: projectTypes.length,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    ...contextCategories.map((cat) => ({ value: cat.value, label: cat.label })),
  ];

  const sortOptions = [
    { value: "userDefined", label: "Custom Order" },
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
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "userDefined":
        default:
          return b.sortOrder - a.sortOrder;
      }
    });

  const handleDelete = async (project: Project) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      )
    ) {
      await onDelete(project.id);
    }
  };

  const handleHeroToggle = async (
    projectId: string,
    currentHeroStatus: boolean,
  ) => {
    if (onToggleHero) {
      try {
        await onToggleHero(projectId, !currentHeroStatus);
      } catch (error) {
        console.error("Error in ProjectList hero toggle:", error);
        // The error handling is done in the parent component
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredAndSortedProjects.findIndex(
        (project) => project.id === active.id,
      );
      const newIndex = filteredAndSortedProjects.findIndex(
        (project) => project.id === over?.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        try {
          const reorderedProjects = arrayMove(
            filteredAndSortedProjects,
            oldIndex,
            newIndex,
          );
          const projectIds = reorderedProjects.map((p) => p.id);
          await updateProjectOrder(projectIds);
        } catch (error) {
          console.error("Error reordering projects:", error);
        }
      }
    }
  };

  const SortableProjectCard = ({ project }: { project: Project }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: project.id, disabled: !isDragMode });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`bg-white hover:shadow-lg transition-shadow ${
          isDragMode ? "cursor-grab" : ""
        } ${isDragging ? "z-50" : ""}`}
        {...attributes}
        {...(isDragMode ? listeners : {})}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              {isDragMode && <DragHandle isDragMode={isDragMode} />}
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
                  {project.isHero && (
                    <Badge
                      variant="default"
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      <Star size={12} className="mr-1" />
                      Hero
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(project)}
                className="h-8 w-8 p-0"
                disabled={isDragMode}
              >
                <Edit size={14} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(project)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isDragMode}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          {/* Hero Toggle */}
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <Star size={16} className="text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Hero Project
            </span>
            <Switch
              checked={project.isHero || false}
              onCheckedChange={() =>
                handleHeroToggle(project.id, project.isHero || false)
              }
              className="ml-auto"
              disabled={isDragMode}
            />
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
    );
  };

  const SortableProjectList = ({ projects }: { projects: Project[] }) => (
    <SortableContext
      items={projects.map((p) => p.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <SortableProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SortableContext>
  );

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
            {sortBy === "userDefined" && (
              <Button
                onClick={() => setIsDragMode(!isDragMode)}
                variant={isDragMode ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowUpDown size={16} />
                {isDragMode ? "Save Order" : "Reorder"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {isDragMode && sortBy === "userDefined" ? (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Drag Mode Active:</strong> Drag projects to reorder them.
            Click "Save Order" when done.
          </p>
        </div>
      ) : null}

      {sortBy === "userDefined" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableProjectList projects={filteredAndSortedProjects} />
        </DndContext>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <SortableProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

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
