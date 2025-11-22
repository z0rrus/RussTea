import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, Trash2 } from 'lucide-react'
import { apiService } from '@/services/apiService'
import dataService from '@/services/dataService'

export default function AdminPanel() {
  const [drinksList, setDrinksList] = useState([])
  const [categories, setCategories] = useState([])
  const [newDrink, setNewDrink] = useState({
    name: '',
    category_id: '',
    description: '',
    origin: '',
    brewing_temp: '',
    brewing_time: '',
    caffeine_level: 'средний',
    taste_notes: [],
    health_benefits: [],
    image_url: '',
    rating: 4.5
  })
  const [currentTasteNote, setCurrentTasteNote] = useState('')
  const [currentHealthBenefit, setCurrentHealthBenefit] = useState('')
  const [loading, setLoading] = useState(false)

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [drinks, categoriesData] = await Promise.all([
        dataService.getDrinks(),
        Promise.resolve(dataService.getCategories())
      ])
      setDrinksList(drinks)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      alert('Ошибка загрузки данных: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const addTasteNote = () => {
    if (currentTasteNote.trim() && !newDrink.taste_notes.includes(currentTasteNote.trim())) {
      setNewDrink({
        ...newDrink,
        taste_notes: [...newDrink.taste_notes, currentTasteNote.trim()]
      })
      setCurrentTasteNote('')
    }
  }

  const removeTasteNote = (note) => {
    setNewDrink({
      ...newDrink,
      taste_notes: newDrink.taste_notes.filter(n => n !== note)
    })
  }

  const addHealthBenefit = () => {
    if (currentHealthBenefit.trim() && !newDrink.health_benefits.includes(currentHealthBenefit.trim())) {
      setNewDrink({
        ...newDrink,
        health_benefits: [...newDrink.health_benefits, currentHealthBenefit.trim()]
      })
      setCurrentHealthBenefit('')
    }
  }

  const removeHealthBenefit = (benefit) => {
    setNewDrink({
      ...newDrink,
      health_benefits: newDrink.health_benefits.filter(b => b !== benefit)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true)
      
      // Используем apiService для добавления чая
      await apiService.addDrink(newDrink)
      
      alert(`Чай "${newDrink.name}" успешно добавлен!`)
      
      // Перезагружаем список чаев
      await loadData()
      
      // Сброс формы
      setNewDrink({
        name: '',
        category_id: '',
        description: '',
        origin: '',
        brewing_temp: '',
        brewing_time: '',
        caffeine_level: 'средний',
        taste_notes: [],
        health_benefits: [],
        image_url: '',
        rating: 4.5
      })
      
    } catch (error) {
      alert('Ошибка при добавлении чая: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteDrink = async (drinkId, drinkName) => {
    if (window.confirm(`Вы уверены, что хотите удалить чай "${drinkName}"?`)) {
      try {
        setLoading(true)
        await apiService.deleteDrink(drinkId)
        alert(`Чай "${drinkName}" успешно удален!`)
        await loadData() // Перезагружаем список
      } catch (error) {
        alert('Ошибка при удалении чая: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Добавить новый чай
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Название чая *</label>
                  <Input
                    value={newDrink.name}
                    onChange={(e) => setNewDrink({...newDrink, name: e.target.value})}
                    placeholder="Например: Жасминовый жемчуг"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Категория *</label>
                  <select
                    value={newDrink.category_id}
                    onChange={(e) => setNewDrink({...newDrink, category_id: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                    disabled={loading}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ... остальная форма без изменений ... */}
              
            </form>
          </CardContent>
        </Card>

        {/* Список существующих чаев */}
        <Card>
          <CardHeader>
            <CardTitle>Существующие чаи ({drinksList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Загрузка...</div>
            ) : (
              <div className="space-y-2">
                {drinksList.map(drink => (
                  <div key={drink.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <span className="font-medium">{drink.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({drink.origin})</span>
                      </div>
                      <Badge>
                        {categories.find(c => c.id === drink.category_id)?.name}
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteDrink(drink.id, drink.name)}
                      className="ml-4"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}