import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Heart, Star, Thermometer, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function DrinkCard({ drink, onToggleFavorite, isFavorite, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-500 h-full">
        <Link to={createPageUrl('DrinkDetail') + `?id=${drink.id}`}>
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
            {drink.image_url ? (
              <img 
                src={drink.image_url} 
                alt={drink.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🍵
              </div>
            )}
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(drink)
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all z-10"
            >
              <Heart 
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>

            {/* Rating Badge */}
            {drink.rating && (
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{drink.rating}</span>
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-5">
          <Link to={createPageUrl('DrinkDetail') + `?id=${drink.id}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-1">
              {drink.name}
            </h3>
            
            {drink.origin && (
              <p className="text-sm text-gray-500 mb-3">📍 {drink.origin}</p>
            )}

            {drink.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {drink.description}
              </p>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              {drink.caffeine_level && (
                <Badge variant="outline" className="text-xs">
                  {drink.caffeine_level} кофеин
                </Badge>
              )}
              {drink.brewing_temp && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Thermometer className="w-3 h-3" />
                  {drink.brewing_temp}
                </Badge>
              )}
              {drink.brewing_time && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {drink.brewing_time}
                </Badge>
              )}
            </div>

            {/* Taste Notes */}
            {drink.taste_notes && drink.taste_notes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {drink.taste_notes.slice(0, 3).map((note, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-800"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}