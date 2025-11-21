import React from 'react'
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'

export default function CategoryCard({ category, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={createPageUrl('Catalog') + `?category=${category.id}`}>
        <Card className="group relative overflow-hidden h-48 cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-500">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: category.image_url 
                ? `url(${category.image_url})` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <h3 className="text-2xl font-bold text-white mb-2">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-white/90 text-sm line-clamp-2 mb-3">
                {category.description}
              </p>
            )}
            <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
              <span>Смотреть</span>
              <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}