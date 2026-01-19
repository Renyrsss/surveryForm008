# Деплой на Coolify

## Структура

```
form008.nnmc.kz     → Frontend (React)
strapi.nnmc.kz      → Strapi (или другой поддомен/IP)
```

---

## 1. Деплой Frontend

### Build команда:
```bash
cd frontend && npm ci && npm run build
```

### Publish directory:
```
frontend/dist
```

### Environment variables:
```env
VITE_API_URL=https://strapi.nnmc.kz
```

---

## 2. Деплой Strapi (Backend)

### Build команда:
```bash
cd server && npm ci && npm run build
```

### Start команда:
```bash
cd server && npm run start
```

### Environment variables (обязательные):
```env
HOST=0.0.0.0
PORT=1339

APP_KEYS=сгенерируй-случайные-ключи-через-запятую
API_TOKEN_SALT=сгенерируй-случайную-строку
ADMIN_JWT_SECRET=сгенерируй-случайную-строку
TRANSFER_TOKEN_SALT=сгенерируй-случайную-строку
JWT_SECRET=сгенерируй-случайную-строку

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

> **Генерация ключей:**
> ```bash
> openssl rand -base64 32
> ```

---

## 3. После деплоя

1. Открой Strapi Admin (например `https://strapi.nnmc.kz/admin`)
2. Создай администратора Strapi
3. Настрой права доступа:
   - **Settings → Users & Permissions → Roles → Public**
   - Включи: `access-code.verify`, `data-quest.create`, `data-quest.find`, `survey-config.find`
4. Создай PIN-коды в **Content Manager → Access Code**

---

## Локальная разработка

```bash
# Терминал 1 — Strapi (порт 1339)
cd server && npm run develop

# Терминал 2 — Frontend (порт 5173)
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Strapi Admin: http://localhost:1339/admin
