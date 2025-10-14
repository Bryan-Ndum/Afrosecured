# Admin Access Guide

## Overview

The AfroSecured admin dashboard is protected by Supabase authentication with role-based access control. Only users with the `admin` role can access the `/admin` route.

## Default Admin Account

A default admin account has been created for immediate access:

**Email:** bryanndum12@gmail.com  
**Password:** Pembroke$12

To activate this account, run the setup script:

\`\`\`bash
# Run in Supabase SQL Editor
scripts/008_create_default_admin.sql
\`\`\`

After running the script, you can immediately log in at `/auth/login` and access the admin dashboard at `/admin`.

**Security Note:** Change this password after first login for production use.

## Setup Instructions

### 1. Run the Database Migration

Execute the SQL script to create the user profiles table:

\`\`\`bash
# Run in Supabase SQL Editor or via CLI
scripts/007_create_user_profiles_table.sql
\`\`\`

This creates:
- `user_profiles` table with role-based access
- Automatic profile creation on user signup
- Row Level Security policies
- Trigger to sync with auth.users

### 2. Create Your Admin Account

1. **Sign up for an account** at `/auth/login` (first-time users will need to create an account)
2. **Verify your email** (check spam folder if needed)
3. **Promote yourself to admin** by running this SQL in Supabase:

\`\`\`sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
\`\`\`

### 3. Access the Admin Dashboard

- Navigate to `/admin` in your browser
- You'll be redirected to `/auth/login` if not authenticated
- After login, you'll be redirected back to `/admin`
- Non-admin users will be redirected to the homepage

## Features

The admin dashboard provides:

- **Article Statistics**: Total articles, recent additions, articles by source
- **System Health**: Database status, API status, error monitoring
- **Manual Updates**: Trigger article updates on-demand
- **Real-time Monitoring**: Auto-refresh every 60 seconds

## Security

- **Middleware Protection**: Routes are protected at the middleware level
- **Role Verification**: User role is checked on every request
- **Row Level Security**: Database queries respect RLS policies
- **Session Management**: Supabase handles secure session cookies

## Troubleshooting

### "Unauthorized" Error
- Ensure you've run the migration script
- Verify your email is set to `admin` role in the database
- Clear browser cookies and log in again

### Can't Access Admin Dashboard
- Check that middleware.ts is properly configured
- Verify Supabase environment variables are set
- Ensure you're logged in with an admin account

### Profile Not Created
- The trigger should auto-create profiles on signup
- If missing, manually insert: `INSERT INTO user_profiles (id, email, role) VALUES ('user-uuid', 'email', 'user');`

## Direct Access

Admin users can bookmark `/admin` for quick access. The route is hidden from public navigation but accessible via direct URL for authenticated admins.
