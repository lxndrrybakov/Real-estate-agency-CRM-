export interface Profile {
  id: string;
  full_name: string;
  role: 'owner' | 'employee';
  created_at: string;
}

export interface Client {
  id: string;
  employee_id: string;
  full_name: string;
  birth_date: string | null;
  phone: string | null;
  contact_date: string;
  source: 'social' | 'referral' | 'personal' | null;
  referral_name?: string | null;
  initial_info: string | null;
  progress_notes: string | null;
  next_contact: string | null;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  completion_date: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  employee_id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  start_time: string;
  meeting_type: 'online' | 'office' | 'online_office';
  created_at: string;
  updated_at: string;
}