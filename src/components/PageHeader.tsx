import { DESIGN_SYSTEM } from './design-system'

interface PageHeaderProps {
  title: string
  subtitle: string
  className?: string
}

export function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`${DESIGN_SYSTEM.components.header.container} text-center ${className}`}>
      <h1 className={DESIGN_SYSTEM.components.header.title}>
        {title}
      </h1>
      <p className={DESIGN_SYSTEM.components.header.subtitle}>
        {subtitle}
      </p>
    </div>
  )
} 