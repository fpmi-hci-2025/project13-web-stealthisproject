import { Route, Station, Train, Carriage, Seat, Order } from '../types';

export const mockStations: Station[] = [
  { id: 1, name: 'Минск-Пассажирский', city: 'Минск' },
  { id: 2, name: 'Брест-Центральный', city: 'Брест' },
  { id: 3, name: 'Гомель', city: 'Гомель' },
  { id: 4, name: 'Витебск', city: 'Витебск' },
  { id: 5, name: 'Гродно', city: 'Гродно' },
  { id: 6, name: 'Могилев', city: 'Могилев' },
];

export const mockTrains: Train[] = [
  { id: 1, number: '703Б', type: 'Скоростной' },
  { id: 2, number: '701Б', type: 'Скоростной' },
  { id: 3, number: '105Б', type: 'Региональный' },
  { id: 4, number: '107Б', type: 'Региональный' },
];

export const mockCarriages: Carriage[] = [
  // Train 1 (703Б)
  { id: 1, trainId: 1, number: 1, type: 'Плацкарт' },
  { id: 2, trainId: 1, number: 2, type: 'Купе' },
  { id: 3, trainId: 1, number: 3, type: 'СВ' },
  // Train 2 (701Б)
  { id: 4, trainId: 2, number: 1, type: 'Плацкарт' },
  { id: 5, trainId: 2, number: 2, type: 'Купе' },
  // Train 3 (105Б)
  { id: 6, trainId: 3, number: 1, type: 'Плацкарт' },
  { id: 7, trainId: 3, number: 2, type: 'Купе' },
  { id: 8, trainId: 3, number: 3, type: 'СВ' },
  // Train 4 (107Б)
  { id: 9, trainId: 4, number: 1, type: 'Плацкарт' },
  { id: 10, trainId: 4, number: 2, type: 'Купе' },
  { id: 11, trainId: 4, number: 3, type: 'СВ' },
];

export const mockSeats: Seat[] = [];
// Generate seats for carriages
mockCarriages.forEach((carriage) => {
  const seatsPerCarriage = carriage.type === 'СВ' ? 18 : carriage.type === 'Купе' ? 36 : 54;
  for (let i = 1; i <= seatsPerCarriage; i++) {
    mockSeats.push({
      id: mockSeats.length + 1,
      carriageId: carriage.id,
      number: i,
      isAvailable: Math.random() > 0.3, // 70% available
    });
  }
});

export const mockRoutes: Route[] = [
  {
    id: 1,
    name: 'Минск - Брест',
    trainId: 1,
    train: mockTrains[0],
    departureStation: mockStations[0],
    arrivalStation: mockStations[1],
    departureTime: '08:00',
    arrivalTime: '12:30',
    duration: '4ч 30м',
    price: 25.50,
    availableSeats: 45,
  },
  {
    id: 2,
    name: 'Минск - Брест',
    trainId: 2,
    train: mockTrains[1],
    departureStation: mockStations[0],
    arrivalStation: mockStations[1],
    departureTime: '14:00',
    arrivalTime: '18:45',
    duration: '4ч 45м',
    price: 22.00,
    availableSeats: 38,
  },
  {
    id: 3,
    name: 'Минск - Гомель',
    trainId: 3,
    train: mockTrains[2],
    departureStation: mockStations[0],
    arrivalStation: mockStations[2],
    departureTime: '09:30',
    arrivalTime: '14:15',
    duration: '4ч 45м',
    price: 18.50,
    availableSeats: 52,
  },
  {
    id: 4,
    name: 'Минск - Витебск',
    trainId: 4,
    train: mockTrains[3],
    departureStation: mockStations[0],
    arrivalStation: mockStations[3],
    departureTime: '10:00',
    arrivalTime: '15:30',
    duration: '5ч 30м',
    price: 20.00,
    availableSeats: 41,
  },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    route: mockRoutes[0],
    seat: {
      routeId: 1,
      seatId: 5,
      carriageId: 1,
      carriageNumber: 1,
      seatNumber: 12,
      price: 25.50,
    },
    passenger: {
      firstName: 'Иван',
      lastName: 'Иванов',
      passportData: 'AB1234567',
    },
    status: 'PAID',
    createdAt: '2024-01-15T10:30:00',
    totalAmount: 25.50,
  },
  {
    id: 2,
    route: mockRoutes[2],
    seat: {
      routeId: 3,
      seatId: 15,
      carriageId: 1,
      carriageNumber: 1,
      seatNumber: 25,
      price: 18.50,
    },
    passenger: {
      firstName: 'Иван',
      lastName: 'Иванов',
      passportData: 'AB1234567',
    },
    status: 'PAID',
    createdAt: '2024-01-10T08:15:00',
    totalAmount: 18.50,
  },
];

// Helper functions
export const getSeatsByCarriage = (carriageId: number): Seat[] => {
  return mockSeats.filter((seat) => seat.carriageId === carriageId);
};

export const getCarriagesByTrain = (trainId: number): Carriage[] => {
  return mockCarriages.filter((carriage) => carriage.trainId === trainId);
};

export const searchRoutes = (fromCity: string, toCity: string): Route[] => {
  return mockRoutes.filter(
    (route) =>
      route.departureStation.city.toLowerCase() === fromCity.toLowerCase() &&
      route.arrivalStation.city.toLowerCase() === toCity.toLowerCase()
  );
};

