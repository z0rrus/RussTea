import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from 'lucide-react'
import { categories, drinks } from '@/data/mockData'

export default function AdminPanel() {
  const [newDrink, setNewDrink] = useState({
    id: '',
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Генерируем ID на основе текущего времени
    const newId = (drinks.length + 1).toString()
    
    const drinkToAdd = {
      ...newDrink,
      id: newId,
      created_date: new Date().toISOString()
    }

    // В реальном приложении здесь был бы запрос к API
    console.log('Новый чай для добавления:', drinkToAdd)
    
    alert(`Чай "${newDrink.name}" готов к добавлению! Проверь консоль браузера.`)
    
    // Сброс формы
    setNewDrink({
      id: '',
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
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Категория *</label>
                  <select
                    value={newDrink.category_id}
                    onChange={(e) => setNewDrink({...newDrink, category_id: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Происхождение</label>
                <Input
                  value={newDrink.origin}
                  onChange={(e) => setNewDrink({...newDrink, origin: e.target.value})}
                  placeholder="Например: Китай, Фуцзянь"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Описание *</label>
                <Textarea
                  value={newDrink.description}
                  onChange={(e) => setNewDrink({...newDrink, description: e.target.value})}
                  placeholder="Подробное описание вкуса и аромата..."
                  rows={3}
                  required
                />
              </div>

              {/* Параметры заваривания */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Температура</label>
                  <Input
                    value={newDrink.brewing_temp}
                    onChange={(e) => setNewDrink({...newDrink, brewing_temp: e.target.value})}
                    placeholder="80°C"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Время заваривания</label>
                  <Input
                    value={newDrink.brewing_time}
                    onChange={(e) => setNewDrink({...newDrink, brewing_time: e.target.value})}
                    placeholder="3-4 минуты"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Уровень кофеина</label>
                  <select
                    value={newDrink.caffeine_level}
                    onChange={(e) => setNewDrink({...newDrink, caffeine_level: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="без кофеина">Без кофеина</option>
                    <option value="низкий">Низкий</option>
                    <option value="средний">Средний</option>
                    <option value="высокий">Высокий</option>
                  </select>
                </div>
              </div>

              {/* Вкусовые ноты */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Вкусовые ноты</label>
                <div className="flex gap-2">
                  <Input
                    value={currentTasteNote}
                    onChange={(e) => setCurrentTasteNote(e.target.value)}
                    placeholder="Добавить вкусовую ноту"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTasteNote())}
                  />
                  <Button type="button" onClick={addTasteNote}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newDrink.taste_notes.map((note, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {note}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTasteNote(note)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Польза для здоровья */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Польза для здоровья</label>
                <div className="flex gap-2">
                  <Input
                    value={currentHealthBenefit}
                    onChange={(e) => setCurrentHealthBenefit(e.target.value)}
                    placeholder="Добавить пользу для здоровья"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHealthBenefit())}
                  />
                  <Button type="button" onClick={addHealthBenefit}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newDrink.health_benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {benefit}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeHealthBenefit(benefit)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Ссылка на изображение */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ссылка на изображение</label>
                <Input
                  value={newDrink.image_url}
                  onChange={(e) => setNewDrink({...newDrink, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Рейтинг */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Рейтинг (0-5)</label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={newDrink.rating}
                  onChange={(e) => setNewDrink({...newDrink, rating: parseFloat(e.target.value)})}
                  placeholder="4.5"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Добавить чай
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Список существующих чаев */}
        <Card>
          <CardHeader>
            <CardTitle>Существующие чаи ({drinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drinks.map(drink => (
                <div key={drink.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{drink.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({drink.origin})</span>
                  </div>
                  <Badge>
                    {categories.find(c => c.id === drink.category_id)?.name}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}