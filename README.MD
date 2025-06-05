# Node.js + MongoDB API

Простий CRUD API для управління елементами.

## Вимоги

- Node.js 18+
- Docker
- Docker Compose
- Git

## Швидкий запуск

```bash
# Клонування репозиторію
git clone <repository-url>
cd lab-03-node

# Запуск
docker-compose up -d

# Перевірка роботи
curl http://localhost:3000/
```

## Використання API

```bash
# Отримати всі елементи
curl http://localhost:3000/items

# Створити елемент
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"тест","value":100}'

# Видалити елемент
curl -X DELETE http://localhost:3000/items/<ID>
```

## Керування

```bash
# Запуск
docker-compose up -d

# Зупинка
docker-compose down

# Перезбірка
docker-compose up -d --build

# Логи
docker-compose logs -f
```

## Маршрути

- `GET /` - Інформація про API
- `GET /items` - Отримати всі елементи  
- `POST /items` - Створити елемент
- `GET /items/:id` - Отримати елемент за ID
- `DELETE /items/:id` - Видалити елемент

## Порти

- API: http://localhost:3000
- MongoDB: localhost:27017