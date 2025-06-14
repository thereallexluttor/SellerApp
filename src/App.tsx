import { Sidebar } from './components/Sidebar'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="transition-all duration-300 ml-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Restaurant Seller App
              </h1>
              <p className="text-xl text-gray-600">
                Sistema de punto de venta para meseros 🍽️
              </p>
            </div>
            
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Órdenes Activas</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    3
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Mesas con órdenes pendientes</p>
                <div className="text-2xl font-bold text-blue-600">Mesa 5, 12, 18</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    2
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Alertas de cocina</p>
                <div className="text-2xl font-bold text-red-600">Orden Lista</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Ventas del Día</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    $2,450
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">Total vendido hoy</p>
                <div className="text-2xl font-bold text-green-600">12 órdenes</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acciones Rápidas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Nueva Orden</h3>
                    <p className="text-gray-600 text-sm">Comenzar una nueva orden</p>
                  </div>
                </button>

                <button className="flex items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Procesar Pago</h3>
                    <p className="text-gray-600 text-sm">Cobrar una orden existente</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                ¿Cómo usar la aplicación?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Para Meseros:</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                      Usa el menú lateral para navegar entre secciones
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                      Toma órdenes desde "Tomar Orden"
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                      Monitorea tus mesas activas
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Características:</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Notificaciones en tiempo real
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Gestión de pagos integrada
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Interfaz responsive
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 