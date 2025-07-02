import { useState, useEffect } from 'react'
import { useConfig } from '../contexts/ConfigContext'
import { useAuth } from '../contexts/AuthContext'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import {
  ClockIcon,
  UserIcon,
  CheckIcon,
  PlayIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  LogOutIcon
} from './icons'

interface OrderItem {
  id: string
  name: string
  category: string
  quantity: number
  price: number
  notes?: string
}

interface Order {
  id: string
  table: number
  guests: number
  items: OrderItem[]
  status: 'new' | 'in-preparation' | 'ready'
  timestamp: string
}

// Componente para el ícono de chef personalizado
const ChefIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/cocina.png" 
    alt="Chef" 
    width={size} 
    height={size} 
    className={className}
  />
)

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: Order['status']) => void
}

function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const { t, formatCurrency } = useConfig()
  const orderTime = new Date(order.timestamp)
  const now = new Date()
  const timeDiff = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60)) // minutos
  
  const getTimeColor = (minutes: number) => {
    if (minutes < 5) return 'text-green-600'
    if (minutes < 15) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColors = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return {
          bg: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100/50',
          accent: 'bg-red-500'
        }
      case 'in-preparation':
        return {
          bg: 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50',
          accent: 'bg-yellow-500'
        }
      case 'ready':
        return {
          bg: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50',
          accent: 'bg-green-500'
        }
    }
  }

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'new':
        return 'in-preparation'
      case 'in-preparation':
        return 'ready'
      case 'ready':
        return null
    }
  }

  const getNextStatusText = (currentStatus: Order['status']): string => {
    switch (currentStatus) {
      case 'new':
        return 'Iniciar Preparación'
      case 'in-preparation':
        return 'Marcar como Lista'
      case 'ready':
        return 'Completada'
    }
  }

  const getNextStatusIcon = (currentStatus: Order['status']) => {
    switch (currentStatus) {
      case 'new':
        return <PlayIcon size={16} />
      case 'in-preparation':
        return <CheckIcon size={16} />
      case 'ready':
        return <CheckIcon size={16} />
    }
  }

  const colors = getStatusColors(order.status)
  const nextStatus = getNextStatus(order.status)

  // Agrupar items por categoría para mejor visualización
  const itemsByCategory = order.items.reduce((acc, item) => {
    const category = item.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof order.items>)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'entrantes':
        return '🥗'
      case 'principales':
        return '🍖'
      case 'postres':
        return '🍰'
      case 'bebidas':
        return '🍷'
      default:
        return '🍽️'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'entrantes':
        return 'Entrantes'
      case 'principales':
        return 'Principales'
      case 'postres':
        return 'Postres'
      case 'bebidas':
        return 'Bebidas'
      default:
        return 'Otros'
    }
  }

  const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div 
      className={`group relative p-3 rounded border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${colors.bg}`}
      style={{ 
        maxWidth: '320px',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"
           style={{
             background: `linear-gradient(45deg, ${
               order.status === 'ready' ? '#10b981, #34d399' :
               order.status === 'in-preparation' ? '#f59e0b, #fbbf24' :
               '#ef4444, #f87171'
             })`
           }}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded flex items-center justify-center font-bold shadow-md">
              <span className="text-xs">{order.table}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Mesa {order.table}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <UserIcon size={12} className="mr-1" />
                {order.guests} {order.guests === 1 ? 'persona' : 'personas'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getTimeColor(timeDiff)}`}>
              <ClockIcon size={12} className="inline mr-1" />
              {timeDiff === 0 ? 'Ahora' : `${timeDiff}m`}
            </div>
            <p className="text-xs text-gray-500">
              {orderTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        {/* Items por categoría */}
        <div className="space-y-3 mb-4">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">{getCategoryIcon(category)}</span>
                <h4 className="font-semibold text-gray-800 text-sm">{getCategoryName(category)}</h4>
                <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="space-y-1">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <span className="text-gray-900 font-medium truncate block">{item.name}</span>
                      {item.notes && (
                        <span className="text-gray-500 text-xs italic block">Nota: {item.notes}</span>
                      )}
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="mb-4 pt-2 border-t border-gray-200/50">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 text-sm">Total de la Orden</span>
            <span className="font-bold text-gray-800 text-sm">{formatCurrency(orderTotal)}</span>
          </div>
        </div>

        {/* Action Button */}
        {nextStatus && (
          <button
            onClick={() => onStatusChange(order.id, nextStatus)}
            className={`w-full text-white font-bold py-2 px-4 rounded transition-all duration-200 flex items-center justify-center space-x-2 ${
              order.status === 'new' 
                ? 'bg-red-500 hover:bg-red-600' 
                : order.status === 'in-preparation'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {getNextStatusIcon(order.status)}
            <span>{getNextStatusText(order.status)}</span>
            <ArrowRightIcon size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export function KitchenDashboard() {
  const { t, getFontSizeClass, formatCurrency } = useConfig()
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Datos simulados para el dashboard de cocina
  const [newOrders, setNewOrders] = useState<Order[]>([
    {
      id: 'new-1',
      table: 15,
      guests: 4,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutos atrás
      status: 'new',
      items: [
        { id: '1', name: 'Paella Valenciana', category: 'principales', quantity: 2, price: 28.90, notes: 'Sin mariscos' },
        { id: '2', name: 'Sangría', category: 'bebidas', quantity: 1, price: 18.50 },
        { id: '3', name: 'Pan de Ajo', category: 'entrantes', quantity: 1, price: 8.50 }
      ]
    },
    {
      id: 'new-2',
      table: 22,
      guests: 2,
      timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minuto atrás
      status: 'new',
      items: [
        { id: '4', name: 'Salmón a la Plancha', category: 'principales', quantity: 1, price: 32.90 },
        { id: '5', name: 'Ensalada César', category: 'entrantes', quantity: 1, price: 16.90, notes: 'Sin crutones' },
        { id: '6', name: 'Agua Mineral', category: 'bebidas', quantity: 2, price: 4.50 }
      ]
    },
    {
      id: 'new-3',
      table: 8,
      guests: 6,
      timestamp: new Date(Date.now() - 30 * 1000).toISOString(), // 30 segundos atrás
      status: 'new',
      items: [
        { id: '7', name: 'Chuletón Ibérico', category: 'principales', quantity: 2, price: 45.90 },
        { id: '8', name: 'Patatas Bravas', category: 'entrantes', quantity: 2, price: 12.90 },
        { id: '9', name: 'Vino Tinto Reserva', category: 'bebidas', quantity: 1, price: 32.90 },
        { id: '10', name: 'Flan Casero', category: 'postres', quantity: 3, price: 8.90 }
      ]
    },
    {
      id: 'new-4',
      table: 33,
      guests: 3,
      timestamp: new Date(Date.now() - 45 * 1000).toISOString(),
      status: 'new',
      items: [
        { id: '11', name: 'Pizza Margherita', category: 'principales', quantity: 1, price: 24.90 },
        { id: '12', name: 'Bruschetta', category: 'entrantes', quantity: 1, price: 12.90 },
        { id: '13', name: 'Tiramisu', category: 'postres', quantity: 2, price: 14.90 }
      ]
    },
    {
      id: 'new-5',
      table: 41,
      guests: 8,
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      status: 'new',
      items: [
        { id: '14', name: 'Mariscada del Chef', category: 'principales', quantity: 1, price: 78.90 },
        { id: '15', name: 'Pulpo a la Gallega', category: 'entrantes', quantity: 1, price: 28.90 },
        { id: '16', name: 'Albariño', category: 'bebidas', quantity: 2, price: 31.90 },
        { id: '17', name: 'Crema Catalana', category: 'postres', quantity: 4, price: 12.90 }
      ]
    }
  ])

  const [inPreparationOrders, setInPreparationOrders] = useState<Order[]>([
    {
      id: 'prep-1',
      table: 12,
      guests: 4,
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      status: 'in-preparation',
      items: [
        { id: '18', name: 'Cochinillo Asado', category: 'principales', quantity: 1, price: 48.90 },
        { id: '19', name: 'Cordero Lechal', category: 'principales', quantity: 1, price: 52.90 },
        { id: '20', name: 'Patatas Panadera', category: 'entrantes', quantity: 2, price: 14.90 }
      ]
    },
    {
      id: 'prep-2',
      table: 7,
      guests: 2,
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      status: 'in-preparation',
      items: [
        { id: '21', name: 'Lenguado a la Plancha', category: 'principales', quantity: 1, price: 32.90, notes: 'Con limón' },
        { id: '22', name: 'Verduras al Vapor', category: 'entrantes', quantity: 1, price: 16.90 }
      ]
    },
    {
      id: 'prep-3',
      table: 25,
      guests: 5,
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      status: 'in-preparation',
      items: [
        { id: '23', name: 'Arroz con Bogavante', category: 'principales', quantity: 2, price: 56.90 },
        { id: '24', name: 'Gambas al Ajillo', category: 'entrantes', quantity: 1, price: 18.90 },
        { id: '25', name: 'Txakoli', category: 'bebidas', quantity: 1, price: 19.90 }
      ]
    },
    {
      id: 'prep-4',
      table: 18,
      guests: 3,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'in-preparation',
      items: [
        { id: '26', name: 'Fabada Asturiana', category: 'principales', quantity: 2, price: 19.90 },
        { id: '27', name: 'Chorizo a la Sidra', category: 'entrantes', quantity: 1, price: 16.90 },
        { id: '28', name: 'Sidra Natural', category: 'bebidas', quantity: 2, price: 8.90 }
      ]
    },
    {
      id: 'prep-5',
      table: 29,
      guests: 6,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'in-preparation',
      items: [
        { id: '29', name: 'Bacalao al Pil Pil', category: 'principales', quantity: 2, price: 29.90 },
        { id: '30', name: 'Pimientos del Piquillo', category: 'entrantes', quantity: 1, price: 14.90 },
        { id: '31', name: 'Vino Blanco Joven', category: 'bebidas', quantity: 1, price: 16.90 },
        { id: '32', name: 'Brownie con Helado', category: 'postres', quantity: 3, price: 13.90 }
      ]
    },
    {
      id: 'prep-6',
      table: 37,
      guests: 2,
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      status: 'in-preparation',
      items: [
        { id: '33', name: 'Risotto de Setas', category: 'principales', quantity: 1, price: 22.90 },
        { id: '34', name: 'Ensalada de Rúcula', category: 'entrantes', quantity: 1, price: 12.90 }
      ]
    }
  ])

  const [readyOrders, setReadyOrders] = useState<Order[]>([
    {
      id: 'ready-1',
      table: 5,
      guests: 4,
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: 'ready',
      items: [
        { id: '35', name: 'Entrecot de Ternera', category: 'principales', quantity: 2, price: 38.90 },
        { id: '36', name: 'Patatas Fritas', category: 'entrantes', quantity: 2, price: 7.90 },
        { id: '37', name: 'Cerveza Artesanal', category: 'bebidas', quantity: 4, price: 8.90 }
      ]
    },
    {
      id: 'ready-2',
      table: 14,
      guests: 2,
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      status: 'ready',
      items: [
        { id: '38', name: 'Lubina a la Sal', category: 'principales', quantity: 1, price: 42.90 },
        { id: '39', name: 'Ensalada Mixta', category: 'entrantes', quantity: 1, price: 14.90 },
        { id: '40', name: 'Vino Blanco', category: 'bebidas', quantity: 1, price: 24.90 }
      ]
    },
    {
      id: 'ready-3',
      table: 31,
      guests: 3,
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      status: 'ready',
      items: [
        { id: '41', name: 'Secreto Ibérico', category: 'principales', quantity: 1, price: 28.90 },
        { id: '42', name: 'Huevos Rotos', category: 'principales', quantity: 1, price: 16.90 },
        { id: '43', name: 'Pan Tostado', category: 'entrantes', quantity: 2, price: 3.50 }
      ]
    },
    {
      id: 'ready-4',
      table: 42,
      guests: 5,
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      status: 'ready',
      items: [
        { id: '44', name: 'Paletilla de Cordero', category: 'principales', quantity: 1, price: 46.90 },
        { id: '45', name: 'Pisto Manchego', category: 'entrantes', quantity: 2, price: 12.90 },
        { id: '46', name: 'Queso Manchego', category: 'entrantes', quantity: 1, price: 18.90 },
        { id: '47', name: 'Helado Artesanal', category: 'postres', quantity: 3, price: 11.90 }
      ]
    }
  ])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    // Mover la orden entre estados
    if (newStatus === 'in-preparation') {
      const orderToMove = newOrders.find(order => order.id === orderId)
      if (orderToMove) {
        setNewOrders(prev => prev.filter(order => order.id !== orderId))
        setInPreparationOrders(prev => [...prev, { ...orderToMove, status: 'in-preparation' }])
      }
    } else if (newStatus === 'ready') {
      const orderToMove = inPreparationOrders.find(order => order.id === orderId)
      if (orderToMove) {
        setInPreparationOrders(prev => prev.filter(order => order.id !== orderId))
        setReadyOrders(prev => [...prev, { ...orderToMove, status: 'ready' }])
      }
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cocina...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`h-full overflow-y-auto bg-gray-50 transition-opacity duration-500 ${getFontSizeClass()}`}
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          <div className="relative flex items-center justify-center mb-2">
            {/* Logout Button - Positioned absolutely */}
            <button
              onClick={logout}
              className="absolute right-0 flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOutIcon size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
            
            {/* Centered Title and Subtitle */}
            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 tracking-tight">
                Dashboard de Cocina
              </h1>
              <p className="text-gray-600 font-medium text-sm lg:text-base">
                Bienvenido, {user?.name} • Gestiona las órdenes en tiempo real • {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-red-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '0ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Nuevas Órdenes</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{newOrders.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black leading-tight">por preparar</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-yellow-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <h3 className="font-medium text-black text-sm lg:text-base leading-tight">En Preparación</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{inPreparationOrders.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black leading-tight">en proceso</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-green-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Listas para Servir</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{readyOrders.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black leading-tight">completadas</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className="bg-blue-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Total Órdenes</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{newOrders.length + inPreparationOrders.length + readyOrders.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black leading-tight">activas hoy</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 justify-center mx-auto">
          
          {/* Nuevas Órdenes */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp w-full xl:w-80 xl:min-w-[320px]" style={{ animationDelay: '400ms' }}>
            <div className="p-3 lg:p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <AlertTriangleIcon size={18} className="text-red-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-800 truncate">Nuevas Órdenes</h3>
                </div>
                <span className="bg-red-50 text-red-800 px-2 py-1 rounded text-xs font-medium border border-red-100 flex-shrink-0 ml-2">
                  {newOrders.length}
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">Órdenes recién recibidas por preparar</p>
            </div>
            <div className="p-3 lg:p-4 h-[550px] lg:h-[650px] overflow-y-auto kitchen-scrollbar">
              {newOrders.length > 0 ? (
                <div className="space-y-3">
                  {newOrders.map((order, index) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangleIcon size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">No hay órdenes nuevas</p>
                  <p className="text-sm">Las nuevas órdenes aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>

          {/* En Preparación */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp w-full xl:w-80 xl:min-w-[320px]" style={{ animationDelay: '500ms' }}>
            <div className="p-3 lg:p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <ChefIcon size={18} className="mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-800 truncate">En Preparación</h3>
                </div>
                <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs font-medium border border-yellow-100 flex-shrink-0 ml-2">
                  {inPreparationOrders.length}
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">Órdenes siendo preparadas en cocina</p>
            </div>
            <div className="p-3 lg:p-4 h-[550px] lg:h-[650px] overflow-y-auto kitchen-scrollbar">
              {inPreparationOrders.length > 0 ? (
                <div className="space-y-3">
                  {inPreparationOrders.map((order, index) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ChefIcon size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">No hay órdenes en preparación</p>
                  <p className="text-sm">Inicia la preparación de las órdenes nuevas</p>
                </div>
              )}
            </div>
          </div>

          {/* Listas para Servir */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp w-full xl:w-80 xl:min-w-[320px]" style={{ animationDelay: '600ms' }}>
            <div className="p-3 lg:p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <CheckIcon size={18} className="text-green-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-800 truncate">Listas para Servir</h3>
                </div>
                <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-100 flex-shrink-0 ml-2">
                  {readyOrders.length}
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">Órdenes completadas esperando servir</p>
            </div>
            <div className="p-3 lg:p-4 h-[550px] lg:h-[650px] overflow-y-auto kitchen-scrollbar">
              {readyOrders.length > 0 ? (
                <div className="space-y-3">
                  {readyOrders.map((order, index) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckIcon size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">No hay órdenes listas</p>
                  <p className="text-sm">Las órdenes completadas aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 