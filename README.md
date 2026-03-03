# Auth Basement

Reusable authentication template for React + TypeScript apps using **Supabase Auth**. Sign up, sign in, sign out, and password reset work out of the box with minimal Supabase setup.

## What this is

- **React 18** + **TypeScript** + **Vite**
- **Supabase** for auth (email/password; optional OAuth via dashboard)
- Auth context (`useAuth`), protected routes, and minimal default pages (Login, Sign up, Forgot password, Dashboard)
- One codebase: point it at any Supabase project via env vars and reuse per client

## Prerequisites

- **Node 18+**
- A **Supabase project** ([create one](https://supabase.com/dashboard))

## Quick start

1. **Clone or copy** this repo into your project.
2. **Create a Supabase project** (or use an existing one).
3. **Get credentials**: [Dashboard](https://supabase.com/dashboard) → your project → **Project Settings** → **API** → copy **Project URL** and **anon (public) key**.
4. **Env file**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `VITE_SUPABASE_URL` = your Project URL  
   - `VITE_SUPABASE_ANON_KEY` = your anon key  
5. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```
6. Open the app, go to **Sign up** / **Sign in** and verify auth works.

## Supabase setup (minimal)

- **Auth** is built-in; no database migrations are required for email/password.
- **Email** provider is enabled by default. Optionally enable Google, GitHub, etc. under **Authentication** → **Providers**.
- For **password reset**, configure a redirect URL in **Authentication** → **URL Configuration** (e.g. your app origin + `/login`) if needed.

## Optional: profiles table

If you want a `public.profiles` table (e.g. `display_name`, `avatar_url`) keyed by `auth.uid()`:

1. In the Supabase dashboard, open **SQL Editor**.
2. Run the migration: `supabase/migrations/00001_profiles.sql`.
3. Optionally add a trigger (see comments in that file) to create a profile row on signup.

Basic auth works without this.

## Using in another app

To reuse only the auth layer in an existing React app:

1. Copy these into your app:
   - `src/env.ts`
   - `src/lib/supabase.ts`
   - `src/contexts/AuthContext.tsx`
   - `src/components/ProtectedRoute.tsx`
   - `src/types/auth.ts`
2. Ensure your build resolves the `@/` alias (or update imports).
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your env.
4. Wrap your app in `<AuthProvider>` and use `useAuth()` and `<ProtectedRoute>` as needed.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## License

Use and adapt as needed for your projects.
