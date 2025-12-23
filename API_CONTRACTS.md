основной функционал магазина:

1) авторизация ( yandex auth )
2) поиск товаров на текущей странице выбранной категории ( все товары, футболки, худи, лонгсливы, штаны )
3) глобальный поиск товара ( поиск по всему ассортименту )
4) добавление товара в избранное
5) покупка товара или группы товаров ( реализовать страницу покупки без самой транзакции )
6) просмотр избранного
7) просмотр корзины

модели:

1) user:
  * id?: number ( уникальный идентификатор в БД )
  * psuid: string ( уникальный id сгенерированный яндексом )
  * first_name?: string
  * last_name?: string
  * sex?: string ( пол: "male" | "female" | "other" )
  * default_email?: string
  * is_buying_smth?: boolean ( флаг процесса покупки )

2) product:
  * id: number ( уникальный идентификатор )
  * name: string ( название )
  * description: string ( описание )
  * sizes: string[] ( массив доступных размеров, например: ["S", "M", "L", "XL"] )
  * article: string ( артикул, уникальный )
  * price: number ( цена в рублях )
  * category: "all" | "tShirts" | "hoodies" | "longSleeves" | "trousers" ( категория товара )
  * stock: number ( общее количество товара в ассортименте )
  * image_url?: string ( URL главного изображения товара )
  * images?: string[] ( массив URL дополнительных изображений )
  * is_active: boolean ( активен ли товар для продажи )

3) favourite_item:
  * id: number ( уникальный идентификатор записи в избранном )
  * user_id: number ( ID пользователя )
  * product_id: number ( ID товара )


4) cart_item:
  * id: number ( уникальный идентификатор записи в корзине )
  * user_id: number ( ID пользователя )
  * product_id: number ( ID товара )
  * quantity: number ( количество товара в корзине, минимум 1 )


5) order:
  * id: number ( уникальный идентификатор заказа )
  * user_id: number ( ID пользователя )
  * items: order_item[] ( массив товаров в заказе )
  * total_price: number ( общая стоимость заказа )
  * status: "pending" | "processing" | "completed" | "cancelled" ( статус заказа )


6) order_item:
  * id: number ( уникальный идентификатор )
  * order_id: number ( ID заказа )
  * product_id: number ( ID товара )
  * product: Product ( информация о товаре на момент заказа )
  * quantity: number ( количество )
  * price: number ( цена на момент заказа )


основные контракты API:

1) Авторизация:
    # POST /api/auth/yandex ( + )
     Request Body: { psuid: string, first_name: string, ... }
     Response: { code: 200, message: "Пользователь успешно создан" }
     Описание: Добавление нового пользователя в бд

   * GET /api/auth/me ( пока не нужно )
     Headers: { Authorization: "Bearer <access_token>" }
     Response: { user: User }
     Описание: Получить информацию о текущем пользователе

   * POST /api/auth/refresh ( пока не нужно )
     Request Body: { refresh_token: string }
     Response: { access_token: string, refresh_token: string }
     Описание: Обновить access_token

2) Товары:
    # GET /api/products ( + )
     Query Params: { category?: "all" | "tShirts" | "hoodies" | "longSleeves" | "trousers"}
     Response: { products: Product[], total: number}
     Описание: Получить список всех товаров с фильтрацией по категории.

    # GET /api/products/:id ( + )
     Params: {id: number};
     Response: { product: Product } ( если авторизован, содержит is_favourite: boolean )
     Описание: Получить информацию о конкретном товаре по ID


3) Избранное:
     # GET /api/favourites ( + )
     Request Body: {user_id: User} 
     Response: { favourites: FavouriteItem[] }
     Описание: Получить список избранных товаров пользователя

     # POST /api/favourites ( + )
     Request Body: { user_id: number, product_id: number }
     Response: { favourite: FavouriteItem }
     Описание: Добавить товар в избранное

     # DELETE /api/favourites/:product_id ( + )
     Request Body: { psuid: number }
     Response: { success: boolean }
     Описание: Удалить товар из избранного

4) Корзина:
   * GET /api/cart
     Headers: { Authorization: "Bearer <access_token>" }
     Response: { cart: CartItem[] }
     Описание: Получить корзину пользователя

   * POST /api/cart
     Headers: { Authorization: "Bearer <access_token>" }
     Request Body: { product_id: number, quantity?: number }
     Response: { cart_item: CartItem }
     Описание: Добавить товар в корзину (или увеличить количество, если уже есть)

   * PATCH /api/cart/:item_id
     Headers: { Authorization: "Bearer <access_token>" }
     Request Body: { quantity: number }
     Response: { cart_item: CartItem }
     Описание: Изменить количество товара в корзине

   * DELETE /api/cart/:item_id
     Headers: { Authorization: "Bearer <access_token>" }
     Response: { success: boolean }
     Описание: Удалить товар из корзины

   * DELETE /api/cart
     Headers: { Authorization: "Bearer <access_token>" }
     Response: { success: boolean }
     Описание: Очистить всю корзину

5) Заказы:
   * POST /api/orders
     Headers: { Authorization: "Bearer <access_token>" }
     Request Body: { items: [{ product_id: number, quantity: number }] }
     Response: { order: Order }
     Описание: Создать заказ из товаров в корзине (корзина очищается после создания заказа)

   * GET /api/orders
     Headers: { Authorization: "Bearer <access_token>" }
     Response: { orders: Order[] }
     Описание: Получить список всех заказов пользователя

   * GET /api/orders/:id
     Headers: { Authorization: "Bearer <access_token>" }
     Response: { order: Order }
     Описание: Получить информацию о конкретном заказе
  

таблицы для бд:

1) user:
   * id: SERIAL PRIMARY KEY ( автоинкремент )
   * psuid: VARCHAR(255) UNIQUE NOT NULL ( уникальный id сгенерированный яндексом )
   * access_token: TEXT ( JWT токен доступа, может быть NULL если не авторизован )
   * refresh_token: TEXT ( токен для обновления, может быть NULL )
   * first_name: VARCHAR(255)
   * last_name: VARCHAR(255)
   * sex: VARCHAR(50) CHECK (sex IN ('male', 'female', 'other')) ( пол )
   * default_email: VARCHAR(255)
   * is_buying_smth: BOOLEAN DEFAULT FALSE ( флаг процесса покупки )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * INDEX idx_user_psuid (psuid) ( индекс для быстрого поиска по psuid )

2) products:
   * id: SERIAL PRIMARY KEY ( автоинкремент )
   * name: VARCHAR(255) NOT NULL ( название )
   * description: TEXT ( описание )
   * article: VARCHAR(100) UNIQUE NOT NULL ( артикул, уникальный )
   * price: DECIMAL(10, 2) NOT NULL CHECK (price > 0) ( цена в рублях, должна быть положительной )
   * category: VARCHAR(100) NOT NULL CHECK (category IN ('all', 'tShirts', 'hoodies', 'longSleeves', 'trousers')) ( категория товара )
   * stock: INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0) ( общее количество товара, не может быть отрицательным )
   * image_url: VARCHAR(500) ( URL главного изображения товара )
   * is_active: BOOLEAN DEFAULT TRUE ( активен ли товар для продажи )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * INDEX idx_products_category (category) ( индекс для фильтрации по категории )
   * INDEX idx_products_article (article) ( индекс для поиска по артикулу )
   * INDEX idx_products_active (is_active) ( индекс для фильтрации активных товаров )
   * FULLTEXT INDEX idx_products_search (name, description) ( полнотекстовый поиск по названию и описанию )

3) product_sizes:
   * id: SERIAL PRIMARY KEY
   * product_id: INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE
   * size: VARCHAR(50) NOT NULL ( размер: S, M, L, XL, XXL и т.д. )
   * stock: INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0) ( количество товара конкретного размера )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * UNIQUE(product_id, size) ( один размер может быть только один раз для товара )
   * INDEX idx_product_sizes_product (product_id) ( индекс для быстрого поиска размеров товара )

4) product_images:
   * id: SERIAL PRIMARY KEY
   * product_id: INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE
   * image_url: VARCHAR(500) NOT NULL ( URL изображения )
   * order_index: INTEGER DEFAULT 0 ( порядок отображения изображений )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * INDEX idx_product_images_product (product_id) ( индекс для быстрого поиска изображений товара )

5) user_favourites:
   * id: SERIAL PRIMARY KEY
   * user_id: INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE
   * product_id: INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * UNIQUE(user_id, product_id) ( один товар может быть в избранном только один раз )
   * INDEX idx_favourites_user (user_id) ( индекс для быстрого поиска избранного пользователя )
   * INDEX idx_favourites_product (product_id) ( индекс для обратных запросов )

6) user_cart:
   * id: SERIAL PRIMARY KEY
   * user_id: INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE
   * product_id: INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE
   * quantity: INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0) ( количество товара в корзине, минимум 1 )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * UNIQUE(user_id, product_id) ( один товар в корзине пользователя только один раз, количество меняется через quantity )
   * INDEX idx_cart_user (user_id) ( индекс для быстрого поиска корзины пользователя )
   * INDEX idx_cart_product (product_id) ( индекс для обратных запросов )

7) orders:
   * id: SERIAL PRIMARY KEY
   * user_id: INTEGER NOT NULL REFERENCES user(id) ON DELETE RESTRICT ( нельзя удалить пользователя с заказами )
   * total_price: DECIMAL(10, 2) NOT NULL CHECK (total_price > 0) ( общая стоимость заказа )
   * status: VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) ( статус заказа )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * INDEX idx_orders_user (user_id) ( индекс для поиска заказов пользователя )
   * INDEX idx_orders_status (status) ( индекс для фильтрации по статусу )

8) order_items:
   * id: SERIAL PRIMARY KEY
   * order_id: INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE
   * product_id: INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT ( нельзя удалить товар, который есть в заказе )
   * quantity: INTEGER NOT NULL CHECK (quantity > 0) ( количество товара в заказе )
   * price: DECIMAL(10, 2) NOT NULL CHECK (price > 0) ( цена товара на момент заказа, сохраняется для истории )
   * product_name: VARCHAR(255) NOT NULL ( название товара на момент заказа )
   * product_article: VARCHAR(100) NOT NULL ( артикул на момент заказа )
   * created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   * INDEX idx_order_items_order (order_id) ( индекс для поиска товаров заказа )


примечания к структуре БД:

1) Размеры товаров вынесены в отдельную таблицу product_sizes для поддержки нескольких размеров одного товара
2) Изображения товаров вынесены в отдельную таблицу product_images для поддержки нескольких изображений
3) Все цены хранятся в DECIMAL(10, 2) для точности расчетов
4) Добавлены CHECK ограничения для валидации данных на уровне БД
5) Добавлены индексы для оптимизации частых запросов
6) В таблице order_items сохраняются данные товара на момент заказа (price, name, article) для истории
7) Используется ON DELETE CASCADE для зависимых данных (избранное, корзина) и ON DELETE RESTRICT для критичных (заказы)