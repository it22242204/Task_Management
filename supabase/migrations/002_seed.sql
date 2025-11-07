-- Seed sample tasks (replace <USER_UUID> with a real user id if desired)
-- NOTE: this file is optional. To insert seeds, replace <USER_UUID> and run in SQL editor.

insert into public.tasks (user_id, title, completed)
values
  ('00000000-0000-0000-0000-000000000000', 'Welcome to your task list — replace this seed with a real user id', false);

-- To seed real demo data, sign up a test user in Supabase Auth, copy their user id, and replace the GUID above.
