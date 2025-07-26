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
  UserIcon
} from './icons'
import { PaymentModal } from './PaymentModal'

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
  createdAt?: number; // timestamp when order is created
  pendingAt?: number; // when enters pending
  cookingAt?: number; // when enters cooking
  readyAt?: number;   // when enters ready
  paymentPendingAt?: number; // when enters payment_pending
}

interface Table {
  number: number
  status: 'occupied' | 'available' | 'payment_pending'
  guests: number
  capacity: number
  orderTotal?: number
  timeOccupied?: string
  orderDetails?: OrderItem[]
  paymentPendingAt?: number; // when enters payment_pending
}

// Componente para el ícono de check personalizado
const CheckIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Wavy_Check.png" 
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
    src="./cocina.png" 
    alt="Cocina" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de tarjeta de crédito personalizado
const CreditCardCustomIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Credit_Card_01.png" 
    alt="Tarjeta de Crédito" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de trending up personalizado
const TrendingUpCustomIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Trending_Up.png" 
    alt="Trending Up" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Utility to format ms to mm:ss
function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { t, formatCurrency, getFontSizeClass } = useConfig()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

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
      ],
      readyAt: Date.now()
    },
    { 
      id: '2', tableNumber: 8, items: 2, time: '1m', status: 'ready', priority: 'high', guests: 2, capacity: 4,
      total: 67.80,
      orderDetails: [
        { name: 'Salmón a la Plancha', quantity: 1, price: 32.90 },
        { name: 'Ensalada César', quantity: 1, price: 16.90, notes: 'Sin crutones' },
        { name: 'Agua Mineral', quantity: 2, price: 4.50 }
      ],
      readyAt: Date.now()
    },
    { 
      id: '3', tableNumber: 15, items: 3, time: '3m', status: 'ready', priority: 'medium', guests: 3, capacity: 6,
      total: 89.70,
      orderDetails: [
        { name: 'Pizza Margherita', quantity: 1, price: 24.90 },
        { name: 'Lasaña Boloñesa', quantity: 1, price: 26.90 },
        { name: 'Tiramisú', quantity: 1, price: 14.90 },
        { name: 'Vino Tinto', quantity: 1, price: 22.90 }
      ],
      readyAt: Date.now()
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
      ],
      readyAt: Date.now()
    },
    { 
      id: '10', tableNumber: 17, items: 1, time: '30s', status: 'ready', priority: 'medium', guests: 1, capacity: 2,
      total: 19.90,
      orderDetails: [
        { name: 'Café Americano', quantity: 1, price: 3.90 },
        { name: 'Tarta de Queso', quantity: 1, price: 15.90 }
      ],
      readyAt: Date.now()
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
      ],
      readyAt: Date.now()
    },
    { 
      id: '12', tableNumber: 6, items: 3, time: '2m', status: 'ready', priority: 'medium', guests: 3, capacity: 4,
      total: 76.70,
      orderDetails: [
        { name: 'Risotto de Setas', quantity: 1, price: 22.90 },
        { name: 'Pescado del Día', quantity: 1, price: 29.90, notes: 'Punto medio' },
        { name: 'Helado Artesanal', quantity: 2, price: 11.90 }
      ],
      readyAt: Date.now()
    },
    { 
      id: '13', tableNumber: 28, items: 2, time: '1m', status: 'ready', priority: 'low', guests: 2, capacity: 4,
      total: 45.80,
      orderDetails: [
        { name: 'Hamburguesa Gourmet', quantity: 2, price: 18.90 },
        { name: 'Patatas Fritas', quantity: 1, price: 7.90 }
      ],
      readyAt: Date.now()
    },
    { 
      id: '14', tableNumber: 35, items: 5, time: '3m', status: 'ready', priority: 'high', guests: 4, capacity: 6,
      total: 134.50,
      orderDetails: [
        { name: 'Entrecot de Ternera', quantity: 2, price: 38.90 },
        { name: 'Verduras a la Parrilla', quantity: 1, price: 16.90 },
        { name: 'Sopa de Tomate', quantity: 2, price: 12.90 },
        { name: 'Brownie con Helado', quantity: 2, price: 13.90 }
      ],
      readyAt: Date.now()
    }
  ])

  const [ordersCooking, setOrdersCooking] = useState<Order[]>([
    { 
      id: '4', tableNumber: 5, items: 2, time: '8m', status: 'cooking', priority: 'medium',
      total: 43.80,
      orderDetails: [
        { name: 'Pollo al Curry', quantity: 1, price: 24.90 },
        { name: 'Arroz Basmati', quantity: 1, price: 8.90 },
        { name: 'Lassi de Mango', quantity: 1, price: 9.90 },
        { name: 'Pollo al Curry', quantity: 1, price: 24.90 },
        { name: 'Arroz Basmati', quantity: 1, price: 8.90 },
        { name: 'Lassi de Mango', quantity: 1, price: 9.90 }
      ],
      cookingAt: Date.now()
    },
    { 
      id: '5', tableNumber: 18, items: 1, time: '12m', status: 'cooking', priority: 'low',
      total: 32.90,
      orderDetails: [
        { name: 'Lenguado a la Plancha', quantity: 1, price: 32.90, notes: 'Con limón' }
      ],
      cookingAt: Date.now()
    },
    { 
      id: '6', tableNumber: 7, items: 5, time: '6m', status: 'cooking', priority: 'high',
      total: 156.70,
      orderDetails: [
        { name: 'Cochinillo Asado', quantity: 1, price: 48.90 },
        { name: 'Cordero Lechal', quantity: 1, price: 52.90 },
        { name: 'Ensalada de Temporada', quantity: 2, price: 14.90 },
        { name: 'Vino Reserva', quantity: 1, price: 45.90 }
      ],
      cookingAt: Date.now()
    },
    { 
      id: '15', tableNumber: 25, items: 3, time: '15m', status: 'cooking', priority: 'medium',
      total: 67.70,
      orderDetails: [
        { name: 'Sopa de Cebolla', quantity: 2, price: 11.90 },
        { name: 'Quiche Lorraine', quantity: 1, price: 18.90 },
        { name: 'Café con Leche', quantity: 2, price: 4.50 }
      ],
      cookingAt: Date.now()
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
      ],
      cookingAt: Date.now()
    },
    { 
      id: '17', tableNumber: 11, items: 4, time: '18m', status: 'cooking', priority: 'low',
      total: 98.60,
      orderDetails: [
        { name: 'Fabada Asturiana', quantity: 2, price: 19.90 },
        { name: 'Chorizo a la Sidra', quantity: 1, price: 16.90 },
        { name: 'Sidra Natural', quantity: 2, price: 8.90 },
        { name: 'Flan de Huevo', quantity: 2, price: 7.90 }
      ],
      cookingAt: Date.now()
    },
    { 
      id: '18', tableNumber: 29, items: 2, time: '7m', status: 'cooking', priority: 'medium',
      total: 54.80,
      orderDetails: [
        { name: 'Bacalao al Pil Pil', quantity: 1, price: 29.90 },
        { name: 'Pimientos del Piquillo', quantity: 1, price: 14.90 },
        { name: 'Txakoli', quantity: 1, price: 19.90 }
      ],
      cookingAt: Date.now()
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
      ],
      cookingAt: Date.now()
    },
    { 
      id: '20', tableNumber: 37, items: 1, time: '5m', status: 'cooking', priority: 'low',
      total: 14.90,
      orderDetails: [
        { name: 'Crema de Calabaza', quantity: 1, price: 14.90, notes: 'Sin nata' }
      ],
      cookingAt: Date.now()
    },
    { 
      id: '21', tableNumber: 42, items: 4, time: '13m', status: 'cooking', priority: 'medium',
      total: 123.60,
      orderDetails: [
        { name: 'Paletilla de Cordero', quantity: 1, price: 46.90 },
        { name: 'Pisto Manchego', quantity: 2, price: 12.90 },
        { name: 'Queso Manchego', quantity: 1, price: 18.90 },
        { name: 'Vino Tinto Crianza', quantity: 1, price: 32.90 }
      ],
      cookingAt: Date.now()
    },
    { 
      id: '22', tableNumber: 16, items: 3, time: '8m', status: 'cooking', priority: 'high',
      total: 76.70,
      orderDetails: [
        { name: 'Secreto Ibérico', quantity: 1, price: 28.90 },
        { name: 'Huevos Rotos', quantity: 1, price: 16.90 },
        { name: 'Cerveza Artesanal', quantity: 2, price: 8.90 }
      ],
      cookingAt: Date.now()
    }
  ])

  const [ordersPending, setOrdersPending] = useState<Order[]>([
    { 
      id: '7', tableNumber: 22, items: 3, time: '1m', status: 'pending', priority: 'high',
      total: 87.70,
      orderDetails: [
        { name: 'Caldo Gallego', quantity: 1, price: 16.90 },
        { name: 'Empanada de Atún', quantity: 2, price: 12.90 },
        { name: 'Vino de la Casa', quantity: 1, price: 14.90 },
        { name: 'Caldo Gallego', quantity: 1, price: 16.90 },
        { name: 'Empanada de Atún', quantity: 2, price: 12.90 },
        { name: 'Vino de la Casa', quantity: 1, price: 14.90 }
      ],
      pendingAt: Date.now()
    },
    { 
      id: '8', tableNumber: 4, items: 2, time: '30s', status: 'pending', priority: 'high',
      total: 34.80,
      orderDetails: [
        { name: 'Tabla de Quesos', quantity: 1, price: 24.90 },
        { name: 'Copa de Cava', quantity: 1, price: 9.90 },
        { name: 'Tabla de Quesos', quantity: 1, price: 24.90 },
        { name: 'Copa de Cava', quantity: 1, price: 9.90 }
      ],
      pendingAt: Date.now()
    },
    { 
      id: '23', tableNumber: 38, items: 5, time: '45s', status: 'pending', priority: 'high',
      total: 167.50,
      orderDetails: [
        { name: 'Rodaballo a la Plancha', quantity: 2, price: 42.90 },
        { name: 'Almejas a la Marinera', quantity: 1, price: 24.90 },
        { name: 'Ensalada Verde', quantity: 1, price: 11.90 },
        { name: 'Pan Artesano', quantity: 2, price: 3.50 },
        { name: 'Agua Mineral', quantity: 3, price: 4.50 },
        { name: 'Rodaballo a la Plancha', quantity: 2, price: 42.90 },
        { name: 'Almejas a la Marinera', quantity: 1, price: 24.90 },
        { name: 'Ensalada Verde', quantity: 1, price: 11.90 },
        { name: 'Pan Artesano', quantity: 2, price: 3.50 },
        { name: 'Agua Mineral', quantity: 3, price: 4.50 }
      ],
      pendingAt: Date.now()
    },
    { 
      id: '24', tableNumber: 14, items: 1, time: '2m', status: 'pending', priority: 'medium',
      total: 12.90,
      orderDetails: [
        { name: 'Té Verde', quantity: 1, price: 4.90 },
        { name: 'Pastel de Manzana', quantity: 1, price: 7.90 }
      ],
      pendingAt: Date.now()
    },
    { 
      id: '25', tableNumber: 26, items: 4, time: '1m', status: 'pending', priority: 'high',
      total: 112.60,
      orderDetails: [
        { name: 'Arroz con Bogavante', quantity: 1, price: 56.90 },
        { name: 'Gambas al Ajillo', quantity: 1, price: 18.90 },
        { name: 'Alioli Casero', quantity: 1, price: 4.90 },
        { name: 'Albariño', quantity: 1, price: 31.90 }
      ],
      pendingAt: Date.now()
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
      ],
      pendingAt: Date.now()
    },
    { 
      id: '27', tableNumber: 41, items: 2, time: '30s', status: 'pending', priority: 'high',
      total: 45.80,
      orderDetails: [
        { name: 'Merluza en Salsa Verde', quantity: 1, price: 29.90 },
        { name: 'Patatas Panadera', quantity: 1, price: 8.90 },
        { name: 'Zumo Natural', quantity: 1, price: 6.90 }
      ],
      pendingAt: Date.now()
    },
    { 
      id: '28', tableNumber: 13, items: 3, time: '1m', status: 'pending', priority: 'medium',
      total: 67.70,
      orderDetails: [
        { name: 'Milanesa de Pollo', quantity: 1, price: 22.90 },
        { name: 'Ensalada Rusa', quantity: 1, price: 12.90 },
        { name: 'Flan Napolitano', quantity: 1, price: 8.90 },
        { name: 'Refresco', quantity: 2, price: 3.50 }
      ],
      pendingAt: Date.now()
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
      ],
      paymentPendingAt: Date.now()
    },
    { 
      number: 14, status: 'payment_pending', guests: 2, capacity: 4, orderTotal: 87.25, timeOccupied: '45m',
      orderDetails: [
        { name: 'Lubina a la Sal', quantity: 1, price: 42.90 },
        { name: 'Ensalada Mixta', quantity: 1, price: 14.90 },
        { name: 'Vino Blanco', quantity: 1, price: 24.90 },
        { name: 'Café Solo', quantity: 2, price: 4.50 }
      ],
      paymentPendingAt: Date.now()
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
      ],
      paymentPendingAt: Date.now()
    },
    { 
      number: 27, status: 'payment_pending', guests: 3, capacity: 4, orderTotal: 156.80, timeOccupied: '1h 45m',
      orderDetails: [
        { name: 'Mariscada del Chef', quantity: 1, price: 78.90 },
        { name: 'Pan con Tomate', quantity: 3, price: 6.90 },
        { name: 'Albariño', quantity: 1, price: 32.90 },
        { name: 'Crema Catalana', quantity: 3, price: 12.90 }
      ],
      paymentPendingAt: Date.now()
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
      ],
      paymentPendingAt: Date.now()
    },
    { 
      number: 24, status: 'payment_pending', guests: 2, capacity: 2, orderTotal: 68.90, timeOccupied: '1h 10m',
      orderDetails: [
        { name: 'Salmón Noruego', quantity: 1, price: 32.90 },
        { name: 'Risotto de Setas', quantity: 1, price: 22.90 },
        { name: 'Agua con Gas', quantity: 2, price: 4.50 },
        { name: 'Tiramisú', quantity: 1, price: 8.50 }
      ],
      paymentPendingAt: Date.now()
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
      ],
      paymentPendingAt: Date.now()
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
      orderDetails: orderToServe.orderDetails,
      paymentPendingAt: Date.now()
    }

    // Remover de órdenes listas
    setOrdersReady(prev => prev.filter(order => order.id !== orderId))
    
    // Agregar a mesas por pagar
    setPaymentPending(prev => [...prev, newTable])
  }

  // Función para manejar cuando se procesa un pago
  const handlePaymentProcessed = (tableNumber: number) => {
    const table = paymentPending.find(t => t.number === tableNumber)
    if (table) {
      setSelectedTable(table)
      setIsPaymentModalOpen(true)
    }
  }

  const handlePaymentCompleted = (method: string) => {
    if (selectedTable) {
      // Aquí podrías enviar la información del pago a tu backend
      console.log(`Pago procesado para la mesa ${selectedTable.number} con método ${method}`)
      // Remover de mesas por pagar
      setPaymentPending(prev => prev.filter(table => table.number !== selectedTable.number))
      setSelectedTable(null)
    }
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
      case 'ready': return 'border-green-100 bg-green-50/60'
      case 'cooking': return 'border-yellow-100 bg-yellow-50/60'
      case 'pending': return 'border-red-100 bg-red-50/60'
      default: return 'border-gray-100 bg-gray-50/60'
    }
  }

  const renderOrderCard = (order: Order, index: number) => {
    const now = Date.now();
    const createdAt = order.createdAt || 0;
    const pendingAt = order.pendingAt || 0;
    const cookingAt = order.cookingAt || 0;
    const readyAt = order.readyAt || 0;
    const paymentPendingAt = order.paymentPendingAt || 0;

    const timeInPending = Math.round((now - pendingAt) / 60000);
    const timeInCooking = Math.round((now - cookingAt) / 60000);
    const timeInReady = Math.round((now - readyAt) / 60000);
    const timeInPaymentPending = Math.round((now - paymentPendingAt) / 60000);

    return (
      <div
        key={order.id}
        className={`group relative p-3 rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slideInUp cursor-pointer border-gray-200 bg-white`}
        style={{ 
          animationDelay: `${index * 50}ms`,
          // backdropFilter: 'blur(8px)',
          // background: `linear-gradient(135deg, ... )` // Elimino fondo dinámico
        }}
      >
        {/* Glow effect */}
        {/* <div className="absolute inset-0 rounded bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" ...></div> */}
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded flex items-center justify-center font-bold shadow-md">
                  <span className="text-xs">{order.tableNumber}</span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900">{t('tableNumber', { number: order.tableNumber })}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white font-bold">{order.items}</span>
                    </div>
                    <span className="text-sm">{t('dishes')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress bar for cooking orders */}
          {order.status === 'cooking' && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-gray-600 mb-1">
                <span className="text-sm">{t('progress')}</span>
                <span className="text-sm">~{Math.floor(Math.random() * 40 + 60)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Capacity indicator for ready orders */}
          {order.status === 'ready' && order.guests !== undefined && order.capacity !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-gray-600 mb-1">
                <span className="text-sm">{t('occupation')}</span>
                <span className="text-sm">{order.guests}/{order.capacity} {t('persons')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    order.guests / order.capacity > 0.8 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                    order.guests / order.capacity > 0.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-green-400 to-blue-500'
                  }`}
                  style={{ width: `${(order.guests / order.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Order Details - Enhanced for responsive prices */}
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <div className="flex items-start justify-between mb-1">
              <span className="font-medium text-gray-700 text-sm">{t('orderDetails')}</span>
              <div className="flex-shrink-0 ml-2 text-right">
                <span className="font-bold text-gray-800 text-sm break-all">{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="space-y-1">
              {order.orderDetails.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between text-sm gap-2">
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <span className="w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {item.quantity}
                    </span>
                    <span className="text-gray-700 line-clamp-2 flex-1 text-justify">{item.name}</span>
                  </div>
                  <span className="text-gray-600 text-xs font-medium shrink-0 ml-1 break-all leading-tight text-right">{formatCurrency(item.price || 0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón Servido - Solo para órdenes listas */}
          {order.status === 'ready' && (
            <div className="mt-2 pt-2 border-t border-gray-200/50">
              <button
                onClick={() => handleServed(order.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md text-sm"
              >
                ✓ {t('served')}
              </button>
            </div>
          )}

          {/* Elapsed Time Display */}
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span>
                {t('created')}: {new Date(createdAt).toLocaleTimeString('es-ES', { minute: 'numeric', second: 'numeric' })}
              </span>
              {pendingAt > 0 && (
                <span>
                  {t('pending')}: {timeInPending}m
                </span>
              )}
              {cookingAt > 0 && (
                <span>
                  {t('cooking')}: {timeInCooking}m
                </span>
              )}
              {readyAt > 0 && (
                <span>
                  {t('ready')}: {timeInReady}m
                </span>
              )}
              {paymentPendingAt > 0 && (
                <span>
                  {t('paymentPending')}: {timeInPaymentPending}m
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTableCard = (table: Table, index: number) => {
    const now = Date.now();
    const paymentPendingAt = table.paymentPendingAt || 0;

    const timeInPaymentPending = Math.round((now - paymentPendingAt) / 60000);

    return (
      <div
        key={table.number}
        className={`group relative p-3 rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slideInUp cursor-pointer border-gray-200 bg-white`}
        style={{ 
          animationDelay: `${index * 50}ms`,
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Glow effect */}
        {/* <div className={`absolute inset-0 rounded bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
          table.status === 'payment_pending' 
            ? 'bg-gradient-to-r from-orange-400 to-yellow-400' 
            : 'bg-gradient-to-r from-blue-400 to-purple-400'
        }`}></div> */}
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded flex items-center justify-center font-bold shadow-md">
                  <span className="text-xs">{table.number}</span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900">{t('tableNumber', { number: table.number })}</span>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  {table.orderTotal && (
                    <div className="flex items-start space-x-1 flex-wrap">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">$</span>
                      </div>
                      <span className="font-bold text-green-700 text-sm break-all leading-tight">{formatCurrency(table.orderTotal || 0)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Capacity indicator */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-gray-600 mb-1">
              <span className="text-sm">{t('occupation')}</span>
              <span className="text-sm">{table.guests}/{table.capacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  table.guests / table.capacity > 0.8 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                  table.guests / table.capacity > 0.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-green-400 to-blue-500'
                }`}
                style={{ width: `${(table.guests / table.capacity) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Order Details for Payment Pending Tables - Enhanced for responsive prices */}
          {table.orderDetails && (
            <div className="mt-2 pt-2 border-t border-gray-200/50">
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-gray-700 text-sm">{t('consumption')}</span>
                <div className="flex-shrink-0 ml-2 text-right">
                  <span className="font-bold text-green-700 text-sm break-all leading-tight">{formatCurrency(table.orderTotal || 0)}</span>
                </div>
              </div>
              <div className="space-y-1">
                {table.orderDetails.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-sm gap-2">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      <span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {item.quantity}
                      </span>
                      <span className="text-gray-700 line-clamp-2 flex-1 text-justify">{item.name}</span>
                    </div>
                    <span className="text-gray-600 text-xs font-medium shrink-0 ml-1 break-all leading-tight text-right">{formatCurrency(item.price || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón Procesar Pago - Solo para mesas por pagar */}
          {table.status === 'payment_pending' && (
            <div className="mt-2 pt-2 border-t border-gray-200/50">
              <button
                onClick={() => handlePaymentProcessed(table.number)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md text-sm"
              >
                {t('processPayment')}
              </button>
            </div>
          )}

          {/* Elapsed Time Display */}
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span>
                {t('paymentPending')}: {timeInPaymentPending}m
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`h-full overflow-y-auto bg-white/40 backdrop-blur-md transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`} 
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 tracking-tight">
            {t('dashboardTitle')}
          </h1>
          <p className="text-gray-600 font-medium text-sm lg:text-base">
            {t('dashboardSubtitle')} • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-full lg:w-48">
            {/* Listas para Servir - Verde */}
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '0ms', boxShadow: '0 4px 16px 0 rgba(34,197,94,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('readyToServe')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{ordersReady.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('completedOrders')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            {/* En Cocina - Amarillo */}
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '100ms', boxShadow: '0 4px 16px 0 rgba(250,204,21,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('inKitchen')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{ordersCooking.length + ordersPending.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('inPreparation')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            {/* Por Pagar - Naranja */}
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '200ms', boxShadow: '0 4px 16px 0 rgba(251,146,60,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('pendingPayment')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{paymentPending.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('tablesWaiting')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            {/* Ocupación - Azul */}
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '300ms', boxShadow: '0 4px 16px 0 rgba(59,130,246,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80">{t('occupancy')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{occupancyRate}%</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('ofRestaurant')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Estado de Mesas */}
        <div className="bg-white rounded-[15px] border border-gray-200 shadow-sm animate-slideInUp mb-6 lg:mb-8 max-w-full lg:max-w-[820px] mx-auto" style={{ animationDelay: '350ms' }}>
          <div className="p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-800 text-xs">{t('tableStatus')}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-xs lg:text-sm">
                <span className="text-gray-600">
                  {t('available')}: <span className="font-medium text-green-600">{availableTables.length}</span>
                </span>
                <span className="text-gray-600">
                  {t('occupied')}: <span className="font-medium text-blue-600">{occupiedTables}</span>
                </span>
                <span className="text-gray-600">
                  {t('total')}: <span className="font-medium text-gray-800">{totalTables}</span>
                </span>
                <span className="font-semibold text-gray-700">{occupancyRate}% {t('occupancyRate')}</span>
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
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 mb-6 lg:mb-8 justify-center mx-auto">
          {/* Órdenes Listas para Servir */}
          <div className="bg-white rounded-[15px] border border-gray-200 shadow-sm animate-slideInUp w-full xl:w-80 xl:min-w-[320px]" style={{ animationDelay: '400ms' }}>
            <div className="p-3 lg:p-4 border-b border-gray-100">
              <div className="relative flex items-center justify-center w-full">
                <h3 className="font-semibold text-gray-800 truncate text-center w-full">{t('readyToServe')}</h3>
                <span className="absolute right-0 flex items-center gap-2">
                  <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-100 flex-shrink-0">
                    {ordersReady.length}
                  </span>
                </span>
              </div>
            </div>
            <div className="p-3 lg:p-4 h-[550px] lg:h-[650px] overflow-y-auto kitchen-scrollbar">
              {ordersReady.length > 0 ? (
                <div className="space-y-3">
                  {ordersReady.map((order, index) => renderOrderCard(order, index))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay órdenes listas</p>
                </div>
              )}
            </div>
          </div>

          {/* Órdenes en Cocina */}
          <div className="bg-white rounded-[15px] border border-gray-200 shadow-sm animate-slideInUp w-full xl:w-[680px] xl:min-w-[680px]" style={{ animationDelay: '500ms' }}>
            <div className="p-3 lg:p-4 border-b border-gray-100">
              <div className="relative flex items-center justify-center w-full">
                <h3 className="font-semibold text-gray-800 truncate text-center w-full">{t('inKitchen')}</h3>
                <span className="absolute right-0 flex items-center gap-2">
                  <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-xs font-medium border border-yellow-100 flex-shrink-0">
                    {ordersCooking.length + ordersPending.length}
                  </span>
                </span>
              </div>
            </div>
            <div className="p-4 lg:p-6 h-[550px] lg:h-[650px] overflow-y-auto kitchen-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Columna Pendientes */}
                <div>
                  <div className="flex items-center font-medium text-red-600 mb-3">
                    <AlertTriangleIcon size={12} className="mr-1 flex-shrink-0" />
                    <span className="text-xs lg:text-sm">{t('pending').toUpperCase()} ({ordersPending.length})</span>
                  </div>
                  <div className="space-y-3">
                    {ordersPending.length > 0 ? (
                      ordersPending.map((order, index) => renderOrderCard(order, index))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        <p className="text-sm">{t('noPendingOrders')}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Columna En Preparación */}
                <div>
                  <div className="flex items-center font-medium text-yellow-600 mb-3">
                    <ClockIcon size={12} className="mr-1 flex-shrink-0" />
                    <span className="text-xs lg:text-sm">{t('inPreparationCaps')} ({ordersCooking.length})</span>
                  </div>
                  <div className="space-y-3">
                    {ordersCooking.length > 0 ? (
                      ordersCooking.map((order, index) => renderOrderCard(order, index))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        <p className="text-sm">{t('noOrdersInPreparation')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mesas por Pagar */}
          <div className="bg-white rounded-[15px] border border-gray-200 shadow-sm animate-slideInUp w-full xl:w-80 xl:min-w-[320px]" style={{ animationDelay: '600ms' }}>
            <div className="p-3 lg:p-4 border-b border-gray-100">
              <div className="relative flex items-center justify-center w-full">
                <h3 className="font-semibold text-gray-800 truncate text-center w-full">{t('pendingPayment')}</h3>
                <span className="absolute right-0 flex items-center gap-2">
                  <span className="bg-orange-50 text-orange-800 px-2 py-1 rounded text-xs font-medium border border-orange-100 flex-shrink-0">
                    {paymentPending.length}
                  </span>
                </span>
              </div>
            </div>
            <div className="p-3 lg:p-4 h-[550px] lg:h-[650px] overflow-y-auto kitchen-scrollbar">
              {paymentPending.length > 0 ? (
                <div className="space-y-3">
                  {paymentPending.map((table, index) => renderTableCard(table, index))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCardCustomIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t('noPaymentsPending')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      {selectedTable && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false)
            setSelectedTable(null)
          }}
          tableData={selectedTable as { number: number; orderTotal?: number | undefined; orderDetails?: OrderItem[] | undefined; timeOccupied: string; guests: number; paymentPendingAt: number; }}
          onProcessPayment={handlePaymentCompleted}
        />
      )}
    </div>
  )
} 