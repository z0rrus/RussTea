const API_BASE_URL = 'http://localhost:3001/api';

export const apiService = {
  // Получить все чаи
  async getDrinks() {
    const response = await fetch(`${API_BASE_URL}/drinks`);
    if (!response.ok) throw new Error('Ошибка загрузки чаев');
    return await response.json();
  },

  // Добавить новый чай
  async addDrink(drinkData) {
    const response = await fetch(`${API_BASE_URL}/drinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drinkData),
    });
    if (!response.ok) throw new Error('Ошибка добавления чая');
    return await response.json();
  },

  // Удалить чай
  async deleteDrink(id) {
    const response = await fetch(`${API_BASE_URL}/drinks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Ошибка удаления чая');
    return await response.json();
  }
};