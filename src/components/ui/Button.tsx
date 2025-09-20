import React, { ButtonHTMLAttributes } from 'react'
import cn from 'classnames'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center border-radius font-medium transition-normal',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
    }
  )

  const variantClasses = cn({
    'bg-accent-blue text-white hover:bg-opacity-90 focus:ring-accent-blue':
      variant === 'primary',
    'bg-secondary text-text-primary border border-color hover:bg-tertiary focus:ring-border-color':
      variant === 'secondary',
    'bg-success-green text-white hover:bg-opacity-90 focus:ring-success-green':
      variant === 'success',
    'bg-warning-yellow text-white hover:bg-opacity-90 focus:ring-warning-yellow':
      variant === 'warning',
    'bg-error-red text-white hover:bg-opacity-90 focus:ring-error-red':
      variant === 'error',
    'text-text-primary hover:bg-tertiary focus:ring-border-color':
      variant === 'ghost',
  })

  return (
    <button
      className={cn(baseClasses, variantClasses, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin mr-2">⏳</span>}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}

export default Button