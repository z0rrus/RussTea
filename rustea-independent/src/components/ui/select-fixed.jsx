import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export function Select({ value, onValueChange, children, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Обработчик выбора
  const handleSelect = (newValue) => {
    console.log('Selected:', newValue) // Для отладки
    onValueChange(newValue)
    setIsOpen(false)
  }

  // Получить отображаемый текст
  // Получить отображаемый текст
    const getDisplayText = () => {
    // Если значение 'all' или '-rating' - показываем placeholder
    if (value === 'all' || value === '-rating' || !value) return placeholder
    
    // Простой поиск среди детей
    const childrenArray = React.Children.toArray(children)
    for (let child of childrenArray) {
        if (child.props.value === value) {
        return child.props.children
        }
    }
    return placeholder
    }

  return (
    <div ref={selectRef} className="relative">
      {/* Кнопка открытия */}
      <button
        type="button"
        onClick={() => {
          console.log('Opening select') // Для отладки
          setIsOpen(!isOpen)
        }}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {getDisplayText()}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, {
              onSelect: handleSelect,
              isSelected: child.props.value === value
            })
          })}
        </div>
      )}
    </div>
  )
}

export function SelectItem({ value, children, onSelect, isSelected }) {
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Clicking item:', value) // Для отладки
        onSelect(value)
      }}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        isSelected 
          ? 'bg-amber-100 text-amber-900 font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

// Пустые компоненты для совместимости
export function SelectTrigger({ children }) { return <>{children}</> }
export function SelectContent({ children }) { return <>{children}</> }
export function SelectValue({ placeholder }) { return <span>{placeholder}</span> }