import { useState, useEffect } from 'react'
import './animations.css'
import SpotlightCard from './SpotlightCard'
import {
  ClockIcon,
  TableIcon,
  UsersIcon,
  AlertTriangleIcon,
  EyeIcon,
  UserIcon
} from './icons'

interface Order {
  id: string
  tableNumber: number
  items: number
  time: string
  status: 'ready' | 'cooking' | 'pending'
  priority: 'high' | 'medium' | 'low'
  guests?: number
  capacity?: number
}

interface Table {
  number: number
  status: 'occupied' | 'available' | 'payment_pending'
  guests: number
  capacity: number
  orderTotal?: number
  timeOccupied?: string
}

// Componente para el ícono de check personalizado
const CheckIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/Wavy_Check.png" 
    alt="Check" 
    width={size} 
    height={size} 
    className={className}
    style={{ filter: 'invert(0)' }}
  />
)

// Componente para el ícono de cocina personalizado
const CocinaIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/cocina.png" 
    alt="Cocina" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de tarjeta de crédito personalizado
const CreditCardCustomIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/Credit_Card_01.png" 
    alt="Tarjeta de Crédito" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de trending up personalizado
const TrendingUpCustomIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/Trending_Up.png" 
    alt="Trending Up" 
    width={size} 
    height={size} 
    className={className}
  />
)

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - En producción esto vendría de tu API
  const ordersReady: Order[] = [
    { id: '1', tableNumber: 12, items: 4, time: '2m', status: 'ready', priority: 'high', guests: 4, capacity: 4 },
    { id: '2', tableNumber: 8, items: 2, time: '1m', status: 'ready', priority: 'high', guests: 2, capacity: 4 },
    { id: '3', tableNumber: 15, items: 3, time: '3m', status: 'ready', priority: 'medium', guests: 3, capacity: 6 }
  ]

  const ordersCooking: Order[] = [
    { id: '4', tableNumber: 5, items: 2, time: '8m', status: 'cooking', priority: 'medium' },
    { id: '5', tableNumber: 18, items: 1, time: '12m', status: 'cooking', priority: 'low' },
    { id: '6', tableNumber: 7, items: 5, time: '6m', status: 'cooking', priority: 'high' }
  ]

  const ordersPending: Order[] = [
    { id: '7', tableNumber: 22, items: 3, time: '1m', status: 'pending', priority: 'high' },
    { id: '8', tableNumber: 4, items: 2, time: '30s', status: 'pending', priority: 'high' }
  ]

  const paymentPending: Table[] = [
    { number: 9, status: 'payment_pending', guests: 4, capacity: 4, orderTotal: 125.50, timeOccupied: '1h 30m' },
    { number: 14, status: 'payment_pending', guests: 2, capacity: 4, orderTotal: 87.25, timeOccupied: '45m' }
  ]

  const availableTables: Table[] = [
    { number: 1, status: 'available', guests: 0, capacity: 2 },
    { number: 3, status: 'available', guests: 0, capacity: 4 },
    { number: 6, status: 'available', guests: 0, capacity: 6 },
    { number: 11, status: 'available', guests: 0, capacity: 4 },
    { number: 16, status: 'available', guests: 0, capacity: 2 },
    { number: 19, status: 'available', guests: 0, capacity: 8 }
  ]

  const occupiedTables = 8
  const totalTables = occupiedTables + availableTables.length
  const occupancyRate = Math.round((occupiedTables / totalTables) * 100)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'border-green-200 bg-green-50'
      case 'cooking': return 'border-yellow-200 bg-yellow-50'
      case 'pending': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const renderOrderCard = (order: Order, index: number) => (
    <div
      key={order.id}
      className={`group relative p-2 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slideInUp cursor-pointer ${getStatusColor(order.status)}`}
      style={{ 
        animationDelay: `${index * 50}ms`,
        backdropFilter: 'blur(8px)',
        background: `linear-gradient(135deg, ${
          order.status === 'ready' ? 'rgba(240, 253, 244, 0.9), rgba(220, 252, 231, 0.7)' :
          order.status === 'cooking' ? 'rgba(255, 251, 235, 0.9), rgba(254, 240, 138, 0.7)' :
          'rgba(254, 242, 242, 0.9), rgba(252, 165, 165, 0.7)'
        })`
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"
           style={{
             background: `linear-gradient(45deg, ${
               order.status === 'ready' ? '#10b981, #34d399' :
               order.status === 'cooking' ? '#f59e0b, #fbbf24' :
               '#ef4444, #f87171'
             })`
           }}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                {order.tableNumber}
              </div>
            </div>
            <div className="ml-2">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-gray-900 text-xs">Mesa {order.tableNumber}</span>
              </div>
              <div className="flex items-center mt-0.5 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">{order.items}</span>
                  </div>
                  <span className="text-[10px]">platillos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar for cooking orders */}
        {order.status === 'cooking' && (
          <div className="mt-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-0.5">
              <span>Progreso</span>
              <span>~{Math.floor(Math.random() * 40 + 60)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Capacity indicator for ready orders */}
        {order.status === 'ready' && order.guests !== undefined && order.capacity !== undefined && (
          <div className="mt-1.5">
            <div className="flex items-center justify-between text-[9px] text-gray-600 mb-0.5">
              <span>Ocupación</span>
              <span>{order.guests}/{order.capacity} personas</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-1000 ${
                  order.guests / order.capacity > 0.8 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                  order.guests / order.capacity > 0.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-green-400 to-blue-500'
                }`}
                style={{ width: `${(order.guests / order.capacity) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderTableCard = (table: Table, index: number) => (
    <div
      key={table.number}
      className={`group relative p-2 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slideInUp cursor-pointer ${
        table.status === 'payment_pending' 
          ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50' 
          : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50'
      }`}
      style={{ 
        animationDelay: `${index * 50}ms`,
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
        table.status === 'payment_pending' 
          ? 'bg-gradient-to-r from-orange-400 to-yellow-400' 
          : 'bg-gradient-to-r from-blue-400 to-purple-400'
      }`}></div>
      

      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                {table.number}
              </div>
            </div>
            <div className="ml-2">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-gray-900 text-xs">Mesa {table.number}</span>
              </div>
              <div className="flex items-center mt-0.5 space-x-2">
                {table.orderTotal && (
                  <div className="flex items-center space-x-1 text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">$</span>
                    </div>
                    <span className="font-bold text-green-700 text-[10px]">${table.orderTotal}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Capacity indicator */}
        <div className="mt-1.5">
          <div className="flex items-center justify-between text-[9px] text-gray-600 mb-0.5">
            <span>Ocupación</span>
            <span>{table.guests}/{table.capacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                table.guests / table.capacity > 0.8 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                table.guests / table.capacity > 0.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-green-400 to-blue-500'
              }`}
              style={{ width: `${(table.guests / table.capacity) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <UserIcon size={24} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 animate-fadeInSlide">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            Dashboard de Operaciones
          </h1>
          <p className="text-gray-600 font-medium">
            Vista en tiempo real del restaurante • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="flex gap-4 mb-8 justify-center">
          <div className="w-48">
            {/* Listas para Servir - Verde */}
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-green-100 backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200" style={{ animationDelay: '0ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <CheckIcon size={18} className="opacity-80" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">Listas para Servir</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>{ordersReady.length}</p>
                  <p className="text-xs font-normal text-black">órdenes completadas</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-48">
            {/* En Cocina - Amarillo */}
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-yellow-100 backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <CocinaIcon size={16} className="opacity-80" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">En Cocina</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>{ordersCooking.length + ordersPending.length}</p>
                  <p className="text-xs font-normal text-black">en preparación</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-48">
            {/* Por Pagar - Naranja */}
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-orange-100 backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <CreditCardCustomIcon size={18} className="opacity-80" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">Por Pagar</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>{paymentPending.length}</p>
                  <p className="text-xs font-normal text-black">mesas esperando</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-48">
            {/* Ocupación - Azul */}
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-blue-100 backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <TrendingUpCustomIcon size={18} className="opacity-80" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">Ocupación</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>{occupancyRate}%</p>
                  <p className="text-xs font-normal text-black">del restaurante</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Estado de Mesas */}
        <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp mb-8 max-w-[820px] mx-auto" style={{ animationDelay: '350ms' }}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TableIcon size={18} className="text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800 text-sm">Estado de Mesas</h3>
              </div>
              <div className="flex items-center space-x-6 text-xs">
                <span className="text-gray-600">
                  Disponibles: <span className="font-medium text-green-600">{availableTables.length}</span>
                </span>
                <span className="text-gray-600">
                  Ocupadas: <span className="font-medium text-blue-600">{occupiedTables}</span>
                </span>
                <span className="text-gray-600">
                  Total: <span className="font-medium text-gray-800">{totalTables}</span>
                </span>
                <span className="text-sm font-semibold text-gray-700 ml-4">{occupancyRate}% ocupación</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex gap-6 mb-8 justify-center mx-auto">
          {/* Órdenes Listas para Servir */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '400ms', width: '300px', minWidth: '300px' }}>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckIcon size={18} className="mr-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">Listas para Servir</h3>
                </div>
                <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-100">
                  {ordersReady.length}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Órdenes completadas por cocina</p>
            </div>
            <div className="p-3 max-h-[600px] overflow-y-auto">
              {ordersReady.length > 0 ? (
                <div className="space-y-2">
                  {ordersReady.map((order, index) => renderOrderCard(order, index))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No hay órdenes listas</p>
                </div>
              )}
            </div>
          </div>

          {/* Órdenes en Cocina */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '500ms', width: '520px', minWidth: '520px' }}>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CocinaIcon size={14} className="mr-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">En Cocina</h3>
                </div>
                <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs font-medium border border-yellow-100">
                  {ordersCooking.length + ordersPending.length}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">En preparación y pendientes</p>
            </div>
            <div className="p-3 max-h-[600px] overflow-y-auto kitchen-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {/* Columna Pendientes */}
                <div>
                  <div className="flex items-center text-xs font-medium text-red-600 mb-2">
                    <AlertTriangleIcon size={12} className="mr-1" />
                    PENDIENTES ({ordersPending.length})
                  </div>
                  <div className="space-y-2">
                    {ordersPending.length > 0 ? (
                      ordersPending.map((order, index) => renderOrderCard(order, index))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        <p className="text-xs">Sin órdenes pendientes</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Columna En Preparación */}
                <div>
                  <div className="flex items-center text-xs font-medium text-yellow-600 mb-2">
                    <ClockIcon size={12} className="mr-1" />
                    EN PREPARACIÓN ({ordersCooking.length})
                  </div>
                  <div className="space-y-2">
                    {ordersCooking.length > 0 ? (
                      ordersCooking.map((order, index) => renderOrderCard(order, index))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        <p className="text-xs">Sin órdenes en preparación</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mesas por Pagar */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '600ms', width: '300px', minWidth: '300px' }}>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCardCustomIcon size={18} className="mr-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">Por Pagar</h3>
                </div>
                <span className="bg-orange-50 text-orange-800 px-2 py-1 rounded text-xs font-medium border border-orange-100">
                  {paymentPending.length}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Mesas esperando el pago</p>
            </div>
            <div className="p-3 max-h-[600px] overflow-y-auto">
              {paymentPending.length > 0 ? (
                <div className="space-y-2">
                  {paymentPending.map((table, index) => renderTableCard(table, index))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCardCustomIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No hay pagos pendientes</p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  )
} 