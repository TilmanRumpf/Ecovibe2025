import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectGallery from './ProjectGallery';
import ContactForm from './ContactForm';
import { Button } from './ui/button';

interface Project {
  id: string;
  title: string;
  category: string;
  before_image_1: string;
  after_image_1: string;
  description: string;
  duration: string;
  budget_range: string;
  materials: string[];
  hero: boolean;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Database error:', error);
          setError(error.message);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to connect to database');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Show the main content even if database fails
  const heroProject = projects.find(p => p.hero) || projects[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6">
            Transforming Spaces
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
            Creating beautiful, functional interiors that reflect your unique style
          </p>
          
          {/* Show hero project if available */}
          {heroProject && !loading && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img 
                  src={heroProject.after_image_1} 
                  alt={heroProject.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-white text-xl font-medium">{heroProject.title}</h3>
                  <p className="text-white/90 text-sm">{heroProject.category}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Show loading state */}
          {loading && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-gray-200 animate-pulse rounded-lg h-64 md:h-80"></div>
              <p className="text-gray-500 mt-4">Loading projects...</p>
            </div>
          )}
          
          {/* Show error state but don't block the page */}
          {error && !loading && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-gray-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Portfolio coming soon</p>
                  <p className="text-sm text-gray-500">Database connection: {error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Recent Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our latest interior design transformations
            </p>
          </div>
          
          <ProjectGallery />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Let's Create Something Beautiful
            </h2>
            <p className="text-xl text-gray-600">
              Ready to transform your space? Get in touch for a consultation.
            </p>
          </div>
          
          <ContactForm />
        </div>
      </section>
    </div>
  );
}