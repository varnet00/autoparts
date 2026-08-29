# autoparts — Backend API

REST API на **Node.js + Express + SQLite**, с авторизацией по JWT, каталогом,
кабинетом продавца, поиском по взаимозаменяемым номерам, подбором аналогов и
чатом с заявками на заказ.

## Запуск

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # демо-продавцы, товары и кросс-номера
npm start         # или npm run dev для авто-перезапуска
```

Сервер поднимется на `http://localhost:4000`, база SQLite создастся в `./data/autoparts.db`.
Без `JWT_SECRET` в `.env` сервер намеренно не стартует.

## Структура

```
backend/src/
  server.js               # точка входа, раздача фронтенда, обработка ошибок
  db.js                   # схема, индексы и миграции
  seed.js                 # демо-данные
  asyncHandler.js         # отказ промиса → error handler, а не падение процесса
  middleware/
    auth.js               # токен покупателя
    sellerAuth.js         # токен продавца
    anyAuth.js            # любой из двух (для чата), пишет req.actor
  routes/
    auth.js parts.js categories.js sellers.js conversations.js stats.js
```

## Модель данных

- **parts** — позиция продавца. `part_no` обязателен и уникален **в пределах
  продавца**: одну деталь предлагают несколько продавцов, и это основа сравнения цен.
  Поля состояния: `kind` (`orig` / `copy` / `used`), `maker`, `fits`, `qty`, `image_url`.
- **sellers** — продавец: имя, город, телефон, рейтинг, флаг «проверенный».
- **interchange_numbers** — взаимозаменяемые номера детали (`number` + `brand`).
- **conversations / messages / order_requests** — чат покупателя с продавцом и
  заявки на заказ внутри него.

Схема применяет миграции при старте: добавляет недостающие колонки и
перестраивает `parts`, если на ней осталась старая глобальная уникальность мактa.

## Аутентификация

```
Authorization: Bearer <token>
```

Токены покупателя и продавца различаются полем `role` и не взаимозаменяемы:
покупательский токен на роутах кабинета даёт `403`.

## API

### Каталог
| Метод | Путь | Параметры | Описание |
|---|---|---|---|
| GET | `/api/parts` | `q`, `category`, `kind`, `page`, `limit` | Список. `q` ищет по названию, макту, производителю, модели и взаимозаменяемым номерам |
| GET | `/api/parts/:id` | — | Карточка: `seller` + `interchange_numbers` |
| GET | `/api/parts/:id/analogs` | — | **Аналоги**: позиции с общим номером или мактom, по возрастанию цены |
| GET | `/api/categories` | — | Список категорий |
| GET | `/api/stats` | — | Счётчики для главной |

### Покупатель
| Метод | Путь | Тело | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | Регистрация → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | Вход → `{ token, user }` |
| GET | `/api/auth/me` | — | Текущий пользователь |

### Продавцы — публичное
| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/sellers` | Список по рейтингу. **Email не отдаётся** — это логин от кабинета |
| GET | `/api/sellers/:id` | Карточка продавца + его позиции |

### Кабинет продавца
| Метод | Путь | Тело | Описание |
|---|---|---|---|
| POST | `/api/sellers/register` | `{ name, city, phone, whatsapp, email, password }` | Регистрация → `{ token, seller }` |
| POST | `/api/sellers/login` | `{ email, password }` | Вход |
| GET | `/api/sellers/me/profile` | — | Свой профиль (с email) |
| PATCH | `/api/sellers/me/profile` | `{ name, city, phone, whatsapp }` | Обновить данные |
| GET | `/api/sellers/me/stats` | — | `{ in_stock, out_of_stock, requests }` |
| GET | `/api/sellers/me/parts` | — | Свои позиции |
| POST | `/api/sellers/me/parts` | `{ name, category, part_no, price, kind, maker, fits, qty, interchange_numbers[] }` | Создать позицию |
| PATCH | `/api/sellers/me/parts/:id` | те же поля частично | Изменить свою позицию |
| DELETE | `/api/sellers/me/parts/:id` | — | Удалить свою позицию |

### Чат и заявки
Доступны обеим сторонам; беседа видна только её покупателю и её продавцу
(иначе `404`).

| Метод | Путь | Тело | Описание |
|---|---|---|---|
| POST | `/api/conversations` | `{ part_id }` | Покупатель открывает или продолжает беседу |
| GET | `/api/conversations` | — | Свои беседы |
| GET | `/api/conversations/:id` | — | Беседа: сообщения и заявки |
| POST | `/api/conversations/:id/messages` | `{ body }` | Отправить сообщение |
| POST | `/api/conversations/:id/order-request` | `{ qty, vehicle }` | Заявка на заказ (только покупатель) |
| PATCH | `/api/conversations/:id/order-requests/:requestId` | `{ status }` | `accepted` / `declined` (только продавец) |

## Перед продакшеном

- Сменить `JWT_SECRET` на длинную случайную строку.
- Поставить `CORS_ORIGIN` на конкретный домен вместо `*`.
- Чат работает на обычных HTTP-запросах и обновляется при открытии беседы;
  для живой доставки понадобится WebSocket или SSE.
