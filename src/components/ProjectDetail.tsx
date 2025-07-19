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

  // Handle case where component is used outside of ProjectProvider (e.g., in storyboards)
  let getProject, projectTypes;
  try {
    const projectContext = useProjects();
    getProject = projectContext.getProject;
    projectTypes = projectContext.projectTypes;
  } catch (error) {
    // Fallback when used outside of ProjectProvider
    getProject = () => null;
    projectTypes = [];
  }

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get project from context if not provided as prop
  const currentProject = project || (id && getProject ? getProject(id) : null);

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

  const handlePinterestShare = (imageUrl: string, description: string) => {
    const currentUrl = window.location.href;
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
    window.open(pinterestUrl, "_blank", "width=750,height=320");
  };

  const PinterestIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mr-1"
    >
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z" />
    </svg>
  );

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
          {projectTypes?.find(
            (type) => type.value === currentProject.projectType,
          )?.label || currentProject.projectType}
        </p>
      </div>

      <div className="mb-6 sm:mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="relative group">
            <BeforeAfterSlider
              beforeImage={currentProject.beforeImage1}
              afterImage={currentProject.afterImage1}
              beforeAlt={`${currentProject.title} - Before 1`}
              afterAlt={`${currentProject.title} - After 1`}
              className="rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white shadow-md"
              onClick={() =>
                handlePinterestShare(
                  currentProject.afterImage1,
                  `${currentProject.title} - Interior Design Transformation`,
                )
              }
            >
              <PinterestIcon />
              Save
            </Button>
          </div>
          <div className="relative group">
            <BeforeAfterSlider
              beforeImage={
                currentProject.beforeImage2 || currentProject.beforeImage1
              }
              afterImage={
                currentProject.afterImage2 || currentProject.afterImage1
              }
              beforeAlt={`${currentProject.title} - Before 2`}
              afterAlt={`${currentProject.title} - After 2`}
              className="rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white shadow-md"
              onClick={() =>
                handlePinterestShare(
                  currentProject.afterImage2 || currentProject.afterImage1,
                  `${currentProject.title} - Interior Design Transformation`,
                )
              }
            >
              <PinterestIcon />
              Save
            </Button>
          </div>
        </div>

        {/* Simple Project Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {(currentProject.additionalImages || []).map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-md relative group"
            >
              <img
                src={image}
                alt={`${currentProject.title} - Image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white shadow-md text-xs px-2 py-1 h-auto"
                onClick={() =>
                  handlePinterestShare(
                    image,
                    `${currentProject.title} - Interior Design Detail`,
                  )
                }
              >
                <PinterestIcon />
                Save
              </Button>
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
              {(currentProject.materials || []).map((material, index) => (
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
            {(currentProject.additionalImages || []).map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-md relative group"
              >
                <img
                  src={image}
                  alt={`${currentProject.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white shadow-md text-xs px-2 py-1 h-auto"
                  onClick={() =>
                    handlePinterestShare(
                      image,
                      `${currentProject.title} - Interior Design Gallery`,
                    )
                  }
                >
                  <PinterestIcon />
                  Save
                </Button>
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
