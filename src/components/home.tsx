import React from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import ProjectGallery from "./ProjectGallery";
import { Button } from "./ui/button";
import { Instagram } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Link } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";

const Home = () => {
  const { projects, categories, projectTypes } = useProjects();

  // Only use real projects from database, no fallback stock images
  const hasRealProjects = projects && projects.length > 0;
  const featuredProject = hasRealProjects ? projects[0] : null;
  const secondFeaturedProject = hasRealProjects && projects.length > 1 ? projects[1] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="container mx-auto py-4 sm:py-6 px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="EcoVibe Design"
            className="h-12 sm:h-10 w-auto mr-3"
          />
          <h1 className="text-3xl sm:text-2xl font-bold text-center sm:text-left">
            EcoVibe Design
          </h1>
        </div>

        {/* Mobile-friendly navigation - hidden on small screens, shown as hamburger menu would be ideal */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  href="/"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] sm:w-[500px] gap-3 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-2">
                        <h3 className="font-medium leading-none">Categories</h3>
                        <p className="text-sm text-muted-foreground pt-1">
                          Browse by room type
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {categories
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((category) => (
                              <button
                                key={category.id}
                                onClick={() => {
                                  const element =
                                    document.querySelector("#projects");
                                  if (element) {
                                    element.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                  }
                                }}
                                className="block p-2 hover:bg-muted rounded-md text-left w-full"
                              >
                                {category.label}
                              </button>
                            ))}
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium leading-none">
                          Project Types
                        </h3>
                        <p className="text-sm text-muted-foreground pt-1">
                          Browse by project type
                        </p>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {projectTypes.map((projectType) => (
                            <button
                              key={projectType.id}
                              onClick={() => {
                                const element =
                                  document.querySelector("#projects");
                                if (element) {
                                  element.scrollIntoView({
                                    behavior: "smooth",
                                  });
                                }
                              }}
                              className="block p-2 hover:bg-muted rounded-md text-left w-full"
                            >
                              {projectType.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  className={navigationMenuTriggerStyle()}
                  onClick={() => {
                    const element = document.querySelector("#about");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  About Us
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  className={navigationMenuTriggerStyle()}
                  onClick={() => {
                    const element = document.querySelector("#contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Contact
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Button className="w-full sm:w-auto text-sm sm:text-base" asChild>
          <a href="tel:+13522142078">Call for Consultation</a>
        </Button>
      </header>

      {/* Hero Section with Featured Before/After */}
      <section className="container mx-auto py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Transforming Spaces
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
            See the difference our design expertise can make with our stunning
            before and after transformations.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {hasRealProjects ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {featuredProject && (
                <div className="space-y-4">
                  <BeforeAfterSlider
                    beforeImage={featuredProject.before_image_1}
                    afterImage={featuredProject.after_image_1}
                    beforeAlt={`Before ${featuredProject.title}`}
                    afterAlt={`After ${featuredProject.title}`}
                    className="h-[300px] sm:h-[400px]"
                  />
                  <div className="text-center lg:text-left px-4 lg:px-0">
                    <h3 className="text-xl sm:text-2xl font-semibold">
                      {featuredProject.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                      {featuredProject.description}
                    </p>
                  </div>
                </div>
              )}

              {secondFeaturedProject && (
                <div className="space-y-4">
                  <BeforeAfterSlider
                    beforeImage={secondFeaturedProject.before_image_1}
                    afterImage={secondFeaturedProject.after_image_1}
                    beforeAlt={`Before ${secondFeaturedProject.title}`}
                    afterAlt={`After ${secondFeaturedProject.title}`}
                    className="h-[300px] sm:h-[400px]"
                  />
                  <div className="text-center lg:text-left px-4 lg:px-0">
                    <h3 className="text-xl sm:text-2xl font-semibold">
                      {secondFeaturedProject.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                      {secondFeaturedProject.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Welcome! Use the admin panel to add your first project and showcase your work.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Project Gallery Section */}
      <section id="projects" className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Our Project Gallery
            </h2>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              Browse our collection of successful transformations across various
              spaces.
            </p>
          </div>

          <ProjectGallery />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="container mx-auto py-12 sm:py-16 lg:py-20 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            About EcoVibe Design
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            We are passionate designers dedicated to creating beautiful,
            functional spaces that reflect your personal style and meet your
            practical needs. With years of experience in residential and
            commercial design, we transform ordinary spaces into extraordinary
            environments.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section
        id="contact"
        className="container mx-auto py-12 sm:py-16 lg:py-20 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Contact us today to schedule a consultation and start your journey
            to a beautifully designed home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <a href="tel:+13522142078">Call for Consultation</a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View More Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 pb-20 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>Email: Shabnam.Rumpf@ecovibe.com</p>
                <p>
                  Phone:{" "}
                  <a
                    href="tel:+13522142078"
                    className="text-gray-400 hover:text-white"
                  >
                    (352) 214-2078
                  </a>
                </p>
              </address>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <a
                href="https://www.instagram.com/ecovibe.design/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                @ecovibe.design
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Ecovibe, LLC. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;