import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { 
  Heart, Star, Thermometer, Clock, MapPin, 
  Coffee, Sparkles, ArrowLeft, Share2 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import PriceComparison from '../components/drink/PriceComparison'
import { Skeleton } from '@/components/ui/skeleton'
import dataService from '../services/dataService'
import LoginModal from '../components/LoginModal'

export default function DrinkDetail() {
  const [user, setUser] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [drinkId, setDrinkId] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Получаем ID из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setDrinkId(urlParams.get('id'))
  }, [])

  // Загрузка пользователя
  useEffect(() => {
    dataService.getCurrentUser().then(setUser).catch(() => setUser(null))
  }, [])

  // Загрузка напитка
  const { data: drink, isLoading } = useQuery({
    queryKey: ['drink', drinkId],
    queryFn: async () => {
      if (!drinkId) return null
      return dataService.getDrinkById(drinkId)
    },
    enabled: !!drinkId,
  })

  // Загрузка категории
  const { data: category } = useQuery({
    queryKey: ['category', drink?.category_id],
    queryFn: async () => {
      if (!drink?.category_id) return null
      return dataService.getCategoryById(drink.category_id)
    },
    enabled: !!drink?.category_id,
  })

  // Проверка избранного
  useEffect(() => {
    if (user && drinkId) {
      dataService.getFavorites(user.email)
        .then(favorites => {
          const isFav = favorites.some(f => f.drink_id === drinkId)
          setIsFavorite(isFav)
        })
        .catch(() => setIsFavorite(false))
    }
  }, [user, drinkId])

  const handleToggleFavorite = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (isFavorite) {
      const favorites = await dataService.getFavorites(user.email)
      const favoriteToDelete = favorites.find(f => f.drink_id === drinkId)
      if (favoriteToDelete) {
        await dataService.removeFavorite(favoriteToDelete.id)
        setIsFavorite(false)
      }
    } else {
      await dataService.addFavorite({
        drink_id: drinkId,
        user_email: user.email,
      })
      setIsFavorite(true)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-[500px] rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!drink) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Напиток не найден</h2>
          <Link to={createPageUrl('Catalog')}>
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link to={createPageUrl('Catalog')}>
          <Button variant="ghost" className="mb-8 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад в каталог
          </Button>
        </Link>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100">
              {drink.image_url ? (
                <img
                  src={drink.image_url}
                  alt={drink.name}
                  className="w-full h-[600px] object-cover"
                />
              ) : (
                <div className="w-full h-[600px] flex items-center justify-center text-9xl">
                  🍵
                </div>
              )}

              {/* Floating Actions */}
              <div className="absolute top-6 right-6 flex gap-3">
                <Button
                  size="icon"
                  onClick={handleToggleFavorite}
                  className={`rounded-full shadow-lg ${
                    isFavorite 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-white/90 hover:bg-white text-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Rating Badge */}
              {drink.rating && (
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold">{drink.rating}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            {category && (
              <Link to={createPageUrl('Catalog') + `?category=${category.id}`}>
                <Badge 
                  className="text-sm px-3 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
                >
                  {category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              {drink.name}
            </h1>

            {/* Origin */}
            {drink.origin && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{drink.origin}</span>
              </div>
            )}

            {/* Description */}
            {drink.description && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {drink.description}
              </p>
            )}

            <Separator />

            {/* Brewing Info */}
            <div className="grid grid-cols-2 gap-4">
              {drink.brewing_temp && (
                <Card className="border-amber-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Thermometer className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Температура</p>
                      <p className="font-semibold text-gray-900">{drink.brewing_temp}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {drink.brewing_time && (
                <Card className="border-amber-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Clock className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Время заваривания</p>
                      <p className="font-semibold text-gray-900">{drink.brewing_time}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {drink.caffeine_level && (
                <Card className="border-amber-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Coffee className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Кофеин</p>
                      <p className="font-semibold text-gray-900 capitalize">{drink.caffeine_level}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Taste Notes */}
            {drink.taste_notes && drink.taste_notes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Вкусовые ноты</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {drink.taste_notes.map((note, idx) => (
                    <Badge 
                      key={idx}
                      className="text-sm px-3 py-1 bg-amber-100 text-amber-800"
                    >
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Health Benefits */}
            {drink.health_benefits && drink.health_benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Польза для здоровья
                </h3>
                <ul className="space-y-2">
                  {drink.health_benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>

        {/* Price Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PriceComparison drink={drink} />
        </motion.div>
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