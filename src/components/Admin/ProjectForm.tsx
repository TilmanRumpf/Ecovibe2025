import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Upload, Image as ImageIcon, Star } from "lucide-react";
import { Project } from "@/contexts/ProjectContext";
import { useProjects } from "@/contexts/ProjectContext";
import { supabase } from "@/lib/supabase";

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
  const { categories, projectTypes } = useProjects();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    projectType: "",
    tags: [] as string[],
    beforeImage1: "",
    afterImage1: "",
    beforeImage2: "",
    afterImage2: "",
    additionalImages: [] as string[],
    duration: "",
    budget: "",
    materials: [] as string[],
    isHero: false,
  });

  const [newTag, setNewTag] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const fileInputRefs = {
    beforeImage1: useRef<HTMLInputElement>(null),
    afterImage1: useRef<HTMLInputElement>(null),
    beforeImage2: useRef<HTMLInputElement>(null),
    afterImage2: useRef<HTMLInputElement>(null),
    additional: useRef<HTMLInputElement>(null),
  };

  const handleImageUpload = async (file: File, fieldName: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [fieldName]: publicUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, fieldName);
    }
  };

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        projectType: project.projectType,
        tags: project.tags,
        beforeImage1: project.beforeImage1,
        afterImage1: project.afterImage1,
        beforeImage2: project.beforeImage2,
        afterImage2: project.afterImage2,
        additionalImages: project.additionalImages,
        duration: project.duration,
        budget: project.budget,
        materials: project.materials,
        isHero: project.isHero,
      });
    }
  }, [project]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddMaterial = () => {
    if (
      newMaterial.trim() &&
      !formData.materials.includes(newMaterial.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()],
      }));
      setNewMaterial("");
    }
  };

  const handleRemoveMaterial = (materialToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter(
        (material) => material !== materialToRemove,
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Submitting project with materials:", formData.materials);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon size={20} />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) =>
                  handleInputChange("projectType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g., 8 weeks"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter project description"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Range</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              placeholder="e.g., $45,000 - $65,000"
            />
          </div>

          {/* Hero Project Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-center gap-3">
              <Star className="text-amber-600" size={20} />
              <div>
                <Label htmlFor="isHero" className="text-base font-medium">
                  Hero Project
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Display this project prominently on the homepage
                </p>
              </div>
            </div>
            <Switch
              id="isHero"
              checked={formData.isHero}
              onCheckedChange={(checked) => handleInputChange("isHero", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Before/After Images */}
      <Card>
        <CardHeader>
          <CardTitle>Before & After Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Slider Set 1 */}
          <div>
            <h4 className="font-medium mb-3">Slider Set 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beforeImage1">Before Image 1 *</Label>
                <Input
                  id="beforeImage1"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'beforeImage1')}
                  required={!project}
                />
                {formData.beforeImage1 && (
                  <img src={formData.beforeImage1} alt="Before preview" className="mt-2 w-32 h-24 object-cover rounded" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="afterImage1">After Image 1 *</Label>
                <Input
                  id="afterImage1"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'afterImage1')}
                  required={!project}
                />
                {formData.afterImage1 && (
                  <img src={formData.afterImage1} alt="After preview" className="mt-2 w-32 h-24 object-cover rounded" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Slider Set 2 */}
          <div>
            <h4 className="font-medium mb-3">Slider Set 2</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beforeImage2">Before Image 2</Label>
                <Input
                  id="beforeImage2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'beforeImage2')}
                />
                {formData.beforeImage2 && (
                  <img src={formData.beforeImage2} alt="Before preview 2" className="mt-2 w-32 h-24 object-cover rounded" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="afterImage2">After Image 2</Label>
                <Input
                  id="afterImage2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'afterImage2')}
                />
                {formData.afterImage2 && (
                  <img src={formData.afterImage2} alt="After preview 2" className="mt-2 w-32 h-24 object-cover rounded" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Images */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Project Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <input
              ref={fileInputRefs.additional}
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const uploadPromises = files.map(async (file) => {
                  const fileExt = file.name.split('.').pop();
                  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                  const filePath = `projects/${fileName}`;

                  const { error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(filePath, file);

                  if (uploadError) {
                    console.error('Upload error:', uploadError);
                    return null;
                  }

                  const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(filePath);

                  return publicUrl;
                });

                const uploadedUrls = await Promise.all(uploadPromises);
                const validUrls = uploadedUrls.filter(url => url !== null);
                
                setFormData(prev => ({
                  ...prev,
                  additionalImages: [...(prev.additionalImages || []), ...validUrls]
                }));
              }}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRefs.additional.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Additional Images
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.additionalImages && formData.additionalImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.additionalImages.map((url, index) => (
                  <img key={index} src={url} alt={`Additional ${index + 1}`} className="w-20 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Materials Used</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              placeholder="Add a material"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddMaterial())
              }
            />
            <Button type="button" onClick={handleAddMaterial} variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.materials.map((material, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
              >
                <span>{material}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(material)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.beforeImage1 || !formData.afterImage1}
        >
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;