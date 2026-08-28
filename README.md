# טורבו חלקים / Turbo Chalakim

Маркетплейс автозапчастей (by autolick): витрина на статическом HTML + REST API на Node.js.

## Структура репозитория

```
index.html            # витрина магазина (RTL, иврит): поиск, категории, карточки товаров
backend/              # REST API (Node.js + Express + SQLite)
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

Проверка: `curl http://localhost:4000/api/health`.

Витрина `index.html` и кабинет `backend/cabinet.html` открываются как обычные
файлы в браузере. Подробное описание всех эндпоинтов — в
[`backend/README.md`](backend/README.md).
