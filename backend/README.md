# Turbo Chalakim — Backend API

Backend для сайта «טורבו חלקים» (by autolick). REST API на **Node.js + Express + SQLite**, с авторизацией по JWT, каталогом товаров, карточкой продавца и списком взаимозаменяемых номеров в каждом товаре.

## Запуск

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # заполнить каталог демо-товарами, продавцами и кросс-номерами
npm start         # или npm run dev для авто-перезапуска
```

Сервер поднимется на `http://localhost:4000`. База данных SQLite создастся автоматически в `./data/turbo_chalakim.db`.

## Структура

```
backend/
  src/
    server.js          # точка входа, подключение роутов
    db.js               # подключение к SQLite + схема таблиц
    seed.js              # наполнение каталога, продавцов и кросс-номеров
    middleware/auth.js   # проверка JWT
    routes/
      auth.js            # регистрация, вход, текущий пользователь
      parts.js            # каталог, поиск (в т.ч. по кросс-номеру), карточка товара
      categories.js        # список категорий
      sellers.js            # карточка продавца и его товары
  data/                       # файл SQLite (создаётся автоматически)
```

## Модель данных

- **parts** — товар. Каждый привязан к `seller_id`.
- **sellers** — продавец: имя, город, телефон, WhatsApp, рейтинг, число отзывов, флаг «проверенный».
- **interchange_numbers** — взаимозаменяемые (кросс-референсные) номера детали: `number` + `brand` (например OEM-номер производителя авто и номера аналогов от Bosch/TRW/Mann-Filter и т.д.). Привязаны к `part_id`, один товар может иметь несколько таких номеров.

## Аутентификация

Токен передаётся в заголовке:
```
Authorization: Bearer <token>
```

## API

### Auth
| Метод | Путь | Тело запроса | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | Регистрация, возвращает `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | Вход, возвращает `{ token, user }` |
| GET | `/api/auth/me` | — (нужен токен) | Текущий пользователь |

### Каталог
| Метод | Путь | Query-параметры | Описание |
|---|---|---|---|
| GET | `/api/parts` | `category`, `q`, `page`, `limit` | Список товаров. `q` ищет и по названию, и по кросс-номерам |
| GET | `/api/parts/:id` | — | Карточка товара — включает объект `seller` и массив `interchange_numbers` |
| GET | `/api/categories` | — | Список категорий |

Пример ответа `GET /api/parts/1`:
```json
{
  "part": {
    "id": 1,
    "name": "רפידות בלם קדמיות",
    "sub": "תואם: טויוטה קורולה 2015–2022",
    "category": "brakes",
    "part_no": "BRK-4471",
    "price": 189,
    "stock": "in",
    "seller": {
      "id": 1,
      "name": "מוסך הרצל — חלקי חילוף",
      "city": "תל אביב",
      "phone": "03-5551234",
      "whatsapp": "972501234567",
      "rating": 4.8,
      "reviews_count": 312,
      "verified": 1
    },
    "interchange_numbers": [
      { "number": "04465-02310", "brand": "OEM Toyota" },
      { "number": "GDB3410", "brand": "TRW" },
      { "number": "P83073", "brand": "Bosch" }
    ]
  }
}
```

### Продавцы — публичное
| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/sellers` | Список продавцов, по рейтингу |
| GET | `/api/sellers/:id` | Публичная карточка продавца + все его товары |

### Продавцы — регистрация и кабинет
| Метод | Путь | Тело запроса | Описание |
|---|---|---|---|
| POST | `/api/sellers/register` | `{ name, city, phone, whatsapp, email, password }` | Создать карточку продавца, вернёт `{ token, seller }` |
| POST | `/api/sellers/login` | `{ email, password }` | Вход продавца, вернёт `{ token, seller }` |
| GET | `/api/sellers/me/profile` | — (токен продавца) | Профиль своего кабинета |
| PATCH | `/api/sellers/me/profile` | `{ name, city, phone, whatsapp }` | Обновить свои данные |
| GET | `/api/sellers/me/parts` | — (токен продавца) | Список своих карточек товаров |
| POST | `/api/sellers/me/parts` | `{ name, sub, category, part_no, price, stock, icon, interchange_numbers[] }` | **Создать новую карточку товара** |
| PATCH | `/api/sellers/me/parts/:id` | те же поля (частично) | Изменить свою карточку товара |
| DELETE | `/api/sellers/me/parts/:id` | — | Удалить свою карточку товара |

Токен продавца передаётся так же, как и обычный: `Authorization: Bearer <token>` — но это отдельный токен с `role: "seller"`, он не подходит для покупательских `/api/auth/*` роутов и наоборот.

Демо-продавцы из `seed.js` имеют пароль **`demo1234`** — их email смотри в `src/seed.js` (например `hertzel@example.com`).

Пример создания товара из кабинета:
```bash
curl -X POST http://localhost:4000/api/sellers/me/parts \
  -H "Authorization: Bearer SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "מסנן דלק",
    "category": "filters",
    "part_no": "FLT-9981",
    "price": 55,
    "icon": "🧰",
    "interchange_numbers": [{"number":"23300-XXXX","brand":"OEM Toyota"}]
  }'
```

## Дальнейшие шаги

- Подключить фронтенд: заменить статичный массив `PARTS` в `index.html` на `fetch('/api/parts')`, использовать `part.seller` и `part.interchange_numbers` для рендера карточки.
- Для продакшена: сменить `JWT_SECRET` в `.env`, поставить `CORS_ORIGIN` на конкретный домен.
- При росте каталога — добавить админку для продавцов (CRUD своих товаров через авторизацию).
