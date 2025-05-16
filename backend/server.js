// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Мок-данные курсов валют (USD — базовая валюта)
let rates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.15,
};

// GET /api/rates
app.get("/api/rates", (req, res) => {
  res.json(rates);
});

// GET /api/rates/:currency
app.get("/api/rates/:currency", (req, res) => {
  const currency = req.params.currency.toUpperCase();
  if (rates[currency]) {
    res.json({ [currency]: rates[currency] });
  } else {
    res.status(404).json({ error: `Валюта ${currency} не найдена` });
  }
});

// POST /api/rates
app.post("/api/rates", (req, res) => {
  const { currency, price } = req.body;

  if (!currency || typeof price !== "number" || isNaN(price) || price <= 0) {
    return res.status(400).json({
      error:
        "Некорректные данные: код валюты должен быть строкой, а курс - положительным числом.",
    });
  }

  const upperCaseCurrency = currency.toUpperCase();
  if (rates[upperCaseCurrency]) {
    return res.status(409).json({
      error: `Курс для валюты ${upperCaseCurrency} уже существует. Используйте PATCH для обновления.`,
    });
  }

  rates[upperCaseCurrency] = price;
  res.status(201).json({
    message: `Курс для ${upperCaseCurrency} успешно добавлен`,
    rates,
  });
});

// PATCH /api/rates/:currency
app.patch("/api/rates/:currency", (req, res) => {
  const currencyToUpdate = req.params.currency.toUpperCase();
  const { price } = req.body;

  if (!rates[currencyToUpdate]) {
    return res
      .status(404)
      .json({ error: `Валюта ${currencyToUpdate} не найдена` });
  }

  if (typeof price !== "number" || isNaN(price) || price <= 0) {
    return res.status(400).json({
      error: "Некорректное значение курса: должно быть положительным числом.",
    });
  }

  rates[currencyToUpdate] = price;
  res.json({ message: `Курс для ${currencyToUpdate} успешно обновлен`, rates });
});

// DELETE /api/rates/:currency
app.delete("/api/rates/:currency", (req, res) => {
  const currencyToDelete = req.params.currency.toUpperCase();

  if (!rates[currencyToDelete]) {
    return res
      .status(404)
      .json({ error: `Валюта ${currencyToDelete} не найдена` });
  }

  delete rates[currencyToDelete];
  res.json({ message: `Курс для ${currencyToDelete} успешно удален`, rates });
});

// GET /api/conversions
app.get("/api/conversions", (req, res) => {
  const { from, to, amount } = req.query;

  if (!rates[from] || !rates[to]) {
    return res.status(400).json({ error: "Неподдерживаемая валюта" });
  }

  const fromRate = rates[from];
  const toRate = rates[to];
  const result = (amount * toRate) / fromRate;
  const rate = toRate / fromRate;

  res.json({
    from,
    to,
    amount: Number(amount),
    result: result.toFixed(2),
    rate: rate.toFixed(4),
  });
});

const PORT = 5001;
app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
