const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Разрешаем запросы с любых доменов
app.use(express.json()); // Для обработки JSON-данных

// Мок-данные курсов валют (USD — базовая валюта)
const rates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.15,
};

// GET-эндпоинт для конвертации
app.get("/api/convert", (req, res) => {
  const { from, to, amount } = req.query; // Параметры из URL

  // Проверка на корректность валют
  if (!rates[from] || !rates[to]) {
    return res.status(400).json({ error: "Неподдерживаемая валюта" });
  }

  // Формула конвертации: (amount * курс целевой валюты) / курс исходной
  const result = ((amount * rates[to]) / rates[from]).toFixed(2);

  // Возвращаем результат в JSON
  res.json({ from, to, amount, result });
});

// Запуск сервера на порту 5000
console.log("Проверка: код выполняется!");
const PORT = 5001;
app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
