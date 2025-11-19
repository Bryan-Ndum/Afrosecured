-- Create admin user with specific credentials
-- Email: afrosecured@gmail.com
-- Password: Pembroke$23

-- First, check if user already exists and delete if found
DELETE FROM auth.users WHERE email = 'afrosecured@gmail.com';
DELETE FROM admin_users WHERE email = 'afrosecured@gmail.com';

-- Insert into auth.users with hashed password
-- Note: This is a Supabase-specific bcrypt hash for "Pembroke$23"
-- Generated using: SELECT crypt('Pembroke$23', gen_salt('bf'));
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'afrosecured@gmail.com',
  crypt('Pembroke$23', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"AfroSecured Admin"}',
  false,
  'authenticated'
) RETURNING id;

-- Get the user ID and insert into admin_users
INSERT INTO admin_users (user_id, email, role, created_at)
SELECT id, 'afrosecured@gmail.com', 'admin', NOW()
FROM auth.users
WHERE email = 'afrosecured@gmail.com';

-- Verify the admin user was created
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  a.role
FROM auth.users u
LEFT JOIN admin_users a ON u.id = a.user_id
WHERE u.email = 'afrosecured@gmail.com';
