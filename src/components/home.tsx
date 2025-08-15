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
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 672px"
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
  const { projects, founder, loading } = useProjects();
  const [error, setError] = useState<string | null>(null);

  // Show the main content even if database fails
  const heroProject = projects.find((p) => p.isHero) || projects[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] max-h-[70vh] xl:max-h-[60vh] 2xl:max-h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8">
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

          <div className="mt-3 space-x-4">
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
            <Button
              size="lg"
              variant="outline"
              className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-2 text-base"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="gallery" className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
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
              Designs that Uplift. Spaces that Inspire.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-gray-900">
                Our Philosophy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We believe that design should uplift the spirit and function
                with clarity. Our aesthetic is rooted in natural materials,
                clean lines, and a sense of joy and purpose in every space. We
                strive to create environments that embody harmony, happiness,
                and function. Our approach is modern and minimal, yet
                warm—emphasizing light, comfort, and a connection to nature.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-medium text-gray-900 mb-4">
                What We Offer
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Thoughtful Conceptual Design
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Inspiring 3D Modeling & Visualization
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Detailed Construction Drawings
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Permit-Ready Drawing Sets with licensed professionals
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Optional Project Oversight during construction
                </li>
              </ul>
            </div>
          </div>

          {/* About the Founder Section */}
          {founder && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 text-center">
                About the Founder
              </h3>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Photo and Name */}
                <div className="flex-shrink-0 text-center">
                  {founder.photoUrl ? (
                    <img
                      src={founder.photoUrl}
                      alt={founder.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-3"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                      <span className="text-gray-400 text-sm">No photo</span>
                    </div>
                  )}
                  <h4 className="text-lg font-medium text-gray-900">
                    {founder.name}
                  </h4>
                </div>

                {/* Background and More Info */}
                <div className="flex-1 grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-3">
                      Background
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                      {founder.background}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-3">
                      More
                    </h5>
                    <p className="text-gray-600 leading-relaxed">
                      {founder.moreInfo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              Let's create a space that inspires you every day.
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
            © {new Date().getFullYear()} EcoVibe, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}