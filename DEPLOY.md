# Деплой на Coolify

## Структура доменов

| URL | Описание |
|-----|----------|
| `https://surveryform.nnmc.kz/` | Frontend — опрос для пациентов |
| `https://surveryform.nnmc.kz/admin` | React админка — аналитика |
| `https://form008.nnmc.kz` | Strapi сервер — API и админка Strapi |

---

## 1. Деплой Frontend (surveryform.nnmc.kz)

### Build команда:
```bash
cd frontend && npm ci && npm run build
```

### Publish directory:
```
frontend/dist
```

### Environment variables:
Не требуются (всё встроено в билд)

---

## 2. Деплой Strapi (form008.nnmc.kz)

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

### Strapi:
1. Открой `https://form008.nnmc.kz/admin`
2. Создай администратора Strapi
3. Настрой права доступа:
   - **Settings → Users & Permissions → Roles → Public**
   - Включи: `access-code.verify`, `data-quest.create`, `data-quest.find`, `survey-config.find`
4. Создай PIN-коды в **Content Manager → Access Code**

### Frontend:
1. Открой `https://surveryform.nnmc.kz/admin/login`
2. Войди с учётными данными Strapi пользователя
3. Проверь аналитику

---

## Локальная разработка

```bash
# Терминал 1 — Strapi (порт 1339)
cd server && npm run develop

# Терминал 2 — Frontend (порт 5173)
cd frontend && npm run dev
```

| URL | Описание |
|-----|----------|
| http://localhost:5173 | Frontend |
| http://localhost:5173/admin | React админка |
| http://localhost:1339/admin | Strapi админка |
