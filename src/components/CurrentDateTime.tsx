import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Устанавливаем часовой пояс Краснодара (UTC+3)
      now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + 180);
      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-2xl font-medium text-gray-600">
      {format(currentTime, 'HH:mm', { locale: ru })}
    </div>
  );
}