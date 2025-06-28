// Sistema de Diseño Unificado
// Constantes para mantener consistencia en toda la aplicación

export const DESIGN_SYSTEM = {
  // Tipografía unificada
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeights: {
      normal: 'font-normal',
      medium: 'font-medium', 
      semibold: 'font-semibold',
      bold: 'font-bold'
    }
  },

  // Colores del sistema
  colors: {
    primary: {
      50: 'bg-blue-50',
      100: 'bg-blue-100', 
      500: 'bg-blue-500',
      600: 'bg-blue-600',
      700: 'bg-blue-700'
    },
    success: {
      50: 'bg-green-50',
      100: 'bg-green-100',
      500: 'bg-green-500',
      600: 'bg-green-600'
    },
    warning: {
      50: 'bg-yellow-50',
      100: 'bg-yellow-100',
      500: 'bg-yellow-500'
    },
    danger: {
      50: 'bg-red-50',
      100: 'bg-red-100',
      500: 'bg-red-500'
    },
    neutral: {
      50: 'bg-gray-50',
      100: 'bg-gray-100',
      800: 'bg-gray-800',
      900: 'bg-gray-900'
    }
  },

  // Espaciado consistente
  spacing: {
    page: 'p-6',
    card: 'p-4',
    section: 'mb-8',
    element: 'mb-4'
  },

  // Sombras
  shadows: {
    card: 'shadow-sm',
    hover: 'hover:shadow-md',
    modal: 'shadow-2xl'
  },

  // Bordes
  borders: {
    default: 'border border-gray-100',
    rounded: 'rounded',
    roundedLg: 'rounded-lg'
  },

  // Transiciones
  transitions: {
    default: 'transition-all duration-200',
    smooth: 'transition-all duration-300',
    fast: 'transition-colors duration-150'
  },

  // Animaciones
  animations: {
    fadeInSlide: 'animate-fadeInSlide',
    slideInUp: 'animate-slideInUp',
    bounceIn: 'animate-bounceIn'
  },

  // Componentes base
  components: {
    button: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md',
      success: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md',
      small: 'text-xs font-bold py-1.5 px-2 rounded',
      large: 'py-4 px-6 text-lg'
    },
    card: {
      base: 'bg-white rounded border border-gray-100 shadow-sm',
      hover: 'hover:shadow-lg transition-all duration-300',
      padding: 'p-4'
    },
    input: {
      base: 'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all duration-300',
      search: 'pl-10 pr-4'
    },
    header: {
      title: 'text-3xl font-bold text-black mb-2 tracking-tight',
      subtitle: 'text-gray-600 font-medium',
      container: 'mb-8 animate-fadeInSlide'
    },
    statsCard: {
      container: 'w-48',
      content: 'backdrop-blur-sm rounded-md px-2 py-3 text-gray-800 shadow-lg animate-slideInUp relative overflow-hidden border border-gray-200',
      gradient: 'absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none',
      title: 'text-sm font-medium text-black mb-1',
      value: 'text-3xl font-normal text-black mb-1',
      description: 'text-xs font-normal text-black'
    }
  }
} as const

// Helpers para construir clases dinámicamente
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Función para generar clases de estadísticas con SpotlightCard
export const createStatsCardClasses = (color: 'green' | 'blue' | 'purple' | 'orange' | 'yellow', delay: number = 0) => ({
  spotlight: "rgba(255, 255, 255, 0.2)",
  container: `bg-${color}-100 ${DESIGN_SYSTEM.components.statsCard.content}`,
  style: { 
    animationDelay: `${delay}ms`, 
    backdropFilter: 'blur(10px)' 
  }
})

// Función para iconos de mesa consistentes
export const createTableBadge = (number: number) => ({
  container: 'w-8 h-8 bg-gradient-to-br from-gray-800 to-black text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md',
  number
}) 