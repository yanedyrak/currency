import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5001/api";

function App() {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [newCurrency, setNewCurrency] = useState("");
  const [newRate, setNewRate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setResult(null);
  }, [amount]);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch(`${API_URL}/rates`);
      const data = await res.json();
      setRates(data);
    } catch (err) {
      console.error("Ошибка загрузки курсов:", err);
    }
  };

  const handleConvert = async () => {
    try {
      const res = await fetch(
        `${API_URL}/conversions?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Ошибка конвертации:", err);
    }
  };

  const handleAddRate = async () => {
    try {
      const res = await fetch(`${API_URL}/rates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: newCurrency, price: Number(newRate) }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Ошибка: ${data.error}`);
      } else {
        setMessage(data.message);
        setNewCurrency("");
        setNewRate("");
        fetchRates();
      }
    } catch (err) {
      setMessage("Ошибка добавления валюты");
    }
  };

  const handleUpdateRate = async () => {
    try {
      const res = await fetch(`${API_URL}/rates/${newCurrency}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(newRate) }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Ошибка: ${data.error}`);
      } else {
        setMessage(data.message);
        fetchRates();
      }
    } catch (err) {
      setMessage("Ошибка обновления курса");
    }
  };

  const handleDeleteRate = async () => {
    try {
      const res = await fetch(`${API_URL}/rates/${newCurrency}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`Ошибка: ${data.error}`);
      } else {
        setMessage(data.message);
        fetchRates();
      }
    } catch (err) {
      setMessage("Ошибка удаления курса");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          💱 Конвертер валют
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="number"
            className="flex-1 p-2 border rounded-md"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="p-2 border rounded-md"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {Object.keys(rates).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>

          <span className="text-xl">→</span>

          <select
            className="p-2 border rounded-md"
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value);
              setResult(null);
            }}
          >
            {Object.keys(rates).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>

          <button
            onClick={handleConvert}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Конвертировать
          </button>
        </div>

        {result && (
          <p className="text-lg font-medium mb-6 text-green-600">
            💰 Результат: {amount} {fromCurrency} = {result} {toCurrency}
          </p>
        )}

        <h2 className="text-xl font-semibold mb-2">Управление курсами</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Код (например, RUB)"
            className="flex-1 p-2 border rounded-md"
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
          />
          <input
            type="number"
            placeholder="Курс"
            className="flex-1 p-2 border rounded-md"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
          />
          <button
            onClick={handleAddRate}
            className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
          >
            Добавить
          </button>
          <button
            onClick={handleUpdateRate}
            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600"
          >
            Обновить
          </button>
          <button
            onClick={handleDeleteRate}
            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
          >
            Удалить
          </button>
        </div>
        {message && <p className="text-sm text-purple-600">{message}</p>}

        <h2 className="text-xl font-semibold mt-6 mb-2">📊 Курсы валют</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(rates).map(([currency, price]) => (
            <li
              key={currency}
              className="bg-gray-100 p-2 rounded-md flex justify-between"
            >
              <span>{currency}</span>
              <span>{price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
