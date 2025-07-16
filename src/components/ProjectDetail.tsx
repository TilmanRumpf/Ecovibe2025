import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, DollarSign, Hammer, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { useProjects } from "@/contexts/ProjectContext";

interface ProjectDetailProps {
  project?: any;
  onBack?: () => void;
}

const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const { getProject, projectTypes } = useProjects();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get project from context if not provided as prop
  const currentProject = project || (id ? getProject(id) : null);

  if (!currentProject) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </Button>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600">
            The requested project could not be found.
          </p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </Button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        {currentProject.title}
      </h1>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <p className="text-gray-500 capitalize">{currentProject.category}</p>
        <span className="text-gray-300">•</span>
        <p className="text-gray-500">
          {projectTypes.find(
            (type) => type.value === currentProject.projectType,
          )?.label || currentProject.projectType}
        </p>
      </div>

      <div className="mb-6 sm:mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <BeforeAfterSlider
            beforeImage={
              currentProject.beforeImage1 || currentProject.beforeImage
            }
            afterImage={currentProject.afterImage1 || currentProject.afterImage}
            beforeAlt={`${currentProject.title} - Before 1`}
            afterAlt={`${currentProject.title} - After 1`}
            className="rounded-lg"
          />
          <BeforeAfterSlider
            beforeImage={
              currentProject.beforeImage2 ||
              currentProject.beforeImage1 ||
              currentProject.beforeImage
            }
            afterImage={
              currentProject.afterImage2 ||
              currentProject.afterImage1 ||
              currentProject.afterImage
            }
            beforeAlt={`${currentProject.title} - Before 2`}
            afterAlt={`${currentProject.title} - After 2`}
            className="rounded-lg"
          />
        </div>

        {/* Simple Project Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {currentProject.additionalImages?.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-md"
            >
              <img
                src={image}
                alt={`${currentProject.title} - Image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6 sm:mb-10">
        <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
          <TabsTrigger
            value="overview"
            onClick={() => setSelectedTab("overview")}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="details"
            onClick={() => setSelectedTab("details")}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            onClick={() => setSelectedTab("gallery")}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Project Overview
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {currentProject.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-medium mb-1">Duration</h3>
                <p>{currentProject.duration}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <DollarSign className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-medium mb-1">Budget Range</h3>
                <p>{currentProject.budget}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-medium mb-1">Completion</h3>
                <p>2023</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Materials Used
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {currentProject.materials.map((material, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Hammer size={16} className="text-primary" />
                  <span>{material}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Project Approach
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Our approach to this project focused on maximizing space
              efficiency while creating a modern aesthetic that complements the
              home's architecture. We began with a complete demolition of the
              existing space, followed by reconfiguring the layout to improve
              workflow and functionality.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
              Special attention was given to lighting design, incorporating both
              task and ambient lighting to create a warm, inviting atmosphere.
              The custom cabinetry was designed to provide ample storage while
              maintaining clean lines and a minimalist appearance.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {currentProject.additionalImages?.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-md"
              >
                <img
                  src={image}
                  alt={`${currentProject.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 sm:mt-10 text-center">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Interested in a similar transformation?
        </h3>
        <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto">
          Book a Consultation
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetail;
