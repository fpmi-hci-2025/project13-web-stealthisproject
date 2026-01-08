# Railway Ticket System - Web Application

Frontend web application for the Railway Ticket System built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Date Handling**: date-fns
- **Code Quality**: ESLint

## Features

- ✅ **Home/Search Page**: Search form for routes with city selection
- ✅ **Search Results**: List of available trains with mock data
- ✅ **Seat Selection**: Visual representation of carriage/seats
- ✅ **Booking Form**: Passenger details input form
- ✅ **User Dashboard**: List of orders/tickets with mock data
- ✅ **State Management**: Context API for booking flow
- ✅ **Responsive Design**: Mobile-friendly UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
project13-web-stealthisproject/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── context/             # React Context providers
│   │   ├── BookingContext.tsx
│   │   └── OrdersContext.tsx
│   ├── data/               # Mock data
│   │   └── mockData.ts
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── SearchResultsPage.tsx
│   │   ├── SeatSelectionPage.tsx
│   │   ├── BookingPage.tsx
│   │   └── DashboardPage.tsx
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .github/workflows/      # CI/CD pipelines
├── public/                 # Static assets
└── package.json
```

## Pages

### Home Page (`/`)
- Search form for routes
- City selection dropdowns
- Date picker
- Popular destinations section

### Search Results (`/search-results`)
- List of available routes based on search criteria
- Route details (departure/arrival times, duration, price)
- Select route to proceed to seat selection

### Seat Selection (`/seat-selection`)
- Carriage selection
- Visual seat map
- Seat availability indicators
- Select seat to proceed to booking

### Booking Form (`/booking`)
- Passenger information form
- Order summary sidebar
- Submit to create order

### Dashboard (`/dashboard`)
- List of user's orders/tickets
- Order status indicators
- Order details and history

## State Management

The application uses React Context API for state management:

- **BookingContext**: Manages the booking flow state (search params, selected route, seat, passenger info)
- **OrdersContext**: Manages user orders/tickets

## Mock Data

All data is currently mocked and stored in `src/data/mockData.ts`:
- Stations
- Trains
- Carriages
- Seats
- Routes
- Orders

## Routing

Routes are defined in `src/App.tsx`:
- `/` - Home page
- `/search-results` - Search results
- `/seat-selection` - Seat selection
- `/booking` - Booking form
- `/dashboard` - User dashboard

## Styling

The application uses Tailwind CSS for styling:
- Custom color palette (primary colors)
- Responsive design utilities
- Component-based styling

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) includes:
- Linting with ESLint
- Build verification
- Runs on push/PR to main/develop branches

## Development Notes

- All data is currently mocked (no API integration yet)
- The booking flow is fully functional with local state
- Orders are stored in React Context (not persisted)
- Responsive design for mobile and desktop

## Future Enhancements

- API integration with backend
- User authentication
- Payment processing
- Real-time seat availability
- Ticket QR code generation
- Email notifications
- Saved passenger profiles
