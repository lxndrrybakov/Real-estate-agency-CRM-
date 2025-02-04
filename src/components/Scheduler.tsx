import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../types/database';
import { Edit, Trash, Plus } from 'lucide-react';
import EventForm from './EventForm';

interface SchedulerProps {
  events: CalendarEvent[];
  onAddEvent: (event: Partial<CalendarEvent>) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  employeeId?: string;
  employees?: { id: string; full_name: string; }[];
  isOwner?: boolean;
}

export default function Scheduler({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  employeeId,
  employees = [],
  isOwner = false
}: SchedulerProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const filteredEvents = isOwner
    ? events
    : events.filter(event => event.employee_id === employeeId);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const handleAddEvent = () => {
    const now = new Date();
    // Корректируем время для Краснодара (UTC+3)
    now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + 180);
    setIsAddingEvent(true);
  };

  const handleSubmitEvent = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      onEditEvent({ ...selectedEvent, ...eventData } as CalendarEvent);
    } else {
      onAddEvent({
        ...eventData,
        employee_id: isOwner ? eventData.employee_id : employeeId || ''
      });
    }
    setSelectedEvent(null);
    setIsAddingEvent(false);
  };

  const formatEventTime = (dateStr: string) => {
    const date = new Date(dateStr);
    // Корректируем время для Краснодара (UTC+3)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 180);
    return format(date, 'dd.MM.yyyy HH:mm');
  };

  const getMeetingTypeLabel = (type: CalendarEvent['meeting_type']) => {
    switch (type) {
      case 'online': return 'Онлайн';
      case 'office': return 'В офисе';
      case 'online_office': return 'Онлайн в офисе';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isOwner ? 'Планы сотрудников' : 'Планировщик встреч'}
        </h2>
        <button
          onClick={handleAddEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить встречу
        </button>
      </div>

      {(isAddingEvent || selectedEvent) && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <EventForm
            event={selectedEvent || {
              employee_id: isOwner ? (employees[0]?.id || '') : employeeId || '',
              title: '',
              description: '',
              start_time: new Date().toISOString(),
              meeting_type: 'office'
            }}
            onSubmit={handleSubmitEvent}
            onCancel={() => {
              setSelectedEvent(null);
              setIsAddingEvent(false);
            }}
            employees={employees}
            isOwner={isOwner}
          />
        </div>
      )}

      {isOwner && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {employees.map(emp => {
            const employeeEvents = events.filter(e => e.employee_id === emp.id);
            const upcomingEvents = employeeEvents.filter(e => new Date(e.start_time) > new Date());
            return (
              <div key={emp.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{emp.full_name}</h3>
                <p className="text-sm text-gray-600">
                  Встреч запланировано: {upcomingEvents.length}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-4">
        {sortedEvents.map(event => (
          <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{event.title}</h3>
                <div className="text-sm text-gray-500 space-y-1 mt-1">
                  <p>{formatEventTime(event.start_time)}</p>
                  <p className="text-blue-600">{getMeetingTypeLabel(event.meeting_type)}</p>
                  {event.description && (
                    <p className="text-gray-600">{event.description}</p>
                  )}
                  {isOwner && (
                    <p className="text-blue-600">
                      Сотрудник: {employees.find(emp => emp.id === event.employee_id)?.full_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Нет запланированных встреч
          </div>
        )}
      </div>
    </div>
  );
}