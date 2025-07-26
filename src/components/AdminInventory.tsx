import { useState, useEffect } from 'react'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import { useConfig } from '../contexts/ConfigContext'
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  AlertTriangleIcon,
  SaveIcon,
  XIcon,
  DollarSignIcon,
  ClockIcon,
  BellIcon,
  TrendingUpIcon,
  FilterIcon,
  SearchIcon,
  ShoppingCartIcon,
  HistoryIcon,
  MinusIcon
} from './icons'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, YAxis, XAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  price: number
  supplier: string
  lastUpdated: string
  status: 'disponible' | 'bajo' | 'agotado'
  cost: number
  location: string
  expirationDate?: string
  lastMovement?: string
  avgConsumption: number // productos por semana
}

interface StockMovement {
  id: string
  itemId: string
  itemName: string
  type: 'entrada' | 'salida' | 'ajuste' | 'perdida'
  quantity: number
  date: string
  reason: string
  user: string
  notes?: string
}

interface InventoryStats {
  totalItems: number
  totalValue: number
  totalCost: number
  lowStockItems: number
  outOfStockItems: number
  expiringItems: number
  avgTurnover: number
  inventoryEfficiency: number
  wasteValue: number
  itemsByCategory: { [key: string]: number }
  stockByCategory: { [key: string]: number }
  valueByCategory: { [key: string]: number }
}

export function AdminInventory() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<'analytics' | 'inventory' | 'movements' | 'alerts'>('analytics')
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isAddingMovement, setIsAddingMovement] = useState(false)
  const { formatCurrency, getFontSizeClass } = useConfig()
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Datos ampliados del inventario
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Arroz Bomba Premium',
      category: 'Cereales',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      price: 4.50,
      cost: 3.20,
      supplier: 'Distribuidor Cereales SA',
      lastUpdated: '2024-01-15',
      status: 'disponible',
      location: 'Almacén A-1',
      avgConsumption: 8,
      lastMovement: '2024-01-14'
    },
    {
      id: '2',
      name: 'Aceite de Oliva Extra Virgen',
      category: 'Aceites',
      currentStock: 5,
      minStock: 8,
      maxStock: 20,
      unit: 'litros',
      price: 12.80,
      cost: 9.60,
      supplier: 'Oleícola Andaluza',
      lastUpdated: '2024-01-14',
      status: 'bajo',
      location: 'Almacén B-3',
      avgConsumption: 3,
      lastMovement: '2024-01-13'
    },
    {
      id: '3',
      name: 'Jamón Ibérico de Bellota',
      category: 'Carnes',
      currentStock: 0,
      minStock: 2,
      maxStock: 10,
      unit: 'kg',
      price: 45.00,
      cost: 32.50,
      supplier: 'Ibéricos Premium',
      lastUpdated: '2024-01-13',
      status: 'agotado',
      location: 'Cámara Fría C-1',
      avgConsumption: 1.5,
      lastMovement: '2024-01-10'
    },
    {
      id: '4',
      name: 'Tomates Cherry Ecológicos',
      category: 'Verduras',
      currentStock: 8,
      minStock: 5,
      maxStock: 15,
      unit: 'kg',
      price: 3.20,
      cost: 2.10,
      supplier: 'Hortícolas Frescas',
      lastUpdated: '2024-01-16',
      status: 'disponible',
      location: 'Refrigerador D-2',
      expirationDate: '2024-01-20',
      avgConsumption: 4,
      lastMovement: '2024-01-15'
    },
    {
      id: '5',
      name: 'Queso Manchego Curado',
      category: 'Lácteos',
      currentStock: 3,
      minStock: 4,
      maxStock: 12,
      unit: 'kg',
      price: 18.50,
      cost: 13.25,
      supplier: 'Lácteos Tradicionales',
      lastUpdated: '2024-01-15',
      status: 'bajo',
      location: 'Refrigerador E-1',
      expirationDate: '2024-02-15',
      avgConsumption: 2,
      lastMovement: '2024-01-14'
    },
    {
      id: '6',
      name: 'Vino Tinto Reserva',
      category: 'Bebidas',
      currentStock: 18,
      minStock: 6,
      maxStock: 30,
      unit: 'botellas',
      price: 24.00,
      cost: 16.80,
      supplier: 'Bodegas del Valle',
      lastUpdated: '2024-01-16',
      status: 'disponible',
      location: 'Bodega F-1',
      avgConsumption: 5,
      lastMovement: '2024-01-15'
    }
  ])

  const [movements, setMovements] = useState<StockMovement[]>([
    {
      id: 'm1',
      itemId: '1',
      itemName: 'Arroz Bomba Premium',
      type: 'entrada',
      quantity: 20,
      date: '2024-01-14',
      reason: 'Compra mensual',
      user: 'Admin',
      notes: 'Proveedor habitual'
    },
    {
      id: 'm2',
      itemId: '4',
      itemName: 'Tomates Cherry Ecológicos',
      type: 'salida',
      quantity: 3,
      date: '2024-01-15',
      reason: 'Consumo cocina',
      user: 'Chef',
      notes: 'Para ensaladas especiales'
    },
    {
      id: 'm3',
      itemId: '3',
      itemName: 'Jamón Ibérico de Bellota',
      type: 'salida',
      quantity: 2,
      date: '2024-01-10',
      reason: 'Preparación platos',
      user: 'Chef',
      notes: 'Menú especial fin de semana'
    }
  ])

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    category: 'Otros',
    unit: 'unidades',
    status: 'disponible',
    lastUpdated: new Date().toISOString().split('T')[0],
    avgConsumption: 1,
    location: 'Almacén General'
  })

  const [newMovement, setNewMovement] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'entrada' as 'entrada' | 'salida' | 'ajuste' | 'perdida',
    quantity: '',
    reason: '',
    user: 'Admin',
    notes: '',
    selectedItemId: ''
  })

  // Cálculo de estadísticas avanzadas
  const inventoryStats: InventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0),
    totalCost: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0),
    lowStockItems: inventory.filter(item => item.status === 'bajo').length,
    outOfStockItems: inventory.filter(item => item.status === 'agotado').length,
    expiringItems: inventory.filter(item => {
      if (!item.expirationDate) return false
      const expDate = new Date(item.expirationDate)
      const today = new Date()
      const diffTime = expDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays >= 0
    }).length,
    avgTurnover: inventory.reduce((sum, item) => sum + item.avgConsumption, 0) / inventory.length,
    inventoryEfficiency: inventory.filter(item => item.currentStock > 0).length / inventory.length * 100,
    wasteValue: movements.filter(m => m.type === 'perdida').reduce((sum, m) => {
      const item = inventory.find(i => i.id === m.itemId)
      return sum + (item ? m.quantity * item.cost : 0)
    }, 0),
    itemsByCategory: inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number }),
    stockByCategory: inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.currentStock
      return acc
    }, {} as { [key: string]: number }),
    valueByCategory: inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + (item.currentStock * item.price)
      return acc
    }, {} as { [key: string]: number })
  }

  const categoryColors = {
    'Cereales': '#f59e0b',
    'Aceites': '#16a34a',
    'Carnes': '#dc2626',
    'Verduras': '#059669',
    'Lácteos': '#2563eb',
    'Bebidas': '#9333ea',
    'Especias': '#ea580c',
    'Otros': '#6b7280'
  }

  const categoryNames = {
    'Cereales': 'Cereales',
    'Aceites': 'Aceites',
    'Carnes': 'Carnes',
    'Verduras': 'Verduras',
    'Lácteos': 'Lácteos',
    'Bebidas': 'Bebidas',
    'Especias': 'Especias',
    'Otros': 'Otros'
  }

  // Datos para gráficos
  const chartDataValue = [
    { v: 15200 }, { v: 14800 }, { v: 15600 }, { v: 14200 }, { v: 15800 }, { v: inventoryStats.totalValue }, { v: 16200 }
  ]
  const chartDataEfficiency = [
    { v: 85 }, { v: 88 }, { v: 82 }, { v: 90 }, { v: 87 }, { v: inventoryStats.inventoryEfficiency }, { v: 89 }
  ]
  const chartDataTurnover = [
    { v: 3.2 }, { v: 3.8 }, { v: 2.9 }, { v: 4.1 }, { v: 3.5 }, { v: inventoryStats.avgTurnover }, { v: 3.7 }
  ]
  const chartDataCost = [
    { v: 11200 }, { v: 10800 }, { v: 11600 }, { v: 10200 }, { v: 11800 }, { v: inventoryStats.totalCost }, { v: 12200 }
  ]

  const daysLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  // Funciones de utilidad
  const getUpcomingExpirations = () => {
    const now = new Date()
    return inventory.filter(item => {
      if (!item.expirationDate) return false
      const expDate = new Date(item.expirationDate)
      const diffTime = expDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays > 0
    }).sort((a, b) => new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime())
  }

  const getLowStockItems = () => {
    return inventory.filter(item => item.status === 'bajo' || item.status === 'agotado')
      .sort((a, b) => {
        if (a.status === 'agotado' && b.status !== 'agotado') return -1
        if (b.status === 'agotado' && a.status !== 'agotado') return 1
        return (a.currentStock / a.maxStock) - (b.currentStock / b.maxStock)
      })
  }

  const upcomingExpirations = getUpcomingExpirations()
  const lowStockAlerts = getLowStockItems()

  // Funciones de manejo
  const handleAddItem = () => {
    if (newItem.name && newItem.currentStock !== undefined && newItem.price && newItem.cost) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category || 'Otros',
        currentStock: newItem.currentStock,
        minStock: newItem.minStock || 0,
        maxStock: newItem.maxStock || 100,
        unit: newItem.unit || 'unidades',
        price: newItem.price,
        cost: newItem.cost,
        supplier: newItem.supplier || '',
        lastUpdated: newItem.lastUpdated || new Date().toISOString().split('T')[0],
        status: newItem.status || 'disponible',
        location: newItem.location || 'Almacén General',
        expirationDate: newItem.expirationDate,
        avgConsumption: newItem.avgConsumption || 1,
        lastMovement: new Date().toISOString().split('T')[0]
      }
      setInventory([...inventory, item])
      setNewItem({
        category: 'Otros',
        unit: 'unidades',
        status: 'disponible',
        lastUpdated: new Date().toISOString().split('T')[0],
        avgConsumption: 1,
        location: 'Almacén General'
      })
      setIsAddItemOpen(false)
      setCurrentStep(1)
    }
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const handleAddMovement = () => {
    if (newMovement.selectedItemId && newMovement.quantity && newMovement.reason) {
      const item = inventory.find(i => i.id === newMovement.selectedItemId)
      if (item) {
        const movement: StockMovement = {
          id: Date.now().toString(),
          itemId: newMovement.selectedItemId,
          itemName: item.name,
          type: newMovement.type,
          quantity: parseInt(newMovement.quantity),
          date: newMovement.date,
          reason: newMovement.reason,
          user: newMovement.user,
          notes: newMovement.notes
        }
        
        // Actualizar stock del item
        const updatedInventory = inventory.map(inv => {
          if (inv.id === newMovement.selectedItemId) {
            let newStock = inv.currentStock
            if (newMovement.type === 'entrada') {
              newStock += parseInt(newMovement.quantity)
            } else {
              newStock -= parseInt(newMovement.quantity)
            }
            newStock = Math.max(0, newStock)
            
            return {
              ...inv,
              currentStock: newStock,
              status: newStock === 0 ? 'agotado' as const : 
                     newStock <= inv.minStock ? 'bajo' as const : 'disponible' as const,
              lastMovement: newMovement.date,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          }
          return inv
        })
        
        setInventory(updatedInventory)
        setMovements([movement, ...movements])
        setNewMovement({
          date: new Date().toISOString().split('T')[0],
          type: 'entrada',
          quantity: '',
          reason: '',
          user: 'Admin',
          notes: '',
          selectedItemId: ''
        })
        setIsAddingMovement(false)
      }
    }
  }

  // Filtrar items
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

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
          <h1 className="text-lg lg:text-xl font-bold text-gray-900">Gestión Inteligente de Inventario</h1>
          <p className="text-xs lg:text-sm text-gray-600 font-normal mt-1">
            Control de stock, análisis de rotación y optimización de inventarios
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <nav className="bg-white rounded-[12px] shadow-sm flex px-1 py-1 gap-1">
              {[
                { id: 'analytics', label: 'Analytics', icon: <TrendingUpIcon size={16} /> },
                { id: 'inventory', label: 'Inventario', icon: <ShoppingCartIcon size={16} /> },
                { id: 'movements', label: 'Movimientos', icon: <HistoryIcon size={16} /> },
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
            {/* Critical Alerts */}
            {(inventoryStats.outOfStockItems > 0 || inventoryStats.expiringItems > 0) && (
              <div className="flex justify-center mb-8">
                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 animate-slideInUp" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center justify-center text-center">
                    <AlertTriangleIcon size={18} className="text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-800 font-medium text-sm">¡Atención! Inventario Crítico</h3>
                      <p className="text-red-700 text-xs mt-1">
                        {inventoryStats.outOfStockItems} agotado(s) • {inventoryStats.expiringItems} próximo(s) a vencer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Metrics */}
            <div className="relative rounded-[16px] border border-gray-200 shadow-sm mb-8 lg:mb-10 p-4 lg:p-6 overflow-hidden bg-white">
              <div className="relative z-10">
                <div className="mb-4">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">Métricas de Inventario Avanzadas</h2>
                  <p className="text-xs lg:text-sm text-gray-600 font-normal mt-1">Indicadores clave para optimización del inventario</p>
                      </div>
                <div className="grid grid-cols-2 lg:flex lg:justify-center gap-3 lg:gap-4">
                  {/* Valor Total Inventario */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '0ms', boxShadow: '0 4px 16px 0 rgba(16,185,129,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Valor Total</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(inventoryStats.totalValue)}</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">En inventario</p>
                          </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataValue.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
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

                  {/* Eficiencia de Inventario */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '100ms', boxShadow: '0 4px 16px 0 rgba(59,130,246,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Eficiencia</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{inventoryStats.inventoryEfficiency.toFixed(0)}%</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Stock disponible</p>
                      </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataEfficiency.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
                                <CartesianGrid stroke="#e0e7ef" strokeOpacity={0.13} vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 2 }} isAnimationActive={true} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

                  {/* Rotación Promedio */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '200ms', boxShadow: '0 4px 16px 0 rgba(251,146,60,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Rotación</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{inventoryStats.avgTurnover.toFixed(1)}</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Unidades/semana</p>
                      </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataTurnover.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
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

                  {/* Coste Total */}
                  <div className="w-full lg:w-64">
                    <SpotlightCard spotlightColor="rgba(0, 0, 0, 0.08)">
                      <div className="rounded-2xl px-4 py-4 shadow-2xl animate-slideInUp relative overflow-hidden h-28 xl:h-36 flex flex-col justify-between config-font-medium metallic-bg" style={{ animationDelay: '300ms', boxShadow: '0 4px 16px 0 rgba(239,68,68,0.15)' }}>
                        <div className="absolute inset-0 pointer-events-none metallic-shine" />
                        <div className="flex flex-col justify-between h-full relative z-10">
                          <div className="flex flex-col items-center justify-center pt-1 pb-2">
                            <h3 className="font-semibold text-black text-xs lg:text-sm mb-1 tracking-wide uppercase opacity-80 text-center w-full">Coste Total</h3>
                            <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-black leading-tight" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(inventoryStats.totalCost)}</p>
                            <p className="text-[10px] lg:text-xs font-normal text-black/70 leading-tight mt-1">Inversión actual</p>
                      </div>
                          <div className="w-full px-2 h-10 xl:h-12 flex items-end">
                            <ResponsiveContainer width="100%" height={48}>
                              <LineChart data={chartDataCost.map((d, i) => ({ ...d, label: daysLabels[i] }))} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
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
                </div>
              </div>
            </div>

            {/* Análisis Completo de Inventario */}
            <div className="w-full mb-8">
              <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 animate-fadeInSlide">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">Análisis Completo de Inventario</h2>
                    <p className="text-xs lg:text-sm text-gray-600 font-normal mt-1">Visualizaciones y métricas avanzadas para la toma de decisiones</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    {inventoryStats.lowStockItems > 0 && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        {inventoryStats.lowStockItems} productos con stock bajo
                      </span>
                    )}
                    {inventoryStats.outOfStockItems > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        {inventoryStats.outOfStockItems} productos agotados
                      </span>
                    )}
                    {inventoryStats.expiringItems > 0 && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {inventoryStats.expiringItems} próximos a vencer
                      </span>
                    )}
                  </div>
                </div>

                {/* Métricas adicionales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Margen promedio</span>
                    <span className="text-2xl font-bold text-green-900">
                      {(((inventoryStats.totalValue - inventoryStats.totalCost) / inventoryStats.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Pérdidas estimadas</span>
                    <span className="text-2xl font-bold text-red-900">{formatCurrency(inventoryStats.wasteValue)}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Total productos</span>
                    <span className="text-2xl font-bold text-blue-900">{inventoryStats.totalItems}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 mb-1">Categorías activas</span>
                    <span className="text-2xl font-bold text-purple-900">{Object.keys(inventoryStats.itemsByCategory).length}</span>
                  </div>
                </div>

                {/* Gráfico de distribución por categorías */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Distribución del Inventario por Categoría</h4>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(inventoryStats.valueByCategory).map(([cat, value]) => ({
                              name: categoryNames[cat as keyof typeof categoryNames] || cat,
                              value,
                              color: categoryColors[cat as keyof typeof categoryColors] || '#6b7280'
                            }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {Object.entries(inventoryStats.valueByCategory).map(([cat], idx) => (
                              <Cell key={cat} fill={categoryColors[cat as keyof typeof categoryColors] || '#6b7280'} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                      {Object.entries(inventoryStats.valueByCategory).map(([cat, value]) => (
                        <div key={cat} className="flex items-center gap-2 text-xs">
                          <span 
                            className="w-3 h-3 rounded-full inline-block" 
                            style={{ backgroundColor: categoryColors[cat as keyof typeof categoryColors] || '#6b7280' }}
                          ></span>
                          <span className="font-medium text-gray-700">{categoryNames[cat as keyof typeof categoryNames] || cat}</span>
                          <span className="text-gray-500">{formatCurrency(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gráfico de barras - Stock por categoría */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Stock Actual por Categoría</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={Object.entries(inventoryStats.stockByCategory).map(([cat, stock]) => ({
                      category: categoryNames[cat as keyof typeof categoryNames] || cat,
                      stock,
                      fill: categoryColors[cat as keyof typeof categoryColors] || '#6b7280'
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" strokeOpacity={0.5} />
                      <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip />
                      <Bar dataKey="stock" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Inventory View */}
        {activeView === 'inventory' && (
          <>
            {/* Filtros y Búsqueda */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm mb-6 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos por nombre o proveedor..."
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
                    <option value="disponible">Disponible</option>
                    <option value="bajo">Stock Bajo</option>
                    <option value="agotado">Agotado</option>
                  </select>
                  <button
                    onClick={() => setIsAddItemOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm whitespace-nowrap"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Agregar Producto
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Inventario */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-base">Inventario Actual</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {filteredInventory.length} de {inventory.length} productos
                </p>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-1 gap-2">
                  {filteredInventory.map((item) => {
                    const stockPercentage = ((item.currentStock) / item.maxStock) * 100
                    return (
                      <div
                        key={item.id}
                        className={`bg-white border border-gray-100 rounded-[6px] px-3 py-2 shadow-none hover:shadow-sm transition-all duration-200 group flex flex-col gap-2 text-xs ${
                          item.status === 'agotado' ? 'border-red-200 bg-red-50' :
                          item.status === 'bajo' ? 'border-yellow-200 bg-yellow-50' :
                          'border-gray-100'
                        }`}
                      >
                        {/* Información principal */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-1">{item.name}</div>
                            <div className="flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
                              <span>{item.category}</span>
                              <span>·</span>
                              <span>{item.supplier}</span>
                              <span>·</span>
                              <span>{item.location}</span>
                              <span>·</span>
                              <span className={`font-bold ${
                                item.status === 'agotado' ? 'text-red-600' :
                                item.status === 'bajo' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {item.status}
                              </span>
                              {item.expirationDate && (
                                <>
                                  <span>·</span>
                                  <span className="text-orange-600">
                                    Vence: {new Date(item.expirationDate).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-none"
                            title="Eliminar"
                          >
                            <TrashIcon size={13} />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Stock {stockPercentage.toFixed(1)}%</span>
                            <span className="text-gray-600">
                              Consumo: {item.avgConsumption} {item.unit}/sem
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                item.status === 'agotado' ? 'bg-red-500' :
                                item.status === 'bajo' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Detalles del producto */}
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-bold text-blue-700">{item.currentStock} {item.unit}</p>
                            <p className="text-[10px] text-blue-600">Stock</p>
                      </div>
                          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                            <p className="text-xs font-bold text-green-700">{formatCurrency(item.price)}</p>
                            <p className="text-[10px] text-green-600">P. Venta</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                            <p className="text-xs font-bold text-gray-700">{formatCurrency(item.cost)}</p>
                            <p className="text-[10px] text-gray-600">Coste</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                            <p className="text-xs font-bold text-purple-700">{formatCurrency(item.currentStock * item.price)}</p>
                            <p className="text-[10px] text-purple-600">Valor</p>
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

        {/* Movements View */}
        {activeView === 'movements' && (
          <>
            {/* Movement Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Movimientos</p>
                    <p className="text-2xl font-bold text-gray-900">{movements.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <HistoryIcon size={20} className="text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Entradas</p>
                    <p className="text-2xl font-bold text-green-900">
                      {movements.filter(m => m.type === 'entrada').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUpIcon size={20} className="text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salidas</p>
                    <p className="text-2xl font-bold text-red-900">
                      {movements.filter(m => m.type === 'salida').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <MinusIcon size={20} className="text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pérdidas</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {movements.filter(m => m.type === 'perdida').length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangleIcon size={20} className="text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Movement History */}
            <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm animate-slideInUp overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Historial de Movimientos</h3>
                    <p className="text-sm text-gray-600 mt-1">Registro de todas las entradas y salidas de inventario</p>
                  </div>
                  <button
                    onClick={() => setIsAddingMovement(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Agregar Movimiento
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {movements.length === 0 && (
                    <div className="text-center py-12">
                      <HistoryIcon size={48} className="mx-auto text-gray-300 mb-4" />
                      <h4 className="font-medium text-gray-900 mb-2">No hay movimientos registrados</h4>
                      <p className="text-gray-600">Los movimientos de inventario aparecerán aquí cuando se registren.</p>
                    </div>
                  )}
                  {movements.length > 0 && movements
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((movement) => (
                      <div
                        key={movement.id}
                        className="group relative overflow-hidden rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg border-gray-200 bg-white"
                      >
                        <div className="p-2 flex items-center space-x-2">
                          {/* Movement Type Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            movement.type === 'entrada' ? 'bg-green-100' :
                            movement.type === 'salida' ? 'bg-red-100' :
                            movement.type === 'ajuste' ? 'bg-blue-100' :
                            'bg-orange-100'
                          }`}>
                            {movement.type === 'entrada' ? (
                              <TrendingUpIcon size={12} className="text-green-600" />
                            ) : movement.type === 'salida' ? (
                              <MinusIcon size={12} className="text-red-600" />
                            ) : movement.type === 'ajuste' ? (
                              <EditIcon size={12} className="text-blue-600" />
                            ) : (
                              <AlertTriangleIcon size={12} className="text-orange-600" />
                              )}
                            </div>
                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                                  {movement.itemName}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-xs">
                                  <span className="font-medium text-gray-700">
                                    {new Date(movement.date).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                    <span className="text-gray-400">•</span>
                                    <span className={`font-bold ${
                                    movement.type === 'entrada' ? 'text-green-600' :
                                    movement.type === 'salida' ? 'text-red-600' :
                                    movement.type === 'ajuste' ? 'text-blue-600' :
                                    'text-orange-600'
                                  }`}>
                                    {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                                    </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">{movement.user}</span>
                                  </div>
                                </div>
                              </div>
                            <div className="grid grid-cols-3 gap-1 mt-1">
                              <div className="text-center p-1 bg-gray-50 rounded border border-gray-200">
                                <p className={`text-xs font-bold ${
                                  movement.type === 'entrada' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                                </p>
                                <p className="text-xs text-gray-500">Cantidad</p>
                              </div>
                              <div className="text-center p-1 bg-gray-50 rounded border border-gray-200">
                                <p className="text-xs font-bold text-gray-900">{movement.reason}</p>
                                <p className="text-xs text-gray-500">Motivo</p>
                              </div>
                              <div className="text-center p-1 bg-gray-50 rounded border border-gray-200">
                                <p className="text-xs font-bold text-gray-900">{movement.notes || '-'}</p>
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
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Alertas de Stock Bajo</h3>
                <p className="text-xs text-gray-600 mt-1">Productos que necesitan reposición</p>
                                </div>
              <div className="p-4">
                {lowStockAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockAlerts.map((item) => (
                      <div key={item.id} className={`border-l-4 p-4 rounded-r-lg ${
                        item.status === 'agotado' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.status === 'agotado' ? 'bg-red-200' : 'bg-yellow-200'
                            }`}>
                              {item.status === 'agotado' ? '🚨' : '⚠️'}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">
                                {item.category} • {item.supplier}
                              </p>
                              <p className="text-xs text-gray-500">
                                Stock actual: {item.currentStock} {item.unit} • Mínimo: {item.minStock} {item.unit}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`font-medium text-sm ${
                              item.status === 'agotado' ? 'text-red-700' : 'text-yellow-700'
                            }`}>
                              {item.status === 'agotado' ? 'Agotado' : 'Stock Bajo'}
                            </span>
                            <p className="text-xs text-gray-500">Ubicación: {item.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BellIcon size={48} className="mx-auto text-gray-300 mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">Todo el stock está en niveles óptimos</h4>
                    <p className="text-gray-600">No hay productos con stock bajo</p>
                  </div>
                )}
                                </div>
                              </div>

            {/* Expiration Alerts */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Alertas de Vencimiento</h3>
                <p className="text-xs text-gray-600 mt-1">Productos próximos a vencer</p>
                                </div>
              <div className="p-4">
                {upcomingExpirations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingExpirations.map((item) => {
                      const expDate = new Date(item.expirationDate!)
                      const now = new Date()
                      const diffTime = expDate.getTime() - now.getTime()
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      
                      return (
                        <div key={item.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-200">
                                ⏰
                                </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {item.category} • {item.currentStock} {item.unit} disponibles
                                </p>
                                <p className="text-xs text-gray-500">
                                  Vence: {expDate.toLocaleDateString()}
                                </p>
                                </div>
                              </div>
                            <div className="text-right">
                              <span className="text-orange-700 font-medium text-sm">
                                {diffDays === 1 ? 'Mañana' : `${diffDays} días`}
                              </span>
                              <p className="text-xs text-gray-500">Ubicación: {item.location}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon size={48} className="mx-auto text-gray-300 mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">No hay productos próximos a vencer</h4>
                    <p className="text-gray-600">Todos los productos están dentro de fechas seguras</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de 3 pasos para agregar producto */}
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md" style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-2 p-0 relative animate-fadeInSlide max-h-[95vh] overflow-y-auto border border-gray-200">
                              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => {
                  setIsAddItemOpen(false)
                  setCurrentStep(1)
                }}
                aria-label="Cerrar"
              >
                <XIcon size={22} />
                              </button>
              <div className="px-6 pt-6 pb-2">
                <h3 className="font-bold text-black text-lg mb-1">Agregar nuevo producto</h3>
                <p className="text-xs text-gray-700 mb-4">Paso {currentStep} de 3</p>
              </div>
              <div className="px-6 pb-6">
                {/* Paso 1: Categoría y Ubicación */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-black mb-2">Información básica</div>
                    <div>
                      <label className="block text-xs font-medium text-black mb-2">Categoría *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(categoryNames).map(([key, value]) => (
                              <button
                            key={key}
                            onClick={() => setNewItem({...newItem, category: key})}
                            className={`py-3 px-2 border rounded-lg text-left transition-all duration-200 text-xs font-semibold ${
                              newItem.category === key 
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
                      <label className="block text-xs font-medium text-black mb-2">Ubicación *</label>
                      <input
                        type="text"
                        value={newItem.location || ''}
                        onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                        placeholder="Ej: Almacén A-1, Cámara Fría..."
                      />
                        </div>
                    <div>
                      <label className="block text-xs font-medium text-black mb-2">Unidad de medida *</label>
                      <select
                        value={newItem.unit}
                        onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                      >
                        <option value="unidades">Unidades</option>
                        <option value="kg">Kilogramos</option>
                        <option value="litros">Litros</option>
                        <option value="gramos">Gramos</option>
                        <option value="botellas">Botellas</option>
                        <option value="cajas">Cajas</option>
                        <option value="paquetes">Paquetes</option>
                      </select>
                      </div>
                </div>
                )}
                
                {/* Paso 2: Detalles del producto */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-black mb-2">Detalles del producto</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Nombre del producto *</label>
                        <input
                          type="text"
                          value={newItem.name || ''}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="Nombre del producto"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Proveedor *</label>
                        <input
                          type="text"
                          value={newItem.supplier || ''}
                          onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="Nombre del proveedor"
                        />
                    </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-black mb-1">Precio de venta *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newItem.price || ''}
                            onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-black mb-1">Coste *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newItem.cost || ''}
                            onChange={(e) => setNewItem({...newItem, cost: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Fecha de vencimiento (opcional)</label>
                        <input
                          type="date"
                          value={newItem.expirationDate || ''}
                          onChange={(e) => setNewItem({...newItem, expirationDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Paso 3: Stock y confirmación */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-sm font-semibold text-black mb-2">Stock y configuración</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Stock actual *</label>
                        <input
                          type="number"
                          value={newItem.currentStock || ''}
                          onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="0"
                          min="0"
                        />
              </div>
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Stock mínimo</label>
                        <input
                          type="number"
                          value={newItem.minStock || ''}
                          onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">Stock máximo</label>
                        <input
                          type="number"
                          value={newItem.maxStock || ''}
                          onChange={(e) => setNewItem({...newItem, maxStock: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                          placeholder="100"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black mb-1">Consumo promedio (por semana)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newItem.avgConsumption || ''}
                        onChange={(e) => setNewItem({...newItem, avgConsumption: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black text-xs"
                        placeholder="1.0"
                        min="0"
                      />
            </div>

                    {/* Resumen */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <h4 className="text-xs font-semibold text-gray-800">Resumen del producto</h4>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Nombre:</span>
                        <span className="font-medium text-black">{newItem.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Categoría:</span>
                        <span className="font-medium text-black">{categoryNames[newItem.category as keyof typeof categoryNames]}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Stock inicial:</span>
                        <span className="font-bold text-blue-600">{newItem.currentStock} {newItem.unit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">Valor total:</span>
                        <span className="font-bold text-green-600">{formatCurrency((newItem.currentStock || 0) * (newItem.price || 0))}</span>
                      </div>
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
                          if (currentStep === 1 && newItem.category && newItem.location && newItem.unit) {
                            setCurrentStep(2)
                          } else if (currentStep === 2 && newItem.name && newItem.supplier && newItem.price && newItem.cost) {
                            setCurrentStep(3)
                          }
                        }}
                        disabled={
                          (currentStep === 1 && (!newItem.category || !newItem.location || !newItem.unit)) ||
                          (currentStep === 2 && (!newItem.name || !newItem.supplier || !newItem.price || !newItem.cost))
                        }
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        Siguiente
                      </button>
                    ) : (
                      <button
                        onClick={handleAddItem}
                        disabled={!newItem.currentStock}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 flex items-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SaveIcon size={14} className="mr-2" />
                        Guardar Producto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para agregar movimiento */}
        {isAddingMovement && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                <div className="bg-white rounded-[12px] shadow-2xl max-w-lg w-full mx-4 p-6 relative animate-fadeInSlide">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                onClick={() => setIsAddingMovement(false)}
                    aria-label="Cerrar"
                  >
                    <XIcon size={22} />
                  </button>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">Registrar Movimiento de Inventario</h3>
              <p className="text-xs text-gray-500 mb-4">Registra entradas, salidas o ajustes de stock</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento</label>
                      <select
                    value={newMovement.type}
                    onChange={(e) => setNewMovement({...newMovement, type: e.target.value as any, selectedItemId: ''})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                      >
                    <option value="entrada">Entrada (Compra/Recepción)</option>
                    <option value="salida">Salida (Consumo/Venta)</option>
                    <option value="ajuste">Ajuste de Inventario</option>
                    <option value="perdida">Pérdida/Merma</option>
                      </select>
                    </div>

                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                      <input
                    type="date"
                    value={newMovement.date}
                    onChange={(e) => setNewMovement({...newMovement, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                      />
                    </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                  <select
                    value={newMovement.selectedItemId}
                    onChange={(e) => {
                      const item = inventory.find(i => i.id === e.target.value)
                      setNewMovement({
                        ...newMovement, 
                        selectedItemId: e.target.value
                      })
                    }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  >
                    <option value="">Selecciona un producto...</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.currentStock} {item.unit} disponibles
                      </option>
                    ))}
                  </select>
                    </div>

                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                      <input
                        type="number"
                    value={newMovement.quantity}
                    onChange={(e) => setNewMovement({...newMovement, quantity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                      <input
                    type="text"
                    value={newMovement.user}
                    onChange={(e) => setNewMovement({...newMovement, user: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="Nombre del usuario"
                      />
                    </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
                      <input
                    type="text"
                    value={newMovement.reason}
                    onChange={(e) => setNewMovement({...newMovement, reason: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="Motivo del movimiento"
                      />
                    </div>

                    <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                      <input
                        type="text"
                    value={newMovement.notes}
                    onChange={(e) => setNewMovement({...newMovement, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    placeholder="Notas adicionales"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                  onClick={() => setNewMovement({
                    date: new Date().toISOString().split('T')[0],
                    type: 'entrada',
                    quantity: '',
                    reason: '',
                    user: 'Admin',
                    notes: '',
                    selectedItemId: ''
                      })}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Limpiar
                    </button>
                    <button
                  onClick={handleAddMovement}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      <SaveIcon size={16} className="mr-2" />
                  Registrar Movimiento
                    </button>
                  </div>
                </div>
              </div>
            )}

        {/* Botón flotante para mobile */}
        <button
          onClick={() => setIsAddItemOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center md:hidden z-40 hover:scale-110"
        >
          <PlusIcon size={24} />
        </button>
      </div>
    </div>
  )
} 