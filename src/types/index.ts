export interface Station {
  id: number;
  name: string;
  city: string;
}

export interface Train {
  id: number;
  number: string;
  type: string;
}

export interface Carriage {
  id: number;
  trainId: number;
  number: number;
  type: string;
}

export interface Seat {
  id: number;
  carriageId: number;
  number: number;
  isAvailable: boolean;
}

export interface Route {
  id: number;
  name: string;
  trainId: number;
  train?: Train;
  departureStation: Station;
  arrivalStation: Station;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
}

export interface RouteSearchParams {
  fromCity: string;
  toCity: string;
  date: string;
}

export interface SelectedSeat {
  routeId: number;
  seatId: number;
  carriageId: number;
  carriageNumber: number;
  seatNumber: number;
  price: number;
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  passportData: string;
}

export interface Order {
  id: number;
  route: Route;
  seat: SelectedSeat;
  passenger: PassengerInfo;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  totalAmount: number;
}

export interface BookingState {
  searchParams: RouteSearchParams | null;
  selectedRoute: Route | null;
  selectedSeat: SelectedSeat | null;
  passengerInfo: PassengerInfo | null;
}

