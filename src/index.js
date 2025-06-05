require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/item');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Порт та URI для MongoDB
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lab03db';

// Підключаємося до MongoDB
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Підключено до MongoDB');
    console.log(`📍 MONGO_URI: ${MONGO_URI}`);
  })
  .catch(err => {
    console.error('❌ Помилка підключення до MongoDB:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB помилка:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB відключена');
});

// Базовий маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Node.js + MongoDB API працює!',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /': 'Головна',
      'GET /items': 'Отримати всі елементи',
      'POST /items': 'Створити елемент {name, value}',
      'GET /items/:id': 'Отримати елемент по ID',
      'DELETE /items/:id': 'Видалити елемент'
    }
  });
});

// GET /items — повертає всі елементи
app.get('/items', async (req, res) => {
  try {
    console.log('📤 GET /items');
    const items = await Item.find().sort({ createdAt: -1 });
    console.log(`✅ Елементів знайдено: ${items.length}`);
    res.json(items);
  } catch (err) {
    console.error('❌ Помилка при GET /items:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /items — створює новий елемент
app.post('/items', async (req, res) => {
  try {
    console.log('📥 POST /items:', req.body);
    const { name, value } = req.body;
    if (!name || value === undefined) {
      return res.status(400).json({ error: 'Поля name і value обов’язкові' });
    }
    const newItem = new Item({ name: name.trim(), value: Number(value) });
    const saved = await newItem.save();
    console.log('✅ Елемент створено:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Помилка при POST /items:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /items/:id — отримати елемент за ID
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Елемент не знайдено' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /items/:id — видалити елемент за ID
app.delete('/items/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Елемент не знайдено' });
    res.json({ message: 'Елемент видалено', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Завершення роботи сервера...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB з’єднання закрито');
    process.exit(0);
  } catch (err) {
    console.error('❌ Помилка при завершенні:', err);
    process.exit(1);
  }
});

// Запуск
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/items`);
});
