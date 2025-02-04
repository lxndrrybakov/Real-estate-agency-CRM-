import React from 'react';
import { CalendarEvent } from '../types/database';

interface EventFormProps {
  event: Partial<CalendarEvent>;
  onSubmit: (event: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  employees?: { id: string; full_name: string; }[];
  isOwner?: boolean;
}

export default function EventForm({ event, onSubmit, onCancel, employees = [], isOwner = false }: EventFormProps) {
  const [formData, setFormData] = React.useState({
    employee_id: event.employee_id || (employees.length > 0 ? employees[0].id : ''),
    title: event.title || '',
    description: event.description || '',
    meeting_type: event.meeting_type || 'office',
    start_time: event.start_time || new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOwner) {
      const employee = employees.find(emp => emp.id === formData.employee_id);
      const baseTitle = formData.title.includes(' - ') ? formData.title.split(' - ')[1] : formData.title;
      formData.title = `${employee?.full_name || 'Сотрудник'} - ${baseTitle}`;
    }

    // Преобразуем время в часовой пояс Краснодара
    const date = new Date(formData.start_time);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 180);
    
    onSubmit({
      ...formData,
      start_time: date.toISOString()
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
        <label className="block text-sm font-medium text-gray-700">Название</label>
        <input
          type="text"
          value={isOwner ? (formData.title.includes(' - ') ? formData.title.split(' - ')[1] : formData.title) : formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Описание</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Тип встречи</label>
        <select
          value={formData.meeting_type}
          onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value as CalendarEvent['meeting_type'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="online">Онлайн</option>
          <option value="office">В офисе</option>
          <option value="online_office">Онлайн в офисе</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Дата и время встречи</label>
        <input
          type="datetime-local"
          value={new Date(formData.start_time).toISOString().slice(0, 16)}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setFormData({ ...formData, start_time: date.toISOString() });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
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