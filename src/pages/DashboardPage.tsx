import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { format } from 'date-fns';
import PaymentTimer from '../components/PaymentTimer';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders, loading, deleteOrder, refreshOrders } = useOrders();
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-system-success/20 text-system-success';
      case 'PENDING':
        return 'bg-system-warning/20 text-system-warning';
      case 'CANCELLED':
        return 'bg-system-error/20 text-system-error';
      default:
        return 'bg-neutral-light text-neutral-dark';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Оплачен';
      case 'PENDING':
        return 'Ожидает оплаты';
      case 'CANCELLED':
        return 'Отменен';
      default:
        return status;
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    setDeletingOrderId(orderId);
    const success = await deleteOrder(orderId);
    setDeletingOrderId(null);
    
    if (success) {
      await refreshOrders();
    } else {
      alert('Не удалось удалить заказ');
    }
  };

  const handleTimerExpired = async () => {
    // Refresh orders when timer expires to remove expired orders
    await refreshOrders();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Мои билеты</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-dark opacity-70">Загрузка...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-dark opacity-70 mb-4">У вас пока нет билетов</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 font-semibold shadow-md"
          >
            Найти билеты
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card p-6 hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary-900">
                        {order.route.departureTime}
                      </div>
                      <div className="text-sm text-neutral-dark opacity-70">
                        {order.route.departureStation.city}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="flex-1 border-t-2 border-dashed border-neutral-light"></div>
                      <div className="px-4 text-sm text-neutral-dark opacity-70">{order.route.duration}</div>
                      <div className="flex-1 border-t-2 border-dashed border-neutral-light"></div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-900">
                        {order.route.arrivalTime}
                      </div>
                      <div className="text-sm text-neutral-dark opacity-70">
                        {order.route.arrivalStation.city}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-dark opacity-70">Поезд:</span>{' '}
                      <span className="font-semibold text-neutral-dark">{order.route.train?.number}</span>
                    </div>
                    <div>
                      <span className="text-neutral-dark opacity-70">Вагон:</span>{' '}
                      <span className="font-semibold text-neutral-dark">{order.seat.carriageNumber}</span>
                    </div>
                    <div>
                      <span className="text-neutral-dark opacity-70">Место:</span>{' '}
                      <span className="font-semibold text-neutral-dark">{order.seat.seatNumber}</span>
                    </div>
                    <div>
                      <span className="text-neutral-dark opacity-70">Пассажир:</span>{' '}
                      <span className="font-semibold text-neutral-dark">
                        {order.passenger.firstName} {order.passenger.lastName}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-neutral-dark opacity-70">
                    Дата покупки:{' '}
                    {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                  </div>
                  {order.status === 'PENDING' && (
                    <div className="mt-4">
                      <PaymentTimer 
                        createdAt={order.createdAt} 
                        onExpired={handleTimerExpired}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                  <div className="text-2xl font-bold text-primary-400 mb-2">
                    {order.totalAmount.toFixed(2)} BYN
                  </div>
                  {order.status === 'PAID' && (
                    <button className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 text-sm font-semibold shadow-md">
                      Показать билет
                    </button>
                  )}
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={deletingOrderId === order.id}
                      className="px-4 py-2 bg-system-error text-white rounded-lg hover:bg-system-error/90 text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingOrderId === order.id ? 'Удаление...' : 'Удалить заказ'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

