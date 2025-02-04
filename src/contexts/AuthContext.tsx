import React, { createContext, useContext, useState } from 'react';
import { Profile } from '../types/database';

// Локальные данные для авторизации
const USERS: Record<string, { password: string; profile: Profile }> = {
  'Александр Широков': {
    password: '123',
    profile: {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Александр Широков',
      role: 'owner',
      created_at: new Date().toISOString()
    }
  },
  'Наталья': {
    password: '123',
    profile: {
      id: '00000000-0000-0000-0000-000000000002',
      full_name: 'Наталья',
      role: 'employee',
      created_at: new Date().toISOString()
    }
  },
  'Роман': {
    password: '123',
    profile: {
      id: '00000000-0000-0000-0000-000000000003',
      full_name: 'Роман',
      role: 'employee',
      created_at: new Date().toISOString()
    }
  },
  'Андрей': {
    password: '123',
    profile: {
      id: '00000000-0000-0000-0000-000000000004',
      full_name: 'Андрей',
      role: 'employee',
      created_at: new Date().toISOString()
    }
  },
  'Александр': {
    password: '123',
    profile: {
      id: '00000000-0000-0000-0000-000000000005',
      full_name: 'Александр',
      role: 'employee',
      created_at: new Date().toISOString()
    }
  }
};

interface AuthContextType {
  profile: Profile | null;
  login: (name: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  login: () => false,
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const login = (name: string, password: string): boolean => {
    const trimmedName = name.trim();
    const user = USERS[trimmedName];
    
    if (user && user.password === password) {
      setProfile(user.profile);
      localStorage.setItem('profile', JSON.stringify(user.profile));
      return true;
    }
    return false;
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('profile');
  };

  return (
    <AuthContext.Provider value={{ profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};