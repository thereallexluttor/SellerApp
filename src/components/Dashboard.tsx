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

interface OrderItem {
  name: string
  quantity: number
  price: number
  notes?: string
}

interface Order {
  id: string
  tableNumber: number
  items: number
  time: string
  status: 'ready' | 'cooking' | 'pending'
  priority: 'high' | 'medium' | 'low'
  guests?: number
  capacity?: number
  orderDetails: OrderItem[]
  total: number
}

interface Table {
  number: number
  status: 'occupied' | 'available' | 'payment_pending'
  guests: number
  capacity: number
  orderTotal?: number
  timeOccupied?: string
  orderDetails?: OrderItem[]
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
    // Simulate loading with shorter delay
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - En producción esto vendría de tu API
  const [ordersReady, setOrdersReady] = useState<Order[]>([
    { 
      id: '1', tableNumber: 12, items: 4, time: '2m', status: 'ready', priority: 'high', guests: 4, capacity: 4,
      total: 125.50,
      orderDetails: [
        { name: 'Paella Valenciana', quantity: 2, price: 28.90 },
        { name: 'Sangría', quantity: 1, price: 18.50 },
        { name: 'Crema Catalana', quantity: 2, price: 12.90 },
        { name: 'Pan de Ajo', quantity: 3, price: 8.50 }
      ]
    },
    { 
      id: '2', tableNumber: 8, items: 2, time: '1m', status: 'ready', priority: 'high', guests: 2, capacity: 4,
      total: 67.80,
      orderDetails: [
        { name: 'Salmón a la Plancha', quantity: 1, price: 32.90 },
        { name: 'Ensalada César', quantity: 1, price: 16.90, notes: 'Sin crutones' },
        { name: 'Agua Mineral', quantity: 2, price: 4.50 }
      ]
    },
    { 
      id: '3', tableNumber: 15, items: 3, time: '3m', status: 'ready', priority: 'medium', guests: 3, capacity: 6,
      total: 89.70,
      orderDetails: [
        { name: 'Pizza Margherita', quantity: 1, price: 24.90 },
        { name: 'Lasaña Boloñesa', quantity: 1, price: 26.90 },
        { name: 'Tiramisú', quantity: 1, price: 14.90 },
        { name: 'Vino Tinto', quantity: 1, price: 22.90 }
      ]
    },
    { 
      id: '9', tableNumber: 23, items: 6, time: '4m', status: 'ready', priority: 'high', guests: 6, capacity: 6,
      total: 187.40,
      orderDetails: [
        { name: 'Chuletón Ibérico', quantity: 2, price: 45.90 },
        { name: 'Patatas Bravas', quantity: 2, price: 12.90 },
        { name: 'Ensalada Mixta', quantity: 1, price: 14.90 },
        { name: 'Flan Casero', quantity: 3, price: 8.90 },
        { name: 'Cerveza', quantity: 4, price: 6.50 }
      ]
    },
    { 
      id: '10', tableNumber: 17, items: 1, time: '30s', status: 'ready', priority: 'medium', guests: 1, capacity: 2,
      total: 19.90,
      orderDetails: [
        { name: 'Café Americano', quantity: 1, price: 3.90 },
        { name: 'Tarta de Queso', quantity: 1, price: 15.90 }
      ]
    },
    { 
      id: '11', tableNumber: 31, items: 8, time: '5m', status: 'ready', priority: 'high', guests: 8, capacity: 8,
      total: 298.60,
      orderDetails: [
        { name: 'Jamón Ibérico', quantity: 2, price: 34.90 },
        { name: 'Pulpo a la Gallega', quantity: 1, price: 28.90 },
        { name: 'Tortilla Española', quantity: 2, price: 16.90 },
        { name: 'Gazpacho', quantity: 3, price: 9.90 },
        { name: 'Croquetas Caseras', quantity: 2, price: 14.90 },
        { name: 'Vino Blanco', quantity: 2, price: 25.90 },
        { name: 'Agua con Gas', quantity: 4, price: 4.50 }
      ]
    },
    { 
      id: '12', tableNumber: 6, items: 3, time: '2m', status: 'ready', priority: 'medium', guests: 3, capacity: 4,
      total: 76.70,
      orderDetails: [
        { name: 'Risotto de Setas', quantity: 1, price: 22.90 },
        { name: 'Pescado del Día', quantity: 1, price: 29.90, notes: 'Punto medio' },
        { name: 'Helado Artesanal', quantity: 2, price: 11.90 }
      ]
    },
    { 
      id: '13', tableNumber: 28, items: 2, time: '1m', status: 'ready', priority: 'low', guests: 2, capacity: 4,
      total: 45.80,
      orderDetails: [
        { name: 'Hamburguesa Gourmet', quantity: 2, price: 18.90 },
        { name: 'Patatas Fritas', quantity: 1, price: 7.90 }
      ]
    },
    { 
      id: '14', tableNumber: 35, items: 5, time: '3m', status: 'ready', priority: 'high', guests: 4, capacity: 6,
      total: 134.50,
      orderDetails: [
        { name: 'Entrecot de Ternera', quantity: 2, price: 38.90 },
        { name: 'Verduras a la Parrilla', quantity: 1, price: 16.90 },
        { name: 'Sopa de Tomate', quantity: 2, price: 12.90 },
        { name: 'Brownie con Helado', quantity: 2, price: 13.90 }
      ]
    }
  ])

  const [ordersCooking, setOrdersCooking] = useState<Order[]>([
    { 
      id: '4', tableNumber: 5, items: 2, time: '8m', status: 'cooking', priority: 'medium',
      total: 43.80,
      orderDetails: [
        { name: 'Pollo al Curry', quantity: 1, price: 24.90 },
        { name: 'Arroz Basmati', quantity: 1, price: 8.90 },
        { name: 'Lassi de Mango', quantity: 1, price: 9.90 }
      ]
    },
    { 
      id: '5', tableNumber: 18, items: 1, time: '12m', status: 'cooking', priority: 'low',
      total: 32.90,
      orderDetails: [
        { name: 'Lenguado a la Plancha', quantity: 1, price: 32.90, notes: 'Con limón' }
      ]
    },
    { 
      id: '6', tableNumber: 7, items: 5, time: '6m', status: 'cooking', priority: 'high',
      total: 156.70,
      orderDetails: [
        { name: 'Cochinillo Asado', quantity: 1, price: 48.90 },
        { name: 'Cordero Lechal', quantity: 1, price: 52.90 },
        { name: 'Ensalada de Temporada', quantity: 2, price: 14.90 },
        { name: 'Vino Reserva', quantity: 1, price: 45.90 }
      ]
    },
    { 
      id: '15', tableNumber: 25, items: 3, time: '15m', status: 'cooking', priority: 'medium',
      total: 67.70,
      orderDetails: [
        { name: 'Sopa de Cebolla', quantity: 2, price: 11.90 },
        { name: 'Quiche Lorraine', quantity: 1, price: 18.90 },
        { name: 'Café con Leche', quantity: 2, price: 4.50 }
      ]
    },
    { 
      id: '16', tableNumber: 33, items: 7, time: '9m', status: 'cooking', priority: 'high',
      total: 234.30,
      orderDetails: [
        { name: 'Mariscada', quantity: 1, price: 78.90 },
        { name: 'Rape a la Plancha', quantity: 2, price: 34.90 },
        { name: 'Verduras al Vapor', quantity: 1, price: 12.90 },
        { name: 'Pan Tostado', quantity: 4, price: 3.50 },
        { name: 'Vino Albariño', quantity: 1, price: 28.90 }
      ]
    },
    { 
      id: '17', tableNumber: 11, items: 4, time: '18m', status: 'cooking', priority: 'low',
      total: 98.60,
      orderDetails: [
        { name: 'Fabada Asturiana', quantity: 2, price: 19.90 },
        { name: 'Chorizo a la Sidra', quantity: 1, price: 16.90 },
        { name: 'Sidra Natural', quantity: 2, price: 8.90 },
        { name: 'Flan de Huevo', quantity: 2, price: 7.90 }
      ]
    },
    { 
      id: '18', tableNumber: 29, items: 2, time: '7m', status: 'cooking', priority: 'medium',
      total: 54.80,
      orderDetails: [
        { name: 'Bacalao al Pil Pil', quantity: 1, price: 29.90 },
        { name: 'Pimientos del Piquillo', quantity: 1, price: 14.90 },
        { name: 'Txakoli', quantity: 1, price: 19.90 }
      ]
    },
    { 
      id: '19', tableNumber: 21, items: 6, time: '11m', status: 'cooking', priority: 'high',
      total: 178.40,
      orderDetails: [
        { name: 'Lubina a la Sal', quantity: 1, price: 42.90 },
        { name: 'Dorada al Horno', quantity: 1, price: 38.90 },
        { name: 'Patatas Nuevas', quantity: 2, price: 8.90 },
        { name: 'Ali Oli', quantity: 1, price: 4.90 },
        { name: 'Vino Blanco Joven', quantity: 2, price: 16.90 }
      ]
    },
    { 
      id: '20', tableNumber: 37, items: 1, time: '5m', status: 'cooking', priority: 'low',
      total: 14.90,
      orderDetails: [
        { name: 'Crema de Calabaza', quantity: 1, price: 14.90, notes: 'Sin nata' }
      ]
    },
    { 
      id: '21', tableNumber: 42, items: 4, time: '13m', status: 'cooking', priority: 'medium',
      total: 123.60,
      orderDetails: [
        { name: 'Paletilla de Cordero', quantity: 1, price: 46.90 },
        { name: 'Pisto Manchego', quantity: 2, price: 12.90 },
        { name: 'Queso Manchego', quantity: 1, price: 18.90 },
        { name: 'Vino Tinto Crianza', quantity: 1, price: 32.90 }
      ]
    },
    { 
      id: '22', tableNumber: 16, items: 3, time: '8m', status: 'cooking', priority: 'high',
      total: 76.70,
      orderDetails: [
        { name: 'Secreto Ibérico', quantity: 1, price: 28.90 },
        { name: 'Huevos Rotos', quantity: 1, price: 16.90 },
        { name: 'Cerveza Artesanal', quantity: 2, price: 8.90 }
      ]
    }
  ])

  const [ordersPending, setOrdersPending] = useState<Order[]>([
    { 
      id: '7', tableNumber: 22, items: 3, time: '1m', status: 'pending', priority: 'high',
      total: 87.70,
      orderDetails: [
        { name: 'Caldo Gallego', quantity: 1, price: 16.90 },
        { name: 'Empanada de Atún', quantity: 2, price: 12.90 },
        { name: 'Vino de la Casa', quantity: 1, price: 14.90 }
      ]
    },
    { 
      id: '8', tableNumber: 4, items: 2, time: '30s', status: 'pending', priority: 'high',
      total: 34.80,
      orderDetails: [
        { name: 'Tabla de Quesos', quantity: 1, price: 24.90 },
        { name: 'Copa de Cava', quantity: 1, price: 9.90 }
      ]
    },
    { 
      id: '23', tableNumber: 38, items: 5, time: '45s', status: 'pending', priority: 'high',
      total: 167.50,
      orderDetails: [
        { name: 'Rodaballo a la Plancha', quantity: 2, price: 42.90 },
        { name: 'Almejas a la Marinera', quantity: 1, price: 24.90 },
        { name: 'Ensalada Verde', quantity: 1, price: 11.90 },
        { name: 'Pan Artesano', quantity: 2, price: 3.50 },
        { name: 'Agua Mineral', quantity: 3, price: 4.50 }
      ]
    },
    { 
      id: '24', tableNumber: 14, items: 1, time: '2m', status: 'pending', priority: 'medium',
      total: 12.90,
      orderDetails: [
        { name: 'Té Verde', quantity: 1, price: 4.90 },
        { name: 'Pastel de Manzana', quantity: 1, price: 7.90 }
      ]
    },
    { 
      id: '25', tableNumber: 26, items: 4, time: '1m', status: 'pending', priority: 'high',
      total: 112.60,
      orderDetails: [
        { name: 'Arroz con Bogavante', quantity: 1, price: 56.90 },
        { name: 'Gambas al Ajillo', quantity: 1, price: 18.90 },
        { name: 'Alioli Casero', quantity: 1, price: 4.90 },
        { name: 'Albariño', quantity: 1, price: 31.90 }
      ]
    },
    { 
      id: '26', tableNumber: 39, items: 6, time: '3m', status: 'pending', priority: 'medium',
      total: 198.40,
      orderDetails: [
        { name: 'Cocido Madrileño', quantity: 2, price: 28.90 },
        { name: 'Morcilla de Burgos', quantity: 1, price: 16.90 },
        { name: 'Chorizo Español', quantity: 1, price: 14.90 },
        { name: 'Garbanzos de la Abuela', quantity: 2, price: 9.90 },
        { name: 'Vino Tinto Reserva', quantity: 1, price: 38.90 }
      ]
    },
    { 
      id: '27', tableNumber: 41, items: 2, time: '30s', status: 'pending', priority: 'high',
      total: 45.80,
      orderDetails: [
        { name: 'Merluza en Salsa Verde', quantity: 1, price: 29.90 },
        { name: 'Patatas Panadera', quantity: 1, price: 8.90 },
        { name: 'Zumo Natural', quantity: 1, price: 6.90 }
      ]
    },
    { 
      id: '28', tableNumber: 13, items: 3, time: '1m', status: 'pending', priority: 'medium',
      total: 67.70,
      orderDetails: [
        { name: 'Milanesa de Pollo', quantity: 1, price: 22.90 },
        { name: 'Ensalada Rusa', quantity: 1, price: 12.90 },
        { name: 'Flan Napolitano', quantity: 1, price: 8.90 },
        { name: 'Refresco', quantity: 2, price: 3.50 }
      ]
    }
  ])

  const [paymentPending, setPaymentPending] = useState<Table[]>([
    { 
      number: 9, status: 'payment_pending', guests: 4, capacity: 4, orderTotal: 125.50, timeOccupied: '1h 30m',
      orderDetails: [
        { name: 'Paella Mixta', quantity: 1, price: 34.90 },
        { name: 'Calamares Fritos', quantity: 1, price: 18.90 },
        { name: 'Sangría', quantity: 2, price: 18.50 },
        { name: 'Helado Variado', quantity: 4, price: 11.90 }
      ]
    },
    { 
      number: 14, status: 'payment_pending', guests: 2, capacity: 4, orderTotal: 87.25, timeOccupied: '45m',
      orderDetails: [
        { name: 'Lubina a la Sal', quantity: 1, price: 42.90 },
        { name: 'Ensalada Mixta', quantity: 1, price: 14.90 },
        { name: 'Vino Blanco', quantity: 1, price: 24.90 },
        { name: 'Café Solo', quantity: 2, price: 4.50 }
      ]
    },
    { 
      number: 32, status: 'payment_pending', guests: 6, capacity: 6, orderTotal: 245.75, timeOccupied: '2h 15m',
      orderDetails: [
        { name: 'Chuletón de Buey', quantity: 2, price: 65.90 },
        { name: 'Cordero Asado', quantity: 1, price: 48.90 },
        { name: 'Patatas Panadera', quantity: 2, price: 12.90 },
        { name: 'Verduras Asadas', quantity: 1, price: 16.90 },
        { name: 'Vino Tinto Reserva', quantity: 2, price: 45.90 },
        { name: 'Postre Variado', quantity: 4, price: 8.90 }
      ]
    },
    { 
      number: 27, status: 'payment_pending', guests: 3, capacity: 4, orderTotal: 156.80, timeOccupied: '1h 45m',
      orderDetails: [
        { name: 'Mariscada del Chef', quantity: 1, price: 78.90 },
        { name: 'Pan con Tomate', quantity: 3, price: 6.90 },
        { name: 'Albariño', quantity: 1, price: 32.90 },
        { name: 'Crema Catalana', quantity: 3, price: 12.90 }
      ]
    },
    { 
      number: 40, status: 'payment_pending', guests: 8, capacity: 8, orderTotal: 398.60, timeOccupied: '2h 30m',
      orderDetails: [
        { name: 'Jamón Ibérico Bellota', quantity: 2, price: 45.90 },
        { name: 'Pulpo a la Gallega', quantity: 1, price: 28.90 },
        { name: 'Arroz Negro', quantity: 2, price: 32.90 },
        { name: 'Secreto Ibérico', quantity: 2, price: 29.90 },
        { name: 'Ensaladas Variadas', quantity: 3, price: 14.90 },
        { name: 'Vinos Selección', quantity: 3, price: 28.90 },
        { name: 'Postres del Chef', quantity: 6, price: 12.90 }
      ]
    },
    { 
      number: 24, status: 'payment_pending', guests: 2, capacity: 2, orderTotal: 68.90, timeOccupied: '1h 10m',
      orderDetails: [
        { name: 'Salmón Noruego', quantity: 1, price: 32.90 },
        { name: 'Risotto de Setas', quantity: 1, price: 22.90 },
        { name: 'Agua con Gas', quantity: 2, price: 4.50 },
        { name: 'Tiramisú', quantity: 1, price: 8.50 }
      ]
    },
    { 
      number: 36, status: 'payment_pending', guests: 5, capacity: 6, orderTotal: 287.40, timeOccupied: '1h 55m',
      orderDetails: [
        { name: 'Cochinillo Segoviano', quantity: 1, price: 89.90 },
        { name: 'Judías del Barco', quantity: 2, price: 16.90 },
        { name: 'Morcilla de Burgos', quantity: 1, price: 18.90 },
        { name: 'Lechazo Asado', quantity: 1, price: 52.90 },
        { name: 'Vino Ribera del Duero', quantity: 2, price: 38.90 },
        { name: 'Ponche Segoviano', quantity: 3, price: 11.90 }
      ]
    }
  ])

  const availableTables: Table[] = [
    { number: 1, status: 'available', guests: 0, capacity: 2 },
    { number: 3, status: 'available', guests: 0, capacity: 4 },
    { number: 6, status: 'available', guests: 0, capacity: 6 },
    { number: 11, status: 'available', guests: 0, capacity: 4 },
    { number: 16, status: 'available', guests: 0, capacity: 2 },
    { number: 19, status: 'available', guests: 0, capacity: 8 },
    { number: 2, status: 'available', guests: 0, capacity: 2 },
    { number: 10, status: 'available', guests: 0, capacity: 4 },
    { number: 20, status: 'available', guests: 0, capacity: 6 },
    { number: 30, status: 'available', guests: 0, capacity: 4 },
    { number: 34, status: 'available', guests: 0, capacity: 2 },
    { number: 43, status: 'available', guests: 0, capacity: 8 },
    { number: 44, status: 'available', guests: 0, capacity: 4 },
    { number: 45, status: 'available', guests: 0, capacity: 6 },
    { number: 46, status: 'available', guests: 0, capacity: 2 },
    { number: 47, status: 'available', guests: 0, capacity: 4 },
    { number: 48, status: 'available', guests: 0, capacity: 8 }
  ]

  const occupiedTables = 25
  const totalTables = occupiedTables + availableTables.length
  const occupancyRate = Math.round((occupiedTables / totalTables) * 100)

  // Función para manejar cuando una orden es servida
  const handleServed = (orderId: string) => {
    const orderToServe = ordersReady.find(order => order.id === orderId)
    if (!orderToServe) return

    // Convertir la orden a una mesa de pago pendiente
    const newTable: Table = {
      number: orderToServe.tableNumber,
      status: 'payment_pending',
      guests: orderToServe.guests || 0,
      capacity: orderToServe.capacity || 4,
      orderTotal: orderToServe.total,
      timeOccupied: '5m', // Tiempo desde que fue servida
      orderDetails: orderToServe.orderDetails
    }

    // Remover de órdenes listas
    setOrdersReady(prev => prev.filter(order => order.id !== orderId))
    
    // Agregar a mesas por pagar
    setPaymentPending(prev => [...prev, newTable])
  }

  // Función para manejar cuando se procesa un pago
  const handlePaymentProcessed = (tableNumber: number) => {
    // Remover de mesas por pagar
    setPaymentPending(prev => prev.filter(table => table.number !== tableNumber))
  }

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

        {/* Order Details */}
        <div className="mt-2 pt-2 border-t border-gray-200/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-700">Detalle de la Orden</span>
          </div>
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {order.orderDetails.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center text-[9px]">
                <div className="flex items-center space-x-1 flex-1 min-w-0">
                  <span className="w-3 h-3 bg-gray-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold shrink-0">
                    {item.quantity}
                  </span>
                  <span className="text-gray-700 truncate">{item.name}</span>
                  {item.notes && (
                    <span className="text-gray-500 italic text-[8px]">({item.notes})</span>
                  )}
                </div>
              </div>
            ))}
            {order.orderDetails.length > 3 && (
              <div className="text-[8px] text-gray-500 italic text-center">
                +{order.orderDetails.length - 3} platillos más...
              </div>
            )}
          </div>
        </div>

        {/* Botón Servido - Solo para órdenes listas */}
        {order.status === 'ready' && (
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <button
              onClick={() => handleServed(order.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold py-1.5 px-2 rounded-[5px] transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
            >
              ✓ Servido
            </button>
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

        {/* Order Details for Payment Pending Tables */}
        {table.orderDetails && (
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-gray-700">Detalle de Consumo</span>
              <span className="text-[10px] font-bold text-green-700">${table.orderTotal}</span>
            </div>
            <div className="space-y-0.5 max-h-16 overflow-y-auto">
              {table.orderDetails.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center space-x-1 flex-1 min-w-0">
                    <span className="w-3 h-3 bg-orange-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-gray-700 truncate">{item.name}</span>
                    {item.notes && (
                      <span className="text-gray-500 italic text-[8px]">({item.notes})</span>
                    )}
                  </div>
                  <span className="text-gray-600 text-[8px] font-medium shrink-0 ml-1">${item.price}</span>
                </div>
              ))}
              {table.orderDetails.length > 3 && (
                <div className="text-[8px] text-gray-500 italic text-center">
                  +{table.orderDetails.length - 3} items más...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón Procesar Pago - Solo para mesas por pagar */}
        {table.status === 'payment_pending' && (
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <button
              onClick={() => handlePaymentProcessed(table.number)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold py-1.5 px-2 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
              style={{ borderRadius: '5px' }}
            >
              Procesar Pago
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div 
      className={`h-full overflow-y-auto bg-gray-50 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`} 
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
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
            <div className="p-3 max-h-[600px] overflow-y-auto kitchen-scrollbar">
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
            <div className="p-3 max-h-[600px] overflow-y-auto kitchen-scrollbar">
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