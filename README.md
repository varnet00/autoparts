# autoparts

Маркетплейс автозапчастей (by autolick): витрина на статическом HTML + REST API на Node.js.

## Структура репозитория

```
index.html            # витрина магазина (RTL, иврит): поиск, категории, карточки товаров
backend/              # REST API (Node.js + Express + SQLite) + раздача фронтенда
  cabinet.html        # кабинет продавца: вход, профиль, CRUD своих товаров
  src/                # сервер, схема БД, сиды, роуты и middleware
  README.md           # полная документация API
```

## Быстрый старт

```bash
cd backend
npm install
cp .env.example .env
npm run seed     # демо-продавцы, товары и кросс-номера
npm start        # http://localhost:4000
```

Сервер раздаёт и фронтенд, так что после `npm start` всё доступно по одному адресу:

| Адрес | Что это |
|---|---|
| http://localhost:4000/ | витрина, данные тянутся из `GET /api/parts` |
| http://localhost:4000/cabinet.html | кабинет продавца (демо-логин `hertzel@example.com` / `demo1234`) |
| http://localhost:4000/api/health | проверка, что API жив |

Категории и поиск на витрине уходят в API параметрами `category` и `q`, поэтому
поиск находит товар и по взаимозаменяемому номеру — например `GDB3410`.

Обе страницы можно по-прежнему открыть и просто файлом с диска: тогда они сами
переключаются на `http://localhost:4000/api`. Подробное описание всех
эндпоинтов — в [`backend/README.md`](backend/README.md).
