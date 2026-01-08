import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { mockStations } from '../data/mockData';
import { format } from 'date-fns';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const cities = Array.from(new Set(mockStations.map((s) => s.city)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCity && toCity && date) {
      setSearchParams({ fromCity, toCity, date });
      navigate('/search-results');
    }
  };

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <div className="bg-primary-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Купите билеты на поезд онлайн
            </h1>
            <p className="text-xl text-primary-300">
              Быстро, удобно и безопасно
            </p>
          </div>

        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 card">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* From City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Откуда
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Выберите город</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={swapCities}
                  className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition"
                  aria-label="Поменять местами"
                >
                  <svg
                    className="w-6 h-6 mx-auto text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </button>
              </div>

              {/* To City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Куда
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Выберите город</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата поездки
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-400 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-500 transition shadow-lg"
            >
              Найти билеты
            </button>
          </form>
        </div>

      </div>

      {/* Popular Destinations */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-dark mb-8 text-center">
            Популярные направления
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { from: 'Минск', to: 'Брест', price: 'от 22 BYN' },
              { from: 'Минск', to: 'Гомель', price: 'от 18 BYN' },
              { from: 'Минск', to: 'Витебск', price: 'от 20 BYN' },
            ].map((route, idx) => (
              <div
                key={idx}
                className="card p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => {
                  setFromCity(route.from);
                  setToCity(route.to);
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-neutral-dark text-lg">
                    {route.from} → {route.to}
                  </span>
                  <span className="text-primary-400 font-bold text-lg">{route.price}</span>
                </div>
                <p className="text-sm text-neutral-dark opacity-70">Быстрое и комфортное путешествие</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

