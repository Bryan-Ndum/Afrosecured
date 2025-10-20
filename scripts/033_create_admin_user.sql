-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Note: After running this script, you need to:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" and create a user with:
--    Email: afrosecured@gmail.com
--    Password: (choose a strong password)
-- 4. Copy the user's UUID
-- 5. Run this query in the SQL Editor:
--    INSERT INTO user_profiles (id, email, role)
--    VALUES ('YOUR_USER_UUID_HERE', 'afrosecured@gmail.com', 'admin');
