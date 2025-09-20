import React from 'react'
import cn from 'classnames'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = cn({
    'w-4 h-4': size === 'sm',
    'w-6 h-6': size === 'md',
    'w-8 h-8': size === 'lg',
  })

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        <div
          className={cn(
            'border-2 border-transparent border-t-accent-blue border-r-accent-blue border-radius-full animate-spin',
            sizeClasses
          )}
        />
      </div>
      {text && (
        <span className="ml-md text-sm text-muted">{text}</span>
      )}
    </div>
  )
}

export default LoadingSpinner