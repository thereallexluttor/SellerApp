import { useState, useEffect } from 'react'
import './animations.css'
import { useConfig } from '../contexts/ConfigContext'
import { PlusIcon, EditIcon, TrashIcon, AlertTriangleIcon } from './icons'

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

export function AdminInventory() {
  const [isLoading, setIsLoading] = useState(true)
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
    }
  ])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const lowStockItems = inventory.filter(item => item.status === 'bajo' || item.status === 'agotado')
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800'
      case 'bajo': return 'bg-yellow-100 text-yellow-800'
      case 'agotado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`h-full overflow-y-auto bg-gray-50 transition-opacity duration-500 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    } ${getFontSizeClass()}`}>
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8 animate-fadeInSlide">
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">
            📦 Gestión de Inventario
          </h1>
          <p className="text-gray-600 font-medium">
            Control de stock y suministros del restaurante
          </p>
        </div>

        {/* Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangleIcon size={20} className="text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Atención: Stock Bajo</h3>
                <p className="text-red-700 text-sm">
                  {lowStockItems.length} producto(s) necesitan reposición urgente
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Inventario Actual</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center text-sm">
                <PlusIcon size={16} className="mr-2" />
                Agregar Producto
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.supplier}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.price)}/{item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <EditIcon size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 