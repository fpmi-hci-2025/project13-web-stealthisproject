import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types';
import { useAuth } from './AuthContext';
import { API_BASE } from '../config/api';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  refreshOrders: () => Promise<void>;
  deleteOrder: (orderId: number) => Promise<boolean>;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Load orders when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders();
    } else {
      // Clear orders when user logs out
      setOrders([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const loadOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setOrders([]);
        return;
      }

      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const ordersData = await response.json();
        // Transform backend order format to frontend format
        interface BackendOrder {
          id: number;
          userId: number;
          routeId?: number;
          routeName?: string;
          trainNumber?: string;
          trainType?: string;
          departureCity?: string;
          arrivalCity?: string;
          departureTime?: string;
          arrivalTime?: string;
          createdAt: string;
          status: string;
          totalAmount: number;
          tickets: Array<{
            id: number;
            ticketNumber: string;
            seatNumber?: number;
            carriageNumber?: number;
            price: number;
          }>;
        }
        
        // Transform orders from backend format to frontend format
        const transformedOrders = ordersData.map((order: BackendOrder) => {
          const ticket = order.tickets?.[0];
          
          // Calculate duration if we have both times
          let duration = '';
          if (order.departureTime && order.arrivalTime) {
            try {
              const dep = new Date(`2000-01-01T${order.departureTime}:00`);
              const arr = new Date(`2000-01-01T${order.arrivalTime}:00`);
              const diffMs = arr.getTime() - dep.getTime();
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              duration = `${hours}ч ${minutes}м`;
            } catch (e) {
              duration = '';
            }
          }
          
          return {
            id: order.id,
            route: {
              id: order.routeId || 0,
              name: order.routeName || '',
              trainId: 0,
              train: { 
                id: 0, 
                number: order.trainNumber || '', 
                type: order.trainType || '' 
              },
              departureStation: { 
                id: 0, 
                name: '', 
                city: order.departureCity || '' 
              },
              arrivalStation: { 
                id: 0, 
                name: '', 
                city: order.arrivalCity || '' 
              },
              departureTime: order.departureTime || '',
              arrivalTime: order.arrivalTime || '',
              duration: duration,
              price: order.totalAmount,
              availableSeats: 0,
            },
            seat: {
              routeId: order.routeId || 0,
              seatId: 0,
              carriageId: 0,
              carriageNumber: ticket?.carriageNumber || 0,
              seatNumber: ticket?.seatNumber || 0,
              price: ticket?.price || order.totalAmount,
            },
            passenger: {
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              passportData: user?.passportData || '',
            },
            status: order.status as 'PENDING' | 'PAID' | 'CANCELLED',
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
          };
        });
        setOrders(transformedOrders);
      } else {
        // If API returns error, just set empty array (user might not have orders yet)
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  const deleteOrder = async (orderId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove order from local state
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete order:', error);
      return false;
    }
  };

  const addOrder = (order: Order) => {
    // Add order locally and sync with backend
    setOrders((prev) => [order, ...prev]);
    
    // Optionally sync with backend if needed
    // This is handled by the booking flow which creates orders via API
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, refreshOrders, deleteOrder, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

