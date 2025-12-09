'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  full_name: string;
  role: string;
  school: string | null;
  email?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'teacher',
    school: ''
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

      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;


      setUsers(data as User[]);
      );


    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Actualizar usuario existente
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            school: formData.school || null
          })
          .eq('id', editingUser.id);

        if (error) throw error;

        alert('Usuario actualizado exitosamente');
        resetForm();
        loadUsers();
      } catch (error) {
        console.error('Error actualizando usuario:', error);
        alert('Error al actualizar usuario');
      }
    } else {
      // Crear nuevo usuario
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: Math.random().toString(36).slice(-8) + 'Aa1!',
          options: {
            data: {
              full_name: formData.full_name
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: formData.full_name,
              role: formData.role,
              school: formData.school || null,
              email: formData.email
            });

          if (profileError) throw profileError;

          alert('Usuario creado exitosamente. Se envió un email de confirmación.');
          resetForm();
          loadUsers();
        }
      } catch (error: any) {
        console.error('Error creando usuario:', error);
        alert('Error al crear usuario: ' + error.message);
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email || '',
      role: user.role,
      school: user.school || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('Usuario eliminado exitosamente');
      loadUsers();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      role: 'teacher',
      school: ''
    });
    setEditingUser(null);
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
          <h1 className="text-3xl font-bold text-indigo-900">Usuarios</h1>
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
            {showForm ? 'Cancelar' : '+ Crear Nuevo Usuario'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
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

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Rol *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="teacher">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Colegio</label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
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
          <h2 className="text-xl font-bold mb-4">Usuarios Registrados ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 text-sm font-medium text-gray-600">NOMBRE</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">EMAIL</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">ROL</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">COLEGIO</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.full_name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">{user.role}</td>
                    <td className="py-3">{user.school || '-'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
