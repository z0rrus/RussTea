class RealPriceService {
  constructor() {
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    this.baseURL = 'https://real-time-product-search.p.rapidapi.com';
  }

  async searchRealPrices(productName) {
    if (!this.apiKey || this.apiKey === 'your_actual_api_key_here') {
      throw new Error('RapidAPI key not configured. Please add VITE_RAPIDAPI_KEY to .env file');
    }

    try {
      console.log('🔍 === STARTING API SEARCH ===');
      
      // Добавляем слово "tea" к запросу (только один раз)
      let englishQuery = this.autoTranslateTeaName(productName);
      if (!englishQuery.includes('tea')) {
        englishQuery = englishQuery + ' tea';
      }
      console.log('Final query:', englishQuery);

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
        }
      };

      const url = `${this.baseURL}/search-v2?q=${encodeURIComponent(englishQuery)}&country=ru&language=ru&page=1&limit=20`;
      console.log('API URL:', url);

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 === FULL API RESPONSE ===', data);

      const products = this.extractProducts(data);
      console.log(`📊 Found ${products.length} raw products`);

      if (products.length === 0) {
        throw new Error('API вернул пустой список товаров');
      }

      const realPrices = this.formatProductData(products);
      console.log('💰 === FORMATTED PRICES ===', realPrices);
      
      if (realPrices.length === 0) {
        throw new Error('Найдены товары, но не удалось извлечь цены');
      }

      console.log(`✅ === SUCCESS: Found ${realPrices.length} products ===`);
      return realPrices.slice(0, 5);
      
    } catch (error) {
      console.error('❌ === API SEARCH FAILED ===', error);
      throw new Error(error.message);
    }
  }

  extractProducts(data) {
    const possiblePaths = [
      'data.products',
      'data.data',
      'products',
      'data.items',
      'items',
      'data.results',
      'results',
      'data'
    ];

    for (const path of possiblePaths) {
      const products = this.getNestedValue(data, path);
      if (Array.isArray(products) && products.length > 0) {
        console.log(`✅ Found products in: ${path}`);
        return products;
      }
    }

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return [data];
    }

    return [];
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2]);
        return current && current[arrayKey] && Array.isArray(current[arrayKey]) 
          ? current[arrayKey][arrayIndex] 
          : undefined;
      }
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  formatProductData(products) {
    return products
      .map((product, index) => {
        const price = this.extractPrice(product);
        const title = this.extractTitle(product);
        const url = this.extractProductUrl(product);
        const store = this.extractStore(product);

        console.log(`📊 Product ${index + 1} - Price: ${price}, Title: "${title}", Store: "${store}", URL: ${url}`);

        if (!price || price === 0) {
          return null;
        }

        return {
          shop_name: store,
          price: price,
          url: url,
          weight: this.extractWeight(title),
          in_stock: true,
          product_title: title,
          rating: this.extractRating(product),
          image_url: this.extractImage(product),
          currency: "₽"
        };
      })
      .filter(product => product !== null)
      .sort((a, b) => a.price - b.price);
  }

  // ИЗВЛЕКАЕМ ЦЕНУ ИЗ ОСНОВНЫХ ПОЛЕЙ
  extractPrice(product) {
    // Проверяем поле offer с ценой
    if (product.offer && product.offer.price) {
      const price = this.parsePrice(product.offer.price);
      if (price > 0) return price;
    }

    // Проверяем typical_price_range
    if (product.typical_price_range) {
      const range = product.typical_price_range;
      if (range.min_price) {
        const price = this.parsePrice(range.min_price);
        if (price > 0) return price;
      }
      if (range.max_price) {
        const price = this.parsePrice(range.max_price);
        if (price > 0) return price;
      }
    }

    // Проверяем основные поля с ценой
    const priceFields = ['price', 'current_price', 'original_price', 'sale_price'];
    for (const field of priceFields) {
      if (product[field]) {
        const price = this.parsePrice(product[field]);
        if (price > 0) return price;
      }
    }

    return 0;
  }

  parsePrice(priceValue) {
    if (!priceValue && priceValue !== 0) return 0;
    
    if (typeof priceValue === 'number') {
      return priceValue;
    }
    
    if (typeof priceValue === 'string') {
      const cleanString = priceValue.replace(/[^\d,.]/g, '');
      const priceMatch = cleanString.match(/(\d+[.,]\d+|\d+)/);
      
      if (priceMatch) {
        const price = parseFloat(priceMatch[0].replace(',', '.'));
        return !isNaN(price) && price > 0 && price < 100000 ? price : 0;
      }
    }
    
    return 0;
  }

  // ИЗВЛЕКАЕМ ССЫЛКУ НА ТОВАР
  extractProductUrl(product) {
    // Используем прямую ссылку из product_page_url
    if (product.product_page_url && this.isValidUrl(product.product_page_url)) {
      return product.product_page_url;
    }

    // Или создаем поисковую ссылку
    const title = this.extractTitle(product);
    const searchQuery = encodeURIComponent(title);
    return `https://www.google.com/search?q=${searchQuery}&tbm=shop`;
  }

  isValidUrl(url) {
    return url && typeof url === 'string' && 
           (url.startsWith('http://') || url.startsWith('https://')) &&
           !url.includes('google.com');
  }

  extractStore(product) {
    // Пробуем извлечь магазин из offer
    if (product.offer && product.offer.store) {
      return this.formatStoreName(product.offer.store);
    }

    // Или из других полей
    const storePaths = ['store', 'shop', 'retailer', 'seller'];
    for (const path of storePaths) {
      const value = this.getNestedValue(product, path);
      if (value && typeof value === 'string') {
        const storeName = this.formatStoreName(value);
        if (storeName) return storeName;
      }
    }

    return 'Интернет-магазин';
  }

  formatStoreName(storeRaw) {
    if (!storeRaw) return null;
    
    const storeMap = {
      'ozon': 'OZON', 'wildberries': 'Wildberries', 'aliexpress': 'AliExpress',
      'yandex': 'Яндекс Маркет', 'citilink': 'Ситилинк', 'mvideo': 'М.Видео',
      'dns': 'DNS', 'eldorado': 'Эльдорадо'
    };

    const lowerStore = storeRaw.toLowerCase().trim();
    for (const [key, value] of Object.entries(storeMap)) {
      if (lowerStore.includes(key)) return value;
    }
    
    return storeRaw.charAt(0).toUpperCase() + storeRaw.slice(1);
  }

  extractTitle(product) {
    return product.product_title || product.title || 'Tea Product';
  }

  extractRating(product) {
    return product.product_rating || product.rating || null;
  }

  extractImage(product) {
    if (product.product_photos && product.product_photos.length > 0) {
      return product.product_photos[0];
    }
    return product.image_url || null;
  }

  autoTranslateTeaName(russianName) {
    const teaDictionary = {
      'зеленый': 'green', 'черный': 'black', 'улун': 'oolong', 'пуэр': 'puerh',
      'жасминовый': 'jasmine', 'жемчуг': 'pearl', 'молочный': 'milk', 'лимонный': 'lemon',
      'имбирный': 'ginger', 'мятный': 'mint', 'ромашковый': 'chamomile', 'лавандовый': 'lavender'
      // Убираем 'чай': 'tea' чтобы добавить его отдельно
    };

    let englishName = russianName.toLowerCase();
    
    for (const [russian, english] of Object.entries(teaDictionary)) {
      const regex = new RegExp(russian, 'gi');
      englishName = englishName.replace(regex, english);
    }

    return englishName.trim();
  }

  extractWeight(title) {
    if (!title) return "100 г";
    const weightMatch = title.match(/(\d+\s*г|\d+\s*gram)/i);
    return weightMatch ? weightMatch[0] : "100 г";
  }
}

export default new RealPriceService();