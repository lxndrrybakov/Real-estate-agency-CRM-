import React, { useEffect } from 'react';
import { Client } from '../types/database';

interface NotificationsProps {
  clients: Client[];
}

export default function Notifications({ clients }: NotificationsProps) {
  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Check for upcoming contacts
    const interval = setInterval(() => {
      const now = new Date();
      clients.forEach(client => {
        if (client.next_contact) {
          const contactTime = new Date(client.next_contact);
          const timeDiff = contactTime.getTime() - now.getTime();
          
          // Notify 5 minutes before
          if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000) {
            new Notification('Напоминание о контакте', {
              body: `Через 5 минут контакт с клиентом: ${client.full_name}`,
              icon: '/notification-icon.png'
            });
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [clients]);

  return null;
}