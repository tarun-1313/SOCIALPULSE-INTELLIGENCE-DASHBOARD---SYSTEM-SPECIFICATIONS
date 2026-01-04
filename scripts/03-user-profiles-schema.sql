-- Clean up existing table and functions
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP FUNCTION IF EXISTS is_admin();

-- Create user_profiles table for role-based access control
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin without recursion
-- SECURITY DEFINER bypasses RLS for the query inside the function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
-- Users can always view and update their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ALLOW users to insert their own profile during signup/first login
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles (uses the non-recursive helper function)
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin());

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Robust update for activity_logs to handle policy dependencies
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_logs') THEN
    -- 1. Drop the dependent policy first
    DROP POLICY IF EXISTS "Users can view their own activity logs" ON activity_logs;
    
    -- 2. Check and alter the column type
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'user_id') THEN
      IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'user_id') != 'uuid' THEN
        ALTER TABLE activity_logs ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
      END IF;
    ELSE
      ALTER TABLE activity_logs ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;

    -- 3. Re-create the policy
    CREATE POLICY "Users can view their own activity logs" ON activity_logs
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;