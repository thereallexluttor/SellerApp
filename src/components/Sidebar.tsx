import { useState, useEffect } from 'react'
import './animations.css'
import {
  MenuIcon,
  XIcon,
  ClipboardIcon,
  TableIcon,
  MoreHorizontalIcon,
  UserIcon,
  HomeIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  HistoryIcon
} from './icons'

interface SidebarProps {
  className?: string
  onNavigate?: (page: string) => void
  currentPage?: string
}

interface MenuItem {
  id: string
  title: string
  icon: React.ReactNode
  badge?: number
  description?: string
  onClick?: () => void
}

export function Sidebar({ className = '', onNavigate, currentPage = 'dashboard' }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeItem, setActiveItem] = useState(currentPage)
  const [contentVisible, setContentVisible] = useState(false)

  // Update active item when currentPage changes
  useEffect(() => {
    setActiveItem(currentPage)
  }, [currentPage])

  // Enhanced animation handling
  useEffect(() => {
    setIsAnimating(true)
    
    if (isExpanded) {
      // Delay content visibility for expand animation
      const contentTimer = setTimeout(() => setContentVisible(true), 200)
      const animationTimer = setTimeout(() => setIsAnimating(false), 400)
      return () => {
        clearTimeout(contentTimer)
        clearTimeout(animationTimer)
      }
    } else {
      // Hide content immediately for collapse animation
      setContentVisible(false)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isExpanded])

  // Reordenamos los items del menú en grupos lógicos
  const menuItems: MenuItem[] = [
    // Grupo 1: Dashboard
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Vista general del restaurante',
      icon: <HomeIcon size={20} />,
      onClick: () => {
        setActiveItem('dashboard')
        onNavigate?.('dashboard')
      }
    },
    // Grupo 2: Tomar Orden
    {
      id: 'take-order',
      title: 'Tomar Orden',
      description: 'Crear nueva orden',
      icon: <ClipboardIcon size={20} />,
      onClick: () => {
        setActiveItem('take-order')
        onNavigate?.('take-order')
      }
    },
    // Grupo 3: Historial de Pagos
    {
      id: 'payment-history',
      title: 'Historial',
      description: 'Registro de pagos',
      icon: <HistoryIcon size={20} />,
      onClick: () => {
        setActiveItem('payment-history')
        onNavigate?.('payment-history')
      }
    }
  ]

  const bottomItems: MenuItem[] = [
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: <SettingsIcon size={20} />,
      onClick: () => {
        setActiveItem('settings')
        onNavigate?.('settings')
      }
    }
  ]

  function handleMenuItemClick(item: MenuItem) {
    // Add visual feedback with animation
    const button = document.querySelector(`[data-item-id="${item.id}"]`)
    if (button) {
      button.classList.add('nav-item-active')
      setTimeout(() => {
        button.classList.remove('nav-item-active')
      }, 300)
    }
    
    item.onClick?.()
    console.log(`Navegando a: ${item.title}`)
  }

  function handleMouseEnter() {
    setIsExpanded(true)
  }

  function handleMouseLeave() {
    setIsExpanded(false)
  }

  // Función auxiliar para renderizar el separador
  const renderDivider = () => (
    <div className="flex justify-center py-2">
      <div className={`transition-all duration-300 ${
        isExpanded ? 'w-full opacity-0' : 'w-1/2 opacity-100'
      }`}>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>
    </div>
  )

  const renderMenuItem = (item: MenuItem, index: number, baseDelay: number) => (
    <div key={item.id} className="relative group">
      <button
        data-item-id={item.id}
        onClick={() => handleMenuItemClick(item)}
        className={`w-full h-12 flex items-center justify-center rounded transition-all duration-200 relative overflow-visible gpu-accelerated ${
          activeItem === item.id
            ? 'bg-black text-white animate-selectItem'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        style={{
          transitionDelay: `${(index + baseDelay) * 15}ms`,
          transform: isExpanded ? 'translateX(0)' : 'translateX(-2px)'
        }}
      >
        {/* Active indicator */}
        {activeItem === item.id && (
          <div className="absolute left-0 top-0 w-0.5 h-full bg-white animate-slideInIndicator"></div>
        )}
        
        {/* Container for icon and badge */}
        <div className="relative">
          {/* Icon container */}
          <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 icon-modern ${
            activeItem === item.id 
              ? 'text-white animate-iconFloat' 
              : 'group-hover:text-black'
          }`}>
            {item.icon}
          </div>

          {/* Badge - now positioned to overlap the icon */}
          {!isExpanded && item.badge && (
            <div className="absolute -top-0 right-[-8px] bg-black text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none shadow-sm border border-white z-50 badge-modern transform -translate-y-1">
              {item.badge}
            </div>
          )}
        </div>

        {/* Expanded content */}
        {isExpanded && contentVisible && (
          <div className="ml-2 flex-1 min-w-0 animate-contentFadeIn flex items-center content-smooth">
            <div className="text-left">
              <p className={`font-medium text-sm tracking-normal truncate ${
                activeItem === item.id ? 'text-white' : 'text-black'
              }`}>
                {item.title}
              </p>
              <p className={`text-xs truncate ${
                activeItem === item.id ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {item.description}
              </p>
            </div>
            {/* Badge for expanded state - adjusted position */}
            {item.badge && (
              <div className="relative ml-auto mr-1">
                <div className="absolute -top-2 right-[-0px] bg-black text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none shadow-sm border border-white z-50 badge-modern">
                  {item.badge}
                </div>
              </div>
            )}
          </div>
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-lg">
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-gray-300">{item.description}</div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-2 border-transparent border-r-black"></div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Main Sidebar Container */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 backdrop-blur-sm gpu-accelerated border-r border-gray-100 overflow-hidden sidebar-modern ${
          isExpanded ? 'w-60 animate-sidebarGlow' : 'w-16'
        } ${isAnimating ? (isExpanded ? 'animate-sidebarExpand' : 'animate-sidebarCollapse') : ''} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          boxShadow: isExpanded 
            ? '0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04)'
            : '0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.02)',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
        }}
      >
        {/* Content */}
        <div className={`relative z-10 h-full flex flex-col overflow-x-hidden transition-smooth ${
          isAnimating ? 'animate-fadeInSlide' : ''
        }`}>
          {/* Header Section */}
          <div className="p-5 flex items-center justify-center border-b border-gray-50">
            <div className={`relative transition-all duration-200 ${isExpanded ? 'scale-100' : 'scale-90'}`}>
              <div className="w-10 h-10 bg-black rounded flex items-center justify-center shadow-sm transition-all duration-200">
                <UserIcon size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-black rounded-full border border-white"></div>
            </div>
            {isExpanded && contentVisible && (
              <div className="ml-3 animate-contentFadeIn">
                <h3 className="text-black font-semibold text-base tracking-tight">Restaurant POS</h3>
                <p className="text-gray-500 text-xs font-medium">Sistema de Ventas</p>
              </div>
            )}
          </div>

          {/* Main Navigation */}
          <nav className={`flex-1 py-8 px-2 space-y-1 overflow-visible content-smooth flex flex-col justify-center ${
            isExpanded ? 'opacity-100' : 'opacity-90'
          }`}>
            {/* Grupo 1: Dashboard */}
            {menuItems.slice(0, 1).map((item, index) => renderMenuItem(item, index, 0))}

            {/* Primer separador */}
            {renderDivider()}

            {/* Grupo 2: Tomar Orden */}
            {menuItems.slice(1, 2).map((item, index) => renderMenuItem(item, index, 1))}

            {/* Segundo separador */}
            {renderDivider()}

            {/* Grupo 3: Historial de Pagos */}
            {menuItems.slice(2).map((item, index) => renderMenuItem(item, index, 2))}
          </nav>

          {/* Bottom Section */}
          <div className={`p-2 space-y-1 content-smooth ${
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1'
                    }`}>
            {bottomItems.map((item) => renderMenuItem(item, 0, 6))}

            {/* Help and Logout */}
            <div className="space-y-1 pt-2 border-t border-gray-50">
              <div className="relative group">
                <button className="w-full h-12 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 hover:text-black transition-all duration-200 gpu-accelerated">
                  <div className="w-12 h-12 flex items-center justify-center transition-all duration-200 flex-shrink-0">
                    <HelpCircleIcon size={20} />
                  </div>
                  {isExpanded && contentVisible && (
                    <span className="ml-2 font-medium text-sm animate-contentFadeIn text-black truncate flex-1 text-left">
                      Ayuda
                    </span>
                  )}
                </button>
                {!isExpanded && (
                  <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-lg">
                    Ayuda y Soporte
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-2 border-transparent border-r-black"></div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <button className="w-full h-12 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200 gpu-accelerated">
                  <div className="w-12 h-12 flex items-center justify-center transition-all duration-200 flex-shrink-0">
                    <LogOutIcon size={20} />
                  </div>
                  {isExpanded && contentVisible && (
                    <span className="ml-2 font-medium text-sm animate-contentFadeIn truncate flex-1 text-left">
                      Cerrar Sesión
                    </span>
                  )}
                </button>
                {!isExpanded && (
                  <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-lg">
                    Cerrar Sesión
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-2 border-transparent border-r-black"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer indicator */}
          <div className="p-3 flex justify-center">
            <div className={`w-6 h-0.5 bg-gray-200 rounded-full transition-all duration-300 ${
              isExpanded ? 'w-6 opacity-100' : 'w-4 opacity-70'
            } hover:bg-gray-300`}></div>
          </div>
        </div>
      </div>
    </>
  )
}