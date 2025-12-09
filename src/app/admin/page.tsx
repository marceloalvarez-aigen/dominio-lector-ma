'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Verificar rol de admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUserRole(profile.role);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
              DL Admin
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Volver al Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">Gestiona usuarios, establecimientos, cursos y estudiantes</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'users', label: 'Usuarios' },
              { id: 'schools', label: 'Establecimientos' },
              { id: 'courses', label: 'Cursos' },
              { id: 'students', label: 'Estudiantes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
              <p className="text-gray-600 mb-4">Aquí podrás crear y gestionar usuarios del sistema.</p>
              <Link
                href="/admin/users"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Gestionar Usuarios
              </Link>
            </div>
          )}

          {activeTab === 'schools' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Gestión de Establecimientos</h2>
              <p className="text-gray-600 mb-4">Crea y administra los colegios registrados en el sistema.</p>
              <Link
                href="/admin/schools"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Gestionar Establecimientos
              </Link>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Gestión de Cursos</h2>
              <p className="text-gray-600 mb-4">Administra los cursos y grados del sistema.</p>
              <Link
                href="/admin/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Gestionar Cursos
              </Link>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Gestión de Estudiantes</h2>
              <p className="text-gray-600 mb-4">Registra y administra los estudiantes del sistema.</p>
              <Link
                href="/admin/students"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Gestionar Estudiantes
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
