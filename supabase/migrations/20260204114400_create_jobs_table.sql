/*
  # Job Tracker Schema

  ## Overview
  Creates a comprehensive job tracking system for managing job applications.

  ## New Tables
  
  ### `jobs`
  Core table for storing job application information:
  - `id` (uuid, primary key) - Unique identifier for each job
  - `user_id` (uuid) - Reference to user (for future auth integration)
  - `company` (text, required) - Company name
  - `position` (text, required) - Job position/title
  - `status` (text, required) - Application status with predefined values
  - `application_date` (date, required) - Date when application was submitted
  - `salary_range` (text, optional) - Expected salary range
  - `location` (text, optional) - Job location
  - `job_url` (text, optional) - Link to job posting
  - `notes` (text, optional) - Additional notes about the application
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  Row Level Security (RLS) is enabled on the jobs table with the following policies:
  
  1. **Public Read Access**: Anyone can view all jobs (for demo purposes)
  2. **Public Insert Access**: Anyone can create new job entries
  3. **Public Update Access**: Anyone can update existing jobs
  4. **Public Delete Access**: Anyone can delete jobs
  
  Note: These policies are permissive for demo purposes. In production with auth,
  these should be restricted to authenticated users accessing only their own data.

  ## Constraints
  
  - Status field is constrained to specific values: 'Applied', 'Interview', 'Offer', 'Rejected', 'Wishlist'
  - Company and position are required fields
  - Application date is required and defaults to current date
*/

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT gen_random_uuid(),
  company text NOT NULL,
  position text NOT NULL,
  status text NOT NULL DEFAULT 'Wishlist' CHECK (status IN ('Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected')),
  application_date date NOT NULL DEFAULT CURRENT_DATE,
  salary_range text,
  location text,
  job_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo mode)
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert jobs"
  ON jobs FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update jobs"
  ON jobs FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete jobs"
  ON jobs FOR DELETE
  TO public
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_application_date ON jobs(application_date DESC);