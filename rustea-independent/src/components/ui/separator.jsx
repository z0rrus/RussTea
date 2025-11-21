import React from 'react'

const Separator = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`shrink-0 bg-gray-200 ${className}`}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator }