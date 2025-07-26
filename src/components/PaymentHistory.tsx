import { useState, useEffect } from 'react'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import { useConfig } from '../contexts/ConfigContext'
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

// Componentes para iconos mejorados de métodos de pago - mantenemos consistencia con Dashboard
const CashIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Credit_Card_01.png" 
    alt="Efectivo" 
    width={size} 
    height={size} 
    className={className}
  />
)

const CardIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Credit_Card_01.png" 
    alt="Tarjeta" 
    width={size} 
    height={size} 
    className={className}
  />
)

const TransferIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Trending_Up.png" 
    alt="Transferencia" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de historial personalizado - siguiendo el patrón de Dashboard
const HistoryIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="./Credit_Card_01.png" 
    alt="Historial" 
    width={size} 
    height={size} 
    className={className}
  />
)

export function PaymentHistory() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('today')
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t, formatCurrency, getFontSizeClass } = useConfig()

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
      total: 156.30,
      paymentMethod: 'efectivo',
      guests: 5,
      duration: '1h 55m',
      waiter: 'Sofia C.',
      tip: 20.00,
      status: 'completed',
      orderDetails: [
        { name: 'Cordero Asado', quantity: 1, price: 38.90 },
        { name: 'Bacalao al Pil Pil', quantity: 1, price: 34.90 },
        { name: 'Pimientos del Padrón', quantity: 2, price: 11.90 },
        { name: 'Cheesecake', quantity: 2, price: 13.90 },
        { name: 'Café', quantity: 3, price: 3.50 }
      ]
    },
    {
      id: 'p007',
      tableNumber: 19,
      date: '2024-01-14',
      time: '20:10',
      total: 234.80,
      paymentMethod: 'transferencia',
      guests: 7,
      duration: '2h 30m',
      waiter: 'Roberto A.',
      tip: 30.00,
      status: 'completed',
      orderDetails: [
        { name: 'Marisco Mixto', quantity: 1, price: 48.90 },
        { name: 'Lubina a la Sal', quantity: 1, price: 36.90 },
        { name: 'Parrillada de Verduras', quantity: 2, price: 15.90 },
        { name: 'Mousse de Chocolate', quantity: 3, price: 11.90 },
        { name: 'Champán', quantity: 1, price: 45.90 }
      ]
    }
  ]

  // Filtros
  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch = searchTerm === '' || 
                         payment.tableNumber.toString().includes(searchTerm) ||
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

  const getPaymentMethodName = (method: string) => {
    const methods = {
      'efectivo': t('cash'),
      'tarjeta': t('card'),
      'transferencia': t('transfer')
    }
    return methods[method as keyof typeof methods] || method
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
      className={`h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`} 
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="p-4 lg:p-6">
        {/* Header - Homogeneizado con Dashboard */}
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 tracking-tight">
            {t('paymentHistoryTitle')}
          </h1>
          <p className="text-gray-600 font-medium text-sm lg:text-base">
            {t('paymentHistorySubtitle')} • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Statistics Cards - Usando SpotlightCard como Dashboard */}
        <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '0ms', boxShadow: '0 4px 16px 0 rgba(34,197,94,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('totalRevenue')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(totalRevenue)}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('totalCollected')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '100ms', boxShadow: '0 4px 16px 0 rgba(59,130,246,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('totalTips')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(totalTips)}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('inTips')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '200ms', boxShadow: '0 4px 16px 0 rgba(168,85,247,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('averageTicket')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(averageTicket)}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('perTransaction')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-full lg:w-48">
            <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
              <div className="rounded-2xl px-4 py-6 shadow-2xl animate-slideInUp relative overflow-hidden h-32 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '300ms', boxShadow: '0 4px 16px 0 rgba(251,146,60,0.15)' }}>
                <div className="absolute inset-0 pointer-events-none metallic-shine" />
                <div className="flex flex-col justify-between h-full">
                  <h3 className="font-semibold text-black text-sm lg:text-base mb-2 tracking-wide uppercase opacity-80 text-center w-full">{t('transactions')}</h3>
                  <div className="flex flex-col items-center justify-center flex-1">
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{filteredPayments.length}</p>
                  </div>
                  <p className="text-xs lg:text-sm font-normal text-black/70 leading-tight">{t('completed')}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Payment History Table - Fullscreen */}
        <div className="bg-white rounded-[15px] border border-gray-100 shadow-sm animate-slideInUp w-full flex flex-col" style={{ animationDelay: '500ms', margin: 0, maxWidth: '100vw', maxHeight: '60vh', minHeight: '300px' }}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HistoryIcon size={18} className="text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800 text-sm">{t('transactionHistory')}</h3>
              </div>
              <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                {filteredPayments.length} {t('found')}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{t('completePaymentRecord')}</p>
            {/* Filtros integrados */}
            <div className="mt-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm text-gray-800 placeholder-gray-500 transition-all duration-300"
                />
              </div>

              {/* Payment Method Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 transition-all duration-300 min-w-0 lg:min-w-[120px]"
              >
                <option value="all">{t('allMethods')}</option>
                <option value="efectivo">{t('cash')}</option>
                <option value="tarjeta">{t('card')}</option>
                <option value="transferencia">{t('transfer')}</option>
              </select>

              {/* Date Filter */}
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 transition-all duration-300 min-w-0 lg:min-w-[120px]"
              >
                <option value="today">{t('today')}</option>
                <option value="yesterday">{t('yesterday')}</option>
                <option value="week">{t('thisWeek')}</option>
                <option value="all">{t('all')}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 overflow-y-auto kitchen-scrollbar" style={{ maxHeight: 'calc(60vh - 80px)' }}>
            <table className="w-full min-w-[800px] table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">{t('table')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">{t('dateTime')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">{t('total')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">{t('method')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">{t('waiter')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">{t('tip')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">{t('duration')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">{t('detail')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150 animate-slideInUp" style={{ animationDelay: `${(index * 50) + 600}ms` }}>
                    {/* TABLE: Only table number and guests */}
                    <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md mb-1">
                          {payment.tableNumber}
                        </div>
                        <div className="text-xs text-gray-500">{payment.guests} {t('guests')}</div>
                      </div>
                    </td>
                    {/* DATETIME: Only date and time */}
                    <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                      <div className="text-sm text-gray-900">{payment.date}</div>
                      <div className="text-xs text-gray-500">{payment.time}</div>
                    </td>
                    {/* TOTAL */}
                    <td className="px-4 py-4 text-center align-middle">
                      <div className="text-sm font-bold text-green-600 break-all leading-tight">{formatCurrency(payment.total)}</div>
                    </td>
                    {/* METHOD */}
                    <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        <span className="mr-1">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        {getPaymentMethodName(payment.paymentMethod)}
                      </span>
                    </td>
                    {/* WAITER */}
                    <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                      <div className="text-sm text-gray-900">{payment.waiter}</div>
                    </td>
                    {/* TIP */}
                    <td className="px-4 py-4 text-center align-middle">
                      <div className="text-sm font-medium text-green-600 break-all leading-tight">
                        {payment.tip ? formatCurrency(payment.tip) : '-'}
                      </div>
                    </td>
                    {/* DURATION */}
                    <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                      <div className="text-sm text-gray-900">{payment.duration}</div>
                    </td>
                    {/* DETAIL */}
                    <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                      <button 
                        onClick={() => openOrderDetail(payment)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1.5 px-2 rounded transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                      >
                        {t('viewDetail')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <HistoryIcon size={48} className="mx-auto text-gray-300 mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noPaymentsFound')}</h3>
              <p className="text-gray-500">{t('tryAdjustingFilters')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Orden - Rediseño aún más impactante y alineado, ahora más compacto */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 p-2 sm:p-4 flex justify-center items-start" style={{ minHeight: 0, overflow: 'auto' }}>
          {/* Blur overlay */}
          <div className="fixed inset-0 bg-white/20 backdrop-blur-[2px] z-0 transition-all duration-300" />
          {/* Modal centrado */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-hidden border border-gray-100 flex flex-col mt-[10vh] mb-[10vh] z-10 relative"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)' }}
          >
            {/* Header ultra minimalista y elegante, compacto */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white">
              <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{formatCurrency(selectedPayment.total)}</div>
                    <div className="text-base font-semibold text-gray-700 mt-1 uppercase tracking-wider">{t('tableNumber', { number: selectedPayment.tableNumber })}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base text-gray-500 font-medium">{selectedPayment.date}</div>
                    <div className="text-sm text-gray-400">{selectedPayment.time}</div>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 text-center justify-between">
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">{selectedPayment.guests}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">{t('guests')}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">{selectedPayment.duration}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">{t('duration')}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900 mb-1">{selectedPayment.waiter}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">{t('waiter')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de productos tipo recibo de lujo, compacta */}
            <div className="px-6 py-5 flex-1 overflow-y-auto bg-white apple-scrollbar">
              <h3 className="font-semibold text-gray-800 mb-4 text-base border-b border-gray-100 pb-2 tracking-wide uppercase">{t('orderDetail')}</h3>
              <div className="divide-y divide-gray-50">
                {selectedPayment.orderDetails.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 items-center py-2 text-sm">
                    <div className="col-span-6 sm:col-span-7 font-medium text-gray-900 truncate text-left">
                      {item.name}
                      {item.notes && (
                        <span className="ml-2 text-xs text-gray-400 italic">{item.notes}</span>
                      )}
                    </div>
                    <div className="col-span-2 sm:col-span-2 text-gray-500 font-mono text-xs text-center">x{item.quantity}</div>
                    <div className="col-span-4 sm:col-span-3 font-semibold text-gray-900 text-right">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Pago - caja especial, compacta */}
            <div className="px-6 pt-5 pb-6 bg-gray-50 border-t border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="flex flex-col gap-2 text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-normal">{t('subtotal')}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(selectedPayment.total - (selectedPayment.tip || 0))}</span>
                  </div>
                  {selectedPayment.tip && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-normal">{t('tip')}</span>
                      <span className="font-semibold text-green-600">{formatCurrency(selectedPayment.tip)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between items-center text-xl font-black">
                    <span className="text-gray-900">{t('total')}</span>
                    <span className="text-green-600">{formatCurrency(selectedPayment.total)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-gray-400">{t('paymentMethod')}</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">{getPaymentMethodName(selectedPayment.paymentMethod)}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeOrderDetail}
                    className="px-6 py-2 rounded-lg bg-gray-900 text-white font-bold text-base shadow-sm hover:bg-gray-800 transition-all duration-200"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 