import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = ({ value, onValueChange, children, ...props }) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (newValue) => {
    onValueChange(newValue)
    setOpen(false)
  }

  return (
    <div className="relative">
      <SelectTrigger onClick={() => setOpen(!open)} {...props}>
        <SelectValue value={value} />
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectTrigger>
      {open && (
        <SelectContent>
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              onSelect: handleSelect
            })
          )}
        </SelectContent>
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 ${className}`}
    {...props}
  />
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectValue = ({ value, placeholder = "Выберите..." }) => {
  return <span className="text-left">{value || placeholder}</span>
}

const SelectContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 shadow-lg ${className}`}
    {...props}
  />
))
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef(({ 
  value, 
  children, 
  onSelect,
  className = '', 
  ...props 
}, ref) => (
  <button
    ref={ref}
    className={`relative flex w-full cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${className}`}
    onClick={() => onSelect(value)}
    {...props}
  >
    {children}
  </button>
))
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }