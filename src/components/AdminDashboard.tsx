import { useState, useEffect } from 'react'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import { useConfig } from '../contexts/ConfigContext'
import {
  ClockIcon,
  TableIcon,
  UsersIcon,
  AlertTriangleIcon,
  EyeIcon,
  UserIcon,
  TrendingUpIcon,
  DollarSignIcon
} from './icons'

interface SalesData {
  today: number
  week: number
  month: number
  year: number
}

interface EmployeeStats {
  id: string
  name: string
  role: string
  servicesCount: number
  totalTips: number
  avgServiceTime: string
  rating: number
  sales: number
}

interface DishStats {
  name: string
  orders: number
  revenue: number
  category: string
  trend: 'up' | 'down' | 'stable'
}

interface CustomerStats {
  totalToday: number
  totalWeek: number
  totalMonth: number
  avgTableTime: string
  returnRate: number
  satisfaction: number
}

// Componentes de iconos personalizados
const MoneyIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Credit_Card_01.png" 
    alt="Dinero" 
    width={size} 
    height={size} 
    className={className}
  />
)

const TrendingUpCustomIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Trending_Up.png" 
    alt="Trending Up" 
    width={size} 
    height={size} 
    className={className}
  />
)

const StarIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { formatCurrency, getFontSizeClass } = useConfig()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - En producción vendría de tu API
  const salesData: SalesData = {
    today: 2847.60,
    week: 18456.80,
    month: 78234.50,
    year: 892456.75
  }

  const customerStats: CustomerStats = {
    totalToday: 127,
    totalWeek: 834,
    totalMonth: 3456,
    avgTableTime: "1h 23m",
    returnRate: 68,
    satisfaction: 4.7
  }

  const employeeStats: EmployeeStats[] = [
    {
      id: '1',
      name: 'Carlos Martínez',
      role: 'Mesero Senior',
      servicesCount: 23,
      totalTips: 145.50,
      avgServiceTime: '18m',
      rating: 4.8,
      sales: 1234.50
    },
    {
      id: '2',
      name: 'Ana López',
      role: 'Mesera',
      servicesCount: 19,
      totalTips: 98.20,
      avgServiceTime: '22m',
      rating: 4.6,
      sales: 987.30
    },
    {
      id: '3',
      name: 'Miguel Rodríguez',
      role: 'Mesero',
      servicesCount: 21,
      totalTips: 134.80,
      avgServiceTime: '20m',
      rating: 4.7,
      sales: 1156.20
    },
    {
      id: '4',
      name: 'Laura Santos',
      role: 'Supervisora',
      servicesCount: 15,
      totalTips: 189.50,
      avgServiceTime: '16m',
      rating: 4.9,
      sales: 1567.80
    },
    {
      id: '5',
      name: 'David Pérez',
      role: 'Mesero',
      servicesCount: 18,
      totalTips: 112.40,
      avgServiceTime: '24m',
      rating: 4.5,
      sales: 876.90
    }
  ]

  const topDishes: DishStats[] = [
    { name: 'Paella Valenciana', orders: 34, revenue: 982.60, category: 'Principales', trend: 'up' },
    { name: 'Jamón Ibérico', orders: 28, revenue: 977.20, category: 'Entrantes', trend: 'up' },
    { name: 'Chuletón Ibérico', orders: 19, revenue: 872.10, category: 'Principales', trend: 'stable' },
    { name: 'Lubina a la Sal', orders: 16, revenue: 686.40, category: 'Principales', trend: 'up' },
    { name: 'Crema Catalana', orders: 25, revenue: 322.50, category: 'Postres', trend: 'down' }
  ]

  const leastPopularDishes: DishStats[] = [
    { name: 'Gazpacho', orders: 3, revenue: 29.70, category: 'Entrantes', trend: 'down' },
    { name: 'Agua Mineral', orders: 8, revenue: 36.00, category: 'Bebidas', trend: 'stable' },
    { name: 'Flan Casero', orders: 5, revenue: 44.50, category: 'Postres', trend: 'down' },
    { name: 'Ensalada César', orders: 4, revenue: 67.60, category: 'Entrantes', trend: 'down' }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➖'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div 
      className={`h-full overflow-y-auto bg-gray-50 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`}
    >
      <div className="p-4 lg:p-6">
        {/* Stats Overview - Combined */}
        <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp mb-8" style={{ animationDelay: '0ms' }}>
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resumen de Ventas */}
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-3">Resumen de Ventas</h2>
                <div className="flex justify-center gap-3 flex-wrap">
                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-green-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-green-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Hoy</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(salesData.today)}</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Ventas del día</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-blue-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-blue-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '150ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Semana</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(salesData.week)}</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Últimos 7 días</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-orange-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-orange-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Mes</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(salesData.month)}</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Mes actual</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-purple-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-purple-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '250ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Año</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(salesData.year)}</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Año en curso</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>

              {/* Estadísticas de Comensales */}
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-3">Estadísticas de Comensales</h2>
                <div className="flex justify-center gap-3 flex-wrap">
                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-cyan-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-cyan-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Hoy</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{customerStats.totalToday}</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Comensales</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-teal-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-teal-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '350ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Tiempo Mesa</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{customerStats.avgTableTime}</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Promedio</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-emerald-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-emerald-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '400ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Clientes Fieles</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{customerStats.returnRate}%</p>
                    </div>
                          <p className="text-xs font-normal text-black leading-tight">Retorno</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

                  <div className="w-36">
              <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                      <div className="bg-yellow-100 backdrop-blur-sm rounded-[8px] px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-yellow-300 h-24 flex flex-col justify-between config-font-medium" style={{ animationDelay: '450ms', backdropFilter: 'blur(10px)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col justify-between h-full">
                          <h3 className="font-medium text-black text-xs leading-tight">Satisfacción</h3>
                    <div className="flex flex-col items-center justify-center flex-1">
                            <p className="text-lg font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{customerStats.satisfaction}/5</p>
                          </div>
                          <p className="text-xs font-normal text-black leading-tight">Calificación</p>
                        </div>
                    </div>
                    </SpotlightCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen del Personal */}
        <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp mb-8" style={{ animationDelay: '500ms' }}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon size={18} className="text-purple-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-800">Resumen del Personal - Día Actual</h3>
              </div>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-[8px] p-4 border border-blue-300">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Total Servicios</h4>
                <p className="text-2xl font-bold text-blue-900">
                  {employeeStats.reduce((sum, emp) => sum + emp.servicesCount, 0)}
                </p>
                <p className="text-xs text-blue-600">Atenciones completadas</p>
              </div>
              <div className="bg-green-50 rounded-[8px] p-4 border border-green-300">
                <h4 className="text-sm font-medium text-green-800 mb-2">Total Propinas</h4>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(employeeStats.reduce((sum, emp) => sum + emp.totalTips, 0))}
                </p>
                <p className="text-xs text-green-600">Propinas del día</p>
              </div>
              <div className="bg-purple-50 rounded-[8px] p-4 border border-purple-300">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Ventas Generadas</h4>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(employeeStats.reduce((sum, emp) => sum + emp.sales, 0))}
                </p>
                <p className="text-xs text-purple-600">Por el equipo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Empleados Performance */}
          <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp" style={{ animationDelay: '600ms' }}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserIcon size={18} className="text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-800">Rendimiento Empleados</h3>
                </div>
                <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                  Hoy
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Servicios y propinas del día</p>
            </div>
            <div className="p-4 h-[400px] overflow-y-auto kitchen-scrollbar">
              <div className="space-y-3">
                {employeeStats.map((employee, index) => (
                  <div key={employee.id} className="bg-gray-50 rounded-[8px] p-3 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-center w-full">
                        <h4 className="font-semibold text-gray-900 text-sm text-center">{employee.name}</h4>
                        <p className="text-xs text-gray-600 text-center">{employee.role}</p>
                      </div>
                      <div className="flex items-center">
                        <StarIcon size={12} className="text-yellow-500 mr-1" />
                        <span className="text-xs font-medium text-gray-700">{employee.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Servicios:</span>
                        <span className="font-medium ml-1">{employee.servicesCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Propinas:</span>
                        <span className="font-medium ml-1 text-green-600">{formatCurrency(employee.totalTips)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tiempo Prom:</span>
                        <span className="font-medium ml-1">{employee.avgServiceTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ventas:</span>
                        <span className="font-medium ml-1 text-blue-600">{formatCurrency(employee.sales)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platos Más Populares */}
          <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp" style={{ animationDelay: '700ms' }}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUpCustomIcon size={18} className="mr-2" />
                  <h3 className="text-sm font-medium text-gray-800">Platos Favoritos</h3>
                </div>
                <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-100">
                  Top 5
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Los más pedidos hoy</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {topDishes.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-xs font-bold text-green-700">#{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{dish.name}</h4>
                        <p className="text-xs text-gray-500">{dish.category}</p>
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="flex items-center">
                        <span className={`text-xs mr-1 ${getTrendColor(dish.trend)}`}>
                          {getTrendIcon(dish.trend)}
                        </span>
                        <span className="font-medium text-sm">{dish.orders}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">{formatCurrency(dish.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platos Menos Populares */}
          <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp" style={{ animationDelay: '800ms' }}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangleIcon size={18} className="text-orange-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-800">Oportunidades</h3>
                </div>
                <span className="bg-orange-50 text-orange-800 px-2 py-1 rounded text-xs font-medium border border-orange-100">
                  Mejorar
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Platos con menor demanda</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {leastPopularDishes.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-xs font-bold text-orange-700">⚠️</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{dish.name}</h4>
                        <p className="text-xs text-gray-500">{dish.category}</p>
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="flex items-center">
                        <span className={`text-xs mr-1 ${getTrendColor(dish.trend)}`}>
                          {getTrendIcon(dish.trend)}
                        </span>
                        <span className="font-medium text-sm">{dish.orders}</span>
                      </div>
                      <p className="text-xs text-red-600 font-medium">{formatCurrency(dish.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-100">
                <p className="text-xs text-orange-700">
                  💡 <strong>Sugerencia:</strong> Considera promociones especiales o revisar recetas para estos platos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}