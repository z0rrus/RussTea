import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, ChevronRight, Leaf, Coffee, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function Hero({ onSearch }) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 min-h-screen flex items-center">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        {/* Tea leaves pattern */}
        <div className="absolute top-10 left-5 w-20 h-20">
          <Leaf className="w-full h-full text-amber-600 rotate-12" />
        </div>
        <div className="absolute top-40 right-10 w-16 h-16">
          <Leaf className="w-full h-full text-rose-500 -rotate-45" />
        </div>
        <div className="absolute bottom-32 left-20 w-24 h-24">
          <Leaf className="w-full h-full text-orange-500 rotate-90" />
        </div>
        <div className="absolute bottom-20 right-32 w-18 h-18">
          <Leaf className="w-full h-full text-amber-700 -rotate-12" />
        </div>
        
        {/* Floating tea cups */}
        <div className="absolute top-20 right-1/4 w-12 h-12 opacity-20">
          <div className="w-full h-full bg-amber-300 rounded-full" />
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-amber-200 rounded-t-full" />
        </div>
        
        <div className="absolute bottom-40 left-1/3 w-10 h-10 opacity-15">
          <div className="w-full h-full bg-rose-300 rounded-full" />
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-rose-200 rounded-t-full" />
        </div>
      </div>

      {/* Animated steam elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/30 rounded-full blur-lg"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 right-1/3 w-20 h-20 bg-amber-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/2 w-14 h-14 bg-rose-200/25 rounded-full blur-lg"
        />
      </div>

      {/* Main gradient blobs */}
      <div className="absolute inset-0 opacity-15">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-rose-400 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 mb-3 md:mb-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full shadow-lg"
            >
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">
                Премиум коллекция чая
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Russ
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">Tea</span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-2xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-rose-700 mt-3 md:mt-4"
              >
                Найдите свой идеальный чай
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
            >
              Откройте мир изысканных чайных напитков со всего мира. 
              <span className="block mt-2 text-amber-700 font-medium text-sm md:text-sm lg:text-sm">
                Сравнивайте цены • Находите лучшие предложения • Создайте свою коллекцию
              </span>
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              onSubmit={handleSearch}
              className="mb-6 md:mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Например: улун, зеленый чай, матча..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-amber-300 focus:border-amber-500 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="h-14 px-8 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Найти чай
                </Button>
              </div>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link to={createPageUrl('Catalog')}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Смотреть каталог
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              {/* Quick stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>200+ сортов</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>50+ магазинов</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://avatars.mds.yandex.net/i?id=0a0593102c47956e4d27079e5cc65b9f_l-9828183-images-thumbs&n=13"
                alt="Чайная церемония"
                className="w-full h-full object-cover"
              />
              
              {/* Enhanced overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              
              {/* Animated tea leaves floating */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-10 right-10 w-8 h-8 text-white/80"
              >
                <Leaf />
              </motion.div>
              
              {/* Enhanced Floating Stats */}
              <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                >
                  <div className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                    200+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Сортов чая</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                >
                  <div className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                    50+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Магазинов</div>
                </motion.div>
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full shadow-xl flex items-center justify-center"
            >
              <Coffee className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{
                y: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-xl flex items-center justify-center"
            >
              <Leaf className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}