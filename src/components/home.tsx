import { useState, useEffect } from "react";
import ProjectGallery from "./ProjectGallery";
import ContactForm from "./ContactForm";
import { Button } from "./ui/button";
import { useProjects } from "@/contexts/ProjectContext";

interface HeroImageProps {
  project: any;
}

const HeroImage = ({ project }: HeroImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-lg shadow-2xl">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 loading-placeholder h-48 md:h-64">
            <img
              src="/logo.png"
              alt="Loading"
              className="h-16 w-auto loading-logo"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        )}
        {!imageError ? (
          <img
            src={project.afterImage1}
            alt={project.title}
            className={`w-full h-48 md:h-64 object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 md:h-64 loading-placeholder">
            <div className="text-gray-400 text-sm">Hero image unavailable</div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-lg font-medium">{project.title}</h3>
          <p className="text-white/90 text-sm">{project.category}</p>
        </div>
      </div>
    </div>
  );
};

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
          <div className="flex items-center justify-center mb-6">
            <img
              src="/logo.png"
              alt="EcoVibe Logo"
              className="h-16 md:h-20 w-auto mr-4 opacity-80"
              style={{ mixBlendMode: "multiply" }}
            />
            <h1 className="text-4xl md:text-6xl font-light text-gray-900">
              Transforming Spaces
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-6 font-light">
            Creating beautiful, functional spaces that reflect your unique style
          </p>

          {/* Show hero project if available */}
          {heroProject && !loading && <HeroImage project={heroProject} />}

          {/* Show loading state */}
          {loading && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="loading-placeholder rounded-lg h-48 md:h-64">
                <img
                  src="/logo.png"
                  alt="Loading"
                  className="h-16 w-auto loading-logo"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <p className="text-gray-500 mt-3">Loading projects...</p>
            </div>
          )}

          {/* Show error state but don't block the page */}
          {error && !loading && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="loading-placeholder rounded-lg h-48 md:h-64">
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

      {/* About Section */}
      <section id="about" className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              About EcoVibe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sustainable solutions meet modern elegance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-gray-900">
                Our Philosophy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                At EcoVibe, we specialize in transforming outdated spaces into
                modern, functional environments that reflect contemporary
                living. We focus on creating open, flowing layouts that maximize
                both space and natural light.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our approach combines thoughtful design, quality materials, and
                expert craftsmanship to reimagine your space from the ground up,
                creating environments that are both stunning and highly
                functional.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-medium text-gray-900 mb-4">
                What We Offer
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Complete space redesign and layout optimization
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Open floor plan creation and flow enhancement
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Modern kitchen and bathroom renovations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Office space transformation and productivity enhancement
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Industrial space modernization and workflow optimization
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Outdoor space design and entertainment area creation
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Contemporary lighting and fixture updates
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Custom storage solutions and built-ins
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-gray-50">
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

      {/* Footer with Copyright */}
      <footer className="py-6 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EcoVibe Interior Design. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
