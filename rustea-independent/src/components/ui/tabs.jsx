import React from 'react'

const Tabs = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 ${className}`}
    {...props}
  />
))
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex items-center justify-center rounded-md ${className}`}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm ${className}`}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export { Tabs, TabsList, TabsTrigger }