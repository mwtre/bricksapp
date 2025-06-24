# Supabase Setup Guide for BricksApp

This guide will help you set up Supabase as your database backend for BricksApp.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `bricksapp`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. Create a `.env` file in your project root:
```bash
cp env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-setup.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and sample data

### 5. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Try logging in with the demo accounts:
   - **Email**: `lars@bricksapp.dk` / **Password**: `password123`
   - **Email**: `mette@bricksapp.dk` / **Password**: `password123`
   - **Email**: `anne@bricksapp.dk` / **Password**: `password123`

## 🔧 Database Schema

The setup creates the following tables:

### Users Table
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: Full name
- `role`: User role (bricklayer, project_manager, recruiter)
- `phone`: Phone number
- `avatar`: Profile picture URL
- `is_active`: Account status
- `created_at`: Account creation date
- `last_login`: Last login timestamp
- `preferences`: User preferences (JSON)

### Projects Table
- `id`: Unique identifier
- `name`: Project name
- `address`: Project location
- `description`: Project description
- `brick_count_required`: Total bricks needed
- `brick_count_used`: Bricks used so far
- `start_date`: Project start date
- `end_date`: Project end date
- `status`: Project status (planning, active, delayed, completed)
- `manager_id`: Project manager reference
- `brick_type`: Type of bricks used
- `bricks_per_sqm`: Bricks per square meter
- `cost_per_brick`: Cost per brick
- `expected_cost`: Total expected cost
- `expected_revenue`: Expected revenue
- `roadmap`: Project phases (JSON)
- `materials`: Project materials (JSON)

### Applications Table
- `id`: Unique identifier
- `name`: Applicant name
- `email`: Applicant email
- `phone`: Applicant phone
- `experience`: Years of experience
- `certifications`: Certifications held
- `message`: Application message
- `cv_url`: CV file URL
- `status`: Application status (pending, reviewed, approved, rejected)
- `submitted_date`: Application submission date

## 🔐 Row Level Security (RLS)

The setup includes RLS policies for data security:

- **Users**: Can view all users, update their own profile
- **Projects**: Project managers can create/update/delete their projects
- **Applications**: Recruiters can view and update applications
- **Public**: Anyone can create job applications

## 🌐 Real-time Features

Supabase provides real-time updates for:
- Project changes
- User updates
- Application status changes
- Team assignments

## 🚀 Deployment

### For Production

1. **Update Environment Variables**:
   - Use production Supabase project
   - Set up proper domain restrictions

2. **Enable Email Auth** (optional):
   - Go to **Authentication** → **Settings**
   - Configure email templates
   - Set up email provider

3. **Set Up Google OAuth** (optional):
   - Go to **Authentication** → **Providers**
   - Enable Google provider
   - Add your Google Client ID

### For GitHub Pages

1. Add environment variables to your deployment:
   - Go to your GitHub repository
   - **Settings** → **Secrets and variables** → **Actions**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. Update your deployment workflow to include environment variables

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Check your `.env` file
   - Verify the anon key is correct
   - Make sure the key starts with `eyJ`

2. **"Table doesn't exist" error**:
   - Run the SQL setup script again
   - Check if tables were created in Supabase dashboard

3. **Authentication not working**:
   - Verify RLS policies are enabled
   - Check if user exists in the database
   - Ensure email/password match

4. **Real-time not working**:
   - Check if you're subscribed to the correct channels
   - Verify RLS policies allow the operation

### Getting Help

- Check [Supabase Documentation](https://supabase.com/docs)
- Join [Supabase Discord](https://discord.supabase.com)
- Review the [React + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

## 📈 Next Steps

1. **Customize the schema** for your specific needs
2. **Add more tables** for additional features
3. **Set up email notifications** for important events
4. **Implement file uploads** for CVs and project documents
5. **Add analytics** and reporting features

## 🎉 You're Ready!

Your BricksApp now has a powerful, scalable database backend with:
- ✅ Real-time updates
- ✅ User authentication
- ✅ Row-level security
- ✅ Automatic backups
- ✅ API access
- ✅ Dashboard analytics

Happy building! 🧱
