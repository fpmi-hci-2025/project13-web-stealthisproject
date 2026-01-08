import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Route } from '../types';
import { API_BASE } from '../config/api';

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingState, setSelectedRoute } = useBooking();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingState.searchParams) {
      loadRoutes();
    } else {
      navigate('/');
    }
  }, [bookingState.searchParams, navigate]);

  const loadRoutes = async () => {
    if (!bookingState.searchParams) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        from_city: bookingState.searchParams.fromCity,
        to_city: bookingState.searchParams.toCity,
        date: bookingState.searchParams.date,
      });

      const response = await fetch(`${API_BASE}/routes/search?${params}`);
      
      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = 'Не удалось загрузить маршруты';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        console.error('Search routes failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          url: `${API_BASE}/routes/search?${params}`,
          responseText,
        });
        throw new Error(errorMessage);
      }

      // Parse JSON response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError, 'Response text:', responseText);
        throw new Error('Не удалось разобрать ответ от сервера');
      }
      
      console.log('Routes data received:', data, 'Type:', typeof data, 'IsArray:', Array.isArray(data));
      
      // Check if data is valid array
      if (!data) {
        console.error('Null or undefined data received');
        throw new Error('Сервер вернул пустой ответ');
      }
      
      // Check if it's an error object instead of array
      if (typeof data === 'object' && !Array.isArray(data) && 'error' in data) {
        console.error('Error object received:', data);
        throw new Error(data.error || 'Ошибка от сервера');
      }
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format received:', data, 'Expected array, got:', typeof data);
        throw new Error(`Неверный формат данных от сервера: ожидался массив, получен ${typeof data}`);
      }
      
      // Transform backend format to frontend format
      // First, fetch train IDs for all routes in parallel
      const routesWithTrainIds = await Promise.all(
        data.map(async (item: any) => {
          // Fetch route details to get train ID
          let trainId = 0;
          try {
            const routeResponse = await fetch(`${API_BASE}/routes/${item.routeId}`);
            if (routeResponse.ok) {
              const routeData = await routeResponse.json();
              if (routeData.train && routeData.train.id) {
                trainId = routeData.train.id;
              }
            }
          } catch (err) {
            console.warn('Failed to fetch route details:', err);
          }

          return { ...item, trainId };
        })
      );

      // Now transform to frontend format
      const transformedRoutes: Route[] = routesWithTrainIds.map((item: any) => {
        // Parse times - handle both ISO format and time-only format
        let depTime = '';
        let arrTime = '';
        
        try {
          if (item.departureTime) {
            // Try parsing as ISO date string first
            const depDate = new Date(item.departureTime);
            if (!isNaN(depDate.getTime())) {
              depTime = depDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            } else {
              // If parsing fails, try to extract time from string
              const timeMatch = item.departureTime.match(/(\d{2}):(\d{2})/);
              if (timeMatch) {
                depTime = `${timeMatch[1]}:${timeMatch[2]}`;
              }
            }
          }
          
          if (item.arrivalTime) {
            const arrDate = new Date(item.arrivalTime);
            if (!isNaN(arrDate.getTime())) {
              arrTime = arrDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            } else {
              const timeMatch = item.arrivalTime.match(/(\d{2}):(\d{2})/);
              if (timeMatch) {
                arrTime = `${timeMatch[1]}:${timeMatch[2]}`;
              }
            }
          }
        } catch (timeError) {
          console.warn('Failed to parse times:', timeError, item);
        }
        
        // Calculate duration
        let duration = '';
        if (item.departureTime && item.arrivalTime) {
          try {
            const dep = new Date(item.departureTime);
            const arr = new Date(item.arrivalTime);
            if (!isNaN(dep.getTime()) && !isNaN(arr.getTime())) {
              const diffMs = arr.getTime() - dep.getTime();
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              duration = `${hours}ч ${minutes}м`;
            }
          } catch (durationError) {
            console.warn('Failed to calculate duration:', durationError);
          }
        }

        return {
          id: item.routeId,
          name: `${bookingState.searchParams?.fromCity} - ${bookingState.searchParams?.toCity}`,
          trainId: item.trainId,
          train: {
            id: item.trainId,
            number: item.trainNumber || '',
            type: '',
          },
          departureStation: {
            id: 0,
            name: '',
            city: bookingState.searchParams?.fromCity || '',
          },
          arrivalStation: {
            id: 0,
            name: '',
            city: bookingState.searchParams?.toCity || '',
          },
          departureTime: depTime,
          arrivalTime: arrTime,
          duration: duration,
          price: item.price || 20.0,
          availableSeats: item.availableSeats || 0,
        };
      });

      setRoutes(transformedRoutes);
    } catch (err) {
      console.error('Failed to load routes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить маршруты';
      setError(errorMessage);
      // Fallback to empty array
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route);
    navigate('/seat-selection');
  };

  if (!bookingState.searchParams) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Изменить запрос
        </button>
        <h1 className="text-3xl font-bold mt-4">
          Результаты поиска: {bookingState.searchParams.fromCity} → {bookingState.searchParams.toCity}
        </h1>
        <p className="text-gray-600 mt-2">
          Дата: {new Date(bookingState.searchParams.date).toLocaleDateString('ru-RU')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-dark opacity-70">Поиск маршрутов...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-xl text-system-error mb-2">{error}</p>
          <p className="text-sm text-neutral-dark opacity-70 mb-4">
            Проверьте консоль браузера (F12) для подробностей
          </p>
          <button
            onClick={() => loadRoutes()}
            className="px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 font-semibold shadow-md"
          >
            Попробовать снова
          </button>
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-dark opacity-70">Рейсы не найдены</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 font-semibold shadow-md"
          >
            Новый поиск
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {routes && Array.isArray(routes) && routes.map((route) => (
            <div
              key={route.id}
              className="card p-6 hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary-900">
                        {route.departureTime}
                      </div>
                      <div className="text-sm text-neutral-dark opacity-70">{route.departureStation.name}</div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="flex-1 border-t-2 border-dashed border-neutral-light"></div>
                      <div className="px-4 text-sm text-neutral-dark opacity-70">{route.duration}</div>
                      <div className="flex-1 border-t-2 border-dashed border-neutral-light"></div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-900">
                        {route.arrivalTime}
                      </div>
                      <div className="text-sm text-neutral-dark opacity-70">{route.arrivalStation.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-neutral-dark opacity-70">
                    <span>Поезд: {route.train?.number}</span>
                    <span>Тип: {route.train?.type}</span>
                    <span>Свободных мест: {route.availableSeats}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    {route.price.toFixed(2)} BYN
                  </div>
                  <button
                    onClick={() => handleSelectRoute(route)}
                    className="px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition font-semibold shadow-md"
                  >
                    Выбрать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

