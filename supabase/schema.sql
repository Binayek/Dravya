-- Run in Supabase SQL editor
create table profiles(id uuid primary key references auth.users on delete cascade, full_name text, role text not null default 'employee' check(role in('admin','employee')));
create table clients(id uuid primary key default gen_random_uuid(), full_name text not null, phone text, email text,
 district text, municipality text, ward text, tole text, marga text, latitude double precision, longitude double precision,
 priority text not null default 'medium' check(priority in('high','medium','low')), photo_path text, docs jsonb not null default '{}',
 created_by uuid references auth.users default auth.uid(), created_at timestamptz default now());
create function is_staff() returns boolean language sql security definer stable as $$ select exists(select 1 from profiles where id=auth.uid()) $$;
create function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
alter table profiles enable row level security; alter table clients enable row level security;
create policy "staff read profiles" on profiles for select using(is_staff());
create policy "admin manage profiles" on profiles for all using(is_admin()) with check(is_admin());
create policy "staff read clients" on clients for select using(is_staff());
create policy "staff add clients" on clients for insert with check(is_staff());
create policy "staff edit clients" on clients for update using(is_staff());
create policy "admin delete clients" on clients for delete using(is_admin());
insert into storage.buckets(id,name,public) values('client-docs','client-docs',false);
create policy "staff read files" on storage.objects for select using(bucket_id='client-docs' and is_staff());
create policy "staff upload files" on storage.objects for insert with check(bucket_id='client-docs' and is_staff());
create policy "staff replace files" on storage.objects for update using(bucket_id='client-docs' and is_staff());
create policy "admin delete files" on storage.objects for delete using(bucket_id='client-docs' and is_admin());
