import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import DrinkCard from '../components/catalog/DrinkCard'
import { Skeleton } from '@/components/ui/skeleton'
import dataService from '../services/dataService'
import LoginModal from '../components/LoginModal'

export default function Favorites() {
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Загрузка пользователя
  useEffect(() => {
    dataService.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  // Загрузка избранного
  const { data: favorites = [], isLoading: favoritesLoading, refetch } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: () => {
      if (!user) return []
      return dataService.getFavorites(user.email)
    },
    enabled: !!user,
  })

  // Загрузка напитков
  const { data: drinks = [], isLoading: drinksLoading } = useQuery({
    queryKey: ['favorite-drinks', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return []
      
      const drinkIds = favorites.map(f => f.drink_id)
      const allDrinks = await dataService.getDrinks()
      return allDrinks.filter(d => drinkIds.includes(d.id))
    },
    enabled: favorites.length > 0,
  })

  const handleToggleFavorite = async (drink) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    const existingFavorite = favorites.find(f => f.drink_id === drink.id)
    
    if (existingFavorite) {
      await dataService.removeFavorite(existingFavorite.id)
      refetch()
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

  const isLoading = favoritesLoading || drinksLoading

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Требуется авторизация
          </h2>
          <p className="text-gray-600 mb-6">
            Войдите в систему, чтобы просмотреть избранное
          </p>
          <Button 
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
          >
            Войти
          </Button>
        </div>

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 fill-white" />
              <h1 className="text-3xl md:text-5xl font-bold">Избранное</h1>
            </div>
            <p className="text-xl text-white/90">
              Ваша личная коллекция любимых чайных напитков
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[450px] rounded-xl" />
            ))}
          </div>
        ) : drinks.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                В избранном: <span className="font-semibold">{drinks.length}</span> {
                  drinks.length === 1 ? 'напиток' : 
                  drinks.length < 5 ? 'напитка' : 'напитков'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {drinks.map((drink, index) => (
                <DrinkCard
                  key={drink.id}
                  drink={drink}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Пока пусто
              </h3>
              <p className="text-gray-600 mb-6">
                Добавьте понравившиеся напитки в избранное
              </p>
              <Link to={createPageUrl('Catalog')}>
                <Button className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700">
                  Перейти в каталог
                </Button>
              </Link>
            </motion.div>
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