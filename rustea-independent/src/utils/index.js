export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Catalog': '/catalog', 
    'DrinkDetail': '/drink',
    'Favorites': '/favorites'
  }
  return routes[pageName] || '/'
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
}

export const getCaffeineLevelColor = (level) => {
  const colors = {
    'низкий': 'bg-green-100 text-green-800',
    'средний': 'bg-yellow-100 text-yellow-800', 
    'высокий': 'bg-red-100 text-red-800',
    'без кофеина': 'bg-blue-100 text-blue-800'
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
}