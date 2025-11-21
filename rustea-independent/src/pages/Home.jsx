import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import CategoryCard from '../components/catalog/CategoryCard'
import DrinkCard from '../components/catalog/DrinkCard'
import { Skeleton } from '@/components/ui/skeleton'
import dataService from '../services/dataService'
import LoginModal from '../components/LoginModal'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Загрузка пользователя
  useEffect(() => {
    dataService.getCurrentUser().then(setUser).catch(() => setUser(null))
  }, [])

  // Загрузка категорий
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => dataService.getCategories(),
  })

  // Загрузка популярных напитков
  const { data: drinks = [], isLoading: drinksLoading } = useQuery({
    queryKey: ['popular-drinks'],
    queryFn: () => dataService.getDrinks('-rating', 8),
  })

  // Загрузка избранного
  useEffect(() => {
    if (user) {
      dataService.getFavorites(user.email)
        .then(setFavorites)
        .catch(() => setFavorites([]))
    }
  }, [user])

  const handleSearch = (query) => {
    navigate(createPageUrl('Catalog') + `?search=${encodeURIComponent(query)}`)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Категории чая
          </h2>
          <p className="text-gray-600 text-lg">
            Выберите категорию и откройте для себя новые вкусы
          </p>
        </motion.div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Drinks Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Популярные напитки
          </h2>
          <p className="text-gray-600 text-lg">
            Самые любимые чаи нашего сообщества
          </p>
        </motion.div>

        {drinksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {drinks.map((drink, index) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(f => f.drink_id === drink.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-amber-600 to-rose-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Умный поиск</h3>
              <p className="text-white/90">
                Находите чай по вкусовым нотам, происхождению и характеристикам
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Сравнение цен</h3>
              <p className="text-white/90">
                Автоматически находим лучшие предложения в магазинах
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-2xl font-bold mb-3">Личная коллекция</h3>
              <p className="text-white/90">
                Сохраняйте любимые чаи и делитесь с друзьями
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}