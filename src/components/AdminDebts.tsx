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
      className={`h-full overflow-y-auto bg-gray-50 transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${getFontSizeClass()}`} 
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 tracking-tight">
            📋 Gestión de Deudas
          </h1>
          <p className="text-gray-600 font-medium text-sm lg:text-base">
            Control y seguimiento de obligaciones financieras
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Resumen', icon: '📊' },
                { id: 'debts', label: 'Deudas', icon: '💳' },
                { id: 'add', label: 'Agregar', icon: '➕' },
                { id: 'payments', label: 'Pagos', icon: '💰' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4 mb-8">
              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-red-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '0ms', backdropFilter: 'blur(10px)' }}>
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
                  <div className="bg-orange-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
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
                  <div className="bg-yellow-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
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
                  <div className="bg-blue-100 backdrop-blur-sm rounded px-3 py-4 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200 h-28 lg:h-32 xl:h-36 flex flex-col justify-between config-font-medium" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
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

            {/* Urgent Debts Alert */}
            {debtStats.overdueDebts > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-8 animate-slideInUp" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center">
                  <AlertTriangleIcon size={20} className="text-red-500 mr-3" />
                  <div>
                    <h3 className="text-red-800 font-medium">¡Atención! Deudas Vencidas</h3>
                    <p className="text-red-700 text-sm mt-1">
                      Tienes {debtStats.overdueDebts} deuda(s) vencida(s) que requieren atención inmediata.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp mb-8" style={{ animationDelay: '500ms' }}>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Deudas por Categoría</h3>
                <p className="text-xs text-gray-600 mt-1">Distribución de obligaciones</p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {Object.entries(debtStats.debtsByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded ${categoryColors[category as keyof typeof categoryColors]} mr-3`}></div>
                        <span className="font-medium text-gray-900">{categoryNames[category as keyof typeof categoryNames]}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                        <div className="text-xs text-gray-500">
                          {((amount / debtStats.totalDebts) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Debts Tab */}
        {activeTab === 'debts' && (
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Registro de Deudas</h3>
                  <p className="text-xs text-gray-600 mt-1">Todas las obligaciones financieras</p>
                </div>
                <button
                  onClick={() => setIsAddingDebt(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 flex items-center text-sm"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Agregar Deuda
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className={`w-3 h-3 rounded-full ${categoryColors[debt.category]} mr-3`}></div>
                          <h4 className="font-bold text-gray-900">{debt.creditor}</h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[debt.status]}`}>
                            {getStatusIcon(debt.status)} {debt.status}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[debt.priority]}`}>
                            {debt.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3">{debt.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <p className="font-bold text-gray-900">{formatCurrency(debt.totalAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Pendiente:</span>
                            <p className="font-bold text-red-600">{formatCurrency(debt.remainingAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Pago Mensual:</span>
                            <p className="font-bold text-blue-600">{formatCurrency(debt.monthlyPayment)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Vencimiento:</span>
                            <p className="font-bold text-gray-900">
                              {new Date(debt.dueDate).toLocaleDateString()}
                            </p>
                            {getDaysUntilDue(debt.dueDate) <= 30 && getDaysUntilDue(debt.dueDate) >= 0 && (
                              <p className="text-xs text-orange-600 font-medium">
                                {getDaysUntilDue(debt.dueDate)} días
                              </p>
                            )}
                          </div>
                        </div>

                        {debt.interestRate && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Tasa de interés: </span>
                            <span className="font-medium text-gray-700">{debt.interestRate}% anual</span>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso de pago</span>
                            <span>{((debt.totalAmount - debt.remainingAmount) / debt.totalAmount * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleDeleteDebt(debt.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors duration-200"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Debt Tab */}
        {activeTab === 'add' && (
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Agregar Nueva Deuda</h3>
              <p className="text-xs text-gray-600 mt-1">Registra una nueva obligación financiera</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Acreedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acreedor</label>
                  <input
                    type="text"
                    value={newDebt.creditor || ''}
                    onChange={(e) => setNewDebt({...newDebt, creditor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Descripción de la deuda"
                  />
                </div>

                {/* Monto Total */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto Total</label>
                  <input
                    type="number"
                    value={newDebt.totalAmount || ''}
                    onChange={(e) => setNewDebt({...newDebt, totalAmount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Monto Restante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto Restante</label>
                  <input
                    type="number"
                    value={newDebt.remainingAmount || newDebt.totalAmount || ''}
                    onChange={(e) => setNewDebt({...newDebt, remainingAmount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Pago Mensual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pago Mensual</label>
                  <input
                    type="number"
                    value={newDebt.monthlyPayment || ''}
                    onChange={(e) => setNewDebt({...newDebt, monthlyPayment: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Tasa de Interés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tasa de Interés (% anual)</label>
                  <input
                    type="number"
                    value={newDebt.interestRate || ''}
                    onChange={(e) => setNewDebt({...newDebt, interestRate: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.0"
                    step="0.1"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={newDebt.category}
                    onChange={(e) => setNewDebt({...newDebt, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Fecha de Vencimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Notas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                  <textarea
                    value={newDebt.notes || ''}
                    onChange={(e) => setNewDebt({...newDebt, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  onClick={handleAddDebt}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 flex items-center"
                >
                  <SaveIcon size={16} className="mr-2" />
                  Guardar Deuda
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Calendario de Pagos</h3>
              <p className="text-xs text-gray-600 mt-1">Próximos vencimientos y pagos programados</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {debts
                  .filter(debt => debt.status === 'activa' || debt.status === 'vencida')
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((debt) => {
                    const daysUntilDue = getDaysUntilDue(debt.dueDate)
                    return (
                      <div key={debt.id} className={`p-4 rounded border-2 ${
                        debt.status === 'vencida' ? 'border-red-300 bg-red-50' :
                        daysUntilDue <= 7 ? 'border-orange-300 bg-orange-50' :
                        daysUntilDue <= 30 ? 'border-yellow-300 bg-yellow-50' :
                        'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{debt.creditor}</h4>
                            <p className="text-sm text-gray-600">{debt.description}</p>
                            <div className="flex items-center mt-2 space-x-4 text-sm">
                              <span className="font-medium">Vence: {new Date(debt.dueDate).toLocaleDateString()}</span>
                              {debt.status === 'vencida' ? (
                                <span className="text-red-600 font-bold">¡VENCIDA!</span>
                              ) : daysUntilDue <= 7 ? (
                                <span className="text-orange-600 font-bold">¡Próximo a vencer! ({daysUntilDue} días)</span>
                              ) : (
                                <span className="text-gray-600">En {daysUntilDue} días</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(debt.monthlyPayment)}</p>
                            <p className="text-sm text-gray-500">Pago requerido</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 