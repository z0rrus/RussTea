import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '../utils'
import dataService from '../services/dataService'
import { Button } from './ui/button'
import { 
  Menu, X, Heart, Home, Coffee, User, LogOut, LogIn 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginModal from './LoginModal'

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    dataService.getCurrentUser().then(setUser).catch(() => setUser(null))
  }, [])

  const handleLogin = async (email) => {
    try {
      const userData = await dataService.login(email)
      setUser(userData)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogout = () => {
    dataService.logout()
    setUser(null)
  }

  const navigation = [
    { name: 'Главная', path: 'Home', icon: Home },
    { name: 'Каталог', path: 'Catalog', icon: Coffee },
    { name: 'Избранное', path: 'Favorites', icon: Heart, requireAuth: true },
  ]

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-primary: #d97706;
          --color-secondary: #ea580c;
          --color-accent: #dc2626;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')}>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="text-4xl">🍵</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    RussTea
                  </h1>
                  <p className="text-xs text-gray-500">Чайный справочник</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                if (item.requireAuth && !user) return null
                const Icon = item.icon
                const isActive = currentPageName === item.path
                
                return (
                  <Link key={item.path} to={createPageUrl(item.path)}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`flex items-center gap-2 ${
                        isActive 
                          ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white' 
                          : 'text-gray-700 hover:text-amber-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <div className="text-right mr-2">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Войти
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-6 py-4 space-y-2">
                {navigation.map((item) => {
                  if (item.requireAuth && !user) return null
                  const Icon = item.icon
                  const isActive = currentPageName === item.path
                  
                  return (
                    <Link 
                      key={item.path} 
                      to={createPageUrl(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isActive 
                            ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  )
                })}

                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <>
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setShowLoginModal(true)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Войти
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🍵</span>
                <h3 className="text-xl font-bold">RussTea</h3>
              </div>
              <p className="text-gray-400">
                Ваш проводник в мир изысканных чайных напитков со всего мира
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link 
                    key={item.path} 
                    to={createPageUrl(item.path)}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">О проекте</h4>
              <p className="text-gray-400 text-sm">
                RussTea - это современный справочник чайных напитков с возможностью 
                сравнения цен в популярных онлайн-магазинах.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>2025 RussTea. Курсовая работа Руслана Зарипова АА-22-08</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}