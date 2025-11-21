import React from 'react'

const Badge = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    secondary: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    destructive: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'text-gray-800 border border-gray-300'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`
  
  return (
    <span
      className={classes}
      ref={ref}
      {...props}
    />
  )
})

Badge.displayName = 'Badge'

export { Badge }