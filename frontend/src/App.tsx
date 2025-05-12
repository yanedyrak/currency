import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [value, setValue] = useState(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleFromCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  const convert = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();
      setValue(data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    convert();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col gap-10 text-3xl items-center w-full max-w-md">
        <h1>Конвертор валюты</h1>
        {/* Input Row */}
        <div className="flex gap-4 w-full items-center">
          <div className="flex w-full max-w-xs">
            <input
              type="text"
              maxLength={10}
              value={amount}
              onChange={handleChange}
              className="w-full text-right px-4 py-2 text-2xl border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            className="px-4 py-2 bg-blue-200 text-xl rounded-xl cursor-pointer focus:outline-none hover:bg-blue-300"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>

        <p className="text-4xl">=</p>

        {/* Output Row */}
        <div className="flex gap-4 w-full items-center">
          <div className="flex w-full max-w-xs">
            <p className="w-full px-4 py-2 bg-gray-100 text-2xl rounded-xl text-right">
              {value}
            </p>
          </div>
          <select
            value={toCurrency}
            onChange={handleToCurrencyChange}
            className="px-4 py-2 bg-purple-200 text-xl rounded-xl cursor-pointer focus:outline-none hover:bg-purple-300"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
