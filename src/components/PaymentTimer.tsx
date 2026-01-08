import React, { useState, useEffect } from 'react';

interface PaymentTimerProps {
  createdAt: string;
  onExpired?: () => void;
}

const PaymentTimer: React.FC<PaymentTimerProps> = ({ createdAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - created) / 1000); // seconds
      const remaining = 15 * 60 - elapsed; // 15 minutes in seconds

      if (remaining <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        if (onExpired) {
          onExpired();
        }
        return 0;
      }

      setIsExpired(false);
      setTimeLeft(remaining);
      return remaining;
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, onExpired]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isExpired) {
    return (
      <div className="px-4 py-2 bg-system-error/20 border border-system-error rounded-lg text-system-error text-sm font-semibold">
        Время оплаты истекло
      </div>
    );
  }

  const isUrgent = timeLeft < 5 * 60; // Less than 5 minutes

  return (
    <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
      isUrgent 
        ? 'bg-system-error/20 border border-system-error text-system-error' 
        : 'bg-system-warning/20 border border-system-warning text-system-warning'
    }`}>
      <div className="flex items-center space-x-2">
        <span>⏱️</span>
        <span>Осталось времени на оплату: {formatTime(timeLeft)}</span>
      </div>
      <div className="text-xs mt-1 opacity-80">
        У вас есть 15 минут с момента создания заказа для оплаты
      </div>
    </div>
  );
};

export default PaymentTimer;

