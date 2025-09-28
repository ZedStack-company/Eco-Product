-- Orders schema for Stripe integration
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending',
  customer_name text,
  customer_email text,
  currency text,
  subtotal numeric,
  total numeric,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  metadata jsonb
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_amount numeric not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- Row Level Security
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Anonymous can insert pending orders via edge function with service role; clients read only their orders
create policy "select_own_orders" on public.orders
  for select
  using (
    auth.email() is not null and customer_email = auth.email()
  );

create policy "select_items_via_order" on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders o where o.id = order_items.order_id and (
        auth.email() is not null and o.customer_email = auth.email()
      )
    )
  );

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_timestamp_orders on public.orders;
create trigger set_timestamp_orders
before update on public.orders
for each row execute function public.set_updated_at();
