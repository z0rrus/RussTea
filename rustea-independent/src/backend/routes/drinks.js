import express from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const DATA_FILE = join(__dirname, '../data/drinks.json');

// Helper функция для чтения данных
const readDrinksData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { drinks: [], categories: [] };
  }
};

// Helper функция для записи данных
const writeDrinksData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/drinks - получить все чаи
router.get('/', async (req, res) => {
  try {
    const data = await readDrinksData();
    res.json(data.drinks);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// POST /api/drinks - добавить новый чай
router.post('/', async (req, res) => {
  try {
    const newDrink = req.body;
    const data = await readDrinksData();
    
    // Генерируем ID
    const newId = (data.drinks.length + 1).toString();
    
    const drinkToAdd = {
      ...newDrink,
      id: newId,
      created_date: new Date().toISOString()
    };
    
    data.drinks.push(drinkToAdd);
    await writeDrinksData(data);
    
    res.status(201).json(drinkToAdd);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка добавления чая' });
  }
});

// DELETE /api/drinks/:id - удалить чай
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readDrinksData();
    
    data.drinks = data.drinks.filter(drink => drink.id !== id);
    await writeDrinksData(data);
    
    res.json({ message: 'Чай удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления чая' });
  }
});

export default router;