import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id?: string;
  title?: string;
  category?: string;
  projectType?: string;
  description?: string;
  thumbnailUrl?: string;
  onClick?: () => void;
}

const ProjectCard = ({
  id = "1",
  title = "Modern Kitchen Renovation",
  category = "Kitchen",
  projectType = "Residential",
  description = "Complete kitchen transformation with custom cabinetry, marble countertops, and state-of-the-art appliances.",
  thumbnailUrl = "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
  onClick,
}: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/project/${id}`);
    }
  };
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white h-full flex flex-col">
      <div
        className="relative h-48 sm:h-56 lg:h-64 overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="flex-grow p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">
            {title}
          </h3>
          <div className="flex gap-2 self-start">
            <Badge variant="outline" className="bg-slate-100">
              {category}
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {projectType}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 sm:p-5 pt-0">
        <Button
          variant="outline"
          className="w-full group hover:bg-primary hover:text-white"
          onClick={handleClick}
        >
          View Project
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
