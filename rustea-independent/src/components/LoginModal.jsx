import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { motion } from "framer-motion"
import { X } from 'lucide-react'

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      onLogin(email)
      setEmail('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Вход</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
            required
          />
          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
            Войти
          </Button>
        </form>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Просто введите email для демо-входа
        </p>
      </motion.div>
    </div>
  )
}