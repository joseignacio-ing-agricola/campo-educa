-- CampoEduca / módulo de anuncios. REVISAR ANTES DE APLICAR.
-- No modifica tablas académicas ni cuentas existentes.
create extension if not exists pgcrypto;

create table if not exists public.ads_plans (
  slug text primary key check (slug in ('basico','profesional','premium')),
  title text not null,
  price_30d_clp integer not null check (price_30d_clp between 0 and 10000000),
  placements_limit smallint not null check (placements_limit between 1 and 10),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.ads_plans(slug,title,price_30d_clp,placements_limit)
values ('basico','Básico',19990,1),('profesional','Profesional',39990,2),('premium','Premium',79990,3)
on conflict (slug) do nothing;

create table if not exists public.ads_requests (
  id uuid primary key default gen_random_uuid(),
  company text not null check (length(company) between 2 and 100),
  contact_name text not null check (length(contact_name) between 2 and 100),
  email text not null check (length(email) between 5 and 180),
  phone text,
  plan_slug text not null references public.ads_plans(slug),
  duration_days integer not null check (duration_days in (7,15,30,90)),
  placement text not null check (placement in ('superior','lateral','contenido','articulo','directorio','curso')),
  destination_url text not null check (length(destination_url) between 10 and 500),
  message text check (length(message) <= 1500),
  creative_path text,
  quoted_price_clp integer not null check (quoted_price_clp >= 0),
  status text not null default 'pendiente' check (status in ('pendiente','aprobada','rechazada','pagada','cancelada')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_notes text
);
create index if not exists ads_requests_status_date_idx on public.ads_requests(status,created_at desc);

create table if not exists public.ads_campaigns (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.ads_requests(id),
  title text not null,
  placement text not null check (placement in ('superior','lateral','contenido','articulo','directorio','curso')),
  destination_url text not null,
  creative_path text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'borrador' check (status in ('borrador','activa','pausada','finalizada')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists ads_campaigns_active_idx on public.ads_campaigns(status,starts_at,ends_at);

create table if not exists public.ads_events (
  id bigint generated always as identity primary key,
  campaign_id uuid not null references public.ads_campaigns(id) on delete cascade,
  event_type text not null check (event_type in ('impresion','clic')),
  created_at timestamptz not null default now()
);
create index if not exists ads_events_campaign_date_idx on public.ads_events(campaign_id,created_at desc);

-- Denegar acceso de clientes; solo Cloudflare Pages Functions con clave secreta del servidor.
alter table public.ads_plans enable row level security;
alter table public.ads_requests enable row level security;
alter table public.ads_campaigns enable row level security;
alter table public.ads_events enable row level security;
revoke all on public.ads_plans,public.ads_requests,public.ads_campaigns,public.ads_events from anon,authenticated;
revoke all on sequence public.ads_events_id_seq from anon,authenticated;
grant select,insert,update,delete on public.ads_plans,public.ads_requests,public.ads_campaigns,public.ads_events to service_role;
grant usage,select on sequence public.ads_events_id_seq to service_role;

-- Creatividades comerciales. Publicar solo anuncios aprobados en la web.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('ads-creatives','ads-creatives',true,2097152,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- No se crean políticas de escritura para anon/authenticated; solo servidor con service_role.
