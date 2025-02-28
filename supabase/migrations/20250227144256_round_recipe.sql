/*
  # Create initial schema for widget chat application

  1. New Tables
    - `widget_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `business_name` (text)
      - `representative_name` (text)
      - `brand_color` (text)
      - `business_description` (text)
      - `created_at` (timestamp)
    - `auto_replies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `keyword` (text)
      - `response` (text)
      - `match_type` (text)
      - `synonyms` (text array)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create widget_settings table
CREATE TABLE IF NOT EXISTS widget_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  business_name text NOT NULL,
  representative_name text NOT NULL,
  brand_color text NOT NULL DEFAULT '#3B82F6',
  business_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create auto_replies table
CREATE TABLE IF NOT EXISTS auto_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  keyword text NOT NULL,
  response text NOT NULL,
  match_type text NOT NULL DEFAULT 'exact',
  synonyms text[] DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for widget_settings
CREATE POLICY "Users can create their own widget settings"
  ON widget_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own widget settings"
  ON widget_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own widget settings"
  ON widget_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own widget settings"
  ON widget_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for auto_replies
CREATE POLICY "Users can create their own auto replies"
  ON auto_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own auto replies"
  ON auto_replies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own auto replies"
  ON auto_replies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own auto replies"
  ON auto_replies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create public access policy for widget settings (for the widget to fetch)
CREATE POLICY "Public can view widget settings"
  ON widget_settings
  FOR SELECT
  TO anon
  USING (true);

-- Create public access policy for auto replies (for the widget to fetch)
CREATE POLICY "Public can view auto replies"
  ON auto_replies
  FOR SELECT
  TO anon
  USING (true);