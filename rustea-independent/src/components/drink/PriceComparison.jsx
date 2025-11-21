import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, TrendingDown, Loader2, ShoppingCart, AlertCircle } from 'lucide-react'
import realPriceService from '@/services/realPriceService'

export default function PriceComparison({ drink }) {
  const [prices, setPrices] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const searchPrices = async () => {
    setIsSearching(true)
    setSearchError(null)
    setPrices([])
    
    try {
      console.log('Starting REAL price search for:', drink.name)
      const foundPrices = await realPriceService.searchRealPrices(drink.name)
      console.log('REAL prices found:', foundPrices)
      
      if (foundPrices.length === 0) {
        throw new Error('No real products found. Try a different search term.')
      }
      
      setPrices(foundPrices)
      setHasSearched(true)
      
    } catch (error) {
      console.error('REAL price search error:', error)
      setSearchError(error.message)
      setPrices([])
      setHasSearched(true)
    } finally {
      setIsSearching(false)
    }
  }

  const loadSavedPrices = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem(`prices_${drink.id}`)) || []
      if (saved.length > 0) {
        setPrices(saved)
        setHasSearched(true)
      }
    } catch (error) {
      console.error('Error loading saved prices:', error)
    }
  }

  React.useEffect(() => {
    loadSavedPrices()
  }, [drink.id])

  const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null

  React.useEffect(() => {
    if (prices.length > 0) {
      localStorage.setItem(`prices_${drink.id}`, JSON.stringify(prices))
    }
  }, [prices, drink.id])

  return (
    <Card className="border-2 border-amber-100">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="w-6 h-6 text-amber-700" />
            Сравнение РЕАЛЬНЫХ цен
          </CardTitle>
          <Button
            onClick={searchPrices}
            disabled={isSearching}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ищем реальные цены...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                {hasSearched ? 'Обновить цены' : 'Найти реальные цены'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {searchError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-800 font-medium">{searchError}</p>
                <p className="text-red-600 text-sm mt-1">
                  Проверьте API ключ или попробуйте другой напиток
                </p>
              </div>
            </motion.div>
          ) : null}

          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
              <p className="text-gray-600 text-center font-medium">
                Ищем РЕАЛЬНЫЕ цены в онлайн-магазинах...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Это может занять несколько секунд
              </p>
            </motion.div>
          ) : prices.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  Найдено реальных товаров: <span className="font-semibold">{prices.length}</span>
                </p>
                {minPrice && (
                  <Badge className="bg-green-100 text-green-800">
                    Лучшая цена: {minPrice} ₽
                  </Badge>
                )}
              </div>

              {prices.map((price, idx) => {
                const isLowest = price.price === minPrice
                return (
                  <motion.div
                    key={`${price.shop_name}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isLowest 
                        ? 'border-green-400 bg-green-50 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-amber-200 hover:shadow-md'
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
                          {price.rating && (
                            <Badge variant="outline" className="text-xs">
                              ⭐ {price.rating.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {price.product_title}
                        </p>

                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-bold ${isLowest ? 'text-green-700' : 'text-gray-900'}`}>
                            {price.price} ₽
                          </span>
                          {price.weight && (
                            <span className="text-sm text-gray-500">• {price.weight}</span>
                          )}
                        </div>
                      </div>
                      
                      <a
                        href={price.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 flex-shrink-0"
                      >
                        <Button 
                          size="sm" 
                          className={isLowest ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Купить сейчас
                        </Button>
                      </a>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Реальные товары не найдены
              </h3>
              <p className="text-gray-600 mb-4">
                Попробуйте другой напиток или обновите поиск
              </p>
              <Button onClick={searchPrices} variant="outline">
                Попробовать снова
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Найти РЕАЛЬНЫЕ цены
              </h3>
              <p className="text-gray-600 mb-4">
                Мы найдем актуальные цены на "{drink.name}" в реальных магазинах
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ⚡ Только настоящие товары • Только реальные цены
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}