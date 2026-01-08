import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Carriage, Seat, SelectedSeat } from '../types';
import { API_BASE } from '../config/api';

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingState, setSelectedSeat } = useBooking();
  const [selectedCarriage, setSelectedCarriage] = useState<Carriage | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [carriages, setCarriages] = useState<Carriage[]>([]);

  useEffect(() => {
    if (!bookingState.selectedRoute) {
      navigate('/');
      return;
    }
    loadCarriages();
  }, [bookingState.selectedRoute, navigate]);

  const loadCarriages = async () => {
    if (!bookingState.selectedRoute) return;

    try {
      // First, get route details to find train ID
      const routeResponse = await fetch(`${API_BASE}/routes/${bookingState.selectedRoute.id}`);
      if (!routeResponse.ok) {
        throw new Error('Failed to load route details');
      }

      const routeData = await routeResponse.json();
      const trainId = routeData.train?.id;

      if (!trainId) {
        throw new Error('Train not found for route');
      }

      // Get carriages for this train
      // Since we don't have a direct API endpoint, we'll use mock data for now
      // but use the real route ID for order creation
      // TODO: Add API endpoint for getting carriages by train ID
      const mockCarriages: Carriage[] = [
        { id: 1, trainId, number: 1, type: 'Плацкарт' },
        { id: 2, trainId, number: 2, type: 'Купе' },
        { id: 3, trainId, number: 3, type: 'СВ' },
      ];

      setCarriages(mockCarriages);
      if (mockCarriages.length > 0 && !selectedCarriage) {
        setSelectedCarriage(mockCarriages[0]);
      }
    } catch (error) {
      console.error('Failed to load carriages:', error);
      // Fallback to mock data
      const fallbackCarriages: Carriage[] = [
        { id: 1, trainId: bookingState.selectedRoute.trainId || 0, number: 1, type: 'Плацкарт' },
        { id: 2, trainId: bookingState.selectedRoute.trainId || 0, number: 2, type: 'Купе' },
        { id: 3, trainId: bookingState.selectedRoute.trainId || 0, number: 3, type: 'СВ' },
      ];
      setCarriages(fallbackCarriages);
      if (fallbackCarriages.length > 0 && !selectedCarriage) {
        setSelectedCarriage(fallbackCarriages[0]);
      }
    }
  };

  useEffect(() => {
    if (selectedCarriage) {
      loadSeats();
    }
  }, [selectedCarriage]);

  const loadSeats = async () => {
    if (!selectedCarriage) return;

    try {
      // Generate seats for the carriage (mock for now)
      // TODO: Add API endpoint for getting seats by carriage ID
      const seatsPerCarriage = selectedCarriage.type === 'СВ' ? 18 : selectedCarriage.type === 'Купе' ? 36 : 54;
      const mockSeats: Seat[] = [];
      for (let i = 1; i <= seatsPerCarriage; i++) {
        mockSeats.push({
          id: selectedCarriage.id * 100 + i, // Generate unique ID
          carriageId: selectedCarriage.id,
          number: i,
          isAvailable: Math.random() > 0.3, // 70% available
        });
      }
      setSeats(mockSeats);
    } catch (error) {
      console.error('Failed to load seats:', error);
      setSeats([]);
    }
  };

  const handleSeatSelect = (seat: Seat) => {
    if (!seat.isAvailable || !selectedCarriage || !bookingState.selectedRoute) return;
    setSelectedSeatId(seat.id);
  };

  const handleContinue = () => {
    if (!selectedSeatId || !selectedCarriage || !bookingState.selectedRoute) return;

    const seat = seats.find((s) => s.id === selectedSeatId);
    if (!seat) return;

    const selectedSeat: SelectedSeat = {
      routeId: bookingState.selectedRoute.id,
      seatId: seat.id,
      carriageId: selectedCarriage.id,
      carriageNumber: selectedCarriage.number,
      seatNumber: seat.number,
      price: bookingState.selectedRoute.price,
    };

    setSelectedSeat(selectedSeat);
    navigate('/booking');
  };

  if (!bookingState.selectedRoute) {
    return null;
  }

  // Render seats in a grid (simplified layout)
  const renderSeats = () => {
    if (!selectedCarriage) return null;

    const seatsPerRow = selectedCarriage.type === 'СВ' ? 2 : selectedCarriage.type === 'Купе' ? 4 : 6;
    const rows: Seat[][] = [];
    
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      rows.push(seats.slice(i, i + seatsPerRow));
    }

    return (
      <div className="space-y-2">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex space-x-2">
            {row.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatSelect(seat)}
                disabled={!seat.isAvailable}
                className={`
                  w-12 h-12 rounded border-2 transition font-semibold
                  ${
                    selectedSeatId === seat.id
                      ? 'bg-primary-400 border-primary-500 text-white'
                      : seat.isAvailable
                      ? 'bg-system-success/20 border-system-success hover:bg-system-success/30 text-neutral-dark'
                      : 'bg-system-error/20 border-system-error text-neutral-dark opacity-50 cursor-not-allowed'
                  }
                `}
              >
                {seat.number}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/search-results')}
          className="text-primary-600 hover:text-primary-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к результатам
        </button>
        <h1 className="text-3xl font-bold mt-4">Выбор места</h1>
      </div>

      {/* Route Info */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">
              {bookingState.selectedRoute.departureStation.city} → {bookingState.selectedRoute.arrivalStation.city}
            </div>
            <div className="text-gray-600">
              Поезд {bookingState.selectedRoute.train?.number} • {bookingState.selectedRoute.departureTime} - {bookingState.selectedRoute.arrivalTime}
            </div>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {bookingState.selectedRoute.price.toFixed(2)} BYN
          </div>
        </div>
      </div>

      {/* Carriage Selection */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Выберите вагон</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {carriages.map((carriage) => (
            <button
              key={carriage.id}
              onClick={() => {
                setSelectedCarriage(carriage);
                setSelectedSeatId(null);
              }}
              className={`
                p-4 rounded-lg border-2 transition
                ${
                  selectedCarriage?.id === carriage.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }
              `}
            >
              <div className="font-semibold">Вагон {carriage.number}</div>
              <div className="text-sm text-gray-600">{carriage.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      {selectedCarriage && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Вагон {selectedCarriage.number} - {selectedCarriage.type}
          </h2>
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
              <span className="text-sm">Свободно</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
              <span className="text-sm">Занято</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-primary-600 border-2 border-primary-700 rounded mr-2"></div>
              <span className="text-sm">Выбрано</span>
            </div>
          </div>
          {renderSeats()}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedSeatId}
          className={`
            px-8 py-3 rounded-lg font-semibold transition shadow-md
            ${
              selectedSeatId
                ? 'bg-primary-400 text-white hover:bg-primary-500'
                : 'bg-neutral-light text-neutral-dark opacity-50 cursor-not-allowed'
            }
          `}
        >
          Продолжить оформление
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;

