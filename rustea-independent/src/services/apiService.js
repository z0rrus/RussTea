// src/services/apiService.js
import { mockDrinks } from '@/data/mockData'

const isDevelopment = import.meta.env.DEV
const API_BASE_URL = 'http://localhost:3001/api'

export const apiService = {
  // Получить все чаи
  async getDrinks() {
    if (isDevelopment) {
      // В разработке - используем реальный API
      try {
        const response = await fetch(`${API_BASE_URL}/drinks`)
        if (!response.ok) throw new Error('Ошибка загрузки чаев')
        return await response.json()
      } catch (error) {
        console.error('API недоступен, используем mock данные:', error)
        return mockDrinks
      }
    } else {
      // На продакшене - используем mock данные
      return mockDrinks
    }
  },

  // Добавить новый чай
  async addDrink(drinkData) {
    if (isDevelopment) {
      // В разработке - отправляем на сервер
      const response = await fetch(`${API_BASE_URL}/drinks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(drinkData),
      })
      if (!response.ok) throw new Error('Ошибка добавления чая')
      return await response.json()
    } else {
      // На продакшене - просто возвращаем данные
      console.log('На продакшене добавление чая:', drinkData)
      alert('На продакшене добавление чая отключено')
      return { ...drinkData, id: Date.now().toString() }
    }
  },

  // Удалить чай
  async deleteDrink(id) {
    if (isDevelopment) {
      // В разработке - удаляем с сервера
      const response = await fetch(`${API_BASE_URL}/drinks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Ошибка удаления чая')
      return await response.json()
    } else {
      // На продакшене - просто подтверждаем
      console.log('На продакшене удаление чая:', id)
      alert('На продакшене удаление чая отключено')
      return { id }
    }
  }
}