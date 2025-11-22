import { apiService } from './apiService'

// Получаем данные из localStorage или используем начальные
const getStoredFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites')) || []
  } catch {
    return []
  }
}

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

class DataService {
  // Категории (пока оставляем локально, можно потом перенести в API)
  getCategories() {
    const categories = [
      { id: '1', name: 'Зеленый чай' },
      { id: '2', name: 'Черный чай' },
      { id: '3', name: 'Улун' },
      { id: '4', name: 'Пуэр' },
      { id: '5', name: 'Травяной чай' },
      { id: '6', name: 'Фруктовый чай' }
    ]
    return Promise.resolve(categories)
  }

  getCategoryById(id) {
    const categories = [
      { id: '1', name: 'Зеленый чай' },
      { id: '2', name: 'Черный чай' },
      { id: '3', name: 'Улун' },
      { id: '4', name: 'Пуэр' },
      { id: '5', name: 'Травяной чай' },
      { id: '6', name: 'Фруктовый чай' }
    ]
    const category = categories.find(c => c.id === id)
    return Promise.resolve(category)
  }

  // Напитки - теперь из API
  async getDrinks(sortBy = '-rating', limit = null) {
    try {
      const drinks = await apiService.getDrinks()
      let sortedDrinks = [...drinks]
      
      // Сортировка
      if (sortBy === '-rating') {
        sortedDrinks.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (sortBy === 'rating') {
        sortedDrinks.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      } else if (sortBy === '-created_date') {
        sortedDrinks.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0))
      } else if (sortBy === 'name') {
        sortedDrinks.sort((a, b) => a.name.localeCompare(b.name))
      }
      
      return limit ? sortedDrinks.slice(0, limit) : sortedDrinks
    } catch (error) {
      console.error('Ошибка загрузки чаев:', error)
      return [] // Возвращаем пустой массив в случае ошибки
    }
  }

  async filterDrinks(filters = {}) {
    try {
      const drinks = await apiService.getDrinks()
      let filtered = [...drinks]
      
      if (filters.category_id && filters.category_id !== 'all') {
        filtered = filtered.filter(d => d.category_id === filters.category_id)
      }
      
      if (filters.caffeine_level && filters.caffeine_level !== 'all') {
        filtered = filtered.filter(d => d.caffeine_level === filters.caffeine_level)
      }

      if (filters.id) {
        filtered = filtered.filter(d => d.id === filters.id)
      }
      
      return filtered
    } catch (error) {
      console.error('Ошибка фильтрации чаев:', error)
      return []
    }
  }

  async getDrinkById(id) {
    try {
      const drinks = await apiService.getDrinks()
      const drink = drinks.find(d => d.id === id)
      return drink || null
    } catch (error) {
      console.error('Ошибка поиска чая:', error)
      return null
    }
  }

  // Избранное
  getFavorites(userEmail) {
    const favorites = getStoredFavorites()
    const userFavorites = favorites.filter(f => f.user_email === userEmail)
    return Promise.resolve(userFavorites)
  }

  addFavorite(favoriteData) {
    const favorites = getStoredFavorites()
    const newFavorite = {
      id: Date.now().toString(),
      ...favoriteData,
      created_date: new Date().toISOString()
    }
    favorites.push(newFavorite)
    localStorage.setItem('favorites', JSON.stringify(favorites))
    return Promise.resolve(newFavorite)
  }

  removeFavorite(favoriteId) {
    const favorites = getStoredFavorites()
    const filteredFavorites = favorites.filter(f => f.id !== favoriteId)
    localStorage.setItem('favorites', JSON.stringify(filteredFavorites))
    return Promise.resolve()
  }

  // Пользователь
  getCurrentUser() {
    return Promise.resolve(getStoredUser())
  }

  login(email) {
    const newUser = {
      email,
      full_name: email.split('@')[0],
      id: Date.now().toString()
    }
    localStorage.setItem('user', JSON.stringify(newUser))
    return Promise.resolve(newUser)
  }

  logout() {
    localStorage.removeItem('user')
    return Promise.resolve()
  }

  // Цены (мок данные)
  searchPrices(drinkName) {
    const mockPrices = [
      {
        shop_name: "Яндекс Маркет",
        price: Math.floor(Math.random() * 200) + 300,
        url: `https://market.yandex.ru/search?text=${encodeURIComponent(drinkName + ' чай')}`,
        weight: "100г",
        in_stock: true
      },
      {
        shop_name: "Wildberries",
        price: Math.floor(Math.random() * 200) + 400,
        url: `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(drinkName + ' чай')}`,
        weight: "100г", 
        in_stock: true
      },
      {
        shop_name: "OZON",
        price: Math.floor(Math.random() * 300) + 350,
        url: `https://www.ozon.ru/search/?text=${encodeURIComponent(drinkName + ' чай')}&from_global=true`,
        weight: "100г",
        in_stock: Math.random() > 0.3
      },
      {
        shop_name: "Яндекс Маркет (премиум)",
        price: Math.floor(Math.random() * 400) + 500,
        url: `https://market.yandex.ru/search?text=${encodeURIComponent(drinkName + ' элитный чай')}`,
        weight: "100г",
        in_stock: true
      },
      {
        shop_name: "Wildberries (акция)",
        price: Math.floor(Math.random() * 150) + 200,
        url: `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(drinkName + ' чай акция')}`,
        weight: "100г",
        in_stock: Math.random() > 0.2
      }
    ]
    
    return Promise.resolve(mockPrices.sort((a, b) => a.price - b.price))
  }

  getSavedPrices(drinkId) {
    const saved = JSON.parse(localStorage.getItem(`prices_${drinkId}`)) || []
    return Promise.resolve(saved)
  }

  savePrices(drinkId, prices) {
    localStorage.setItem(`prices_${drinkId}`, JSON.stringify(prices))
    return Promise.resolve()
  }
}

export default new DataService()