import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = login(name, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Неверное имя или пароль');
    }
    
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("https://i.imghippo.com/files/fvY7481.jpg")',
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Building2 className="w-12 h-12 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Риелторское агентство Широковых
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            Вход в систему
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Например: Андрей"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Тестовые данные для входа:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Владелец:</strong> Александр Широков (пароль: 123)</p>
            <p><strong>Сотрудники:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Наталья (пароль: 123)</li>
              <li>Роман (пароль: 123)</li>
              <li>Андрей (пароль: 123)</li>
              <li>Александр (пароль: 123)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}