import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, TrendingDown, Loader2, ShoppingCart } from 'lucide-react'
import dataService from '@/services/dataService'

export default function PriceComparison({ drink }) {
  const [prices, setPrices] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchPrices = async () => {
    setIsSearching(true)
    try {
      const foundPrices = await dataService.searchPrices(drink.name)
      setPrices(foundPrices)
      setHasSearched(true)
      // Сохраняем цены для этого напитка
      await dataService.savePrices(drink.id, foundPrices)
    } catch (error) {
      console.error('Ошибка поиска цен:', error)
      setPrices([])
      setHasSearched(true)
    } finally {
      setIsSearching(false)
    }
  }

  const loadSavedPrices = async () => {
    try {
      const savedPrices = await dataService.getSavedPrices(drink.id)
      if (savedPrices.length > 0) {
        setPrices(savedPrices)
        setHasSearched(true)
      }
    } catch (error) {
      console.error('Ошибка загрузки цен:', error)
    }
  }

  React.useEffect(() => {
    loadSavedPrices()
  }, [drink.id])

  const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null

  return (
    <Card className="border-2 border-amber-100">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="w-6 h-6 text-amber-700" />
            Сравнение цен
          </CardTitle>
          <Button
            onClick={searchPrices}
            disabled={isSearching}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ищем...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                {hasSearched ? 'Обновить цены' : 'Найти лучшие цены'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
              <p className="text-gray-600 text-center">
                Ищем лучшие предложения в интернет-магазинах...
              </p>
            </motion.div>
          ) : prices.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {prices
                .sort((a, b) => a.price - b.price)
                .map((price, idx) => {
                  const isLowest = price.price === minPrice
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isLowest 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-900">{price.shop_name}</h4>
                            {isLowest && (
                              <Badge className="bg-green-500 text-white flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                Лучшая цена
                              </Badge>
                            )}
                            {!price.in_stock && (
                              <Badge variant="outline" className="text-gray-500">
                                Нет в наличии
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-bold ${isLowest ? 'text-green-700' : 'text-gray-900'}`}>
                              {price.price} ₽
                            </span>
                            {price.weight && (
                              <span className="text-sm text-gray-500">за {price.weight}</span>
                            )}
                          </div>
                        </div>
                        {price.url && (
                          <a
                            href={price.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4"
                          >
                            <Button 
                              size="sm" 
                              className={isLowest ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Купить
                            </Button>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 mb-2">
                К сожалению, не удалось найти предложения для этого чая
              </p>
              <p className="text-sm text-gray-500">
                Попробуйте обновить поиск позже
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-600 mb-4">
                Нажмите кнопку "Найти лучшие цены" для поиска предложений
              </p>
              <p className="text-sm text-gray-500">
                Мы автоматически найдем этот чай в популярных онлайн-магазинах
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}