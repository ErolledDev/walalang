/*
  # Add AI settings table

  1. New Tables
    - `ai_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `enabled` (boolean)
      - `api_key` (text)
      - `model` (text)
      - `business_context` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `ai_settings` table
    - Add policies for authenticated users to manage their own AI settings
*/

CREATE TABLE IF NOT EXISTS ai_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  api_key text,
  model text NOT NULL DEFAULT 'gpt-3.5-turbo',
  business_context text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_settings
CREATE POLICY "Users can create their own AI settings"
  ON ai_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI settings"
  ON ai_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI settings"
  ON ai_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI settings"
  ON ai_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create public access policy for AI settings (for the widget to fetch)
CREATE POLICY "Public can view AI settings"
  ON ai_settings
  FOR SELECT
  TO anon
  USING (true);