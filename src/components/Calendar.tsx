import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../types/database';
import { Edit, Trash, Plus } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function Calendar({ events, onAddEvent, onEditEvent, onDeleteEvent }: CalendarProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Календарь встреч</h2>
        <button
          onClick={onAddEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить встречу
        </button>
      </div>
      
      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(event.start_time), 'dd.MM.yyyy HH:mm')} - 
                  {format(new Date(event.end_time), 'HH:mm')}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditEvent(event)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}