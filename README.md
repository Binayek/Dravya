# Dravya Studio System
1. Create a Supabase project; run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the keys (Settings → API).
3. `npm install && npm run seed` (creates admin db@gmail.com — change the password after first login).
4. `npm run dev`. To deploy: import the repo in Vercel and add the same env vars (skip the service-role key).
In Supabase → Authentication → Providers, keep email on and disable public sign-ups.
