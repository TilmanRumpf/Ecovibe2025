import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DatabaseCheck() {
  const [projects, setProjects] = useState<any[]>([]);
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
          setError(error.message);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div className="p-4">Loading database...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Database Check</h1>
      <p className="mb-4">Found {projects.length} projects in database:</p>
      
      {projects.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-yellow-800">No projects found in database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-600">ID: {project.id}</p>
              <p className="text-sm text-gray-600">Category: {project.category}</p>
              <p className="text-sm text-gray-600">Created: {new Date(project.created_at).toLocaleString()}</p>
              <div className="mt-2">
                <p className="text-sm">Before Image: {project.before_image_1 ? '✅ Present' : '❌ Missing'}</p>
                <p className="text-sm">After Image: {project.after_image_1 ? '✅ Present' : '❌ Missing'}</p>
                {project.before_image_1 && (
                  <img src={project.before_image_1} alt="Before" className="w-32 h-24 object-cover mt-2 rounded" />
                )}
                {project.after_image_1 && (
                  <img src={project.after_image_1} alt="After" className="w-32 h-24 object-cover mt-2 rounded" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}