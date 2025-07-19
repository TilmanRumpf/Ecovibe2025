import { useState, useEffect } from "react";
import ProjectGallery from "./ProjectGallery";
import ContactForm from "./ContactForm";
import { Button } from "./ui/button";
import { useProjects } from "@/contexts/ProjectContext";

export default function Home() {
  const { projects, loading } = useProjects();
  const [error, setError] = useState<string | null>(null);

  // Show the main content even if database fails
  const heroProject = projects.find((p) => p.isHero) || projects[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-4">
            Transforming Spaces
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 font-light">
            Creating beautiful, functional interiors that reflect your unique
            style
          </p>

          {/* Show hero project if available */}
          {heroProject && !loading && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={heroProject.afterImage1}
                  alt={heroProject.title}
                  className="w-full h-48 md:h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white text-lg font-medium">
                    {heroProject.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {heroProject.category}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show loading state */}
          {loading && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-gray-200 animate-pulse rounded-lg h-48 md:h-64"></div>
              <p className="text-gray-500 mt-3">Loading projects...</p>
            </div>
          )}

          {/* Show error state but don't block the page */}
          {error && !loading && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-gray-100 rounded-lg h-48 md:h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Portfolio coming soon</p>
                  <p className="text-sm text-gray-500">
                    Database connection: {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 text-base"
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="gallery" className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              Recent Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore some of our beautiful project transformations
            </p>
          </div>

          <ProjectGallery />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              Let's Create Something Beautiful
            </h2>
            <p className="text-lg text-gray-600">
              Ready to transform your space? Get in touch for a consultation.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
