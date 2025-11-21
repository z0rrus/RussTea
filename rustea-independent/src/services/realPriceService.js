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
      console.log('Original product name:', productName);
      
      const englishQuery = this.autoTranslateTeaName(productName);
      console.log('Translated query:', englishQuery);

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

      const realPrices = this.formatRealProductData(products);
      console.log('💰 === FORMATTED PRICES ===', realPrices);
      
      if (realPrices.length === 0) {
        throw new Error('Найдены товары, но не удалось извлечь цены. Проверьте структуру данных в консоли.');
      }

      console.log(`✅ === SUCCESS: Found ${realPrices.length} valid products ===`);
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
      console.log('⚠️ Using data object as single product');
      return [data];
    }

    console.log('❌ No products found in any known path');
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

  formatRealProductData(products) {
    return products
      .map((product, index) => {
        console.log(`🛒 Processing product ${index + 1}:`, product);
        
        const price = this.extractPriceFromProduct(product);
        const title = this.extractTitle(product);
        const { directUrl, store } = this.extractDirectStoreUrl(product);

        console.log(`📊 Product ${index + 1} - Price: ${price}, Title: "${title}", Store: "${store}", URL: ${directUrl}`);

        if (!price || price === 0) {
          console.log(`❌ Skipping product ${index + 1} - no valid price`);
          return null;
        }

        if (!title) {
          console.log(`❌ Skipping product ${index + 1} - no title`);
          return null;
        }

        return {
          shop_name: store,
          price: price,
          url: directUrl,
          weight: this.extractWeight(title),
          in_stock: this.checkStock(product),
          product_title: title,
          rating: this.extractRating(product),
          image_url: this.extractImage(product),
          is_real_product: true,
          currency: "₽",
          source: 'real_api'
        };
      })
      .filter(product => product !== null)
      .sort((a, b) => a.price - b.price);
  }

  // ГЛАВНЫЙ МЕТОД: извлекаем прямую ссылку на магазин
  extractDirectStoreUrl(product) {
    console.log('🔗 === EXTRACTING DIRECT STORE URL ===', product);

    // 1. Ищем прямую ссылку в основных полях
    const directUrlPaths = [
      'product_url',
      'url',
      'link',
      'product_link',
      'offer_url',
      'product_page_url',
      'detail_url',
      'store_url'
    ];

    for (const path of directUrlPaths) {
      const url = this.getNestedValue(product, path);
      if (url && this.isDirectStoreUrl(url)) {
        const store = this.extractStoreFromUrl(url);
        console.log(`✅ Found direct store URL in ${path}: ${url}`);
        return { directUrl: url, store };
      }
    }

    // 2. Ищем в массивах offers
    if (product.offers && Array.isArray(product.offers)) {
      for (const offer of product.offers) {
        if (offer.url && this.isDirectStoreUrl(offer.url)) {
          const store = this.extractStoreFromUrl(offer.url) || offer.store || offer.merchant;
          console.log(`✅ Found direct URL in offers: ${offer.url}`);
          return { 
            directUrl: offer.url, 
            store: this.formatStoreName(store) || 'Интернет-магазин' 
          };
        }
      }
    }

    // 3. Ищем в merchants
    if (product.merchants && Array.isArray(product.merchants)) {
      for (const merchant of product.merchants) {
        if (merchant.url && this.isDirectStoreUrl(merchant.url)) {
          console.log(`✅ Found direct URL in merchants: ${merchant.url}`);
          return { 
            directUrl: merchant.url, 
            store: this.formatStoreName(merchant.name) || 'Интернет-магазин' 
          };
        }
      }
    }

    // 4. Если нашли Google URL, пытаемся извлечь реальную ссылку
    const googleUrl = this.getGoogleUrl(product);
    if (googleUrl) {
      const realUrl = this.extractRealUrlFromGoogle(googleUrl);
      if (realUrl && this.isDirectStoreUrl(realUrl)) {
        const store = this.extractStoreFromUrl(realUrl) || this.extractStoreFromProductData(product);
        console.log(`✅ Extracted real URL from Google: ${realUrl}`);
        return { directUrl: realUrl, store: store || 'Интернет-магазин' };
      }
    }

    // 5. Если ничего не нашли, создаем поисковую ссылку для магазина
    const title = this.extractTitle(product);
    const store = this.extractStoreFromProductData(product) || 'Интернет-магазин';
    const searchUrl = this.createStoreSearchUrl(store, title);
    
    console.log(`⚠️ Using search URL for: ${store}`);
    return { directUrl: searchUrl, store };
  }

  // Проверяем, что ссылка ведет напрямую в магазин (не на Google)
  isDirectStoreUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // Исключаем Google и связанные домены
    const excludedDomains = [
      'google.com',
      'google.ru',
      'gstatic.com',
      'googleapis.com',
      'googleadservices.com'
    ];

    const isExcluded = excludedDomains.some(domain => url.includes(domain));
    if (isExcluded) {
      console.log(`❌ Excluded Google domain: ${url}`);
      return false;
    }

    return url.startsWith('http://') || url.startsWith('https://');
  }

  // Ищем Google URL в продукте
  getGoogleUrl(product) {
    const googlePaths = ['url', 'product_url', 'link'];
    for (const path of googlePaths) {
      const url = this.getNestedValue(product, path);
      if (url && url.includes('google.com')) {
        return url;
      }
    }
    return null;
  }

  // Пытаемся извлечь реальную ссылку из Google URL
  extractRealUrlFromGoogle(googleUrl) {
    try {
      console.log(`🔍 Extracting real URL from Google: ${googleUrl}`);
      const url = new URL(googleUrl);
      
      // Пробуем разные параметры, которые могут содержать реальную ссылку
      const possibleParams = ['url', 'link', 'u', 'q', 'adurl'];
      
      for (const param of possibleParams) {
        const value = url.searchParams.get(param);
        if (value) {
          try {
            const decodedUrl = decodeURIComponent(value);
            if (this.isDirectStoreUrl(decodedUrl)) {
              console.log(`✅ Found real URL in parameter ${param}: ${decodedUrl}`);
              return decodedUrl;
            }
          } catch (e) {
            // Пробуем без декодирования
            if (this.isDirectStoreUrl(value)) {
              console.log(`✅ Found real URL in parameter ${param}: ${value}`);
              return value;
            }
          }
        }
      }

      // Пробуем найти в пути URL
      if (url.pathname.includes('/url?')) {
        const matches = googleUrl.match(/url=([^&]+)/);
        if (matches && matches[1]) {
          const decodedUrl = decodeURIComponent(matches[1]);
          if (this.isDirectStoreUrl(decodedUrl)) {
            console.log(`✅ Found real URL in path: ${decodedUrl}`);
            return decodedUrl;
          }
        }
      }

    } catch (error) {
      console.log('❌ Error parsing Google URL:', error);
    }

    return null;
  }

  // Извлекаем магазин из URL
  extractStoreFromUrl(url) {
    try {
      const domain = new URL(url).hostname;
      console.log('🌐 Analyzing domain:', domain);
      
      const domainWithoutWww = domain.replace(/^www\./, '');
      
      const domainMap = {
        'ozon.ru': 'OZON',
        'wildberries.ru': 'Wildberries',
        'aliexpress.ru': 'AliExpress',
        'amazon.ru': 'Amazon',
        'ebay.com': 'eBay',
        'etsy.com': 'Etsy',
        'market.yandex.ru': 'Яндекс Маркет',
        'yandex.ru': 'Яндекс Маркет',
        'citilink.ru': 'Ситилинк',
        'mvideo.ru': 'М.Видео',
        'dns-shop.ru': 'DNS',
        'eldorado.ru': 'Эльдорадо',
        'sbermegamarket.ru': 'СберМегаМаркет',
        'goods.ru': 'Goods',
        'megamarket.ru': 'Мегамаркет',
        'lamoda.ru': 'Lamoda',
        'brandshop.ru': 'Brandshop'
      };

      for (const [domainPattern, storeName] of Object.entries(domainMap)) {
        if (domainWithoutWww.includes(domainPattern)) {
          return storeName;
        }
      }

      const mainDomain = domainWithoutWww.split('.')[0];
      return this.formatStoreName(mainDomain);

    } catch (error) {
      console.log('❌ Error parsing domain:', error);
      return null;
    }
  }

  // Извлекаем магазин из данных продукта
  extractStoreFromProductData(product) {
    const storePaths = [
      'store',
      'shop',
      'retailer',
      'seller',
      'source',
      'website',
      'site',
      'merchant',
      'seller_name',
      'retailer_name',
      'merchant_name'
    ];

    for (const path of storePaths) {
      const value = this.getNestedValue(product, path);
      if (value && typeof value === 'string') {
        const storeName = this.formatStoreName(value);
        if (storeName) {
          return storeName;
        }
      }
    }

    const title = this.extractTitle(product);
    return this.extractStoreFromTitle(title);
  }

  extractStoreFromTitle(title) {
    if (!title) return null;

    const storeKeywords = {
      'ozon': 'OZON',
      'wildberries': 'Wildberries',
      'aliexpress': 'AliExpress',
      'яндекс': 'Яндекс Маркет',
      'yandex': 'Яндекс Маркет',
      'amazon': 'Amazon',
      'ebay': 'eBay',
      'etsy': 'Etsy',
      'ситилинк': 'Ситилинк',
      'м.видео': 'М.Видео',
      'эльдорадо': 'Эльдорадо',
      'сбермегамаркет': 'СберМегаМаркет'
    };

    const lowerTitle = title.toLowerCase();
    for (const [keyword, storeName] of Object.entries(storeKeywords)) {
      if (lowerTitle.includes(keyword)) {
        return storeName;
      }
    }
    return null;
  }

  formatStoreName(storeRaw) {
    if (!storeRaw) return null;

    const storeMap = {
      'ozon': 'OZON',
      'wildberries': 'Wildberries',
      'aliexpress': 'AliExpress',
      'yandex': 'Яндекс Маркет',
      'amazon': 'Amazon',
      'ebay': 'eBay',
      'etsy': 'Etsy',
      'citilink': 'Ситилинк',
      'mvideo': 'М.Видео',
      'dns': 'DNS',
      'eldorado': 'Эльдорадо',
      'sbermegamarket': 'СберМегаМаркет'
    };

    const lowerStore = storeRaw.toLowerCase().trim();
    
    for (const [key, value] of Object.entries(storeMap)) {
      if (lowerStore === key || lowerStore.includes(key)) {
        return value;
      }
    }

    if (lowerStore.includes('google')) {
      return null;
    }

    return storeRaw.charAt(0).toUpperCase() + storeRaw.slice(1);
  }

  createStoreSearchUrl(storeName, productTitle) {
    const searchQuery = encodeURIComponent(productTitle);
    
    const storeSearchUrls = {
      'OZON': `https://www.ozon.ru/search/?text=${searchQuery}`,
      'Wildberries': `https://www.wildberries.ru/catalog/0/search.aspx?search=${searchQuery}`,
      'AliExpress': `https://aliexpress.ru/wholesale?SearchText=${searchQuery}`,
      'Яндекс Маркет': `https://market.yandex.ru/search?text=${searchQuery}`,
      'Ситилинк': `https://www.citilink.ru/search/?text=${searchQuery}`,
      'М.Видео': `https://www.mvideo.ru/product-list?q=${searchQuery}`,
      'DNS': `https://www.dns-shop.ru/search/?q=${searchQuery}`,
      'Эльдорадо': `https://www.eldorado.ru/search/?q=${searchQuery}`,
      'СберМегаМаркет': `https://sbermegamarket.ru/catalog/?q=${searchQuery}`
    };

    return storeSearchUrls[storeName] || `https://www.google.com/search?q=${encodeURIComponent(productTitle)}&tbm=shop`;
  }

  // ОСТАЛЬНЫЕ МЕТОДЫ
  extractPriceFromProduct(product) {
    const pricePaths = [
      'price',
      'product_price',
      'current_price',
      'original_price',
      'discounted_price',
      'sale_price',
      'retail_price',
      'price_value',
      'cost',
      'amount'
    ];

    for (const path of pricePaths) {
      const value = this.getNestedValue(product, path);
      if (value) {
        const parsedPrice = this.parsePrice(value);
        if (parsedPrice > 0) {
          return parsedPrice;
        }
      }
    }
    return 0;
  }

  extractTitle(product) {
    const titlePaths = [
      'title',
      'product_title',
      'name',
      'product_name',
      'description'
    ];

    for (const path of titlePaths) {
      const value = this.getNestedValue(product, path);
      if (value && typeof value === 'string') {
        return value;
      }
    }
    return 'Tea Product';
  }

  checkStock(product) {
    return !(product.availability === 'out_of_stock' || 
             product.in_stock === false || 
             product.stock_status === 'out');
  }

  extractRating(product) {
    const ratingPaths = ['rating', 'product_rating', 'review_rating', 'stars'];
    for (const path of ratingPaths) {
      const value = this.getNestedValue(product, path);
      if (value && !isNaN(value)) {
        return parseFloat(value);
      }
    }
    return null;
  }

  extractImage(product) {
    const imagePaths = [
      'product_photos[0]',
      'image_url',
      'thumbnail',
      'image',
      'product_image'
    ];

    for (const path of imagePaths) {
      const value = this.getNestedValue(product, path);
      if (value && typeof value === 'string') {
        return value;
      }
    }
    return null;
  }

  parsePrice(priceValue) {
    if (!priceValue) return 0;
    
    if (typeof priceValue === 'number') {
      return priceValue;
    }
    
    if (typeof priceValue === 'string') {
      const cleanString = priceValue.replace(/[^\d,.]/g, '');
      const priceMatch = cleanString.match(/(\d+[.,]\d+|\d+)/);
      
      if (priceMatch) {
        return parseFloat(priceMatch[0].replace(',', '.'));
      }
    }
    
    return 0;
  }

  autoTranslateTeaName(russianName) {
    const teaDictionary = {
      'зеленый': 'green', 'черный': 'black', 'улун': 'oolong', 'пуэр': 'puerh',
      'жасминовый': 'jasmine', 'жемчуг': 'pearl', 'молочный': 'milk', 'лимонный': 'lemon',
      'имбирный': 'ginger', 'мятный': 'mint', 'ромашковый': 'chamomile', 'лавандовый': 'lavender',
      'чай': 'tea'
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
    const weightMatch = title.match(/(\d+\s*г|\d+\s*gram|\d+\s*grams?|\d+\s*oz)/i);
    return weightMatch ? weightMatch[0] : "100 г";
  }
}

export default new RealPriceService();