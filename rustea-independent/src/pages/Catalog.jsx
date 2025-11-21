import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import DrinkCard from '../components/catalog/DrinkCard'
import { Skeleton } from '@/components/ui/skeleton'
import dataService from '../services/dataService'
import LoginModal from '../components/LoginModal'

export default function Catalog() {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [caffeineFilter, setCaffeineFilter] = useState('all')
  const [sortBy, setSortBy] = useState('-rating')
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Загрузка пользователя
  useEffect(() => {
    dataService.getCurrentUser().then(setUser).catch(() => setUser(null))
  }, [])

  // Получаем параметры из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const search = urlParams.get('search')
    const category = urlParams.get('category')
    
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [])

  // Загрузка категорий
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => dataService.getCategories(),
  })

  // Загрузка напитков
  const { data: drinks = [], isLoading } = useQuery({
    queryKey: ['drinks', selectedCategory, caffeineFilter, sortBy],
    queryFn: async () => {
      let query = {}
      
      if (selectedCategory !== 'all') {
        query.category_id = selectedCategory
      }
      
      if (caffeineFilter !== 'all') {
        query.caffeine_level = caffeineFilter
      }

      if (Object.keys(query).length > 0) {
        return dataService.filterDrinks(query)
      }
      
      return dataService.getDrinks(sortBy)
    },
  })

  // Загрузка избранного
  useEffect(() => {
    if (user) {
      dataService.getFavorites(user.email)
        .then(setFavorites)
        .catch(() => setFavorites([]))
    }
  }, [user])

  const handleToggleFavorite = async (drink) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    const existingFavorite = favorites.find(f => f.drink_id === drink.id)
    
    if (existingFavorite) {
      await dataService.removeFavorite(existingFavorite.id)
      setFavorites(favorites.filter(f => f.id !== existingFavorite.id))
    } else {
      const newFavorite = await dataService.addFavorite({
        drink_id: drink.id,
        user_email: user.email,
      })
      setFavorites([...favorites, newFavorite])
    }
  }

  const handleLogin = async (email) => {
    try {
      const userData = await dataService.login(email)
      setUser(userData)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  // Фильтрация по поиску
  const filteredDrinks = drinks.filter(drink => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      drink.name?.toLowerCase().includes(query) ||
      drink.description?.toLowerCase().includes(query) ||
      drink.origin?.toLowerCase().includes(query) ||
      drink.taste_notes?.some(note => note.toLowerCase().includes(query))
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4">Каталог чая</h1>
            <p className="text-xl text-white/90">
              Исследуйте нашу коллекцию изысканных чайных напитков
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Фильтры и поиск</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Caffeine Filter */}
            <Select value={caffeineFilter} onValueChange={setCaffeineFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Уровень кофеина" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любой уровень</SelectItem>
                <SelectItem value="без кофеина">Без кофеина</SelectItem>
                <SelectItem value="низкий">Низкий</SelectItem>
                <SelectItem value="средний">Средний</SelectItem>
                <SelectItem value="высокий">Высокий</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-rating">По рейтингу ↓</SelectItem>
                <SelectItem value="rating">По рейтингу ↑</SelectItem>
                <SelectItem value="-created_date">Новинки</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' || caffeineFilter !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Активные фильтры:</span>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="h-7 text-xs"
                >
                  {searchQuery}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              {selectedCategory !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="h-7 text-xs"
                >
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              {caffeineFilter !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCaffeineFilter('all')}
                  className="h-7 text-xs"
                >
                  {caffeineFilter} кофеин
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Найдено напитков: <span className="font-semibold">{filteredDrinks.length}</span>
          </p>
        </div>

        {/* Drinks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[450px] rounded-xl" />
            ))}
          </div>
        ) : filteredDrinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDrinks.map((drink, index) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(f => f.drink_id === drink.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ничего не найдено
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}