import React from 'react';

interface ClientFiltersProps {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  phoneFilter: string;
  onPhoneFilterChange: (value: string) => void;
  infoFilter: string;
  onInfoFilterChange: (value: string) => void;
}

export default function ClientFilters({
  nameFilter,
  onNameFilterChange,
  phoneFilter,
  onPhoneFilterChange,
  infoFilter,
  onInfoFilterChange,
}: ClientFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700">
          Поиск по имени
        </label>
        <input
          id="nameFilter"
          type="text"
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Введите имя..."
        />
      </div>
      <div>
        <label htmlFor="phoneFilter" className="block text-sm font-medium text-gray-700">
          Поиск по телефону
        </label>
        <input
          id="phoneFilter"
          type="text"
          value={phoneFilter}
          onChange={(e) => onPhoneFilterChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Введите телефон..."
        />
      </div>
      <div>
        <label htmlFor="infoFilter" className="block text-sm font-medium text-gray-700">
          Поиск по информации
        </label>
        <input
          id="infoFilter"
          type="text"
          value={infoFilter}
          onChange={(e) => onInfoFilterChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Поиск в описании..."
        />
      </div>
    </div>
  );
}