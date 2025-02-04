/*
  # Real Estate CRM Initial Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `full_name` (text) - employee full name
      - `role` (text) - either 'owner' or 'employee'
      - `created_at` (timestamp)
      
    - `clients`
      - `id` (uuid, primary key)
      - `employee_id` (uuid) - reference to profiles
      - `full_name` (text) - client's full name
      - `birth_date` (date)
      - `phone` (text)
      - `contact_date` (timestamp) - initial contact date
      - `source` (text) - client source (YouTube, Telegram, VK, etc)
      - `initial_info` (text) - initial client information
      - `progress_notes` (text) - work progress notes
      - `next_contact` (timestamp) - next contact date/time
      - `status` (text) - 'new', 'in_progress', 'completed', 'cancelled'
      - `completion_date` (timestamp)
      - `cancellation_reason` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'employee')),
  created_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES profiles(id) NOT NULL,
  full_name text NOT NULL,
  birth_date date,
  phone text,
  contact_date timestamptz DEFAULT now(),
  source text CHECK (source IN ('youtube', 'telegram', 'vk', 'referral', 'direct')),
  initial_info text,
  progress_notes text,
  next_contact timestamptz,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  completion_date timestamptz,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Employees can view their own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    employee_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

CREATE POLICY "Employees can insert their own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Employees can update their own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    employee_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Insert initial users
INSERT INTO auth.users (id, email, role, encrypted_password)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'alexander.shirokov@example.com', 'authenticated', crypt('owner123', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000002', 'natalia@example.com', 'authenticated', crypt('emp456nat', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000003', 'roman@example.com', 'authenticated', crypt('emp789rom', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000004', 'andrey@example.com', 'authenticated', crypt('emp101and', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000005', 'alexander@example.com', 'authenticated', crypt('emp202ale', gen_salt('bf')));

INSERT INTO profiles (id, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', 'employee'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', 'employee'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', 'employee'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', 'employee');