import { useState, useEffect } from 'react'
import './animations.css'
import {
  ClockIcon,
  CheckIcon,
  CreditCardIcon,
  CalendarIcon,
  FilterIcon,
  SearchIcon,
  ExternalLinkIcon,
  UserIcon,
  DollarSignIcon
} from './icons'

interface OrderItem {
  name: string
  quantity: number
  price: number
  notes?: string
}

interface PaymentRecord {
  id: string
  tableNumber: number
  date: string
  time: string
  total: number
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia'
  guests: number
  duration: string
  waiter: string
  orderDetails: OrderItem[]
  tip?: number
  status: 'completed'
}

// Componentes para iconos mejorados de métodos de pago
const CashIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V7Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 9V9.01M18 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const CardIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 8C3 6.89543 3.89543 6 5 6H19C20.1046 6 21 6.89543 21 8V16C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 16V8Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 14H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const TransferIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

export function PaymentHistory() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('today')
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate loading with shorter delay
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data para historial de pagos - basado en la estructura del Dashboard
  const paymentHistory: PaymentRecord[] = [
    {
      id: 'p001',
      tableNumber: 12,
      date: '2024-01-15',
      time: '14:35',
      total: 125.50,
      paymentMethod: 'tarjeta',
      guests: 4,
      duration: '1h 25m',
      waiter: 'Carlos M.',
      tip: 15.00,
      status: 'completed',
      orderDetails: [
        { name: 'Paella Valenciana', quantity: 2, price: 28.90 },
        { name: 'Sangría', quantity: 1, price: 18.50 },
        { name: 'Crema Catalana', quantity: 2, price: 12.90 },
        { name: 'Pan de Ajo', quantity: 3, price: 8.50 }
      ]
    },
    {
      id: 'p002',
      tableNumber: 8,
      date: '2024-01-15',
      time: '13:22',
      total: 67.80,
      paymentMethod: 'efectivo',
      guests: 2,
      duration: '55m',
      waiter: 'Ana L.',
      tip: 8.20,
      status: 'completed',
      orderDetails: [
        { name: 'Salmón a la Plancha', quantity: 1, price: 32.90 },
        { name: 'Ensalada César', quantity: 1, price: 16.90, notes: 'Sin crutones' },
        { name: 'Agua Mineral', quantity: 2, price: 4.50 }
      ]
    },
    {
      id: 'p003',
      tableNumber: 15,
      date: '2024-01-15',
      time: '12:45',
      total: 89.70,
      paymentMethod: 'transferencia',
      guests: 3,
      duration: '1h 15m',
      waiter: 'Miguel R.',
      tip: 12.00,
      status: 'completed',
      orderDetails: [
        { name: 'Pizza Margherita', quantity: 1, price: 24.90 },
        { name: 'Lasaña Boloñesa', quantity: 1, price: 26.90 },
        { name: 'Tiramisú', quantity: 1, price: 14.90 },
        { name: 'Vino Tinto', quantity: 1, price: 22.90 }
      ]
    },
    {
      id: 'p004',
      tableNumber: 23,
      date: '2024-01-15',
      time: '15:18',
      total: 187.40,
      paymentMethod: 'tarjeta',
      guests: 6,
      duration: '1h 45m',
      waiter: 'Laura S.',
      tip: 25.00,
      status: 'completed',
      orderDetails: [
        { name: 'Chuletón Ibérico', quantity: 2, price: 45.90 },
        { name: 'Patatas Bravas', quantity: 2, price: 12.90 },
        { name: 'Ensalada Mixta', quantity: 1, price: 14.90 },
        { name: 'Flan Casero', quantity: 3, price: 8.90 },
        { name: 'Cerveza', quantity: 4, price: 6.50 }
      ]
    },
    {
      id: 'p005',
      tableNumber: 31,
      date: '2024-01-15',
      time: '16:42',
      total: 298.60,
      paymentMethod: 'tarjeta',
      guests: 8,
      duration: '2h 10m',
      waiter: 'David P.',
      tip: 40.00,
      status: 'completed',
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
      id: 'p006',
      tableNumber: 6,
      date: '2024-01-14',
      time: '19:25',
      total: 76.70,
      paymentMethod: 'efectivo',
      guests: 3,
      duration: '1h 30m',
      waiter: 'Elena V.',
      tip: 10.00,
      status: 'completed',
      orderDetails: [
        { name: 'Risotto de Setas', quantity: 1, price: 22.90 },
        { name: 'Pescado del Día', quantity: 1, price: 29.90, notes: 'Punto medio' },
        { name: 'Helado Artesanal', quantity: 2, price: 11.90 }
      ]
    },
    {
      id: 'p007',
      tableNumber: 28,
      date: '2024-01-14',
      time: '20:15',
      total: 45.80,
      paymentMethod: 'tarjeta',
      guests: 2,
      duration: '45m',
      waiter: 'Roberto C.',
      tip: 5.00,
      status: 'completed',
      orderDetails: [
        { name: 'Hamburguesa Gourmet', quantity: 2, price: 18.90 },
        { name: 'Patatas Fritas', quantity: 1, price: 7.90 }
      ]
    },
    {
      id: 'p008',
      tableNumber: 35,
      date: '2024-01-14',
      time: '18:50',
      total: 134.50,
      paymentMethod: 'transferencia',
      guests: 4,
      duration: '1h 35m',
      waiter: 'Sofia T.',
      tip: 18.00,
      status: 'completed',
      orderDetails: [
        { name: 'Entrecot de Ternera', quantity: 2, price: 38.90 },
        { name: 'Verduras a la Parrilla', quantity: 1, price: 16.90 },
        { name: 'Sopa de Tomate', quantity: 2, price: 12.90 },
        { name: 'Brownie con Helado', quantity: 2, price: 13.90 }
      ]
    },
    {
      id: 'p009',
      tableNumber: 9,
      date: '2024-01-14',
      time: '17:30',
      total: 156.90,
      paymentMethod: 'efectivo',
      guests: 5,
      duration: '1h 20m',
      waiter: 'Andrea F.',
      tip: 20.00,
      status: 'completed',
      orderDetails: [
        { name: 'Cochinillo Asado', quantity: 1, price: 48.90 },
        { name: 'Cordero Lechal', quantity: 1, price: 52.90 },
        { name: 'Ensalada de Temporada', quantity: 2, price: 14.90 },
        { name: 'Vino Reserva', quantity: 1, price: 40.00 }
      ]
    },
    {
      id: 'p010',
      tableNumber: 42,
      date: '2024-01-13',
      time: '21:10',
      total: 89.60,
      paymentMethod: 'tarjeta',
      guests: 3,
      duration: '1h 10m',
      waiter: 'Javier M.',
      tip: 12.00,
      status: 'completed',
      orderDetails: [
        { name: 'Paletilla de Cordero', quantity: 1, price: 46.90 },
        { name: 'Pisto Manchego', quantity: 2, price: 12.90 },
        { name: 'Queso Manchego', quantity: 1, price: 18.90 },
        { name: 'Vino Tinto Crianza', quantity: 1, price: 10.90 }
      ]
    }
  ]

  // Filtros
  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch = payment.tableNumber.toString().includes(searchTerm) ||
                         payment.waiter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderDetails.some(item => 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesFilter = selectedFilter === 'all' || payment.paymentMethod === selectedFilter
    
    const matchesDate = selectedDate === 'all' || 
                       (selectedDate === 'today' && payment.date === '2024-01-15') ||
                       (selectedDate === 'yesterday' && payment.date === '2024-01-14') ||
                       (selectedDate === 'week' && ['2024-01-13', '2024-01-14', '2024-01-15'].includes(payment.date))
    
    return matchesSearch && matchesFilter && matchesDate
  })

  // Estadísticas
  const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.total, 0)
  const totalTips = filteredPayments.reduce((sum, payment) => sum + (payment.tip || 0), 0)
  const averageTicket = filteredPayments.length > 0 ? totalRevenue / filteredPayments.length : 0

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'efectivo':
        return <CashIcon size={14} />
      case 'tarjeta':
        return <CardIcon size={14} />
      case 'transferencia':
        return <TransferIcon size={14} />
      default:
        return <DollarSignIcon size={14} />
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'efectivo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'tarjeta':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'transferencia':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const openOrderDetail = (payment: PaymentRecord) => {
    setSelectedPayment(payment)
    setIsModalOpen(true)
  }

  const closeOrderDetail = () => {
    setSelectedPayment(null)
    setIsModalOpen(false)
  }

  return (
    <div 
      className={`h-screen w-full overflow-y-auto bg-gray-50 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 animate-fadeInSlide flex-shrink-0">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            Historial de Pagos
          </h1>
          <p className="text-gray-600 font-medium">
            Registro completo de transacciones • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4 flex-shrink-0">
          <div className="bg-white rounded border border-gray-100 shadow-sm p-3 animate-slideInUp" style={{ animationDelay: '0ms' }}>
            <div>
              <p className="text-xs font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-100 shadow-sm p-3 animate-slideInUp" style={{ animationDelay: '100ms' }}>
            <div>
              <p className="text-xs font-medium text-gray-600">Propinas Totales</p>
              <p className="text-xl font-bold text-blue-600">${totalTips.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-100 shadow-sm p-3 animate-slideInUp" style={{ animationDelay: '200ms' }}>
            <div>
              <p className="text-xs font-medium text-gray-600">Ticket Promedio</p>
              <p className="text-xl font-bold text-purple-600">${averageTicket.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-100 shadow-sm p-3 animate-slideInUp" style={{ animationDelay: '300ms' }}>
            <div>
              <p className="text-xs font-medium text-gray-600">Transacciones</p>
              <p className="text-xl font-bold text-orange-600">{filteredPayments.length}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded shadow-sm p-3 mb-4 animate-slideInUp flex-shrink-0" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                placeholder="Buscar por mesa, mesero o platillo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-white rounded focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center space-x-2">
              <FilterIcon size={16} className="text-white" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white border border-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
              >
                <option value="all">Todos los métodos</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <CalendarIcon size={16} className="text-white" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
              >
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="week">Esta semana</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp flex-1 flex flex-col" style={{ animationDelay: '500ms' }}>
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-semibold text-gray-800">Historial de Transacciones</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredPayments.length} transacciones encontradas
            </p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesero</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propina</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150" style={{ animationDelay: `${(index * 50) + 600}ms` }}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded flex items-center justify-center text-sm font-bold">
                          {payment.tableNumber}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Mesa {payment.tableNumber}</div>
                          <div className="text-sm text-gray-500">{payment.guests} comensales</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.date}</div>
                      <div className="text-sm text-gray-500">{payment.time}</div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${payment.total.toFixed(2)}</div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        <span className="mr-1">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.waiter}</div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {payment.tip ? `$${payment.tip.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.duration}</div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => openOrderDetail(payment)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-150"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCardIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pagos</h3>
              <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Orden - Diseño Minimalista */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div 
            className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-out"
            style={{ 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
            }}
          >
            {/* Header Minimalista */}
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                                         <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded flex items-center justify-center">
                       <span className="text-white font-bold text-lg">{selectedPayment.tableNumber}</span>
                     </div>
                    <div>
                      <h2 className="text-2xl font-light text-gray-900 tracking-tight">
                        Mesa {selectedPayment.tableNumber}
                      </h2>
                      <p className="text-sm text-gray-500 font-light">
                        {selectedPayment.date} · {selectedPayment.time}
                      </p>
                    </div>
                  </div>
                </div>
                                   <button
                    onClick={closeOrderDetail}
                    className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 text-gray-400 hover:text-gray-600"
                  >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

                         {/* Contenido Principal */}
             <div className="overflow-y-auto max-h-[calc(90vh-200px)] apple-scrollbar">
              {/* Información de Servicio */}
              <div className="px-8 py-6 border-b border-gray-50">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-light text-gray-900 mb-1">{selectedPayment.guests}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Comensales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-gray-900 mb-1">{selectedPayment.duration}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Duración</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-gray-900 mb-1">{selectedPayment.waiter}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Mesero</div>
                  </div>
                </div>
              </div>

              {/* Items de la Orden - Ultra Minimalista */}
              <div className="px-8 py-6">
                <div className="space-y-4">
                  {selectedPayment.orderDetails.map((item, index) => (
                    <div key={index} className="flex items-start justify-between group py-2">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-3">
                                                     <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-600 text-sm font-medium">
                             {item.quantity}
                           </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-base">{item.name}</h4>
                            {item.notes && (
                              <p className="text-sm text-gray-500 mt-0.5 italic">{item.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-light text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de Pago Elegante */}
              <div className="bg-gray-50/50 px-8 py-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600 font-light">Subtotal</span>
                    <span className="font-light text-gray-900">${(selectedPayment.total - (selectedPayment.tip || 0)).toFixed(2)}</span>
                  </div>
                  
                  {selectedPayment.tip && (
                    <div className="flex justify-between items-center text-base">
                      <span className="text-gray-600 font-light">Propina</span>
                      <span className="font-light text-emerald-600">${selectedPayment.tip.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-light text-gray-900">Total</span>
                      <span className="text-2xl font-light text-gray-900">${selectedPayment.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500 font-light">Método de pago</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 text-gray-600">
                        {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {selectedPayment.paymentMethod.charAt(0).toUpperCase() + selectedPayment.paymentMethod.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Minimalista */}
            <div className="px-8 py-6 border-t border-gray-100">
              <div className="flex justify-end">
                <button
                  onClick={closeOrderDetail}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-all duration-200 font-medium text-sm tracking-wide"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 