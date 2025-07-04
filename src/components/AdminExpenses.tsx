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
  UserIcon,
  AlertTriangleIcon
} from './icons'

interface Expense {
  id: string
  category: 'nomina' | 'servicios' | 'inventario' | 'mantenimiento' | 'marketing' | 'otros'
  description: string
  amount: number
  date: string
  type: 'fijo' | 'variable'
  status: 'pagado' | 'pendiente' | 'programado'
  dueDate?: string
  employeeId?: string
  recurring: boolean
  notes?: string
}

interface Employee {
  id: string
  name: string
  position: string
  salary: number
  payrollType: 'mensual' | 'quincenal' | 'semanal'
  startDate: string
  status: 'activo' | 'inactivo'
}

interface ExpenseStats {
  totalMonth: number
  totalYear: number
  byCategory: { [key: string]: number }
  pendingPayments: number
  averageMonthly: number
}

export function AdminExpenses() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'payroll' | 'expenses'>('overview')
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const { formatCurrency, getFontSizeClass } = useConfig()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - En producción vendría de tu API
  const employees: Employee[] = [
    {
      id: '1',
      name: 'Carlos Martínez',
      position: 'Mesero Senior',
      salary: 1200.00,
      payrollType: 'mensual',
      startDate: '2023-01-15',
      status: 'activo'
    },
    {
      id: '2',
      name: 'Ana López',
      position: 'Mesera',
      salary: 1000.00,
      payrollType: 'mensual',
      startDate: '2023-03-01',
      status: 'activo'
    },
    {
      id: '3',
      name: 'Miguel Rodríguez',
      position: 'Chef Principal',
      salary: 1800.00,
      payrollType: 'mensual',
      startDate: '2022-11-01',
      status: 'activo'
    },
    {
      id: '4',
      name: 'Laura Santos',
      position: 'Supervisora',
      salary: 1400.00,
      payrollType: 'mensual',
      startDate: '2023-02-15',
      status: 'activo'
    },
    {
      id: '5',
      name: 'David Pérez',
      position: 'Cocinero',
      salary: 1100.00,
      payrollType: 'mensual',
      startDate: '2023-04-01',
      status: 'activo'
    }
  ]

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      category: 'nomina',
      description: 'Nómina Enero 2024',
      amount: 6500.00,
      date: '2024-01-31',
      type: 'fijo',
      status: 'pagado',
      recurring: true
    },
    {
      id: '2',
      category: 'servicios',
      description: 'Electricidad',
      amount: 450.30,
      date: '2024-01-15',
      type: 'variable',
      status: 'pagado',
      dueDate: '2024-02-15',
      recurring: true
    },
    {
      id: '3',
      category: 'inventario',
      description: 'Compra de ingredientes',
      amount: 1200.80,
      date: '2024-01-10',
      type: 'variable',
      status: 'pagado',
      recurring: false
    },
    {
      id: '4',
      category: 'servicios',
      description: 'Internet y Telefonía',
      amount: 89.99,
      date: '2024-01-05',
      type: 'fijo',
      status: 'pagado',
      dueDate: '2024-02-05',
      recurring: true
    },
    {
      id: '5',
      category: 'mantenimiento',
      description: 'Reparación de equipos',
      amount: 320.00,
      date: '2024-01-12',
      type: 'variable',
      status: 'pendiente',
      recurring: false
    },
    {
      id: '6',
      category: 'marketing',
      description: 'Publicidad en redes sociales',
      amount: 150.00,
      date: '2024-01-08',
      type: 'fijo',
      status: 'programado',
      dueDate: '2024-02-08',
      recurring: true
    }
  ])

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'otros',
    type: 'variable',
    status: 'pendiente',
    recurring: false,
    date: new Date().toISOString().split('T')[0]
  })

  const expenseStats: ExpenseStats = {
    totalMonth: expenses.filter(e => e.date.startsWith('2024-01')).reduce((sum, e) => sum + e.amount, 0),
    totalYear: expenses.reduce((sum, e) => sum + e.amount, 0),
    byCategory: expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {} as { [key: string]: number }),
    pendingPayments: expenses.filter(e => e.status === 'pendiente').length,
    averageMonthly: expenses.reduce((sum, e) => sum + e.amount, 0) / 12
  }

  const categoryColors = {
    nomina: 'bg-blue-500',
    servicios: 'bg-yellow-500',
    inventario: 'bg-green-500',
    mantenimiento: 'bg-red-500',
    marketing: 'bg-purple-500',
    otros: 'bg-gray-500'
  }

  const categoryNames = {
    nomina: 'Nómina',
    servicios: 'Servicios',
    inventario: 'Inventario',
    mantenimiento: 'Mantenimiento',
    marketing: 'Marketing',
    otros: 'Otros'
  }

  // Colores para degradado de barras
  const categoryGradients = {
    nomina: 'linear-gradient(90deg, #60a5fa 0%, #1e40af 100%)', // blue-400 to blue-900
    servicios: 'linear-gradient(90deg, #fde68a 0%, #b45309 100%)', // yellow-300 to yellow-800
    inventario: 'linear-gradient(90deg, #6ee7b7 0%, #065f46 100%)', // green-300 to green-900
    mantenimiento: 'linear-gradient(90deg, #fca5a5 0%, #991b1b 100%)', // red-300 to red-900
    marketing: 'linear-gradient(90deg, #c4b5fd 0%, #6d28d9 100%)', // purple-300 to purple-800
    otros: 'linear-gradient(90deg, #d1d5db 0%, #374151 100%)', // gray-300 to gray-800
  }

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category as any,
        description: newExpense.description,
        amount: newExpense.amount,
        date: newExpense.date || new Date().toISOString().split('T')[0],
        type: newExpense.type as any,
        status: newExpense.status as any,
        recurring: newExpense.recurring || false,
        dueDate: newExpense.dueDate,
        notes: newExpense.notes
      }
      setExpenses([...expenses, expense])
      setNewExpense({
        category: 'otros',
        type: 'variable',
        status: 'pendiente',
        recurring: false,
        date: new Date().toISOString().split('T')[0]
      })
      setIsAddExpenseModalOpen(false)
    }
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-red-100 text-red-800'
      case 'programado': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pagado': return '•'
      case 'pendiente': return '•'
      case 'programado': return '•'
      default: return '•'
    }
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
            Control de gastos operativos y nómina del restaurante
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <nav className="bg-white rounded-[12px] shadow-sm flex px-1 py-1 gap-1">
              {[
                { id: 'overview', label: 'Resumen' },
                { id: 'payroll', label: 'Nómina' },
                { id: 'expenses', label: 'Gastos' }
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
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4 mb-8">
              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-red-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-red-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '0ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Este Mes</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(expenseStats.totalMonth)}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Gastos totales</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-orange-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-orange-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Nómina</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(expenseStats.byCategory.nomina || 0)}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Personal</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-yellow-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-yellow-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Pendientes</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{expenseStats.pendingPayments}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Por pagar</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-blue-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-blue-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Promedio</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(expenseStats.averageMonthly)}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Mensual</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp mb-8" style={{ animationDelay: '400ms' }}>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Gastos por Categoría</h3>
                <p className="text-xs text-gray-600 mt-1">Distribución del gasto total</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {Object.entries(expenseStats.byCategory).map(([category, amount]) => {
                    const percent = expenseStats.totalMonth > 0 ? (amount / expenseStats.totalMonth) * 100 : 0;
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

        {/* Payroll Tab */}
        {activeTab === 'payroll' && (
          <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Nómina del Personal</h3>
                  <p className="text-xs text-gray-600 mt-1">Salarios y información del personal</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total mensual:</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(employees.reduce((sum, emp) => sum + emp.salary, 0))}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <UserIcon size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">Desde: {new Date(employee.startDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(employee.salary)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {employee.payrollType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Registro de Gastos</h3>
                  <p className="text-xs text-gray-600 mt-1">Todos los gastos operativos</p>
                </div>
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Agregar Gasto
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white border border-gray-100 rounded-[8px] p-3 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-row items-center gap-2 min-h-[56px]"
                  >
                    {/* Contenido principal a la izquierda */}
                    <div className="flex flex-col justify-center min-h-[40px] flex-1">
                      <h4 className="font-semibold text-gray-900 truncate text-sm leading-tight text-left mb-1">
                        {expense.description}
                      </h4>
                      <div className="flex items-center gap-x-2 gap-y-1 text-xs text-gray-400 flex-wrap min-w-0">
                        <div className={`w-2 h-2 rounded-full ${categoryColors[expense.category]} flex-shrink-0`}></div>
                        <span>{categoryNames[expense.category]}</span>
                        <span>·</span>
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className={expense.type === 'fijo' ? 'text-blue-500' : 'text-orange-500'}>{expense.type}</span>
                        {expense.recurring && <><span>·</span><span className="text-blue-400">Recurrente</span></>}
                        {expense.notes && <><span>·</span><span className="italic text-gray-300 truncate max-w-[100px]">{expense.notes}</span></>}
                      </div>
                    </div>
                    {/* Bloque horizontal a la derecha */}
                    <div className="flex flex-row items-center gap-2 ml-2">
                      <span className="text-base font-bold text-blue-700 leading-none select-text" style={{minWidth: 60, textAlign: 'right'}}>{formatCurrency(expense.amount)}</span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(expense.status)}`}
                        style={{ minWidth: 54, textTransform: 'capitalize', background: 'white', borderWidth: 1 }}>
                        <span className={`w-2 h-2 rounded-full ${
                          expense.status === 'pagado' ? 'bg-green-400' : expense.status === 'pendiente' ? 'bg-red-400' : 'bg-yellow-300'
                        }`}></span>
                        {expense.status}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm"
                        title="Eliminar"
                        style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar gasto */}
        {isAddExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white rounded-[12px] shadow-2xl max-w-lg w-full mx-4 p-6 relative animate-fadeInSlide">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setIsAddExpenseModalOpen(false)}
                aria-label="Cerrar"
              >
                <XIcon size={22} />
              </button>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">Agregar Nuevo Gasto</h3>
              <p className="text-xs text-gray-500 mb-4">Registra un nuevo gasto operativo</p>
              {/* Formulario de agregar gasto (reutilizado del tab 'add') */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <input
                    type="text"
                    value={newExpense.description || ''}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="Descripción del gasto"
                  />
                </div>
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    value={newExpense.amount || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/,/g, '.');
                      setNewExpense({ ...newExpense, amount: val === '' ? undefined : parseFloat(val) });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black appearance-none"
                    placeholder="0.00"
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  >
                    {Object.entries(categoryNames).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={newExpense.type}
                    onChange={(e) => setNewExpense({...newExpense, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  >
                    <option value="variable">Variable</option>
                    <option value="fijo">Fijo</option>
                  </select>
                </div>
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  />
                </div>
                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={newExpense.status}
                    onChange={(e) => setNewExpense({...newExpense, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="programado">Programado</option>
                  </select>
                </div>
                {/* Recurrente */}
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newExpense.recurring}
                      onChange={(e) => setNewExpense({...newExpense, recurring: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Gasto recurrente</span>
                  </label>
                </div>
                {/* Notas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                  <textarea
                    value={newExpense.notes || ''}
                    onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    rows={3}
                    placeholder="Notas adicionales sobre este gasto..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setNewExpense({
                    category: 'otros',
                    type: 'variable',
                    status: 'pendiente',
                    recurring: false,
                    date: new Date().toISOString().split('T')[0]
                  })}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => {
                    handleAddExpense();
                    setIsAddExpenseModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <SaveIcon size={16} className="mr-2" />
                  Guardar Gasto
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
} 