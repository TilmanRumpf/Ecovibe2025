import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  projectType?: string;
  description: string;
  thumbnailUrl: string;
}

const ProjectCard = ({
  id,
  title,
  category,
  projectType,
  description,
  thumbnailUrl,
}: ProjectCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/project/${id}`} className="block group">
      <Card className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 loading-placeholder">
              <img
                src="/logo.png"
                alt="Loading"
                className="h-12 w-auto loading-logo"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          )}
          {!imageError ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full loading-placeholder">
              <div className="text-gray-400 text-sm">Image unavailable</div>
            </div>
          )}
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="capitalize text-xs">
              {category}
            </Badge>
            {projectType && (
              <Badge variant="outline" className="capitalize text-xs">
                {projectType}
              </Badge>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
