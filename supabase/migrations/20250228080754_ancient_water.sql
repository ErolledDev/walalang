/*
  # Fix Chat Analytics RLS Policies

  1. Changes
     - Update RLS policies for chat_analytics and chat_messages tables
     - Allow public access for inserting data into these tables
     - Fix the issue with the chat widget not being able to save analytics data

  2. Security
     - Maintain security while allowing the widget to function properly
     - Ensure users can still only view their own data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert chat analytics" ON chat_analytics;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;

-- Create new policies with public access for chat_analytics
CREATE POLICY "Public can insert chat analytics"
  ON chat_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create new policies with public access for chat_messages
CREATE POLICY "Public can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);