'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface Student {
  id: string;
  full_name: string;
  rut: string;
  birth_date: string;
  course_id?: string;
  created_at?: string;
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    rut: '',
    birth_date: '',
    course_id: ''
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

      loadStudents();
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStudents(data as Student[]);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent) {
      // Actualizar estudiante existente
      try {
        const { error } = await supabase
          .from('students')
          .update({
            full_name: formData.full_name,
            rut: formData.rut,
            birth_date: formData.birth_date,
            course_id: formData.course_id || null
          })
          .eq('id', editingStudent.id);

        if (error) throw error;

        alert('Estudiante actualizado exitosamente');
        resetForm();
        loadStudents();
      } catch (error) {
        console.error('Error actualizando estudiante:', error);
        alert('Error al actualizar estudiante');
      }
    } else {
      // Crear nuevo estudiante
      try {
        const { error } = await supabase
          .from('students')
          .insert({
            full_name: formData.full_name,
            rut: formData.rut,
            birth_date: formData.birth_date,
            course_id: formData.course_id || null
          });

        if (error) throw error;

        alert('Estudiante creado exitosamente');
        resetForm();
        loadStudents();
      } catch (error: any) {
        console.error('Error creando estudiante:', error);
        alert('Error al crear estudiante: ' + error.message);
      }
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name,
      rut: student.rut,
      birth_date: student.birth_date,
      course_id: student.course_id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      alert('Estudiante eliminado exitosamente');
      loadStudents();
    } catch (error) {
      console.error('Error eliminando estudiante:', error);
      alert('Error al eliminar estudiante');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      rut: '',
      birth_date: '',
      course_id: ''
    });
    setEditingStudent(null);
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
          <h1 className="text-3xl font-bold text-indigo-900">Estudiantes</h1>
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
            {showForm ? 'Cancelar' : '+ Crear Nuevo Estudiante'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">RUT *</label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Ej: 12345678-9"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ID del Curso</label>
                <input
                  type="text"
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Opcional"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingStudent ? 'Actualizar' : 'Crear'}
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
          <h2 className="text-xl font-bold mb-4">Estudiantes Registrados ({students.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 text-sm font-medium text-gray-600">NOMBRE</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">RUT</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">FECHA NACIMIENTO</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="py-3">{student.full_name}</td>
                    <td className="py-3">{student.rut}</td>
                    <td className="py-3">{student.birth_date}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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
