"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DL</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Dominio Lector MA</span>
          </Link>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Evalúa la lectura con <span className="text-indigo-600">Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automatiza el diagnóstico de fluidez y velocidad lectora.
            Ahorra horas de trabajo administrativo y enfócate en enseñar.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition shadow-lg cursor-pointer"
          >
            Comenzar Gratis
          </Link>
        </div>
      </main>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Evaluación Precisa</h3>
          <p className="text-gray-600">
            Analiza la fluidez, precisión y comprensión lectora con IA avanzada.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Resultados Instantáneos</h3>
          <p className="text-gray-600">
            Obtén reportes detallados en segundos, no en horas.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Seguimiento Completo</h3>
          <p className="text-gray-600">
            Monitorea el progreso de cada estudiante a lo largo del tiempo.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2025 Dominio Lector MA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
