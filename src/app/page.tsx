export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DL</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Dominio Lector MA</span>
          </div>
          <div className="space-x-4">
            <button className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium">
              Iniciar Sesión
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Registrarse
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Evalúa la lectura con
            <span className="text-indigo-600"> Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automatiza el diagnóstico de fluidez y velocidad lectora. 
            Ahorra horas de trabajo administrativo y enfócate en enseñar.
          </p>
          <button className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition shadow-lg">
            Comenzar Gratis
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Grabación Simple</h3>
            <p className="text-gray-600">
              Graba desde cualquier dispositivo sin instalar nada.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis Inmediato</h3>
            <p className="text-gray-600">
              Detecta velocidad, precisión y entonación en segundos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reportes Visuales</h3>
            <p className="text-gray-600">
              Gráficos de progreso automático para apoderados.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 text-center text-gray-600">
        <p>© 2025 Dominio Lector MA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
