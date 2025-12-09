'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface Course {
  id: string;
  name: string;
  grade_level: string;
  description: string | null;
  created_at?: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade_level: '',
    description: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      loadCourses();
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    }
  };

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(data as Course[]);
    } catch (error) {
      console.error('Error cargando cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourse) {
      // Actualizar curso existente
      try {
        const { error } = await supabase
          .from('courses')
          .update({
            name: formData.name,
            grade_level: formData.grade_level,
            description: formData.description || null
          })
          .eq('id', editingCourse.id);

        if (error) throw error;

        alert('Curso actualizado exitosamente');
        resetForm();
        loadCourses();
      } catch (error) {
        console.error('Error actualizando curso:', error);
        alert('Error al actualizar curso');
      }
    } else {
      // Crear nuevo curso
      try {
        const { error } = await supabase
          .from('courses')
          .insert({
            name: formData.name,
            grade_level: formData.grade_level,
            description: formData.description || null
          });

        if (error) throw error;

        alert('Curso creado exitosamente');
        resetForm();
        loadCourses();
      } catch (error: any) {
        console.error('Error creando curso:', error);
        alert('Error al crear curso: ' + error.message);
      }
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      grade_level: course.grade_level,
      description: course.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      alert('Curso eliminado exitosamente');
      loadCourses();
    } catch (error) {
      console.error('Error eliminando curso:', error);
      alert('Error al eliminar curso');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      grade_level: '',
      description: ''
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Cursos</h1>
          <Link 
            href="/admin" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Volver
          </Link>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {showForm ? 'Cancelar' : '+ Crear Nuevo Curso'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Curso *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Grado *</label>
                <input
                  type="text"
                  value={formData.grade_level}
                  onChange={(e) => setFormData({...formData, grade_level: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Ej: 1° Básico, 3° Medio"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingCourse ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Cursos Registrados ({courses.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 text-sm font-medium text-gray-600">NOMBRE</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">GRADO</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">DESCRIPCIÓN</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b">
                    <td className="py-3">{course.name}</td>
                    <td className="py-3">{course.grade_level}</td>
                    <td className="py-3">{course.description || '-'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
