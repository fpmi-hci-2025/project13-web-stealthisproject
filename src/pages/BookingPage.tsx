import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { PassengerInfo } from '../types';
import { API_BASE } from '../config/api';
import PaymentTimer from '../components/PaymentTimer';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingState, setPassengerInfo, clearBooking } = useBooking();
  const { refreshOrders } = useOrders();
  const { user } = useAuth();
  const [formData, setFormData] = useState<PassengerInfo>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    passportData: user?.passportData || '',
  });
  const [orderCreatedAt, setOrderCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingState.selectedRoute || !bookingState.selectedSeat) {
      navigate('/');
    }
  }, [bookingState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingState.selectedRoute || !bookingState.selectedSeat) return;

    setPassengerInfo(formData);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // First, update passenger profile with passport data if provided
      if (formData.passportData) {
        try {
          const updateResponse = await fetch(`${API_BASE}/users/me`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              passportData: formData.passportData,
            }),
          });

          if (!updateResponse.ok) {
            console.warn('Failed to update passenger profile, continuing with order creation');
          }
        } catch (updateError) {
          console.warn('Error updating passenger profile:', updateError);
        }
      }

      // Create order via API
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routeId: bookingState.selectedRoute.id,
          seatId: bookingState.selectedSeat.seatId,
          price: bookingState.selectedSeat.price,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Неизвестная ошибка';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        
        const debugInfo = {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          requestBody: {
            routeId: bookingState.selectedRoute.id,
            seatId: bookingState.selectedSeat.seatId,
          },
        };
        
        console.error('Order creation failed:', debugInfo);
        
        // Show user-friendly error message
        if (errorMessage.includes('Seat not found') || errorMessage.includes('seat')) {
          alert('Ошибка: Место не найдено в базе данных.\n\nВозможные причины:\n- Место было удалено\n- База данных не содержит данных о местах\n\nРешение: Запустите команду "make seed" в директории backend для заполнения базы данных.');
        } else {
          alert(`Ошибка при создании заказа: ${errorMessage}\n\nПроверьте консоль браузера (F12) для подробностей.`);
        }
        return;
      }

      const orderData = await response.json();
      setOrderCreatedAt(orderData.createdAt);

      // Refresh orders list
      await refreshOrders();
      clearBooking();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка при создании заказа: ${errorMessage}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!bookingState.selectedRoute || !bookingState.selectedSeat) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/seat-selection')}
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к выбору места
        </button>
        <h1 className="text-3xl font-bold mt-4">Оформление заказа</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Данные пассажира</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Паспортные данные *
                </label>
                <input
                  type="text"
                  name="passportData"
                  value={formData.passportData}
                  onChange={handleChange}
                  placeholder="AB1234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-400 text-white py-3 rounded-lg font-semibold hover:bg-primary-500 transition shadow-md"
              >
                Перейти к оплате
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            {orderCreatedAt && (
              <div className="mb-4">
                <PaymentTimer createdAt={orderCreatedAt} />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-4">Детали поездки</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Маршрут</div>
                <div className="font-semibold">
                  {bookingState.selectedRoute.departureStation.city} → {bookingState.selectedRoute.arrivalStation.city}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Поезд</div>
                <div className="font-semibold">
                  {bookingState.selectedRoute.train?.number} ({bookingState.selectedRoute.train?.type})
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Дата и время</div>
                <div className="font-semibold">
                  {bookingState.searchParams?.date && new Date(bookingState.searchParams.date).toLocaleDateString('ru-RU')} • {bookingState.selectedRoute.departureTime}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Место</div>
                <div className="font-semibold">
                  Вагон {bookingState.selectedSeat.carriageNumber}, Место {bookingState.selectedSeat.seatNumber}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-primary-400">
                    {bookingState.selectedSeat.price.toFixed(2)} BYN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

