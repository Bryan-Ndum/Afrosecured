-- Create default admin user for AfroSecured
-- Email: bryanndum12@gmail.com
-- Password: Pembroke$12

-- Note: This script creates a user directly in Supabase Auth
-- The password will be hashed using Supabase's built-in functions

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Insert user into auth.users table
  -- Using crypt extension to hash the password
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'bryanndum12@gmail.com',
    crypt('Pembroke$12', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Insert corresponding user profile with admin role
  INSERT INTO user_profiles (
    id,
    email,
    role,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'bryanndum12@gmail.com',
    'admin',
    NOW(),
    NOW()
  );

  -- Create identity record for email authentication
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    format('{"sub":"%s","email":"%s"}', new_user_id::text, 'bryanndum12@gmail.com')::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Admin user created successfully with ID: %', new_user_id;
END $$;
