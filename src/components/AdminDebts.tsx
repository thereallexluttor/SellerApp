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
  ClockIcon
} from './icons'

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
  debtsByCategory: { [key: string]: number }
}

export function AdminDebts() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'debts' | 'add' | 'payments'>('overview')
  const [isAddingDebt, setIsAddingDebt] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [editingDebt, setEditingDebt] = useState<string | null>(null)
  const [selectedDebt, setSelectedDebt] = useState<string | null>(null)
  const { formatCurrency, getFontSizeClass } = useConfig()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - En producción vendría de tu API
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
      status: 'activa',
      category: 'proveedor',
      priority: 'alta',
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
      paymentHistory: []
    }
  ])

  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    category: 'otros',
    status: 'activa',
    priority: 'media',
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
    },
    {
      id: 'p4',
      date: '2024-06-04',
      amount: 750,
      type: 'deuda',
      concept: 'Pago mensual remodelación',
      related: 'Constructora Mejoras',
      notes: '',
    },
  ])

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
    debtsByCategory: debts.reduce((acc, debt) => {
      acc[debt.category] = (acc[debt.category] || 0) + debt.remainingAmount
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

  // Colores para degradado de barras
  const categoryGradients = {
    prestamo: 'linear-gradient(90deg, #fca5a5 0%, #991b1b 100%)', // red-300 to red-900
    proveedor: 'linear-gradient(90deg, #fdba74 0%, #c2410c 100%)', // orange-300 to orange-800
    equipos: 'linear-gradient(90deg, #60a5fa 0%, #1e40af 100%)', // blue-400 to blue-900
    servicios: 'linear-gradient(90deg, #fde68a 0%, #b45309 100%)', // yellow-300 to yellow-800
    otros: 'linear-gradient(90deg, #d1d5db 0%, #374151 100%)', // gray-300 to gray-800
  }

  const priorityColors = {
    alta: 'bg-red-100 text-red-800',
    media: 'bg-yellow-100 text-yellow-800',
    baja: 'bg-green-100 text-green-800'
  }

  const statusColors = {
    activa: 'bg-blue-100 text-blue-800',
    pagada: 'bg-green-100 text-green-800',
    vencida: 'bg-red-100 text-red-800',
    reestructurada: 'bg-purple-100 text-purple-800'
  }

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
        notes: newDebt.notes,
        paymentHistory: []
      }
      setDebts([...debts, debt])
      setNewDebt({
        category: 'otros',
        status: 'activa',
        priority: 'media',
        startDate: new Date().toISOString().split('T')[0],
        paymentHistory: []
      })
      setIsAddingDebt(false)
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
      
      // Si es un pago de deuda, actualizar el remainingAmount
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activa': return '🔄'
      case 'pagada': return '✅'
      case 'vencida': return '⚠️'
      case 'reestructurada': return '📝'
      default: return '❓'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`}
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="flex-1 flex flex-col p-4 lg:p-6 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          
          <p className="text-gray-600 font-medium text-sm lg:text-base">
            Control y seguimiento de obligaciones financieras
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <nav className="bg-white rounded-[12px] shadow-sm flex px-1 py-1 gap-1">
              {[
                { id: 'overview', label: 'Resumen' },
                { id: 'debts', label: 'Deudas' },
                { id: 'payments', label: 'Pagos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-[8px] font-semibold text-sm transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                  `}
                  style={{ minWidth: 90 }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Urgent Debts Alert */}
            {debtStats.overdueDebts > 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 animate-slideInUp" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center justify-center text-center">
                    <AlertTriangleIcon size={18} className="text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-800 font-medium text-sm">¡Atención! Deudas Vencidas</h3>
                      <p className="text-red-700 text-xs mt-1">
                        Tienes {debtStats.overdueDebts} deuda(s) vencida(s) que requieren atención inmediata.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4 mb-8">
              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-red-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-red-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Total Deudas</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(debtStats.totalDebts)}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Por pagar</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-orange-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-orange-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Pago Mensual</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(debtStats.totalMonthlyPayments)}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Comprometido</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-yellow-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-yellow-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Vencidas</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{debtStats.overdueDebts}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Urgentes</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-blue-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-blue-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '400ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Próximos 30d</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{debtStats.nextPaymentsDue}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Por vencer</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp mb-8" style={{ animationDelay: '500ms' }}>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Deudas por Categoría</h3>
                <p className="text-xs text-gray-600 mt-1">Distribución de obligaciones</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {Object.entries(debtStats.debtsByCategory).map(([category, amount]) => {
                    const percent = debtStats.totalDebts > 0 ? (amount / debtStats.totalDebts) * 100 : 0;
                    const gradient = categoryGradients[category as keyof typeof categoryGradients];
                    return (
                      <div key={category} className="flex flex-col">
                        <div className="flex flex-row items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded ${categoryColors[category as keyof typeof categoryColors]} mr-2`}></div>
                            <span className="font-medium text-gray-900 text-sm">{categoryNames[category as keyof typeof categoryNames]}</span>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{formatCurrency(amount)}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden mr-2">
                            <div
                              className={`h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${percent}%`, minWidth: percent > 0 ? '8px' : '0', background: gradient }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 min-w-[32px] text-right">{percent.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

                {/* Debts Tab */}
        {activeTab === 'debts' && (
          <>
            {/* Debt Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Total Deudas</p>
                    <p className="text-2xl font-bold text-red-800">
                      {formatCurrency(debtStats.totalDebts)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                    <DollarSignIcon size={20} className="text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Pago Mensual</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {formatCurrency(debtStats.totalMonthlyPayments)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <CalendarIcon size={20} className="text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Vencidas</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {debtStats.overdueDebts}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                    <AlertTriangleIcon size={20} className="text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Próximas 30d</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {debtStats.nextPaymentsDue}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <ClockIcon size={20} className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Debts List */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Registro de Deudas</h3>
                  <p className="text-xs text-gray-600 mt-1">Todas las obligaciones financieras</p>
                </div>
                <button
                  onClick={() => setIsAddingDebt(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Agregar Deuda
                </button>
              </div>
            </div>
              <div className="p-4">
                                <div className="space-y-2">
                {debts.map((debt) => {
                  const progressPercentage = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
                  return (
                    <div
                      key={debt.id}
                      className={`group relative overflow-hidden rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg ${
                        debt.status === 'vencida' 
                          ? 'border-red-300 bg-gradient-to-r from-red-50 to-red-100' 
                          : debt.status === 'activa'
                            ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100'
                            : debt.status === 'pagada'
                              ? 'border-green-300 bg-gradient-to-r from-green-50 to-green-100'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Priority Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          debt.priority === 'alta' ? 'bg-red-100 text-red-800' :
                          debt.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {debt.priority === 'alta' ? '🔥' : debt.priority === 'media' ? '⚡' : '✅'} {debt.priority}
                        </span>
                      </div>

                      <div className="p-2">
                        <div className="flex items-center space-x-2">
                          {/* Status Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            debt.status === 'vencida' ? 'bg-red-200' :
                            debt.status === 'activa' ? 'bg-blue-200' :
                            debt.status === 'pagada' ? 'bg-green-200' :
                            'bg-gray-200'
                          }`}>
                            {debt.status === 'vencida' ? (
                              <AlertTriangleIcon size={12} className="text-red-600" />
                            ) : debt.status === 'activa' ? (
                              <ClockIcon size={12} className="text-blue-600" />
                            ) : (
                              <DollarSignIcon size={12} className="text-green-600" />
                            )}
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                                  {debt.creditor}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <div className={`w-1 h-1 rounded-full ${categoryColors[debt.category]}`}></div>
                                    <span className="text-gray-600">{categoryNames[debt.category]}</span>
                                  </div>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600 truncate max-w-[120px]">{debt.description}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className={`font-bold ${
                                    debt.status === 'vencida' ? 'text-red-600' :
                                    debt.status === 'activa' ? 'text-blue-600' :
                                    'text-green-600'
                                  }`}>
                                    {debt.status}
                                  </span>
                                  {debt.interestRate && (
                                    <>
                                      <span className="text-gray-400">•</span>
                                      <span className="text-blue-600">{debt.interestRate}%</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-1 mb-2">
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-gray-600">Progreso {progressPercentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                                <div 
                                  className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div className="grid grid-cols-3 gap-1">
                              <div className="text-center p-1 bg-white rounded border border-gray-200">
                                <p className="text-xs font-bold text-red-600">{formatCurrency(debt.remainingAmount)}</p>
                                <p className="text-xs text-gray-500">Pendiente</p>
                              </div>
                              <div className="text-center p-1 bg-white rounded border border-gray-200">
                                <p className="text-xs font-bold text-blue-600">{formatCurrency(debt.monthlyPayment)}</p>
                                <p className="text-xs text-gray-500">Mensual</p>
                              </div>
                              <div className="text-center p-1 bg-white rounded border border-gray-200">
                                <p className="text-xs font-bold text-gray-900">{formatCurrency(debt.totalAmount)}</p>
                                <p className="text-xs text-gray-500">Total</p>
                              </div>
                            </div>

                            {/* Interest Rate Info */}
                            {debt.interestRate && (
                              <div className="mt-1 p-1 bg-blue-50 rounded border border-blue-200">
                                <span className="text-xs font-medium text-blue-800">
                                  {debt.interestRate}% interés anual
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm"
                            title="Eliminar"
                          >
                            <TrashIcon size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                </div>
              </div>
            </div>

            {/* Modal para agregar deuda */}
            {isAddingDebt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                <div className="bg-white rounded-[12px] shadow-2xl max-w-lg w-full mx-4 p-6 relative animate-fadeInSlide">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                    onClick={() => setIsAddingDebt(false)}
                    aria-label="Cerrar"
                  >
                    <XIcon size={22} />
                  </button>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">Agregar Nueva Deuda</h3>
                  <p className="text-xs text-gray-500 mb-4">Registra una nueva obligación financiera</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Acreedor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Acreedor</label>
                      <input
                        type="text"
                        value={newDebt.creditor || ''}
                        onChange={(e) => setNewDebt({...newDebt, creditor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                        placeholder="Nombre del acreedor"
                      />
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <input
                        type="text"
                        value={newDebt.description || ''}
                        onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                        placeholder="Descripción de la deuda"
                      />
                    </div>

                    {/* Monto Total */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monto Total</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        value={newDebt.totalAmount || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, '.');
                          setNewDebt({ ...newDebt, totalAmount: val === '' ? undefined : parseFloat(val) });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black appearance-none"
                        placeholder="0.00"
                        step="0.01"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>

                    {/* Monto Restante */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monto Restante</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        value={newDebt.remainingAmount || newDebt.totalAmount || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, '.');
                          setNewDebt({ ...newDebt, remainingAmount: val === '' ? undefined : parseFloat(val) });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black appearance-none"
                        placeholder="0.00"
                        step="0.01"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>

                    {/* Pago Mensual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pago Mensual</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        value={newDebt.monthlyPayment || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, '.');
                          setNewDebt({ ...newDebt, monthlyPayment: val === '' ? undefined : parseFloat(val) });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black appearance-none"
                        placeholder="0.00"
                        step="0.01"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>

                    {/* Tasa de Interés */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Interés (% anual)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        value={newDebt.interestRate || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, '.');
                          setNewDebt({ ...newDebt, interestRate: val === '' ? undefined : parseFloat(val) });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black appearance-none"
                        placeholder="0.0"
                        step="0.1"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select
                        value={newDebt.category}
                        onChange={(e) => setNewDebt({...newDebt, category: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                      >
                        {Object.entries(categoryNames).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>

                    {/* Prioridad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                      <select
                        value={newDebt.priority}
                        onChange={(e) => setNewDebt({...newDebt, priority: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                      >
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                      </select>
                    </div>

                    {/* Fecha de Inicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                      <input
                        type="date"
                        value={newDebt.startDate}
                        onChange={(e) => setNewDebt({...newDebt, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                      />
                    </div>

                    {/* Fecha de Vencimiento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
                      <input
                        type="date"
                        value={newDebt.dueDate}
                        onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                      />
                    </div>

                    {/* Notas */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                      <textarea
                        value={newDebt.notes || ''}
                        onChange={(e) => setNewDebt({...newDebt, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black"
                        rows={3}
                        placeholder="Notas adicionales sobre esta deuda..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setNewDebt({
                        category: 'otros',
                        status: 'activa',
                        priority: 'media',
                        startDate: new Date().toISOString().split('T')[0],
                        paymentHistory: []
                      })}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Limpiar
                    </button>
                                    <button
                  onClick={() => {
                    handleAddDebt();
                    setIsAddingDebt(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <SaveIcon size={16} className="mr-2" />
                  Guardar Deuda
                </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <>
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Pagado</p>
                    <p className="text-2xl font-bold text-green-800">
                      {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <DollarSignIcon size={20} className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Pagos Deuda</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {formatCurrency(payments.filter(p => p.type === 'deuda').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <ClockIcon size={20} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Pagos Servicios</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {formatCurrency(payments.filter(p => p.type === 'servicio').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                    <AlertTriangleIcon size={20} className="text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Pagos Proveedores</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {formatCurrency(payments.filter(p => p.type === 'proveedor').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <DollarSignIcon size={20} className="text-orange-600" />
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
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                        <span className="text-gray-600">📝</span>
                        <span className="text-sm font-medium text-gray-800">Registra tu primer pago</span>
                      </div>
                    </div>
                  )}
                  {payments.length > 0 && payments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment) => (
                      <div
                        key={payment.id}
                        className={`group relative overflow-hidden rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg ${
                          payment.type === 'deuda' 
                            ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100' 
                            : payment.type === 'servicio'
                              ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100'
                              : 'border-orange-300 bg-gradient-to-r from-orange-50 to-orange-100'
                        }`}
                      >
                        <div className="p-2 flex items-center space-x-2">
                          {/* Payment Type Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            payment.type === 'deuda' ? 'bg-blue-200' :
                            payment.type === 'servicio' ? 'bg-yellow-200' :
                            'bg-orange-200'
                          }`}>
                            {payment.type === 'deuda' ? (
                              <ClockIcon size={12} className="text-blue-600" />
                            ) : payment.type === 'servicio' ? (
                              <AlertTriangleIcon size={12} className="text-yellow-600" />
                            ) : (
                              <DollarSignIcon size={12} className="text-orange-600" />
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
                                  <span className={`font-bold ${
                                    payment.type === 'deuda' ? 'text-blue-600' :
                                    payment.type === 'servicio' ? 'text-yellow-600' :
                                    'text-orange-600'
                                  }`}>
                                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">{payment.related}</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              <div className="text-center p-1 bg-white rounded border border-gray-200">
                                <p className="text-xs font-bold text-green-700">{formatCurrency(payment.amount)}</p>
                                <p className="text-xs text-gray-500">Monto Pagado</p>
                              </div>
                              <div className="text-center p-1 bg-white rounded border border-gray-200">
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
                    {/* Tipo de Pago */}
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

                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del Pago</label>
                      <input
                        type="date"
                        value={newPayment.date}
                        onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                      />
                    </div>

                    {/* Selección de Deuda (solo si es tipo deuda) */}
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

                    {/* Concepto */}
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

                    {/* Entidad/Proveedor */}
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

                    {/* Monto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monto Pagado</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        value={newPayment.amount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, '.');
                          setNewPayment({ ...newPayment, amount: val });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black appearance-none"
                        placeholder="0.00"
                        step="0.01"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>

                    {/* Notas */}
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
          </>
        )}
      </div>
    </div>
  )
} 