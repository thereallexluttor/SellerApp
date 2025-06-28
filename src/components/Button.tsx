import { ReactNode } from 'react'
import { DESIGN_SYSTEM, cn } from './design-system'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = DESIGN_SYSTEM.components.button.primary
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    success: 'bg-green-500 hover:bg-green-600', 
    danger: 'bg-red-500 hover:bg-red-600'
  }

  const sizeClasses = {
    small: DESIGN_SYSTEM.components.button.small,
    medium: 'py-2 px-4',
    large: DESIGN_SYSTEM.components.button.large
  }

  const buttonClasses = cn(
    'text-white font-bold rounded transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md',
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
} 