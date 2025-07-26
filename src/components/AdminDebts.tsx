import { useState, useEffect } from 'react'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import { useConfig } from '../contexts/ConfigContext'
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  CalendarIcon,
  DollarSignIcon,
  AlertTriangleIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  CreditCardIcon,
  FilterIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon
} from './icons'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, YAxis, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

interface Debt {
  id: string
  creditor: string
  description: string
  totalAmount: number
  remainingAmount: number
  interestRate?: number
  startDate: string
  dueDate: string
  monthlyPayment: number
  status: 'activa' | 'pagada' | 'vencida' | 'reestructurada'
  category: 'prestamo' | 'proveedor' | 'equipos' | 'servicios' | 'otros'
  priority: 'alta' | 'media' | 'baja'
  notes?: string
  paymentHistory: PaymentRecord[]
  impact: 'critico' | 'alto' | 'medio' | 'bajo' // Impacto en operaciones del restaurante
}

interface PaymentRecord {
  id: string
  debtId: string
  amount: number
  date: string
  type: 'principal' | 'interes' | 'completo'
  notes?: string
}

interface DebtStats {
  totalDebts: number
  totalMonthlyPayments: number
  overdueDebts: number
  nextPaymentsDue: number
  debtToRevenueRatio: number
  operationalDays: number
  cashFlowImpact: number
  debtsByCategory: { [key: string]: number }
  debtsByImpact: { [key: string]: number }
}

export function AdminDebts() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<'analytics' | 'debts' | 'payments' | 'alerts'>('analytics')
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const { formatCurrency, getFontSizeClass } = useConfig()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data con información más específica para restaurantes
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: '1',
      creditor: 'Banco Central',
      description: 'Préstamo para equipamiento de cocina',
      totalAmount: 50000.00,
      remainingAmount: 35000.00,
      interestRate: 8.5,
      startDate: '2023-06-01',
      dueDate: '2028-06-01',
      monthlyPayment: 1200.00,
      status: 'activa',
      category: 'equipos',
      priority: 'alta',
      impact: 'medio',
      paymentHistory: []
    },
    {
      id: '2',
      creditor: 'Distribuidora Alimentaria SA',
      description: 'Deuda por suministros de enero',
      totalAmount: 3500.00,
      remainingAmount: 3500.00,
      startDate: '2024-01-31',
      dueDate: '2024-02-28',
      monthlyPayment: 3500.00,
      status: 'vencida',
      category: 'proveedor',
      priority: 'alta',
      impact: 'critico',
      paymentHistory: []
    },
    {
      id: '3',
      creditor: 'Leasing Motors',
      description: 'Financiamiento vehículo delivery',
      totalAmount: 25000.00,
      remainingAmount: 18500.00,
      interestRate: 12.0,
      startDate: '2023-03-15',
      dueDate: '2026-03-15',
      monthlyPayment: 850.00,
      status: 'activa',
      category: 'equipos',
      priority: 'media',
      impact: 'alto',
      paymentHistory: []
    },
    {
      id: '4',
      creditor: 'Empresa Eléctrica',
      description: 'Factura de electricidad diciembre',
      totalAmount: 890.50,
      remainingAmount: 890.50,
      startDate: '2024-01-05',
      dueDate: '2024-02-05',
      monthlyPayment: 890.50,
      status: 'vencida',
      category: 'servicios',
      priority: 'alta',
      impact: 'critico',
      paymentHistory: []
    },
    {
      id: '5',
      creditor: 'Constructora Mejoras',
      description: 'Remodelación del salón principal',
      totalAmount: 15000.00,
      remainingAmount: 7500.00,
      interestRate: 6.0,
      startDate: '2023-11-01',
      dueDate: '2024-11-01',
      monthlyPayment: 750.00,
      status: 'activa',
      category: 'otros',
      priority: 'baja',
      impact: 'bajo',
      paymentHistory: []
    }
  ])

  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    category: 'otros',
    status: 'activa',
    priority: 'media',
    impact: 'medio',
    startDate: new Date().toISOString().split('T')[0],
    paymentHistory: []
  })

  const [newPayment, setNewPayment] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'deuda' as 'deuda' | 'servicio' | 'proveedor' | 'otros',
    concept: '',
    related: '',
    notes: '',
    selectedDebtId: ''
  })

  const [payments, setPayments] = useState([
    {
      id: 'p1',
      date: '2024-06-01',
      amount: 1200,
      type: 'deuda',
      concept: 'Pago mensual préstamo cocina',
      related: 'Banco Central',
      notes: 'Pago puntual',
    },
    {
      id: 'p2',
      date: '2024-06-02',
      amount: 890.5,
      type: 'servicio',
      concept: 'Factura electricidad',
      related: 'Empresa Eléctrica',
      notes: '',
    },
    {
      id: 'p3',
      date: '2024-06-03',
      amount: 3500,
      type: 'proveedor',
      concept: 'Pago suministros enero',
      related: 'Distribuidora Alimentaria SA',
      notes: 'Pago completo',
    }
  ])

  // Métricas específicas para restaurantes
  const monthlyRevenue = 45000 // Simulado - ingresos mensuales promedio
  const debtStats: DebtStats = {
    totalDebts: debts.reduce((sum, debt) => sum + debt.remainingAmount, 0),
    totalMonthlyPayments: debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0),
    overdueDebts: debts.filter(debt => debt.status === 'vencida').length,
    nextPaymentsDue: debts.filter(debt => {
      const dueDate = new Date(debt.dueDate)
      const today = new Date()
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays >= 0
    }).length,
    debtToRevenueRatio: (debts.reduce((sum, debt) => sum + debt.remainingAmount, 0) / monthlyRevenue) * 100,
    operationalDays: Math.floor(monthlyRevenue / (debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0) || 1)),
    cashFlowImpact: debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0) / monthlyRevenue * 100,
    debtsByCategory: debts.reduce((acc, debt) => {
      acc[debt.category] = (acc[debt.category] || 0) + debt.remainingAmount
      return acc
    }, {} as { [key: string]: number }),
    debtsByImpact: debts.reduce((acc, debt) => {
      acc[debt.impact] = (acc[debt.impact] || 0) + debt.remainingAmount
      return acc
    }, {} as { [key: string]: number })
  }

  const categoryColors = {
    prestamo: 'bg-red-500',
    proveedor: 'bg-orange-500',
    equipos: 'bg-blue-500',
    servicios: 'bg-yellow-500',
    otros: 'bg-gray-500'
  }

  const categoryNames = {
    prestamo: 'Préstamos',
    proveedor: 'Proveedores',
    equipos: 'Equipos',
    servicios: 'Servicios',
    otros: 'Otros'
  }

  const impactColors = {
    critico: 'bg-red-500',
    alto: 'bg-orange-500',
    medio: 'bg-yellow-500',
    bajo: 'bg-green-500'
  }

  const impactNames = {
    critico: 'Crítico',
    alto: 'Alto',
    medio: 'Medio',
    bajo: 'Bajo'
  }

  const categoryGradients = {
    prestamo: 'linear-gradient(90deg, #fca5a5 0%, #991b1b 100%)',
    proveedor: 'linear-gradient(90deg, #fdba74 0%, #c2410c 100%)',
    equipos: 'linear-gradient(90deg, #60a5fa 0%, #1e40af 100%)',
    servicios: 'linear-gradient(90deg, #fde68a 0%, #b45309 100%)',
    otros: 'linear-gradient(90deg, #d1d5db 0%, #374151 100%)',
  }

  // Datos para gráficos
  const chartDataTotalDebts = [
    { v: 68000 }, { v: 71000 }, { v: 69500 }, { v: 72000 }, { v: 66000 }, { v: debtStats.totalDebts }, { v: 64000 }
  ]
  const chartDataMonthlyPayments = [
    { v: 6800 }, { v: 7200 }, { v: 6900 }, { v: 7100 }, { v: 6500 }, { v: debtStats.totalMonthlyPayments }, { v: 6400 }
  ]
  const chartDataDebtRatio = [
    { v: 142 }, { v: 158 }, { v: 154 }, { v: 160 }, { v: 147 }, { v: debtStats.debtToRevenueRatio }, { v: 142 }
  ]
  const chartDataOperationalDays = [
    { v: 7 }, { v: 6 }, { v: 7 }, { v: 6 }, { v: 7 }, { v: debtStats.operationalDays }, { v: 7 }
  ]

  const daysLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  // Datos para cronograma de vencimientos - se calculan dinámicamente en el componente

  // Función para obtener alertas próximas
  const getUpcomingAlerts = () => {
    const now = new Date()
    return debts.filter(debt => {
      if (debt.status === 'pagada') return false
      
      const dueDate = new Date(debt.dueDate)
      const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      return diffHours <= 168 && diffHours > 0 // 7 días
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const upcomingAlerts = getUpcomingAlerts()

  // Funciones de manejo
  const handleAddDebt = () => {
    if (newDebt.creditor && newDebt.totalAmount && newDebt.monthlyPayment) {
      const debt: Debt = {
        id: Date.now().toString(),
        creditor: newDebt.creditor,
        description: newDebt.description || '',
        totalAmount: newDebt.totalAmount,
        remainingAmount: newDebt.remainingAmount || newDebt.totalAmount,
        interestRate: newDebt.interestRate,
        startDate: newDebt.startDate || new Date().toISOString().split('T')[0],
        dueDate: newDebt.dueDate || new Date().toISOString().split('T')[0],
        monthlyPayment: newDebt.monthlyPayment,
        status: newDebt.status as any,
        category: newDebt.category as any,
        priority: newDebt.priority as any,
        impact: newDebt.impact as any,
        notes: newDebt.notes,
        paymentHistory: []
      }
      setDebts([...debts, debt])
      setNewDebt({
        category: 'otros',
        status: 'activa',
        priority: 'media',
        impact: 'medio',
        startDate: new Date().toISOString().split('T')[0],
        paymentHistory: []
      })
      setIsAddDebtOpen(false)
      setCurrentStep(1)
    }
  }

  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id))
  }

  const handleAddPayment = () => {
    if (newPayment.amount && newPayment.concept && newPayment.related) {
      const payment = {
        id: Date.now().toString(),
        date: newPayment.date,
        amount: parseFloat(newPayment.amount),
        type: newPayment.type,
        concept: newPayment.concept,
        related: newPayment.related,
        notes: newPayment.notes
      }
      
      if (newPayment.type === 'deuda' && newPayment.selectedDebtId) {
        const debt = debts.find(d => d.id === newPayment.selectedDebtId)
        if (debt) {
          const updatedDebts = debts.map(d => 
            d.id === newPayment.selectedDebtId 
              ? { ...d, remainingAmount: Math.max(0, d.remainingAmount - parseFloat(newPayment.amount)) }
              : d
          )
          setDebts(updatedDebts)
        }
      }
      
      setPayments([payment, ...payments])
      setNewPayment({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'deuda',
        concept: '',
        related: '',
        notes: '',
        selectedDebtId: ''
      })
      setIsAddingPayment(false)
    }
  }

  // Filtrar deudas
  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.creditor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || debt.category === filterCategory
    const matchesStatus = filterStatus === 'all' || debt.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Funciones de utilidad para cronograma de vencimientos

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pagada': return 'bg-green-100 text-green-800 border-green-200'
      case 'vencida': return 'bg-red-100 text-red-800 border-red-200'
      case 'reestructurada': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critico': return 'bg-red-100 text-red-800 border-red-200'
      case 'alto': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'bajo': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`}
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          <h1 className="text-lg lg:text-xl font-bold text-gray-900">Gestión Inteligente de Deudas</h1>
          <p className="text-xs lg:text-sm text-gray-600 font-normal mt-1">
            Control financiero, análisis de riesgo y optimización de flujo de caja
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <nav className="bg-white rounded-[12px] shadow-sm flex px-1 py-1 gap-1">
              {[
                { id: 'analytics', label: 'Analytics', icon: <TrendingUpIcon size={16} /> },
                { id: 'debts', label: 'Deudas', icon: <DollarSignIcon size={16} /> },
                { id: 'payments', label: 'Pagos', icon: <CreditCardIcon size={16} /> },
                { id: 'alerts', label: 'Alertas', icon: <BellIcon size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-3 py-2 rounded-[8px] font-semibold text-sm transition-all duration-200 flex items-center gap-2
                    ${activeView === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                  `}
                  style={{ minWidth: 90 }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <>
            {/* Urgent Debts Alert */}
            {debtStats.overdueDebts > 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 animate-slideInUp" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center justify-center text-center">
                    <AlertTriangleIcon size={18} className="text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-800 font-medium text-sm">¡Atención! Deudas Críticas</h3>
                      <p className="text-red-700 text-xs mt-1">
                        Tienes {debtStats.overdueDebts} deuda(s) vencida(s) que pueden afectar operaciones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Overview - Métricas específicas para restaurantes */}
            <div className="relative rounded-[16px] border border-gray-200 shadow-sm mb-8 lg:mb-10 p-4 lg:p-6 overflow-hidden bg-white">
              <div className="relative z-10">
                <div className="mb-4">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">Análisis Financiero del Restaurante</h2>
                  <p className="text-xs lg:text-sm text-gray-600 font-normal mt-1">Métricas clave para la salud financiera del negocio</p>
                </div>
                <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4">
                  {/* Total Deudas */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '0ms', boxShadow: '0 4px 16px 0 rgba(239,68,68,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Total Deudas</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(debtStats.totalDebts)}</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Pendientes</p>
                          </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataTotalDebts.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
                                <CartesianGrid stroke="#e0e7ef" strokeOpacity={0.13} vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={true} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Ratio Deuda/Ingresos */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '100ms', boxShadow: '0 4px 16px 0 rgba(251,146,60,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Ratio D/I</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{debtStats.debtToRevenueRatio.toFixed(0)}%</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Deuda vs Ingresos</p>
                          </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataDebtRatio.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
                                <CartesianGrid stroke="#e0e7ef" strokeOpacity={0.13} vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Line type="monotone" dataKey="v" stroke="#fb923c" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={true} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Impacto en Operaciones */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '200ms', boxShadow: '0 4px 16px 0 rgba(220,38,38,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Impacto CF</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{debtStats.cashFlowImpact.toFixed(0)}%</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Del flujo de caja</p>
                          </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataMonthlyPayments.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
                                <CartesianGrid stroke="#e0e7ef" strokeOpacity={0.13} vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Line type="monotone" dataKey="v" stroke="#dc2626" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={true} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* Días de Operación */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '300ms', boxShadow: '0 4px 16px 0 rgba(16,185,129,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Autonomía</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{debtStats.operationalDays}</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Días de operación</p>
                          </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataOperationalDays.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
                                <CartesianGrid stroke="#e0e7ef" strokeOpacity={0.13} vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={true} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </div>
              </div>
            </div>

            {/* Análisis de Riesgo Financiero - Full Width Card Mejorada */}
            <div className="w-full mb-8">
              <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 animate-fadeInSlide">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">Análisis de Riesgo Financiero</h2>
                    <p className="text-xs lg:text-sm text-gray-600 font-normal mt-1">Indicadores clave y visualizaciones para la toma de decisiones</p>
                  </div>
                  {/* Alertas visuales */}
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {debtStats.debtToRevenueRatio > 60 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Alerta: Deuda &gt; 60% ingresos</span>
                    )}
                    {debtStats.cashFlowImpact > 30 && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Alerta: Pagos &gt; 30% flujo</span>
                    )}
                    {debts.filter(d => d.impact === 'critico').length > 0 && (
                      <span className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-xs font-semibold">¡Tienes deudas críticas!</span>
                    )}
                  </div>
                </div>
                {/* Métricas clave */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Ratio de liquidez</span>
                    <span className="text-2xl font-bold text-blue-900">{(monthlyRevenue / debtStats.totalMonthlyPayments).toFixed(2)}x</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">% ingresos comprometido</span>
                    <span className="text-2xl font-bold text-orange-900">{debtStats.cashFlowImpact.toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Deuda crítica</span>
                    <span className="text-2xl font-bold text-red-900">{formatCurrency(debts.filter(d => d.impact === 'critico').reduce((sum, d) => sum + d.remainingAmount, 0))}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Pagos próximos 30d</span>
                    <span className="text-2xl font-bold text-yellow-900">{debts.filter(debt => {
                      const dueDate = new Date(debt.dueDate)
                      const today = new Date()
                      const diffTime = dueDate.getTime() - today.getTime()
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays <= 30 && diffDays >= 0 && debt.status !== 'pagada'
                    }).length}</span>
                  </div>
                </div>
                {/* Gráfico de líneas: Pagos vs Ingresos últimos 6 meses */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Pagos vs Ingresos (últimos 6 meses)</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={(() => {
                      // Simulación de datos variados para las curvas
                      const months = []
                      const now = new Date()
                      // Simular ingresos y pagos con variación
                      const ingresosSim = [45000, 47000, 43000, 48000, 46000, 45500]
                      const pagosSim = [12000, 15000, 9000, 17000, 11000, 14000]
                      for (let i = 5; i >= 0; i--) {
                        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                        const label = d.toLocaleDateString('es-ES', { month: 'short' })
                        months.push({
                          mes: label,
                          pagos: pagosSim[5 - i],
                          ingresos: ingresosSim[5 - i]
                        })
                      }
                      return months
                    })()} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
                      <CartesianGrid stroke="#e0e7ef" strokeOpacity={0.13} vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Line type="monotone" dataKey="pagos" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Pagos" />
                      <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Ingresos" />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Gráfico de barras y PieChart: Deuda por categoría */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Distribución de Deuda por Categoría</h4>
                  <div className="flex flex-col items-center">
                    {/* PieChart */}
                    <div className="w-full h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(debtStats.debtsByCategory).map(([cat, value]) => ({
                              name: categoryNames[cat as keyof typeof categoryNames],
                              value,
                              color: categoryColors[cat as keyof typeof categoryColors]
                            }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {Object.entries(debtStats.debtsByCategory).map(([cat], idx) => (
                              <Cell key={cat} fill={
                                cat === 'prestamo' ? '#ef4444' :
                                cat === 'proveedor' ? '#fb923c' :
                                cat === 'equipos' ? '#3b82f6' :
                                cat === 'servicios' ? '#facc15' :
                                '#6b7280'
                              } />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Leyenda PieChart */}
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                      {Object.entries(debtStats.debtsByCategory).map(([cat, value]) => (
                        <div key={cat} className="flex items-center gap-2 text-xs">
                          <span className={`w-3 h-3 rounded-full inline-block ${categoryColors[cat as keyof typeof categoryColors]}`}></span>
                          <span className="font-medium text-gray-700">{categoryNames[cat as keyof typeof categoryNames]}</span>
                          <span className="text-gray-500">{formatCurrency(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Métrica adicional: Deuda promedio por proveedor */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Deuda promedio por proveedor</span>
                    <span className="text-xl font-bold text-blue-800">{formatCurrency(
                      debts.filter(d => d.category === 'proveedor').reduce((sum, d) => sum + d.remainingAmount, 0) /
                      (debts.filter(d => d.category === 'proveedor').length || 1)
                    )}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Total proveedores</span>
                    <span className="text-xl font-bold text-blue-800">{debts.filter(d => d.category === 'proveedor').length}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Total servicios</span>
                    <span className="text-xl font-bold text-blue-800">{debts.filter(d => d.category === 'servicios').length}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Total equipos</span>
                    <span className="text-xl font-bold text-blue-800">{debts.filter(d => d.category === 'equipos').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Debts View */}
        {activeView === 'debts' && (
          <>
            {/* Filtros y Búsqueda */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm mb-6 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar deudas por acreedor o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  >
                    <option value="all">Todas las categorías</option>
                    {Object.entries(categoryNames).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activa">Activa</option>
                    <option value="pagada">Pagada</option>
                    <option value="vencida">Vencida</option>
                    <option value="reestructurada">Reestructurada</option>
                  </select>
                  <button
                    onClick={() => setIsAddDebtOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm whitespace-nowrap"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Agregar Deuda
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Deudas */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">Registro de Deudas</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredDebts.length} de {debts.length} deudas
                </p>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-1 gap-2">
                  {filteredDebts.map((debt) => {
                    const progressPercentage = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
                    return (
                      <div
                        key={debt.id}
                        className="bg-white border border-gray-100 rounded-[6px] px-3 py-2 shadow-none hover:shadow-sm transition-all duration-200 group flex flex-col gap-2 text-xs"
                      >
                        {/* Información principal */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-1">{debt.creditor}</div>
                            <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
                              <span>{debt.description}</span>
                              <span>·</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(debt.status)}`}>
                                {debt.status}
                              </span>
                              <span>·</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getImpactColor(debt.impact)}`}>
                                {impactNames[debt.impact]}
                              </span>
                              <span>·</span>
                              <span>{categoryNames[debt.category]}</span>
                              {debt.interestRate && (
                                <>
                                  <span>·</span>
                                  <span className="text-blue-600">{debt.interestRate}%</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-none"
                            title="Eliminar"
                          >
                            <TrashIcon size={13} />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progreso {progressPercentage.toFixed(1)}%</span>
                            <span className="text-gray-600">Vence: {new Date(debt.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-1.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Detalles financieros */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-red-50 rounded border border-red-200">
                            <p className="text-xs font-bold text-red-700">{formatCurrency(debt.remainingAmount)}</p>
                            <p className="text-[10px] text-red-600">Pendiente</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-bold text-blue-700">{formatCurrency(debt.monthlyPayment)}</p>
                            <p className="text-[10px] text-blue-600">Mensual</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs font-bold text-gray-700">{formatCurrency(debt.totalAmount)}</p>
                            <p className="text-[10px] text-gray-600">Total</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payments View */}
        {activeView === 'payments' && (
          <>
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Pagado</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSignIcon size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pagos Deuda</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payments.filter(p => p.type === 'deuda').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <ClockIcon size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pagos Servicios</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payments.filter(p => p.type === 'servicio').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertTriangleIcon size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pagos Proveedores</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payments.filter(p => p.type === 'proveedor').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSignIcon size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment History */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm animate-slideInUp overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Historial de Pagos</h3>
                    <p className="text-sm text-gray-600 mt-1">Registro de todas las transacciones realizadas</p>
                  </div>
                  <button
                    onClick={() => setIsAddingPayment(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Agregar Pago
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {payments.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <DollarSignIcon size={24} className="text-gray-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No hay pagos registrados</h3>
                      <p className="text-gray-600 mb-4">Aún no se han realizado pagos. Los pagos aparecerán aquí cuando se registren.</p>
                    </div>
                  )}
                  {payments.length > 0 && payments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment) => (
                      <div
                        key={payment.id}
                        className="group relative overflow-hidden rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg border-gray-200 bg-white"
                      >
                        <div className="p-2 flex items-center space-x-2">
                          {/* Payment Type Icon */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                            {payment.type === 'deuda' ? (
                              <ClockIcon size={12} className="text-gray-600" />
                            ) : payment.type === 'servicio' ? (
                              <AlertTriangleIcon size={12} className="text-gray-600" />
                            ) : (
                              <DollarSignIcon size={12} className="text-gray-600" />
                            )}
                          </div>
                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                                  {payment.concept}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="font-medium text-gray-700">
                                    {new Date(payment.date).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-bold text-gray-600">
                                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">{payment.related}</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              <div className="text-center p-1 bg-gray-50 rounded border border-gray-200">
                                <p className="text-xs font-bold text-gray-700">{formatCurrency(payment.amount)}</p>
                                <p className="text-xs text-gray-500">Monto Pagado</p>
                              </div>
                              <div className="text-center p-1 bg-gray-50 rounded border border-gray-200">
                                <p className="text-xs font-bold text-gray-900">{payment.notes || '-'}</p>
                                <p className="text-xs text-gray-500">Notas</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Alerts View */}
        {activeView === 'alerts' && (
          <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Sistema de Alertas de Deudas</h3>
              <p className="text-xs text-gray-600 mt-1">Vencimientos próximos y riesgos operacionales</p>
            </div>
            <div className="p-4">
              {upcomingAlerts.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Alertas Críticas</h4>
                  {upcomingAlerts.map((debt) => {
                    const dueDate = new Date(debt.dueDate)
                    const now = new Date()
                    const diffHours = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60))
                    const diffDays = Math.ceil(diffHours / 24)
                    
                    let alertLevel = 'yellow'
                    let alertText = '7 días'
                    if (diffDays <= 3) {
                      alertLevel = 'orange'
                      alertText = '3 días'
                    }
                    if (diffDays <= 1) {
                      alertLevel = 'red'
                      alertText = '1 día'
                    }

                    return (
                      <div key={debt.id} className={`border-l-4 border-${alertLevel}-500 bg-${alertLevel}-50 p-4 rounded-r-lg`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              debt.impact === 'critico' ? 'bg-red-200' :
                              debt.impact === 'alto' ? 'bg-orange-200' :
                              debt.impact === 'medio' ? 'bg-yellow-200' :
                              'bg-green-200'
                            }`}>
                              {debt.impact === 'critico' ? '🚨' : 
                               debt.impact === 'alto' ? '⚠️' :
                               debt.impact === 'medio' ? '⚡' : '✅'}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{debt.creditor}</h5>
                              <p className="text-sm text-gray-600">
                                {debt.description} • {formatCurrency(debt.remainingAmount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Impacto: {impactNames[debt.impact]} • {categoryNames[debt.category]}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-${alertLevel}-700 font-medium text-sm`}>
                              Vence en {alertText}
                            </span>
                            <p className="text-xs text-gray-500">{dueDate.toLocaleDateString()}</p>
                            <p className="text-xs font-medium text-gray-700">{formatCurrency(debt.monthlyPayment)}/mes</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BellIcon size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">No hay alertas pendientes</h4>
                  <p className="text-gray-600">Todas las deudas están al día</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de 3 pasos para agregar deuda */}
        {isAddDebtOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md" style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-2 p-0 relative animate-fadeInSlide max-h-[95vh] overflow-y-auto border border-gray-200">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => {
                  setIsAddDebtOpen(false)
                  setCurrentStep(1)
                }}
                aria-label="Cerrar"
              >
                <XIcon size={22} />
              </button>
              <div className="px-6 pt-6 pb-2">
                <h3 className="font-bold text-black text-lg mb-1">Agregar nueva deuda</h3>
                <p className="text-xs text-gray-700 mb-4">Paso {currentStep} de 3</p>
              </div>
              <div className="px-6 pb-6">
                {/* Paso 1: Categoría e Impacto */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-black mb-2">Tipo de deuda y impacto</div>
                    <div>
                      <label className="block text-xs font-medium text-black mb-2">Categoría *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(categoryNames).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => setNewDebt({...newDebt, category: key as any})}
                            className={`py-3 px-2 border rounded-lg text-left transition-all duration-200 text-xs font-semibold ${
                              newDebt.category === key 
                                ? 'border-blue-500 bg-blue-50 text-black' 
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black mb-2">Impacto en operaciones *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(impactNames).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => setNewDebt({...newDebt, impact: key as any})}
                            className={`py-3 px-2 border rounded-lg text-left transition-all duration-200 text-xs font-semibold ${
                              newDebt.impact === key 
                                ? 'border-blue-500 bg-blue-50 text-black' 
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {value}
                            <div className="text-[10px] text-gray-500 font-normal mt-1">
                              {key === 'critico' ? 'Puede parar operaciones' :
                               key === 'alto' ? 'Afecta rendimiento' :
                               key === 'medio' ? 'Impacto moderado' :
                               'Impacto mínimo'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Paso 2: Detalles */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-black mb-2">Detalles de la deuda</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Acreedor *</label>
                        <input
                          type="text"
                          value={newDebt.creditor || ''}
                          onChange={(e) => setNewDebt({...newDebt, creditor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="Nombre del acreedor"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Descripción *</label>
                        <input
                          type="text"
                          value={newDebt.description || ''}
                          onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="Descripción de la deuda"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-black mb-1">Monto Total *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newDebt.totalAmount || ''}
                            onChange={(e) => setNewDebt({...newDebt, totalAmount: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-black mb-1">Pago Mensual *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newDebt.monthlyPayment || ''}
                            onChange={(e) => setNewDebt({...newDebt, monthlyPayment: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-black mb-1">Fecha de Inicio</label>
                          <input
                            type="date"
                            value={newDebt.startDate}
                            onChange={(e) => setNewDebt({...newDebt, startDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-black mb-1">Fecha de Vencimiento</label>
                          <input
                            type="date"
                            value={newDebt.dueDate}
                            onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Tasa de Interés (% anual)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newDebt.interestRate || ''}
                          onChange={(e) => setNewDebt({...newDebt, interestRate: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Paso 3: Confirmación */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-black mb-2">Confirmar datos</div>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Acreedor:</span>
                        <span className="font-medium text-black">{newDebt.creditor}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Monto Total:</span>
                        <span className="font-bold text-black">{formatCurrency(newDebt.totalAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Pago Mensual:</span>
                        <span className="font-bold text-black">{formatCurrency(newDebt.monthlyPayment || 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Categoría:</span>
                        <span className="font-medium text-black">{categoryNames[newDebt.category as keyof typeof categoryNames]}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Impacto:</span>
                        <span className="font-medium text-black">{impactNames[newDebt.impact as keyof typeof impactNames]}</span>
                      </div>
                      {newDebt.interestRate && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-700">Interés:</span>
                          <span className="font-medium text-blue-600">{newDebt.interestRate}% anual</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Botones de navegación */}
                <div className="mt-6 flex justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs"
                      >
                        Anterior
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {currentStep < 3 ? (
                      <button
                        onClick={() => {
                          if (currentStep === 1 && newDebt.category && newDebt.impact) {
                            setCurrentStep(2)
                          } else if (currentStep === 2 && newDebt.creditor && newDebt.description && newDebt.totalAmount && newDebt.monthlyPayment) {
                            setCurrentStep(3)
                          }
                        }}
                        disabled={
                          (currentStep === 1 && (!newDebt.category || !newDebt.impact)) ||
                          (currentStep === 2 && (!newDebt.creditor || !newDebt.description || !newDebt.totalAmount || !newDebt.monthlyPayment))
                        }
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        Siguiente
                      </button>
                    ) : (
                      <button
                        onClick={handleAddDebt}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 flex items-center text-xs"
                      >
                        <SaveIcon size={14} className="mr-2" />
                        Guardar Deuda
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar pago */}
        {isAddingPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-[12px] shadow-2xl max-w-lg w-full mx-4 p-6 relative animate-fadeInSlide">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setIsAddingPayment(false)}
                aria-label="Cerrar"
              >
                <XIcon size={22} />
              </button>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">Registrar Nuevo Pago</h3>
              <p className="text-xs text-gray-500 mb-4">Registra un pago realizado</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Pago</label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({...newPayment, type: e.target.value as any, selectedDebtId: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                  >
                    <option value="deuda">Pago de Deuda</option>
                    <option value="servicio">Pago de Servicio</option>
                    <option value="proveedor">Pago a Proveedor</option>
                    <option value="otros">Otro Pago</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del Pago</label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                  />
                </div>

                {newPayment.type === 'deuda' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Deuda</label>
                    <select
                      value={newPayment.selectedDebtId}
                      onChange={(e) => {
                        const debt = debts.find(d => d.id === e.target.value)
                        setNewPayment({
                          ...newPayment, 
                          selectedDebtId: e.target.value,
                          concept: debt ? `Pago a ${debt.creditor}` : '',
                          related: debt ? debt.creditor : ''
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                    >
                      <option value="">Selecciona una deuda...</option>
                      {debts.filter(debt => debt.remainingAmount > 0).map(debt => (
                        <option key={debt.id} value={debt.id}>
                          {debt.creditor} - {formatCurrency(debt.remainingAmount)} pendiente
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Concepto</label>
                  <input
                    type="text"
                    value={newPayment.concept}
                    onChange={(e) => setNewPayment({...newPayment, concept: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                    placeholder="Descripción del pago"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entidad/Proveedor</label>
                  <input
                    type="text"
                    value={newPayment.related}
                    onChange={(e) => setNewPayment({...newPayment, related: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                    placeholder="Nombre de la entidad o proveedor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto Pagado</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                  <input
                    type="text"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                    placeholder="Notas adicionales"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setNewPayment({
                    date: new Date().toISOString().split('T')[0],
                    amount: '',
                    type: 'deuda',
                    concept: '',
                    related: '',
                    notes: '',
                    selectedDebtId: ''
                  })}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleAddPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <SaveIcon size={16} className="mr-2" />
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón flotante para mobile */}
        <button
          onClick={() => setIsAddDebtOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center md:hidden z-40 hover:scale-110"
        >
          <PlusIcon size={24} />
        </button>
      </div>
    </div>
  )
} 