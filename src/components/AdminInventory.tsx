import { useState, useEffect } from 'react'
import './animations.css'
import './config-styles.css'
import SpotlightCard from './SpotlightCard'
import { useConfig } from '../contexts/ConfigContext'
import { PlusIcon, EditIcon, TrashIcon, AlertTriangleIcon, SaveIcon, XIcon, DollarSignIcon, ClockIcon } from './icons'

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
}

interface InventoryStats {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  itemsByCategory: { [key: string]: number }
}

export function AdminInventory() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'add'>('overview')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const { formatCurrency, getFontSizeClass } = useConfig()
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Arroz Bomba',
      category: 'Cereales',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      price: 4.50,
      supplier: 'Distribuidor Cereales SA',
      lastUpdated: '2024-01-15',
      status: 'disponible'
    },
    {
      id: '2',
      name: 'Aceite de Oliva Extra',
      category: 'Aceites',
      currentStock: 5,
      minStock: 8,
      maxStock: 20,
      unit: 'litros',
      price: 12.80,
      supplier: 'Oleícola Andaluza',
      lastUpdated: '2024-01-14',
      status: 'bajo'
    },
    {
      id: '3',
      name: 'Jamón Ibérico',
      category: 'Carnes',
      currentStock: 0,
      minStock: 2,
      maxStock: 10,
      unit: 'kg',
      price: 45.00,
      supplier: 'Ibéricos Premium',
      lastUpdated: '2024-01-13',
      status: 'agotado'
    },
    {
      id: '4',
      name: 'Tomates Cherry',
      category: 'Verduras',
      currentStock: 8,
      minStock: 5,
      maxStock: 15,
      unit: 'kg',
      price: 3.20,
      supplier: 'Hortícolas Frescas',
      lastUpdated: '2024-01-16',
      status: 'disponible'
    },
    {
      id: '5',
      name: 'Queso Manchego',
      category: 'Lácteos',
      currentStock: 3,
      minStock: 4,
      maxStock: 12,
      unit: 'kg',
      price: 18.50,
      supplier: 'Lácteos Tradicionales',
      lastUpdated: '2024-01-15',
      status: 'bajo'
    }
  ])

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    category: 'Otros',
    unit: 'unidades',
    status: 'disponible',
    lastUpdated: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const inventoryStats: InventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0),
    lowStockItems: inventory.filter(item => item.status === 'bajo').length,
    outOfStockItems: inventory.filter(item => item.status === 'agotado').length,
    itemsByCategory: inventory.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
  }

  const categoryColors = {
    'Cereales': 'bg-yellow-500',
    'Aceites': 'bg-green-500',
    'Carnes': 'bg-red-500',
    'Verduras': 'bg-emerald-500',
    'Lácteos': 'bg-blue-500',
    'Otros': 'bg-gray-500'
  }

  const categoryGradients = {
    'Cereales': 'linear-gradient(90deg, #fde68a 0%, #f59e0b 100%)',
    'Aceites': 'linear-gradient(90deg, #86efac 0%, #16a34a 100%)',
    'Carnes': 'linear-gradient(90deg, #fca5a5 0%, #dc2626 100%)',
    'Verduras': 'linear-gradient(90deg, #6ee7b7 0%, #059669 100%)',
    'Lácteos': 'linear-gradient(90deg, #93c5fd 0%, #2563eb 100%)',
    'Otros': 'linear-gradient(90deg, #d1d5db 0%, #6b7280 100%)'
  }

  const statusColors = {
    disponible: 'bg-green-100 text-green-800',
    bajo: 'bg-yellow-100 text-yellow-800',
    agotado: 'bg-red-100 text-red-800'
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.currentStock !== undefined && newItem.price) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category || 'Otros',
        currentStock: newItem.currentStock,
        minStock: newItem.minStock || 0,
        maxStock: newItem.maxStock || 100,
        unit: newItem.unit || 'unidades',
        price: newItem.price,
        supplier: newItem.supplier || '',
        lastUpdated: newItem.lastUpdated || new Date().toISOString().split('T')[0],
        status: newItem.status || 'disponible'
      }
      setInventory([...inventory, item])
      setNewItem({
        category: 'Otros',
        unit: 'unidades',
        status: 'disponible',
        lastUpdated: new Date().toISOString().split('T')[0]
      })
      setIsAddingItem(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const getStockPercentage = (current: number, max: number) => {
    return max > 0 ? (current / max) * 100 : 0
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
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 tracking-tight">
            Gestión de Inventario
          </h1>
          <p className="text-gray-600 font-medium text-sm lg:text-base">
            Control de stock y suministros del restaurante
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center">
            <nav className="bg-white rounded-[12px] shadow-sm flex px-1 py-1 gap-1">
              {[
                { id: 'overview', label: 'Resumen' },
                { id: 'inventory', label: 'Inventario' }
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
            {/* Low Stock Alert */}
            {inventoryStats.lowStockItems > 0 && (
              <div className="flex justify-center mb-8">
                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 animate-slideInUp" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center justify-center text-center">
                    <AlertTriangleIcon size={18} className="text-red-500 mr-3" />
                    <div>
                      <h3 className="text-red-800 font-medium text-sm">¡Atención! Stock Bajo</h3>
                      <p className="text-red-700 text-xs mt-1">
                        {inventoryStats.lowStockItems} producto(s) necesitan reposición urgente.
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
                  <div className="bg-blue-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-blue-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Total Productos</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{inventoryStats.totalItems}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">En inventario</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-green-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-green-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Valor Total</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{formatCurrency(inventoryStats.totalValue)}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">En stock</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-yellow-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-yellow-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '300ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Stock Bajo</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{inventoryStats.lowStockItems}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Necesitan reposición</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <div className="w-full lg:w-48">
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
                  <div className="bg-red-100 backdrop-blur-sm rounded-[8px] px-2 py-2 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-red-400 h-20 lg:h-24 xl:h-28 flex flex-col justify-between config-font-medium" style={{ animationDelay: '400ms', backdropFilter: 'blur(10px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <h3 className="font-medium text-black text-sm lg:text-base leading-tight">Agotados</h3>
                      <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black" style={{ fontFamily: 'Helvetica Neue' }}>{inventoryStats.outOfStockItems}</p>
                      </div>
                      <p className="text-xs lg:text-sm font-normal text-black leading-tight">Sin stock</p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp mb-8" style={{ animationDelay: '500ms' }}>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Productos por Categoría</h3>
                <p className="text-xs text-gray-600 mt-1">Distribución del inventario</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {Object.entries(inventoryStats.itemsByCategory).map(([category, count]) => {
                    const percent = inventoryStats.totalItems > 0 ? (count / inventoryStats.totalItems) * 100 : 0;
                    const gradient = categoryGradients[category as keyof typeof categoryGradients];
                    return (
                      <div key={category} className="flex flex-col">
                        <div className="flex flex-row items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded ${categoryColors[category as keyof typeof categoryColors]} mr-2`}></div>
                            <span className="font-medium text-gray-900 text-sm">{category}</span>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{count} productos</span>
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

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <>
            {/* Inventory Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Productos</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {inventoryStats.totalItems}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <DollarSignIcon size={20} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Valor Total</p>
                    <p className="text-2xl font-bold text-green-800">
                      {formatCurrency(inventoryStats.totalValue)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <ClockIcon size={20} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Stock Bajo</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {inventoryStats.lowStockItems}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                    <AlertTriangleIcon size={20} className="text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-[12px] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Agotados</p>
                    <p className="text-2xl font-bold text-red-800">
                      {inventoryStats.outOfStockItems}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                    <AlertTriangleIcon size={20} className="text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-[8px] border border-gray-200 shadow-sm animate-slideInUp">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Inventario Actual</h3>
                    <p className="text-xs text-gray-600 mt-1">Todos los productos en stock</p>
                  </div>
                  <button
                    onClick={() => setIsAddingItem(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                  >
                    <PlusIcon size={16} className="mr-2" />
                    Agregar Producto
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {inventory.map((item) => {
                    const stockPercentage = getStockPercentage(item.currentStock, item.maxStock)
                    return (
                      <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-[8px] border-2 transition-all duration-300 hover:shadow-lg ${
                          item.status === 'agotado' 
                            ? 'border-red-300 bg-gradient-to-r from-red-50 to-red-100' 
                            : item.status === 'bajo'
                              ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100'
                              : 'border-green-300 bg-gradient-to-r from-green-50 to-green-100'
                        }`}
                      >
                        <div className="p-2">
                          <div className="flex items-center space-x-2">
                            {/* Status Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              item.status === 'agotado' ? 'bg-red-200' :
                              item.status === 'bajo' ? 'bg-yellow-200' :
                              'bg-green-200'
                            }`}>
                              {item.status === 'agotado' ? (
                                <AlertTriangleIcon size={12} className="text-red-600" />
                              ) : item.status === 'bajo' ? (
                                <AlertTriangleIcon size={12} className="text-yellow-600" />
                              ) : (
                                <DollarSignIcon size={12} className="text-green-600" />
                              )}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-xs">
                                    <div className="flex items-center space-x-1">
                                      <div className={`w-1 h-1 rounded-full ${categoryColors[item.category as keyof typeof categoryColors]}`}></div>
                                      <span className="text-gray-600">{item.category}</span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600">{item.supplier}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className={`font-bold ${
                                      item.status === 'agotado' ? 'text-red-600' :
                                      item.status === 'bajo' ? 'text-yellow-600' :
                                      'text-green-600'
                                    }`}>
                                      {item.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Stock Progress Bar */}
                              <div className="mt-1 mb-2">
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-gray-600">Stock {stockPercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                                  <div 
                                    className={`h-1 rounded-full transition-all duration-500 ${
                                      item.status === 'agotado' ? 'bg-red-500' :
                                      item.status === 'bajo' ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${stockPercentage}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Item Details */}
                              <div className="grid grid-cols-3 gap-1">
                                <div className="text-center p-1 bg-white rounded border border-gray-200">
                                  <p className="text-xs font-bold text-gray-900">{item.currentStock} {item.unit}</p>
                                  <p className="text-xs text-gray-500">Stock Actual</p>
                                </div>
                                <div className="text-center p-1 bg-white rounded border border-gray-200">
                                  <p className="text-xs font-bold text-blue-600">{formatCurrency(item.price)}</p>
                                  <p className="text-xs text-gray-500">Precio Unit.</p>
                                </div>
                                <div className="text-center p-1 bg-white rounded border border-gray-200">
                                  <p className="text-xs font-bold text-green-600">{formatCurrency(item.currentStock * item.price)}</p>
                                  <p className="text-xs text-gray-500">Valor Total</p>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => setEditingItem(item.id)}
                                className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 bg-white text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                                title="Editar"
                              >
                                <EditIcon size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm"
                                title="Eliminar"
                              >
                                <TrashIcon size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Empty State */}
                {inventory.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <DollarSignIcon size={24} className="text-gray-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No hay productos registrados</h3>
                    <p className="text-gray-600 mb-4">Aún no se han agregado productos al inventario.</p>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                      <span className="text-gray-600">📝</span>
                      <span className="text-sm font-medium text-gray-800">Registra tu primer producto</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal para agregar producto */}
            {isAddingItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                <div className="bg-white rounded-[12px] shadow-2xl max-w-lg w-full mx-4 p-6 relative animate-fadeInSlide">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                    onClick={() => setIsAddingItem(false)}
                    aria-label="Cerrar"
                  >
                    <XIcon size={22} />
                  </button>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">Agregar Nuevo Producto</h3>
                  <p className="text-xs text-gray-500 mb-4">Registra un nuevo producto en el inventario</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                      <input
                        type="text"
                        value={newItem.name || ''}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Nombre del producto"
                      />
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                      >
                        <option value="Cereales">Cereales</option>
                        <option value="Aceites">Aceites</option>
                        <option value="Carnes">Carnes</option>
                        <option value="Verduras">Verduras</option>
                        <option value="Lácteos">Lácteos</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>

                    {/* Unidad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unidad</label>
                      <input
                        type="text"
                        value={newItem.unit || ''}
                        onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="kg, litros, unidades..."
                      />
                    </div>

                    {/* Stock Actual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Actual</label>
                      <input
                        type="number"
                        value={newItem.currentStock || ''}
                        onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Precio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio Unitario</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.price || ''}
                        onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="0.00"
                        min="0"
                      />
                    </div>

                    {/* Stock Mínimo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Mínimo</label>
                      <input
                        type="number"
                        value={newItem.minStock || ''}
                        onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Stock Máximo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Máximo</label>
                      <input
                        type="number"
                        value={newItem.maxStock || ''}
                        onChange={(e) => setNewItem({...newItem, maxStock: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="100"
                        min="0"
                      />
                    </div>

                    {/* Proveedor */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
                      <input
                        type="text"
                        value={newItem.supplier || ''}
                        onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Nombre del proveedor"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setNewItem({
                        category: 'Otros',
                        unit: 'unidades',
                        status: 'disponible',
                        lastUpdated: new Date().toISOString().split('T')[0]
                      })}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      <SaveIcon size={16} className="mr-2" />
                      Guardar Producto
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