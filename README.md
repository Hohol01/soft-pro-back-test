# Booking Backend Starter

## 🧱 Архітектура
```
Client <---> Fastify REST API <---> MongoDB
                          │
                          └──> Redis (BullMQ, Availability Cache)
```

- **Fastify** — веб-сервер з JWT авторизацією
- **MongoDB** — зберігання користувачів, послуг, бронювань
- **Redis** — кеш вільних слотів + черга повідомлень (BullMQ)
- **Swagger** — інтерактивна документація API

## ⚙️ Запуск локально
```bash
git clone https://github.com/Hohol01/soft-pro-back-test.git
cd soft-pro-back-test
cp .env .env
docker-compose up --build
```

## 🔐 .env змінні
```
PORT=3000
MONGO_URI=mongodb://mongo:27017/booking-db
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
REDIS_URL=redis://redis:6379
```

## 📘 Swagger UI
Документація доступна на: [http://localhost:3000/docs](http://localhost:3000/docs)

## 📥 Приклади запитів

### 🔐 Авторизація
**Реєстрація:**
```http
POST /auth/register
Content-Type: application/json
{
  "email": "user@mail.com",
  "password": "12345678",
  "role": "Client"
}
```

**Вхід:**
```http
POST /auth/login
{
  "email": "user@mail.com",
  "password": "12345678"
}
```

**Оновлення токена:**
```http
POST /auth/refresh
{
  "refresh": "<refresh_token>"
}
```

### 🛠 Послуги (Provider)
```http
POST /services
Authorization: Bearer <access_token>
{
  "name": "Масаж",
  "description": "60 хв",
  "duration": 60,
  "price": 500
}
```

### 📅 Бронювання (Client)
```http
POST /bookings
Authorization: Bearer <access_token>
{
  "serviceId": "..."," +
        "
  "startTime": "2025-07-01T10:00:00Z"
}
```

### 📆 Доступність
```http
GET /availability?providerId=...&date=2025-07-01
```

## 📦 Функціональність
- JWT аутентифікація (access/refresh)
- CRUD для послуг (Provider)
- Створення/підтвердження/скасування бронювань
- Обчислення доступних слотів (Redis кеш)
- BullMQ черга для симуляції повідомлень


## 🧪 Тести
```bash
npm run test
```
