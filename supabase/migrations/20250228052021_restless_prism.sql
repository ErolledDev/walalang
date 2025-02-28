/*
  # Create chat analytics tables

  1. New Tables
    - `chat_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `visitor_name` (text)
      - `visitor_email` (text)
      - `ip_address` (text)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)
    - `chat_messages`
      - `id` (uuid, primary key)
      - `analytics_id` (uuid, references chat_analytics)
      - `message` (text)
      - `sender` (text)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    - Add policies for public to insert data
*/

CREATE TABLE IF NOT EXISTS chat_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  visitor_name text NOT NULL,
  visitor_email text NOT NULL,
  ip_address text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_id uuid REFERENCES chat_analytics NOT NULL,
  message text NOT NULL,
  sender text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_analytics
CREATE POLICY "Users can view their own chat analytics"
  ON chat_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can insert chat analytics"
  ON chat_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chat_analytics
    WHERE chat_analytics.id = chat_messages.analytics_id
    AND chat_analytics.user_id = auth.uid()
  ));

CREATE POLICY "Public can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);