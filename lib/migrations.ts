-- Run these in your Supabase SQL editor before using the admin panel

-- 1. app_config table (feature flags + announcements)
create table if not exists app_config (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Seed defaults
insert into app_config (key, value) values
  ('feature_flags', '{"journal":true,"mileage":true,"invoices":true,"appointments":true,"aiIdScanner":false,"smsInvoices":false,"taxExport":true,"offlineMode":false,"googleOAuth":true,"maintenanceMode":false}'),
  ('announcement',  '{"active":false,"message":"","type":"info"}')
on conflict (key) do nothing;

-- 2. support_tickets table
create table if not exists support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  subject     text not null,
  message     text not null,
  status      text default 'open' check (status in ('open','resolved')),
  reply       text,
  replied_at  timestamptz,
  created_at  timestamptz default now()
);

-- Mobile app uses this to submit a ticket:
-- POST /api/v1/support  { subject, message }  → inserts into support_tickets

-- RLS: users can only see their own tickets
alter table support_tickets enable row level security;
create policy "Users see own tickets" on support_tickets for select using (auth.uid() = user_id);
create policy "Users create tickets"  on support_tickets for insert with check (auth.uid() = user_id);