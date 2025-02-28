/*
  # Fix RLS policies for chat analytics and messages

  1. Changes
    - Drop existing RLS policies for chat_analytics and chat_messages
    - Create new policies with proper permissions for anonymous users
    - Ensure public can insert data into both tables
  2. Security
    - Maintain user data isolation while allowing anonymous inserts
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own chat analytics" ON chat_analytics;
DROP POLICY IF EXISTS "Public can insert chat analytics" ON chat_analytics;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Public can insert chat messages" ON chat_messages;

-- Create new policies for chat_analytics
CREATE POLICY "Users can view their own chat analytics"
  ON chat_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert chat analytics"
  ON chat_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create new policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chat_analytics
    WHERE chat_analytics.id = chat_messages.analytics_id
    AND chat_analytics.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);