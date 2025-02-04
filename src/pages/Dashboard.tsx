import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Client, CalendarEvent } from '../types/database';
import { format } from 'date-fns';
import { Users, UserCheck, XCircle, CheckCircle, LogOut, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CurrentDateTime from '../components/CurrentDateTime';
import ClientForm from '../components/ClientForm';
import Scheduler from '../components/Scheduler';
import { supabase } from '../lib/supabase';

type TabType = 'new' | 'in_progress' | 'cancelled' | 'completed';

function Dashboard() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [clients, setClients] = useState<Client[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    if (profile?.id) {
      loadClients();
      loadEvents();
    }
  }, [profile?.id]);

  const loadClients = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('employee_id', profile.id);

    if (error) {
      console.error('Error loading clients:', error);
      return;
    }

    setClients(data || []);
  };

  const loadEvents = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('employee_id', profile.id);

    if (error) {
      console.error('Error loading events:', error);
      return;
    }

    setEvents(data || []);
  };

  const handleAddEvent = async (event: Partial<CalendarEvent>) => {
    if (!profile?.id) return;

    const krasnodarTime = new Date(event.start_time || new Date());
    krasnodarTime.setMinutes(krasnodarTime.getMinutes() - krasnodarTime.getTimezoneOffset() - 180);

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{
        employee_id: profile.id,
        client_id: event.client_id || null,
        title: event.title || '',
        description: event.description || null,
        start_time: krasnodarTime.toISOString(),
        meeting_type: event.meeting_type || 'office'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding event:', error);
      return;
    }

    await loadEvents();
  };

  const handleEditEvent = async (event: CalendarEvent) => {
    const krasnodarTime = new Date(event.start_time);
    krasnodarTime.setMinutes(krasnodarTime.getMinutes() - krasnodarTime.getTimezoneOffset() - 180);

    const { error } = await supabase
      .from('calendar_events')
      .update({
        title: event.title,
        description: event.description,
        start_time: krasnodarTime.toISOString(),
        meeting_type: event.meeting_type
      })
      .eq('id', event.id);

    if (error) {
      console.error('Error updating event:', error);
      return;
    }

    await loadEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!eventId) return;

    if (window.confirm('Вы уверены, что хотите удалить эту встречу?')) {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        return;
      }

      await loadEvents();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateClient = async (updatedClientData: Partial<Client>) => {
    if (!updatedClientData.id) {
      console.error('Invalid client data: missing id');
      return;
    }

    const updateData = {
      full_name: updatedClientData.full_name,
      birth_date: updatedClientData.birth_date || null,
      phone: updatedClientData.phone,
      source: updatedClientData.source,
      referral_name: updatedClientData.referral_name || null,
      initial_info: updatedClientData.initial_info || null,
      progress_notes: updatedClientData.progress_notes || null,
      next_contact: updatedClientData.next_contact || null,
      status: updatedClientData.status || editingClient?.status,
      completion_date: updatedClientData.completion_date || null,
      cancellation_reason: updatedClientData.cancellation_reason || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', updatedClientData.id);

    if (error) {
      console.error('Error updating client:', error);
      return;
    }

    await loadClients();
    setEditingClient(null);
  };

  const handleAddClient = async (clientData: Partial<Client>) => {
    if (!profile?.id) return;

    const formattedData = {
      employee_id: profile.id,
      full_name: clientData.full_name || '',
      birth_date: clientData.birth_date || null,
      phone: clientData.phone || null,
      contact_date: new Date().toISOString(),
      source: clientData.source || 'personal',
      referral_name: clientData.referral_name || null,
      initial_info: clientData.initial_info || null,
      progress_notes: clientData.progress_notes || null,
      next_contact: clientData.next_contact || null,
      status: 'new'
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([formattedData])
      .select()
      .single();

    if (error) {
      console.error('Error adding client:', error);
      return;
    }

    await loadClients();
    setIsAddingClient(false);
  };

  const handleUpdateClientStatus = async (client: Client, newStatus: Client['status'], reason?: string) => {
    const updateData: Partial<Client> = {
      status: newStatus,
      cancellation_reason: null,
      completion_date: null
    };

    if (newStatus === 'completed') {
      updateData.completion_date = new Date().toISOString();
    } else if (newStatus === 'cancelled' && reason) {
      updateData.cancellation_reason = reason;
    }

    const { error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', client.id);

    if (error) {
      console.error('Error updating client status:', error);
      return;
    }

    await loadClients();
  };

  const filteredClients = clients.filter(client => {
    const matchesStatus = client.status === activeTab;
    const matchesSearch = client.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    new: clients.filter(c => c.status === 'new').length,
    in_progress: clients.filter(c => c.status === 'in_progress').length,
    cancelled: clients.filter(c => c.status === 'cancelled').length,
    completed: clients.filter(c => c.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Агентство Недвижимости ИП Широков
              </h1>
              <div className="mt-1">
                <CurrentDateTime />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSchedulerOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Планировщик
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="w-64">
                <input
                  type="text"
                  placeholder="Поиск по ФИО..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setIsAddingClient(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить клиента
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'new', label: 'Текущие заявки', icon: Users, color: 'blue', count: statusCounts.new },
                { id: 'in_progress', label: 'В процессе', icon: UserCheck, color: 'yellow', count: statusCounts.in_progress },
                { id: 'cancelled', label: 'Забракованные', icon: XCircle, color: 'red', count: statusCounts.cancelled },
                { id: 'completed', label: 'Завершённые', icon: CheckCircle, color: 'green', count: statusCounts.completed },
              ].map(({ id, label, icon: Icon, color, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as TabType)}
                  className={`
                    flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
                    ${activeTab === id
                      ? `border-${color}-500 text-${color}-600 bg-${color}-50`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <span>{label}</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}>
                    {count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ФИО
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контакты
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Источник
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Информация
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.full_name}
                        </div>
                        {client.birth_date && (
                          <div className="text-sm text-gray-500">
                            {format(new Date(client.birth_date), 'dd.MM.yyyy')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.phone}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(client.contact_date), 'dd.MM.yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {client.source === 'social' ? 'Соц.сети' :
                           client.source === 'referral' ? 'Рекомендация' :
                           'Личный клиент'}
                        </span>
                        {client.referral_name && (
                          <div className="text-sm text-gray-500 mt-1">
                            От: {client.referral_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs space-y-4">
                          {client.initial_info && (
                            <div>
                              <div className="font-medium text-blue-600 mb-2">Первичная информация:</div>
                              <p className="text-gray-600 whitespace-pre-wrap">{client.initial_info}</p>
                            </div>
                          )}
                          {client.progress_notes && (
                            <div>
                              <div className="font-medium text-blue-600 mb-2">Этапы работы:</div>
                              <p className="text-gray-600 whitespace-pre-wrap">{client.progress_notes}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingClient(client)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Изменить
                          </button>
                          {activeTab === 'new' && (
                            <button
                              onClick={() => handleUpdateClientStatus(client, 'in_progress')}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              В работу
                            </button>
                          )}
                          {activeTab === 'in_progress' && (
                            <>
                              <button
                                onClick={() => handleUpdateClientStatus(client, 'completed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Завершить
                              </button>
                              <button
                                onClick={async () => {
                                  const reason = window.prompt('Укажите причину отмены:');
                                  if (reason) {
                                    await handleUpdateClientStatus(client, 'cancelled', reason);
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Отменить
                              </button>
                            </>
                          )}
                          {activeTab === 'cancelled' && (
                            <button
                              onClick={() => handleUpdateClientStatus(client, 'in_progress')}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Вернуть в работу
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {(isAddingClient || editingClient) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">
              {isAddingClient ? 'Новый клиент' : 'Редактировать клиента'}
            </h3>
            <ClientForm
              client={editingClient}
              employeeId={profile?.id || ''}
              onSubmit={editingClient ? handleUpdateClient : handleAddClient}
              onCancel={() => {
                setEditingClient(null);
                setIsAddingClient(false);
              }}
            />
          </div>
        </div>
      )}

      {isSchedulerOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Планировщик встреч</h2>
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Scheduler
              events={events}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              employeeId={profile?.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;