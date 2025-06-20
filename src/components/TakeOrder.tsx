import { useState, useEffect } from 'react'
import './animations.css'
import SpotlightCard from './SpotlightCard'
import Stepper, { Step } from './Stepper'
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
  const [guests, setGuests] = useState(0)

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
    setGuests(0)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ClipboardIcon size={24} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Cargando sistema de órdenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div className="p-2 sm:p-3 md:p-5">
        

        {/* Stepper Component */}
        <Stepper
          initialStep={1}
          onStepChange={(step) => {
            console.log('Paso cambiado a:', step);
          }}
          onFinalStepCompleted={() => {
            console.log('Todos los pasos completados!');
          }}
          backButtonText="Anterior"
          nextButtonText="Siguiente"
        >
          {/* Paso 1: Selección de Mesa */}
          <Step>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl mx-auto px-2 sm:px-3">
              <div className="text-center mb-2 sm:mb-3">
                <TableIcon size={20} className="sm:w-6 sm:h-6 mx-auto text-blue-600 mb-1" />
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">Seleccionar Mesa</h2>
                <p className="text-xs text-gray-600">Primero indica cuántos huéspedes y te ayudaremos a encontrar la mesa ideal</p>
              </div>

              {/* Configuración de Huéspedes - Siempre visible */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-2 sm:p-3 border border-blue-200 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-blue-500 p-1 rounded">
                    <UserIcon size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-xs sm:text-sm">¿Cuántos huéspedes?</h4>
                    <p className="text-blue-600 text-xs">Te mostraremos las mesas más adecuadas</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-blue-800">
                    Número de huéspedes
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={guests === 0 ? '' : guests}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setGuests(0);
                        } else {
                          const num = parseInt(value);
                          if (!isNaN(num) && num >= 0) {
                            setGuests(num);
                          }
                        }
                      }}
                      className="w-full px-2 py-1.5 bg-white border-2 border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs font-semibold text-gray-700 shadow-sm transition-all duration-300"
                      placeholder="Ej: 4"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500">
                      <UserIcon size={14} />
                    </div>
                  </div>

                  {/* Quick Selection Buttons */}
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium text-blue-700 mb-1 w-full">Selección rápida:</span>
                    {[1, 2, 4, 6, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setGuests(num)}
                        className={`px-1.5 py-0.5 rounded text-xs font-semibold transition-all duration-200 ${
                          guests === num
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-100'
                        }`}
                      >
                        {num} {num === 1 ? 'persona' : 'personas'}
                      </button>
                    ))}
                  </div>


                </div>
              </div>



              <div className="bg-white rounded border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-white/20 p-1 rounded">
                        <TableCustomIcon size={16} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">Mesas Disponibles</h3>
                        <p className="text-blue-100 text-xs">Selecciona tu mesa preferida</p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                      <span className="text-white font-bold text-xs">
                        {availableTables.length} disponibles
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 sm:p-3 bg-gray-50">

                  
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-1.5 sm:gap-2 mb-3">
                    {availableTables.map((table, index) => {
                      // Lógica para determinar si la mesa es recomendada
                      const isRecommended = table.capacity >= guests && table.capacity <= guests + 2;
                      const isPerfectMatch = table.capacity === guests || (guests <= 2 && table.capacity === 2);
                      const isTooSmall = table.capacity < guests;
                      
                      return (
                        <div
                          key={table.number}
                          className="group perspective-1000 animate-slideInUp"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <button
                            onClick={() => setSelectedTable(table.number)}
                            className={`
                              relative w-full aspect-square rounded border-2 transition-all duration-300 
                              transform-gpu hover:scale-105 hover:-translate-y-1 hover:rotate-1
                              shadow-md hover:shadow-lg
                              ${selectedTable === table.number
                                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-emerald-200/50'
                                : isPerfectMatch
                                ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-blue-200/50 ring-2 ring-blue-200'
                                : isRecommended
                                ? 'border-blue-300 bg-gradient-to-br from-blue-25 to-blue-50 shadow-blue-100/50'
                                : isTooSmall
                                ? 'border-red-200 bg-gradient-to-br from-red-25 to-red-50 opacity-60'
                                : 'border-slate-200 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-blue-200/30'
                              }
                            `}
                          >
                            {/* Recommendation Badge */}
                            {isPerfectMatch && selectedTable !== table.number && (
                              <div className="absolute -top-0.5 -right-0.5 z-10">
                                <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded font-bold animate-pulse">
                                  ⭐
                                </div>
                              </div>
                            )}
                            
                            {isTooSmall && (
                              <div className="absolute -top-0.5 -right-0.5 z-10">
                                <div className="bg-red-400 text-white text-xs px-1 py-0.5 rounded font-bold">
                                  ✕
                                </div>
                              </div>
                            )}

                            {/* Background Pattern */}
                            <div className="absolute inset-0 rounded overflow-hidden">
                              <div className={`absolute inset-0 opacity-5 ${
                                selectedTable === table.number 
                                  ? 'bg-emerald-500' 
                                  : isPerfectMatch 
                                  ? 'bg-blue-500'
                                  : isRecommended
                                  ? 'bg-blue-400'
                                  : isTooSmall
                                  ? 'bg-red-400'
                                  : 'bg-slate-500'
                              }`}>
                                <svg className="w-full h-full" viewBox="0 0 40 40">
                                  <defs>
                                    <pattern id={`dots-${table.number}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                                      <circle cx="2" cy="2" r="1" fill="currentColor"/>
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill={`url(#dots-${table.number})`}/>
                                </svg>
                              </div>
                            </div>

                            {/* Selection Ring */}
                            {selectedTable === table.number && (
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded opacity-75 blur-sm animate-pulse"></div>
                            )}

                            {/* Perfect Match Ring */}
                            {isPerfectMatch && selectedTable !== table.number && (
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded opacity-50 blur-sm animate-pulse"></div>
                            )}

                            {/* Mesa Icon */}
                            <div className="absolute top-1.5 left-1.5">
                              <div className={`p-0.5 rounded ${
                                selectedTable === table.number 
                                  ? 'bg-emerald-500 text-white' 
                                  : isPerfectMatch
                                  ? 'bg-blue-500 text-white'
                                  : isRecommended
                                  ? 'bg-blue-400 text-white'
                                  : isTooSmall
                                  ? 'bg-red-400 text-white'
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                              } transition-all duration-300`}>
                                <TableCustomIcon size={8} />
                              </div>
                            </div>

                            {/* Selection Check */}
                            {selectedTable === table.number && (
                              <div className="absolute top-1.5 right-1.5">
                                <div className="bg-emerald-500 text-white p-0.5 rounded animate-bounce">
                                  <CheckIcon size={6} />
                                </div>
                              </div>
                            )}

                            {/* Mesa Number - Prominent Display */}
                            <div className="relative flex flex-col items-center justify-center h-full">
                              <div className={`
                                text-lg sm:text-xl md:text-2xl font-black tracking-tight mb-0.5
                                ${selectedTable === table.number 
                                  ? 'text-emerald-600 drop-shadow-sm' 
                                  : isPerfectMatch
                                  ? 'text-blue-600 drop-shadow-sm'
                                  : isRecommended
                                  ? 'text-blue-500'
                                  : isTooSmall
                                  ? 'text-red-500'
                                  : 'text-slate-700 group-hover:text-blue-600'
                                }
                                transition-all duration-300 transform group-hover:scale-105
                              `}>
                                {table.number}
                              </div>
                              
                              {/* Capacity Badge */}
                              <div className={`
                                px-1 py-0.5 rounded text-xs font-semibold
                                ${selectedTable === table.number
                                  ? 'bg-emerald-200 text-emerald-800'
                                  : isPerfectMatch
                                  ? 'bg-blue-200 text-blue-800'
                                  : isRecommended
                                  ? 'bg-blue-100 text-blue-700'
                                  : isTooSmall
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-200 text-slate-600 group-hover:bg-blue-200 group-hover:text-blue-800'
                                }
                                transition-all duration-300
                              `}>
                                <UserIcon size={6} className="inline mr-0.5" />
                                {table.capacity}
                              </div>
                              
                              {/* Status Text */}
                              {isPerfectMatch && selectedTable !== table.number && (
                                <div className="text-xs text-blue-600 font-bold mt-0.5">
                                  Ideal
                                </div>
                              )}
                              {isRecommended && !isPerfectMatch && selectedTable !== table.number && (
                                <div className="text-xs text-blue-500 font-medium mt-0.5">
                                  Buena
                                </div>
                              )}
                              {isTooSmall && (
                                <div className="text-xs text-red-500 font-medium mt-0.5">
                                  Pequeña
                                </div>
                              )}
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 rounded overflow-hidden">
                              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform rotate-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                            </div>

                            {/* Hover Glow */}
                            <div className={`
                              absolute inset-0 rounded transition-opacity duration-300
                              ${selectedTable === table.number 
                                ? 'bg-emerald-400/10' 
                                : isPerfectMatch
                                ? 'bg-blue-400/10'
                                : 'bg-blue-400/0 group-hover:bg-blue-400/10'
                              }
                            `}></div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="bg-white/70 rounded p-2 border border-gray-200/50">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded bg-blue-500"></div>
                        <span className="text-gray-700">⭐ Ideal</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded bg-blue-300"></div>
                        <span className="text-gray-700">Recomendada</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded bg-gray-300"></div>
                        <span className="text-gray-700">Disponible</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded bg-red-300"></div>
                        <span className="text-gray-700">✕ Muy pequeña</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          {/* Paso 2: Menú de Productos */}
          <Step>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl mx-auto px-2 sm:px-3">
              <div className="text-center mb-3 sm:mb-4">
                <ChefIcon size={28} className="sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">Seleccionar Productos</h2>
                <p className="text-xs sm:text-sm text-gray-600">Agrega productos del menú a tu orden</p>
              </div>

              {/* Progress Summary */}
              <div className="bg-green-50 rounded p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">Mesa</p>
                    <p className="text-sm sm:text-lg font-bold text-green-600">Mesa {selectedTable}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">Productos</p>
                    <p className="text-sm sm:text-lg font-bold text-green-600">{getTotalItems()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 shadow-sm">
                <div className="p-2 sm:p-3 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 sm:mb-3">
                    <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">Menú del Restaurante</h3>
                    <span className="bg-green-50 text-green-800 px-2 py-0.5 rounded text-xs font-medium self-start sm:self-auto">
                      {filteredItems.length} productos
                    </span>
                  </div>
                  
                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="hidden sm:inline">{category.icon} </span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-2 sm:p-3 max-h-[270px] sm:max-h-[360px] md:max-h-[450px] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {filteredItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-2 sm:p-3 border border-gray-200 rounded hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col h-full">
                          <h4 className="font-medium text-gray-900 mb-1 text-xs sm:text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600 mb-2 flex-1 line-clamp-2">{item.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="font-bold text-sm sm:text-base text-green-600">${item.price}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium transition-all duration-200 active:scale-95 w-full sm:w-auto"
                            >
                              <PlusIcon size={12} className="sm:w-3 sm:h-3 inline mr-1" />
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Step>

          {/* Paso 3: Carrito y Resumen */}
          <Step>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl mx-auto px-2 sm:px-3">
              <div className="text-center mb-3 sm:mb-4">
                <ShoppingCartIcon size={28} className="sm:w-10 sm:h-10 mx-auto text-green-600 mb-2 sm:mb-3" />
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">Revisar Orden</h2>
                <p className="text-xs sm:text-sm text-gray-600">Confirma tu orden antes de enviarla</p>
              </div>

              {/* Order Summary */}
              <div className="bg-green-50 rounded p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">Mesa</p>
                    <p className="text-sm sm:text-lg font-bold text-green-600">Mesa {selectedTable}</p>
                    <p className="text-xs text-gray-500">{guests} huéspedes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">Productos</p>
                    <p className="text-sm sm:text-lg font-bold text-green-600">{getTotalItems()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">Total</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">${getTotalPrice().toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 shadow-sm">
                <div className="p-2 sm:p-3 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Productos en el Carrito</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-50 text-green-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                        {getTotalItems()} items
                      </span>
                      {cart.length > 0 && (
                        <button
                          onClick={clearCart}
                          className="text-red-500 hover:text-red-700 p-1.5 sm:p-2 rounded hover:bg-red-50"
                          title="Vaciar carrito"
                        >
                          <TrashIcon size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-2 sm:p-3">
                  {cart.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {cart.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">${item.price} c/u</p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-center gap-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                              >
                                <MinusIcon size={14} className="sm:w-4 sm:h-4" />
                              </button>
                              <span className="font-medium text-base sm:text-lg min-w-[30px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => addToCart(menuItems.find(mi => mi.id === item.id)!)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                              >
                                <PlusIcon size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-base sm:text-lg text-green-600">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Total */}
                      <div className="border-t border-gray-200 pt-3 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">Total:</span>
                          <span className="text-xl sm:text-2xl font-bold text-green-600">${getTotalPrice().toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-3 sm:pt-4">
                        <button
                          onClick={handleSubmitOrder}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded text-base sm:text-lg font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                        >
                          <CheckIcon size={16} className="sm:w-5 sm:h-5 inline mr-2" />
                          Confirmar y Enviar Orden
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-gray-500">
                      <ShoppingCartIcon size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-30" />
                      <p className="text-base sm:text-lg mb-2">No hay productos en el carrito</p>
                      <p className="text-xs sm:text-sm">Regresa al paso anterior para agregar productos</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  )
} 