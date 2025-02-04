import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '../types/database';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Plus } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateSelect: (start: Date, end: Date) => void;
  onAddEventClick: () => void;
}

export default function Calendar({ events, onEventClick, onDateSelect, onAddEventClick }: CalendarProps) {
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
    extendedProps: event,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onAddEventClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить встречу
        </button>
      </div>
      
      <div className="h-[600px] bg-white p-4 rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={ruLocale}
          events={calendarEvents}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          expandRows={true}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          eventClick={(info) => {
            onEventClick(info.event.extendedProps as CalendarEvent);
          }}
          select={(info) => {
            onDateSelect(info.start, info.end);
            info.view.calendar.unselect();
          }}
          height="100%"
          selectConstraint={{
            start: '00:00',
            end: '24:00',
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          buttonText={{
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День'
          }}
        />
      </div>
    </div>
  );
}