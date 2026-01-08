import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingState, RouteSearchParams, Route, SelectedSeat, PassengerInfo } from '../types';

interface BookingContextType {
  bookingState: BookingState;
  setSearchParams: (params: RouteSearchParams) => void;
  setSelectedRoute: (route: Route | null) => void;
  setSelectedSeat: (seat: SelectedSeat | null) => void;
  setPassengerInfo: (info: PassengerInfo | null) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    searchParams: null,
    selectedRoute: null,
    selectedSeat: null,
    passengerInfo: null,
  });

  const setSearchParams = (params: RouteSearchParams) => {
    setBookingState((prev) => ({ ...prev, searchParams: params }));
  };

  const setSelectedRoute = (route: Route | null) => {
    setBookingState((prev) => ({ ...prev, selectedRoute: route }));
  };

  const setSelectedSeat = (seat: SelectedSeat | null) => {
    setBookingState((prev) => ({ ...prev, selectedSeat: seat }));
  };

  const setPassengerInfo = (info: PassengerInfo | null) => {
    setBookingState((prev) => ({ ...prev, passengerInfo: info }));
  };

  const clearBooking = () => {
    setBookingState({
      searchParams: null,
      selectedRoute: null,
      selectedSeat: null,
      passengerInfo: null,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        setSearchParams,
        setSelectedRoute,
        setSelectedSeat,
        setPassengerInfo,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

