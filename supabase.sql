-- Run once in the Supabase SQL editor
create table categories(id uuid primary key default gen_random_uuid(),name text not null,cover_url text,sort int default 0);
create table subcategories(id uuid primary key default gen_random_uuid(),category_id uuid references categories(id) on delete cascade,name text not null);
create table products(id uuid primary key default gen_random_uuid(),category_id uuid references categories(id) on delete set null,subcategory_id uuid references subcategories(id) on delete set null,name text not null,fabric text,sizes text[] default '{}',colours text[] default '{}',price numeric,description text,in_stock boolean default true,featured boolean default false,is_new boolean default false,images text[] default '{}',created_at timestamptz default now());
create table gallery(id uuid primary key default gen_random_uuid(),url text not null,created_at timestamptz default now());
create table settings(key text primary key,value text);
create table messages(id uuid primary key default gen_random_uuid(),name text not null,phone text not null,message text not null,is_read boolean default false,created_at timestamptz default now());
create table prebookings(id uuid primary key default gen_random_uuid(),product_id uuid references products(id) on delete set null,product_name text,product_image_url text,custom_category text,budget text,name text not null,phone text not null,email text,city text,size text,colour text,quantity int default 1,preferred_date date,message text,reference_image_urls text[] default '{}',status text default 'new' check(status in('new','contacted','confirmed','cancelled')),created_at timestamptz default now());
create table wishlists(device_id text not null,product_id uuid references products(id) on delete cascade,primary key(device_id,product_id));
create table admins(user_id uuid primary key references auth.users(id) on delete cascade);
create function is_admin() returns boolean language sql security definer stable as $$select exists(select 1 from admins where user_id=auth.uid())$$;
do $$ declare t text; begin foreach t in array array['categories','subcategories','products','gallery','settings'] loop
execute format('alter table %I enable row level security',t);
execute format('create policy "read %1$s" on %1$I for select using(true)',t);
execute format('create policy "admin %1$s" on %1$I for all using(is_admin()) with check(is_admin())',t); end loop; end $$;
alter table messages enable row level security;alter table prebookings enable row level security;alter table wishlists enable row level security;alter table admins enable row level security;
create policy "send message" on messages for insert with check(true);create policy "admin messages" on messages for all using(is_admin()) with check(is_admin());
create policy "send prebook" on prebookings for insert with check(true);create policy "admin prebook" on prebookings for all using(is_admin()) with check(is_admin());
create policy "wish all" on wishlists for all using(true) with check(true);
create policy "self admin" on admins for select using(user_id=auth.uid());
insert into storage.buckets(id,name,public) values('shop-images','shop-images',true),('prebook-refs','prebook-refs',true) on conflict do nothing;
create policy "img read" on storage.objects for select using(bucket_id in('shop-images','prebook-refs'));
create policy "shop admin" on storage.objects for all using(bucket_id='shop-images' and is_admin()) with check(bucket_id='shop-images' and is_admin());
create policy "ref upload" on storage.objects for insert with check(bucket_id='prebook-refs');
create policy "ref admin delete" on storage.objects for delete using(bucket_id='prebook-refs' and is_admin());
insert into categories(name,sort) values('Kids',1),('Boys',2),('Men',3),('Girls',4);
insert into subcategories(category_id,name) select c.id,s from categories c,unnest(array['T-shirts','Shirts','Jeans & Pants','Ethnic wear','Festive wear','School wear','Nightwear']) s;
insert into settings values('owner_name','Gundre Kishore Kumar Reddy'),('years','12+'),('story','Shanmukha Readymades has dressed families in Rayachoty for over a decade, from school uniforms to wedding-day outfits.'),('banner_on','true'),('banner_text','Festival offers on now! Pre-book your outfit today.');
-- After creating your admin user in Authentication > Users, run:
-- insert into admins(user_id) select id from auth.users where email='YOUR_EMAIL';
