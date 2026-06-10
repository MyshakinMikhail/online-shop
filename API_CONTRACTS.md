# API_CONTRACTS.md

Актуальные API-контракты интернет-магазина одежды по состоянию кода в `backend/src`.

Backend по умолчанию доступен по адресу:

```text
http://localhost:3000/api
```

Frontend использует этот base URL в `frontend/src/shared/api/axios.ts`.

## Общие правила

- В URL-параметрах `:userId` фактически передается Yandex ID пользователя (`psuid`), а не внутренний `users.id`.
- Backend валидирует все id через `validateId`: значение обязательно, должно быть положительным целым числом.
- Пользователь ищется по `User.psuid`. Внутренний `User.id` используется уже после поиска, например для корзины, избранного и заказов.
- Bearer/JWT авторизация в текущем backend не реализована. Права проверяются через найденного пользователя и его `role`.
- Админские операции доступны ролям `admin` и `super_admin` через `AuthService.hasAdminRights`.
- Типовая ошибка валидации: HTTP `400` и `{ message: string }`.
- Если пользователь не найден: HTTP `404` и `{ message: string }`.
- При недостатке прав: HTTP `403` и `{ message: string }`.
- При серверной ошибке: HTTP `500` и `{ message: string }`.

## Модели

### User

Источник: `backend/src/models/User.ts`.

```ts
type UserRole = "super_admin" | "admin" | "user";
type UserSex = "male" | "female" | "other";

type User = {
  id: number;
  role: UserRole;
  psuid: number;
  first_name: string;
  last_name: string;
  sex: UserSex;
  default_email: string;
  is_buying_smth: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Таблица: `users`.

### Category

Источник: `backend/src/models/Category.ts`.

```ts
type Category = {
  id: number;
  name: string;
  slug: string;
};
```

Таблица: `categories`. `timestamps: false`.

### Product

Источник: `backend/src/models/Product.ts`.

```ts
type Product = {
  id: number;
  name: string;
  description: string;
  sizes: string[];
  article: string;
  price: number;
  categoryId: number;
  stock: number;
  image_url?: string | null;
  images?: string[] | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
```

В ответах списка и карточки товара может добавляться:

```ts
type ProductWithFavorite = Product & {
  isFavorite: boolean;
};
```

Таблица: `products`.

Важно: в текущем коде нет отдельных таблиц `product_sizes` и `product_images`; размеры и изображения хранятся в полях `sizes` и `images`.

### Cart

Источник: `backend/src/models/Cart.ts`.

```ts
type Cart = {
  id: number;
  userId: number;
  items?: CartItemWithProduct[];
  createdAt: string;
  updatedAt: string;
};
```

Таблица: `carts`.

### CartItem

Источник: `backend/src/models/CartItem.ts`.

```ts
type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

type CartItemWithProduct = CartItem & {
  product: Product;
};
```

Таблица: `cartItem`.

### Favorite

Источник: `backend/src/models/Favorite.ts`.

```ts
type Favorite = {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
};

type FavoriteWithProduct = Favorite & {
  product: Product;
};
```

Таблица: `favorites`.

### Order

Источник: `backend/src/models/Order.ts`.

```ts
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: number;
  userId: number;
  userName: string;
  email: string;
  phoneNumber: string;
  promocode: string;
  isPromocodeActivate: boolean;
  sale: number;
  city: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};
```

Таблица: `orders`.

### OrderItem

Источник: `backend/src/models/OrderItem.ts`.

```ts
type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  createdAt: string;
  updatedAt: string;
};
```

Таблица: `orderItem`.

### Promocode

Источник: `backend/src/models/Promocode.ts`.

```ts
type Promocode = {
  id: number;
  name: string;
  isActive: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
};
```

Таблица: `promocode`.

## Auth

### POST `/api/auth/yandex`

Создает пользователя, если его еще нет. При создании также создает корзину.

Request body:

```ts
{
  user: {
    psuid: number;
    first_name: string;
    last_name: string;
    sex: "male" | "female" | "other";
    default_email: string;
    is_buying_smth: boolean;
    role?: "super_admin" | "admin" | "user";
  };
}
```

Успешные ответы:

```ts
// 201
{
  message: string;
  created: true;
  user: User;
}

// 200, если пользователь уже есть
{
  message: string;
  created: false;
}
```

### GET `/api/auth/checkUser/:psuid`

Проверяет наличие пользователя по Yandex ID.

Response:

```ts
// 200
{
  message: string;
  user: User;
  found: true;
}

// 404
{
  message: string;
  found: false;
}
```

## Categories

### GET `/api/categories`

Возвращает все категории.

Response:

```ts
{
  categories: Category[];
}
```

### GET `/api/categories/:slug`

Возвращает категорию по `slug`.

Response:

```ts
{
  category: Category;
}
```

## Products

### GET `/api/products/:userId`

Возвращает список товаров для пользователя. `:userId` - Yandex `psuid`.

Query params:

```ts
{
  page?: number;        // default: 1
  limit?: number;       // default: 16
  categoryId?: number;  // обязательный для обычного списка; 1 означает все активные товары
  searchQuery?: string; // если передан, используется поиск по имени
  isFavorites?: boolean;
}
```

Ответ при `searchQuery`:

```ts
{
  products: Product[];
  message: string;
}
```

Ответ при `isFavorites=true`:

```ts
{
  products: Product[];
  message: string;
}
```

Обычный ответ:

```ts
{
  products: ProductWithFavorite[];
  count: number;
}
```

Особенности:

- Для обычного списка `categoryId` должен приводиться к числу, иначе backend вернет `400`.
- Возвращаются только активные товары (`isActive: true`), кроме админского поведения, которое зависит от текущей реализации сервиса.

### DELETE `/api/products/:userId`

Админская операция. Удаляет все товары, а также связанные записи избранного, корзин и order items.

Response:

```ts
{
  message: string;
}
```

## Product

### GET `/api/product/:userId/:productId`

Возвращает товар по id и признак избранного для пользователя.

Response:

```ts
{
  product: ProductWithFavorite;
}
```

### POST `/api/product/:userId`

Админская операция. Создает товар. `article` в request body валидируется как строка, но итоговый артикул генерируется на backend через `uuid`.

Request body:

```ts
{
  product: {
    name: string;        // 3..200 символов
    description: string; // 10..5000 символов
    sizes: string[];
    article: string;
    price: number;       // положительное целое
    categoryId: number;  // положительное целое
    stock: number;       // целое >= 0
    image_url?: string | null;
    images?: string[] | null;
    isActive: boolean;
  };
}
```

Response:

```ts
// 201
{
  createdProduct: Product;
}
```

### PUT `/api/product/:userId`

Админская операция. Обновляет товар по `product.id` и `product.article`.

Request body:

```ts
{
  product: Product;
}
```

Response:

```ts
{
  updatedProduct: Product;
  message: string;
}
```

### DELETE `/api/product/:userId/:productId`

Админская операция. Удаляет один товар.

Response:

```ts
{
  message: string;
}
```

## Favorites

### GET `/api/favorites/:userId`

Возвращает избранные записи пользователя с вложенными товарами.

Response:

```ts
{
  products: FavoriteWithProduct[];
}
```

### DELETE `/api/favorites/:userId`

Удаляет все избранные товары пользователя.

Response:

```ts
{
  message: string;
}
```

### POST `/api/favorite/items/:userId`

Добавляет товар в избранное.

Request body:

```ts
{
  productId: number;
}
```

Responses:

```ts
// 201
{
  message: string;
}

// 200, если товар уже был в избранном
{
  message: string;
}
```

### DELETE `/api/favorite/items/:userId`

Удаляет товар из избранного.

Request body:

```ts
{
  productId: number;
}
```

Response:

```ts
{
  message: string;
}
```

## Cart

### GET `/api/cart/:userId`

Возвращает корзину пользователя с товарами.

Response:

```ts
{
  message: string;
  cart: Cart & {
    items: CartItemWithProduct[];
  };
}
```

### DELETE `/api/cart/:userId`

Очищает корзину пользователя.

Response:

```ts
{
  message: string;
  isDeleted: boolean;
}
```

Если корзина уже пустая, backend возвращает `404` и `isDeleted: false`.

### POST `/api/cart/items/:userId`

Добавляет товар в корзину с `quantity: 1`.

Request body:

```ts
{
  productId: number;
}
```

Response:

```ts
// 201
{
  message: string;
  cartItem: CartItem;
}
```

Если товар уже есть в корзине, текущий backend возвращает `404` с `{ message: string }`.

### PUT `/api/cart/items/:userId`

Увеличивает или уменьшает количество товара в корзине.

Request body:

```ts
{
  productId: number;
  isIncrement: boolean;
}
```

Responses:

```ts
// количество изменено
{
  message: string;
  quantity: number;
}

// при уменьшении до 0 товар удаляется, quantity не возвращается
{
  message: string;
}
```

### DELETE `/api/cart/items/:userId`

Удаляет один товар из корзины.

Request body:

```ts
{
  productId: number;
}
```

Response:

```ts
{
  message: string;
  isDeleted: boolean;
}
```

## Orders

### POST `/api/order/:userId`

Создает заказ из текущей корзины пользователя и очищает корзину.

Request body:

```ts
{
  userName: string;
  email: string;
  phoneNumber: string;
  promocode: string;
  city: string;
}
```

Response:

```ts
{
  message: string;
  orderId: number;
}
```

Особенности текущей реализации:

- Заказ создается только если `userName`, `email`, `phoneNumber` и `promocode` truthy.
- `city` записывается в заказ, но в условии обязательных полей явно не проверяется.
- `totalPrice` считается по товарам корзины через `OrderService.calculateOrderTotal`.
- Промокод применяется через `OrderService.getPriceWithPromocode`.
- Новый заказ получает статус `"processing"`.
- В `orderItem` сохраняются `orderId`, `productId`, `quantity`, `priceAtPurchase`.
- GET endpoints для заказов в текущих роутерах не реализованы.

## Admin

### GET `/api/admin/checkAdmin/:userId`

Проверяет, что пользователь не имеет роль `user`.

Response:

```ts
// 200
{
  message: string;
}
```

Если роль `user`, backend возвращает `403`.

## Promocodes

### GET `/api/promocodes/:userId`

Админская операция. Возвращает промокоды, отфильтрованные по имени.

Query params:

```ts
{
  searchQuery?: string;
}
```

Response:

```ts
{
  promocodes: Promocode[];
  message: string;
}
```

Текущая реализация использует `Op.iLike` с `%${searchQuery}%`. Если `searchQuery` не передан, значение становится `undefined`.

### DELETE `/api/promocodes/:userId`

Админская операция. Должна удалять все промокоды.

Текущее состояние кода:

- В `promocodesRoutes.ts` DELETE ошибочно привязан к `promocodesController.getAllPromocodes`, а не к `deleteAllPromocodes`.
- Фактический DELETE `/api/promocodes/:userId` сейчас ведет себя как получение списка и ожидает query `searchQuery`.

Ожидаемый response после исправления роутера:

```ts
{
  message: string;
}
```

### POST `/api/promocode/:userId`

Админская операция. Создает промокод.

Request body:

```ts
{
  name: string;
  isActive: boolean;
  discount: number; // целое 0..100
}
```

Response:

```ts
// 201
{
  promocode: Promocode;
  message: string;
}
```

### PUT `/api/promocode/:userId`

Админская операция. Обновляет промокод по `id`.

Request body:

```ts
{
  id: number;
  name: string;
  discount: number; // целое 0..100
  isActive: boolean;
}
```

Response:

```ts
{
  promocode: Promocode;
  message: string;
}
```

### DELETE `/api/promocode/:userId`

Админская операция. Удаляет промокод по имени.

Query params:

```ts
{
  name: string;
}
```

Response:

```ts
{
  message: string;
}
```

## Реализованные маршруты

Сводка из `backend/src/routers/index.ts`:

```text
POST   /api/auth/yandex
GET    /api/auth/checkUser/:psuid

GET    /api/admin/checkAdmin/:userId

GET    /api/categories
GET    /api/categories/:slug

GET    /api/products/:userId
DELETE /api/products/:userId

GET    /api/product/:userId/:productId
POST   /api/product/:userId
PUT    /api/product/:userId
DELETE /api/product/:userId/:productId

GET    /api/favorites/:userId
DELETE /api/favorites/:userId
POST   /api/favorite/items/:userId
DELETE /api/favorite/items/:userId

GET    /api/cart/:userId
DELETE /api/cart/:userId
POST   /api/cart/items/:userId
PUT    /api/cart/items/:userId
DELETE /api/cart/items/:userId

POST   /api/order/:userId

GET    /api/promocodes/:userId
DELETE /api/promocodes/:userId
POST   /api/promocode/:userId
PUT    /api/promocode/:userId
DELETE /api/promocode/:userId
```

## Роли

```ts
type UserRole = "super_admin" | "admin" | "user";
```

- `user`: просмотр товаров, избранное, корзина, оформление заказа.
- `admin`: все пользовательские действия плюс создание, редактирование и удаление товаров и промокодов.
- `super_admin`: в текущем коде имеет те же backend-права, что и `admin`.

Назначение админов отдельным endpoint в текущем backend не реализовано.

## Известные расхождения и технический долг

- `GET /api/products/:userId` требует `categoryId` для обычного списка, хотя тип query помечает его optional.
- `DELETE /api/promocodes/:userId` в роутере привязан к неправильному контроллеру.
- В `orderController.createOrder` транзакция не всегда явно rollback-ается перед ранними `400/404` ответами.
- В модели `Order.ts` TypeScript union содержит `"ready to give"`, а Sequelize ENUM содержит `"shipped"`. Фактическая БД-модель принимает `"shipped"`.
- В старом контракте были `GET /api/orders` и `GET /api/orders/:id`, но в текущем коде они не реализованы.
- В старом контракте были JWT endpoints `/api/auth/me` и `/api/auth/refresh`, но в текущем коде они не реализованы.
