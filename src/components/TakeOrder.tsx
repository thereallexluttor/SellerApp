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
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [guests, setGuests] = useState(0)
  const [showCompletedAnimation, setShowCompletedAnimation] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Función para normalizar texto (eliminar acentos y caracteres especiales)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos y diacríticos
      .replace(/[^a-z0-9\s]/g, '') // Elimina caracteres especiales excepto espacios
      .trim()
  }

  useEffect(() => {
    // Simulate loading with shorter delay
    const timer = setTimeout(() => setIsLoading(false), 300)
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

  const filteredItems = menuItems.filter(item => {
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    // Filter by search query (sin acentos)
    const matchesSearch = searchQuery === '' || (() => {
      const normalizedQuery = normalizeText(searchQuery)
      const normalizedName = normalizeText(item.name)
      const normalizedDescription = normalizeText(item.description)
      
      return normalizedName.includes(normalizedQuery) || 
             normalizedDescription.includes(normalizedQuery)
    })()
    
    return matchesCategory && matchesSearch
  })

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

  const resetOrder = () => {
    setCart([])
    setSelectedTable(null)
    setGuests(0)
    setSelectedCategory('all')
    setSearchQuery('')
    setCurrentStep(1)
  }

  // Validaciones para cada paso
  const isStep1Valid = () => {
    return selectedTable !== null && guests > 0
  }

  const isStep2Valid = () => {
    return cart.length > 0
  }

  const isCurrentStepValid = () => {
    switch(currentStep) {
      case 1: return isStep1Valid()
      case 2: return isStep2Valid()
      default: return true
    }
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
    
    // Mostrar animación de completado
    setShowCompletedAnimation(true)
    
    // Después de 3 segundos, resetear todo
    setTimeout(() => {
      setShowCompletedAnimation(false)
      resetOrder()
    }, 3000)
  }

  return (
    <div 
      className={`h-full overflow-y-auto bg-gray-50 font-helvetica relative transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="p-2 sm:p-3 md:p-5">
        
        {/* Completed Animation Overlay */}
        {showCompletedAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4 animate-bounce-in">
              <div className="mb-4">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <CheckIcon size={40} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">¡Pedido Confirmado!</h3>
              <p className="text-gray-600 mb-2">Mesa {selectedTable}</p>
              <p className="text-xl font-bold text-gray-900 mb-4">€{getTotalPrice().toFixed(2)}</p>
              <div className="flex items-center justify-center space-x-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Enviando a cocina...</p>
            </div>
          </div>
        )}

        {/* Stepper Component */}
        <Stepper
          initialStep={currentStep}
          onStepChange={(step) => {
            setCurrentStep(step);
            console.log('Paso cambiado a:', step);
          }}
          onFinalStepCompleted={() => {
            console.log('Todos los pasos completados!');
          }}
          backButtonText="Anterior"
          nextButtonText="Siguiente"
          canProceed={isCurrentStepValid()}
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
              

              {/* Progress Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded p-2 sm:p-3 border border-blue-200 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div>
                    <h4 className="font-bold text-blue-800 text-xs sm:text-sm">Progreso del Pedido</h4>
                    <p className="text-blue-600 text-xs">Mesa {selectedTable} • {guests} huéspedes • {getTotalItems()} productos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">Menú del Restaurante</h3>
                        <p className="text-blue-100 text-xs">Selecciona tus platos favoritos</p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                      <span className="text-white font-bold text-xs">
                        {filteredItems.length} disponibles
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 sm:p-3 bg-white">
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full px-3 py-2 bg-gray-50 border-0 border-b border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200 text-sm"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 opacity-60 hover:opacity-100"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedCategory === category.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-100 shadow-sm'
                        }`}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                  
                                      <div className="max-h-[450px] sm:max-h-[550px] md:max-h-[600px] overflow-y-auto pr-2 -mr-2 py-1 apple-scroll">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      {filteredItems.map((item, index) => {
                        const cartItem = cart.find(cartItem => cartItem.id === item.id);
                        const isInCart = !!cartItem;
                        
                        return (
                          <div
                            key={item.id}
                            className="group bg-white border border-gray-200 rounded flex p-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:border-gray-300 relative"
                          >
                            {/* Add/Remove buttons - top right of card */}
                            <div className="absolute -top-1 -right-1 flex gap-1 z-10">
                              {/* Remove button - only show when item is in cart */}
                              {isInCart && (
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-6 h-6 sm:w-7 sm:h-7 bg-red-500 text-white flex items-center justify-center hover:scale-110 hover:bg-red-600 transition-all duration-200 shadow-md rounded-full"
                                >
                                  <MinusIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                                </button>
                              )}
                              
                              {/* Add button */}
                              <button
                                onClick={() => addToCart(item)}
                                className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white flex items-center justify-center hover:scale-110 hover:bg-blue-500 transition-all duration-200 shadow-md rounded-full"
                              >
                                <PlusIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                              </button>
                            </div>

                            {/* Left side: text info */}
                            <div className="flex-grow flex flex-col pr-8 text-left">
                              <h4 className="font-bold text-gray-900 text-xs sm:text-sm text-left">{item.name}</h4>
                              <p className="text-gray-600 text-xs mt-1 flex-grow line-clamp-2 text-left">{item.description}</p>
                              <div className="mt-1">
                                <span className="font-bold text-gray-700 text-xs text-left">Product info</span>
                                <p className="text-blue-600 text-sm font-bold mt-0 text-left">€{item.price.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Right side: image */}
                            <div className="flex-shrink-0 w-16 sm:w-18 h-16 sm:h-18 relative self-center">
                              {/* Image Placeholder */}
                              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                <div className="text-4xl sm:text-5xl opacity-60">
                                  {categories.find(cat => cat.id === item.category)?.icon || '🍽️'}
                                </div>
                              </div>
                              
                              {/* In Cart Indicator */}
                              {isInCart && (
                                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                                    <div className="bg-green-500 text-white text-xs w-4 h-4 rounded-full font-bold flex items-center justify-center shadow-lg ring-2 ring-white/50">
                                      {cartItem.quantity}
                                    </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {filteredItems.length === 0 && (
                      <div className="text-center py-12 text-gray-600">
                        <ChefIcon size={48} className="mx-auto mb-4 opacity-30" />
                        {searchQuery ? (
                          <>
                            <p className="text-lg mb-2">No se encontraron resultados para "{searchQuery}"</p>
                            <p className="text-sm">Prueba con otros términos de búsqueda o selecciona otra categoría</p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg mb-2">No hay productos en esta categoría</p>
                            <p className="text-sm">Prueba seleccionando otra categoría</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Summary Fixed at Bottom */}
              {cart.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-50 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:mt-4">
                  <div className="bg-white rounded-lg border-2 border-green-400 shadow-2xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <ShoppingCartIcon size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {getTotalItems()} productos
                          </p>
                          <p className="text-xs text-gray-600">
                            Mesa {selectedTable}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-green-600">
                          €{getTotalPrice().toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Step>

          {/* Paso 3: Carrito y Resumen */}
          <Step>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl mx-auto px-2 sm:px-3">
              

              {/* Order Info Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <TableCustomIcon size={16} className="mr-1" />
                      <span className="text-sm font-medium text-gray-700">Mesa</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{selectedTable}</p>
                    <p className="text-xs text-gray-500">{guests} {guests === 1 ? 'huésped' : 'huéspedes'}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <ShoppingCartIcon size={16} className="mr-1" />
                      <span className="text-sm font-medium text-gray-700">Productos</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{getTotalItems()}</p>
                    <p className="text-xs text-gray-500">{cart.length} {cart.length === 1 ? 'tipo' : 'tipos'}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-sm font-medium text-gray-700">💰 Total</span>
                    </div>
                    <p className="text-xl font-black text-green-600">€{getTotalPrice().toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {cart.length > 0 ? (
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Tu Pedido</h3>
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {getTotalItems()} items
                          </span>
                          {cart.length > 0 && (
                            <button
                              onClick={clearCart}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-all duration-200"
                              title="Vaciar carrito"
                            >
                              <TrashIcon size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {cart.map((item, index) => {
                        const menuItem = menuItems.find(mi => mi.id === item.id);
                        const categoryIcon = categories.find(cat => cat.id === menuItem?.category)?.icon || '🍽️';
                        
                        return (
                          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center space-x-4">
                              {/* Product Icon */}
                              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">{categoryIcon}</span>
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-grow min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                <p className="text-sm text-gray-600">€{item.price.toFixed(2)} por unidad</p>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                                >
                                  <MinusIcon size={16} />
                                </button>
                                
                                <div className="bg-gray-100 px-3 py-1 rounded-full min-w-[60px] text-center">
                                  <span className="font-bold text-gray-900">{item.quantity}</span>
                                </div>
                                
                                <button
                                  onClick={() => addToCart(menuItems.find(mi => mi.id === item.id)!)}
                                  className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
                                >
                                  <PlusIcon size={16} />
                                </button>
                              </div>
                              
                              {/* Subtotal */}
                              <div className="text-right min-w-[80px]">
                                <p className="font-bold text-lg text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Total Section */}
                    <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Total del pedido</p>
                          <p className="text-xs text-gray-500">{getTotalItems()} productos • Mesa {selectedTable}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-green-600">€{getTotalPrice().toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSubmitOrder}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded text-lg font-semibold transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <CheckIcon size={20} />
                      <span>Confirmar y Enviar Pedido</span>
                    </button>
                    
                    <p className="text-center text-xs text-gray-500">
                      Puedes editar las cantidades usando los botones + y -
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <ShoppingCartIcon size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay productos en tu pedido</h3>
                  <p className="text-sm text-gray-500 mb-4">Regresa al paso anterior para agregar productos al carrito</p>
                </div>
              )}
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  )
} 