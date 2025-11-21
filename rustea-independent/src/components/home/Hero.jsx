import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, ChevronRight } from 'lucide-react'
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
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-amber-200">
              <span className="text-sm font-medium text-amber-800">
                🍵 Ваш проводник в мир чая
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              RussTea
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">
                Найдите свой идеальный чай
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Исследуйте коллекцию изысканных чайных напитков со всего мира. 
              Сравнивайте цены и находите лучшие предложения.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Поиск чая..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-amber-200 focus:border-amber-400 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="h-14 px-8 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-lg"
                >
                  Найти
                </Button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl('Catalog')}>
                <Button 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 h-12 px-6"
                >
                  Смотреть каталог
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://avatars.mds.yandex.net/i?id=0a0593102c47956e4d27079e5cc65b9f_l-9828183-images-thumbs&n=13"
                alt="Чайная церемония"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Floating Stats */}
              <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold text-gray-900">8+</div>
                  <div className="text-sm text-gray-600">Сортов чая</div>
                </div>
                <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold text-gray-900">20+</div>
                  <div className="text-sm text-gray-600">Магазинов</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}