# Деплой на Coolify

## Структура

```
form008.nnmc.kz/         → Frontend (React)
form008.nnmc.kz/server/  → Strapi API
form008.nnmc.kz/server/admin → Strapi Admin Panel
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
PUBLIC_URL=https://form008.nnmc.kz/server

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

## 3. Настройка Reverse Proxy в Coolify

В Coolify нужно настроить маршрутизацию:

| Путь | Сервис |
|------|--------|
| `/` | Frontend (статика из `frontend/dist`) |
| `/server/*` | Strapi (порт 1339) |

### Пример Caddy (Coolify использует Caddy):

```caddy
form008.nnmc.kz {
    # Strapi под /server
    handle_path /server/* {
        reverse_proxy localhost:1339
    }
    
    # Frontend — всё остальное
    handle {
        root * /path/to/frontend/dist
        try_files {path} /index.html
        file_server
    }
}
```

---

## 4. После деплоя

1. Открой `https://form008.nnmc.kz/server/admin`
2. Создай администратора Strapi
3. Настрой права доступа:
   - **Settings → Users & Permissions → Roles → Public**
   - Включи: `access-code.verify`, `data-quest.create`, `data-quest.find`, `survey-config.find`
4. Создай PIN-коды в **Content Manager → Access Code**

---

## Быстрая проверка

```bash
# Проверка Frontend
curl https://form008.nnmc.kz/

# Проверка Strapi API
curl https://form008.nnmc.kz/server/api/survey-configs

# Проверка Strapi Admin
curl https://form008.nnmc.kz/server/admin
```

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
