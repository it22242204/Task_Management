# Task Management (Next.js + Supabase)

This is a small Task Management app built with Next.js (App Router), TypeScript, Tailwind CSS and Supabase (Auth + Postgres).

Features
- Email/password sign up & sign in (Supabase Auth)
- Create, list, toggle complete, and delete tasks
- Row-level security ensures users only access their own tasks

Quick setup
1. Create a Supabase project and copy the API keys.
2. Set environment variables in Vercel or locally (.env.local):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run migrations:

Install the Supabase CLI and run:

```bash
supabase db push --file supabase/migrations/001_init.sql
```

4. Install and run locally:

```powershell
npm install
npm run dev
```

Pages
- `/login` - sign up / sign in
- `/tasks` - task list and create/delete/toggle

Notes
- This code uses the public (anon) Supabase key in the browser. Do NOT include service_role keys in the client.
- The migration file is in `supabase/migrations/001_init.sql` and enables RLS policies.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deploy steps (recommended)

1. Create a GitHub repository and push this project to it. Example:

```powershell
git init
git add .
git commit -m "Initial commit: task management app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

2. In Vercel, import the GitHub repository and follow the prompts to deploy.

3. In the Vercel project settings > Environment Variables, add:

 - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL (e.g. https://xxxxx.supabase.co)
 - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your public anon key

4. Deploy. Vercel will build the project and publish the site.

### Submission checklist

- Live demo URL from Vercel
- GitHub repository URL containing the source code
- `supabase/migrations/001_init.sql` and `supabase/migrations/002_seed.sql` included (they are in the `supabase/migrations` directory)
- Short note describing approach (this README can be used)

If you'd like, I can prepare a minimal PR-ready branch and a suggested commit message with this work.
