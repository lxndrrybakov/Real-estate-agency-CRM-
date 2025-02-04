import React, { useState } from 'react';
import { Client } from '../types/database';
import { formatPhoneNumber } from '../utils/formatters';

interface ClientFormProps {
  client?: Client;
  employeeId: string;
  onSubmit: (client: Partial<Client>) => void;
  onCancel: () => void;
  employees?: { id: string; full_name: string; }[];
  isOwner?: boolean;
}

export default function ClientForm({ client, employeeId, onSubmit, onCancel, employees = [], isOwner = false }: ClientFormProps) {
  const [formData, setFormData] = useState({
    id: client?.id, // Сохраняем ID клиента если он есть
    employee_id: client?.employee_id || employeeId || (isOwner && employees.length > 0 ? employees[0].id : ''),
    full_name: client?.full_name || '',
    birth_date: client?.birth_date || '',
    phone: client?.phone || '+7',
    source: client?.source || 'personal',
    referral_name: client?.referral_name || '',
    initial_info: client?.initial_info || '',
    progress_notes: client?.progress_notes || '',
    next_contact: client?.next_contact ? new Date(client.next_contact).toISOString().slice(0, 16) : '',
    status: client?.status || 'new',
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('+7')) {
      value = '+7' + value;
    }
    setFormData({ ...formData, phone: formatPhoneNumber(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Преобразуем время в часовой пояс Краснодара
    let nextContact = null;
    if (formData.next_contact) {
      const date = new Date(formData.next_contact);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 180);
      nextContact = date.toISOString();
    }

    // Передаем все данные формы, включая ID если он есть
    onSubmit({
      ...formData,
      next_contact: nextContact,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isOwner && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Сотрудник</label>
          <select
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Выберите сотрудника</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">ФИО</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Дата рождения</label>
        <input
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Телефон</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Источник</label>
        <select
          value={formData.source}
          onChange={(e) => {
            const value = e.target.value as Client['source'];
            setFormData({ ...formData, source: value });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="social">Соц.сети</option>
          <option value="referral">Рекомендация от клиента</option>
          <option value="personal">Личный клиент</option>
        </select>
      </div>

      {formData.source === 'referral' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">От кого рекомендация</label>
          <input
            type="text"
            value={formData.referral_name}
            onChange={(e) => setFormData({ ...formData, referral_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Укажите имя клиента"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Первичная информация</label>
        <textarea
          value={formData.initial_info}
          onChange={(e) => setFormData({ ...formData, initial_info: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Этапы работы</label>
        <textarea
          value={formData.progress_notes}
          onChange={(e) => setFormData({ ...formData, progress_notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Следующий контакт</label>
        <input
          type="datetime-local"
          value={formData.next_contact}
          onChange={(e) => setFormData({ ...formData, next_contact: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}