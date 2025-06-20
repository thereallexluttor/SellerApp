import { useState, useEffect } from 'react'
import './animations.css'
import SpotlightCard from './SpotlightCard'
import {
  ClipboardIcon,
  TableIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  UserIcon,
  TrashIcon,
  CheckIcon
} from './icons'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  image?: string
  available: boolean
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface Table {
  number: number
  capacity: number
  status: 'available' | 'occupied'
  guests?: number
}

// Componente para el ícono de chef personalizado
const ChefIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/cocina.png" 
    alt="Chef" 
    width={size} 
    height={size} 
    className={className}
  />
)

// Componente para el ícono de mesa personalizado
const TableCustomIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <img 
    src="/src/public/mesa.png" 
    alt="Mesa" 
    width={size} 
    height={size} 
    className={className}
  />
)

export function TakeOrder() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Mock data para mesas disponibles
  const availableTables: Table[] = [
    { number: 1, capacity: 2, status: 'available' },
    { number: 3, capacity: 4, status: 'available' },
    { number: 6, capacity: 6, status: 'available' },
    { number: 11, capacity: 4, status: 'available' },
    { number: 16, capacity: 2, status: 'available' },
    { number: 19, capacity: 8, status: 'available' },
    { number: 20, capacity: 6, status: 'available' },
    { number: 30, capacity: 4, status: 'available' },
    { number: 34, capacity: 2, status: 'available' },
    { number: 43, capacity: 8, status: 'available' },
    { number: 44, capacity: 4, status: 'available' },
    { number: 45, capacity: 6, status: 'available' },
    { number: 46, capacity: 2, status: 'available' },
    { number: 47, capacity: 4, status: 'available' },
    { number: 48, capacity: 8, status: 'available' }
  ]

  // Mock data para el menú
  const menuItems: MenuItem[] = [
    // Entrantes
    { id: '1', name: 'Jamón Ibérico', category: 'entrantes', price: 34.90, description: 'Jamón ibérico de bellota cortado a mano', available: true },
    { id: '2', name: 'Pulpo a la Gallega', category: 'entrantes', price: 28.90, description: 'Pulpo cocido con papas, pimentón y aceite de oliva', available: true },
    { id: '3', name: 'Croquetas Caseras', category: 'entrantes', price: 14.90, description: 'Croquetas de jamón ibérico (6 unidades)', available: true },
    { id: '4', name: 'Tortilla Española', category: 'entrantes', price: 16.90, description: 'Tortilla de patatas tradicional', available: true },
    { id: '5', name: 'Gazpacho', category: 'entrantes', price: 9.90, description: 'Gazpacho andaluz con verduras frescas', available: true },

    // Principales
    { id: '6', name: 'Paella Valenciana', category: 'principales', price: 28.90, description: 'Paella tradicional con pollo, conejo y verduras', available: true },
    { id: '7', name: 'Chuletón Ibérico', category: 'principales', price: 45.90, description: 'Chuletón de cerdo ibérico a la parrilla (400g)', available: true },
    { id: '8', name: 'Lubina a la Sal', category: 'principales', price: 42.90, description: 'Lubina fresca cocinada en costra de sal', available: true },
    { id: '9', name: 'Cochinillo Asado', category: 'principales', price: 48.90, description: 'Cochinillo segoviano asado al horno', available: true },
    { id: '10', name: 'Arroz con Bogavante', category: 'principales', price: 56.90, description: 'Arroz cremoso con bogavante fresco', available: true },
    { id: '11', name: 'Secreto Ibérico', category: 'principales', price: 28.90, description: 'Secreto ibérico a la plancha con verduras', available: true },

    // Postres
    { id: '12', name: 'Crema Catalana', category: 'postres', price: 12.90, description: 'Crema catalana tradicional quemada', available: true },
    { id: '13', name: 'Tiramisú', category: 'postres', price: 14.90, description: 'Tiramisú italiano casero', available: true },
    { id: '14', name: 'Flan Casero', category: 'postres', price: 8.90, description: 'Flan de huevo con caramelo', available: true },
    { id: '15', name: 'Tarta de Queso', category: 'postres', price: 15.90, description: 'Tarta de queso New York', available: true },

    // Bebidas
    { id: '16', name: 'Vino Tinto Reserva', category: 'bebidas', price: 32.90, description: 'Vino tinto Ribera del Duero', available: true },
    { id: '17', name: 'Albariño', category: 'bebidas', price: 28.90, description: 'Vino blanco Rías Baixas', available: true },
    { id: '18', name: 'Sangría', category: 'bebidas', price: 18.50, description: 'Sangría de la casa (1 litro)', available: true },
    { id: '19', name: 'Cerveza Artesanal', category: 'bebidas', price: 8.90, description: 'Cerveza artesanal local', available: true },
    { id: '20', name: 'Agua Mineral', category: 'bebidas', price: 4.50, description: 'Agua mineral con gas o sin gas', available: true }
  ]

  const categories = [
    { id: 'all', name: 'Todo', icon: '🍽️' },
    { id: 'entrantes', name: 'Entrantes', icon: '🥗' },
    { id: 'principales', name: 'Principales', icon: '🍖' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
    { id: 'bebidas', name: 'Bebidas', icon: '🍷' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1 
      }])
    }
  }

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId)
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ))
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    if (!selectedTable || cart.length === 0) {
      alert('Por favor selecciona una mesa y agrega productos al carrito')
      return
    }

    const orderData = {
      table: selectedTable,
      guests: guests,
      items: cart,
      total: getTotalPrice(),
      timestamp: new Date().toISOString()
    }

    console.log('Orden enviada:', orderData)
    alert(`Orden enviada exitosamente para la Mesa ${selectedTable}!\nTotal: $${getTotalPrice().toFixed(2)}`)
    
    // Reset form
    setCart([])
    setSelectedTable(null)
    setGuests(1)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ClipboardIcon size={24} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Cargando sistema de órdenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 animate-fadeInSlide">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
            Tomar Nueva Orden
          </h1>
          <p className="text-gray-600 font-medium">
            Selecciona mesa, agrega productos y envía la orden • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex gap-4 mb-8 justify-center">
          <div className="w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className={`${selectedTable ? 'bg-green-100' : 'bg-gray-100'} backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200`} style={{ animationDelay: '0ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <TableIcon size={18} className="opacity-80" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">Mesa Seleccionada</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>
                    {selectedTable || '-'}
                  </p>
                  <p className="text-xs font-normal text-black">
                    {selectedTable ? `${guests} huéspedes` : 'sin seleccionar'}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className={`${cart.length > 0 ? 'bg-blue-100' : 'bg-gray-100'} backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200`} style={{ animationDelay: '100ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <ShoppingCartIcon size={18} className="opacity-80" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">Productos</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>
                    {getTotalItems()}
                  </p>
                  <p className="text-xs font-normal text-black">en el carrito</p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          <div className="w-48">
            <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.2)">
              <div className={`${cart.length > 0 ? 'bg-green-100' : 'bg-gray-100'} backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200`} style={{ animationDelay: '200ms', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-lg opacity-80">€</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-black mb-1">Total</h3>
                  <p className="text-3xl font-normal text-black mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>
                    ${getTotalPrice().toFixed(2)}
                  </p>
                  <p className="text-xs font-normal text-black">precio total</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-6 mb-8 justify-center">
          {/* Selección de Mesa */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '300ms', width: '300px', minWidth: '300px' }}>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TableIcon size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">Seleccionar Mesa</h3>
                </div>
                <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                  {availableTables.length} disponibles
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Mesas disponibles en el restaurante</p>
            </div>
            <div className="p-3 max-h-[500px] overflow-y-auto kitchen-scrollbar">
              <div className="grid grid-cols-3 gap-2">
                {availableTables.map((table, index) => (
                  <button
                    key={table.number}
                    onClick={() => setSelectedTable(table.number)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 animate-slideInUp ${
                      selectedTable === table.number
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="font-bold text-lg">{table.number}</div>
                    <div className="text-xs text-gray-600">{table.capacity} pers.</div>
                  </button>
                ))}
              </div>
              
              {selectedTable && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg animate-slideInUp">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de huéspedes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Menú de Productos */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '400ms', width: '420px', minWidth: '420px' }}>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <ChefIcon size={14} className="mr-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">Menú del Restaurante</h3>
                </div>
                <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-100">
                  {filteredItems.length} productos
                </span>
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-3 max-h-[500px] overflow-y-auto kitchen-scrollbar">
              <div className="space-y-2">
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 animate-slideInUp"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm text-green-600">${item.price}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 active:scale-95"
                          >
                            <PlusIcon size={12} className="inline mr-1" />
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carrito */}
          <div className="bg-white rounded border border-gray-100 shadow-sm animate-slideInUp" style={{ animationDelay: '500ms', width: '300px', minWidth: '300px' }}>
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCartIcon size={18} className="text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-800 text-sm">Carrito</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium border border-green-100">
                    {getTotalItems()} items
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Vaciar carrito"
                    >
                      <TrashIcon size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Productos seleccionados</p>
            </div>
            
            <div className="p-3 max-h-[400px] overflow-y-auto kitchen-scrollbar">
              {cart.length > 0 ? (
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-2 border border-gray-200 rounded-lg animate-slideInUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                          <p className="text-xs text-gray-600">${item.price} c/u</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="font-medium text-sm min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(menuItems.find(mi => mi.id === item.id)!)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Subtotal:</span>
                        <span className="font-bold text-sm text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total:</span>
                      <span className="font-bold text-xl text-green-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCartIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Agrega productos al carrito</p>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            {cart.length > 0 && selectedTable && (
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={handleSubmitOrder}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                >
                  <CheckIcon size={16} className="inline mr-2" />
                  Enviar Orden (Mesa {selectedTable})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 