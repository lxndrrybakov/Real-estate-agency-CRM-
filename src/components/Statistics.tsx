import React from 'react';
import { Client } from '../types/database';
import { Users, UserCheck, XCircle, CheckCircle, TrendingUp, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface StatisticsProps {
  clients: Client[];
  employees: { id: string; full_name: string; }[];
}

export default function Statistics({ clients, employees }: StatisticsProps) {
  const totalClients = clients.length;
  const inProgressClients = clients.filter(c => c.status === 'in_progress').length;
  const cancelledClients = clients.filter(c => c.status === 'cancelled').length;
  const completedClients = clients.filter(c => c.status === 'completed').length;

  const employeeStats = employees.map(emp => {
    const employeeClients = clients.filter(c => c.employee_id === emp.id);
    return {
      ...emp,
      total: employeeClients.length,
      new: employeeClients.filter(c => c.status === 'new').length,
      inProgress: employeeClients.filter(c => c.status === 'in_progress').length,
      completed: employeeClients.filter(c => c.status === 'completed').length,
      cancelled: employeeClients.filter(c => c.status === 'cancelled').length,
      successRate: employeeClients.length > 0
        ? (employeeClients.filter(c => c.status === 'completed').length / employeeClients.length * 100).toFixed(1)
        : 0
    };
  }).sort((a, b) => b.completed - a.completed);

  const exportClientsToExcel = () => {
    const data = clients.map(client => ({
      'Сотрудник': employees.find(emp => emp.id === client.employee_id)?.full_name,
      'ФИО клиента': client.full_name,
      'Телефон': client.phone,
      'Дата рождения': client.birth_date,
      'Источник': client.source === 'social' ? 'Соц.сети' :
                 client.source === 'referral' ? 'Рекомендация' : 'Личный клиент',
      'Статус': client.status === 'new' ? 'Новый' :
                client.status === 'in_progress' ? 'В процессе' :
                client.status === 'completed' ? 'Завершён' : 'Отменён',
      'Первичная информация': client.initial_info,
      'Этапы работы': client.progress_notes,
      'Дата создания': new Date(client.created_at).toLocaleDateString('ru-RU'),
      'Последнее обновление': new Date(client.updated_at).toLocaleDateString('ru-RU'),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Клиенты');
    XLSX.writeFile(wb, 'clients.xlsx');
  };

  const exportStatsToExcel = () => {
    const data = employeeStats.map(emp => ({
      'Сотрудник': emp.full_name,
      'Всего клиентов': emp.total,
      'Новые': emp.new,
      'В процессе': emp.inProgress,
      'Завершённые': emp.completed,
      'Забракованные': emp.cancelled,
      'Успешность (%)': emp.successRate,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Статистика');
    XLSX.writeFile(wb, 'statistics.xlsx');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Статистика</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={exportClientsToExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт клиентов
          </button>
          <button
            onClick={exportStatsToExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт статистики
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">Всего клиентов</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalClients}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-900">В процессе</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgressClients}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-medium text-red-900">Забракованные</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-2">{cancelledClients}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-green-900">Завершённые</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedClients}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">Статистика по сотрудникам</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сотрудник
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Всего клиентов
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Новые
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                В процессе
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Завершённые
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Забракованные
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Успешность
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employeeStats.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {emp.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {emp.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {emp.new}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {emp.inProgress}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {emp.completed}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {emp.cancelled}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${emp.successRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">{emp.successRate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}