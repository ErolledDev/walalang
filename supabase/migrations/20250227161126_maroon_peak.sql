/*
  # Create advanced_replies table

  1. New Tables
    - `advanced_replies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `keyword` (text, the trigger word/phrase)
      - `button_text` (text, text to display on the button)
      - `response` (text, optional response message)
      - `url` (text, optional URL to open)
      - `match_type` (text, how to match the keyword)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `advanced_replies` table
    - Add policies for authenticated users to manage their own data
    - Add policy for public access to read data
*/

CREATE TABLE IF NOT EXISTS advanced_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  keyword text NOT NULL,
  button_text text NOT NULL,
  response text,
  url text,
  match_type text NOT NULL DEFAULT 'exact',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE advanced_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for advanced_replies
CREATE POLICY "Users can create their own advanced replies"
  ON advanced_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own advanced replies"
  ON advanced_replies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own advanced replies"
  ON advanced_replies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advanced replies"
  ON advanced_replies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create public access policy for advanced replies (for the widget to fetch)
CREATE POLICY "Public can view advanced replies"
  ON advanced_replies
  FOR SELECT
  TO anon
  USING (true);