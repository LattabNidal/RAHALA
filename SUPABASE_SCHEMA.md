# 🇩🇿 RAHALA - Architecture de Base de Données Supabase (PostgreSQL)

Ce document fournit la structure complète et détaillée de la base de données relationnelle pour l'application **RAHALA** sur **Supabase** (PostgreSQL). Il inclut les requêtes SQL (DDL), les contraintes d'intégrité, les relations clés, ainsi que la configuration de la sécurité d'accès aux lignes (**Row Level Security - RLS**), essentielle sur Supabase.

---

## 🗺️ Diagramme Relationnel Global (Conceptuel)

```text
[auth.users] (Supabase Built-in Auth)
       │
       ▼ (1:1 via trigger)
   [profiles] ◄────────────────────────┐ (1:N)
       │ (1:N)                         │
       ├──► [bookings_hotels]          ├──► [ai_conversations] ──► [ai_messages]
       │                               │
       ├──► [bookings_flights]         ├──► [payments_transactions]
       │                               │
       ├──► [bookings_taxis]           └──► [user_favorites] (Heritage/Landmarks)
       │
       └─► [safety_reports] (Si signalements par l'utilisateur)
```

---

## 💾 Script DDL SQL Complet pour l'Éditeur Supabase

Copiez-collez ce script directement dans le **SQL Editor** de votre projet Supabase pour créer la structure complète :

```sql
-- ==========================================
-- 0. EXTENSIONS & TYPES ENUMÉRÉS
-- ==========================================
create extension if not exists "uuid-ossp";

create type user_role as enum ('user', 'admin');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type alert_severity as enum ('low', 'medium', 'high');
create type transaction_status as enum ('pending', 'succeeded', 'failed', 'refunded');

-- ==========================================
-- 1. TABLE : PROFILES (Profils Utilisateurs)
-- ==========================================
-- Se connecte à la table native d'authentification de Supabase (auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    fullName text not null,
    email text unique not null,
    avatarUrl text,
    role user_role not null default 'user',
    isPremium boolean not null default false,
    premiumUntil timestamp with time zone,
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
    updatedAt timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activation Row Level Security (RLS)
alter table public.profiles enable row level security;

-- ==========================================
-- 2. TABLE : HERITAGE_LANDMARKS (Sites Historiques & Patrimoine)
-- ==========================================
create table public.heritage_landmarks (
    id uuid default gen_random_uuid() primary key,
    name varchar(255) not null,
    description text not null,
    category varchar(100) not null, -- 'Roman', 'Islamic', 'Prehistoric', 'Nature', etc.
    region varchar(100) not null, -- 'Sahara', 'Casbah', 'Kabylie', etc.
    latitude double precision not null,
    longitude double precision not null,
    imageUrl text,
    audioUrl text, -- Guide audio pré-enregistré
    isGoldExclusive boolean not null default false, -- Réservé aux comptes GOLD VIP
    ratingsAverage numeric(3, 2) default 5.00,
    checkInCount integer default 0,
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.heritage_landmarks enable row level security;

-- ==========================================
-- 3. TABLE : FAVORITES (Couplage Voyageur & Sites d'Intérêt)
-- ==========================================
create table public.user_favorites (
    id uuid default gen_random_uuid() primary key,
    userId uuid references public.profiles(id) on delete cascade not null,
    landmarkId uuid references public.heritage_landmarks(id) on delete cascade not null,
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(userId, landmarkId)
);

alter table public.user_favorites enable row level security;

-- ==========================================
-- 4. TABLES DES MODULES DE RÉSERVATION (BOOKINGS)
-- ==========================================

-- A. RÉSERVATIONS D'HÔTELS
create table public.bookings_hotels (
    id uuid default gen_random_uuid() primary key,
    userId uuid references public.profiles(id) on delete cascade not null,
    hotelName varchar(255) not null,
    roomType varchar(150) not null,
    checkInDate date not null,
    checkOutDate date not null,
    totalPrice decimal(10, 2) not null check (totalPrice >= 0),
    guestsCount integer not null default 1 check (guestsCount > 0),
    status booking_status not null default 'pending',
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint check_dates check (checkOutDate > checkInDate)
);

alter table public.bookings_hotels enable row level security;

-- B. RÉSERVATIONS DE VOLS
create table public.bookings_flights (
    id uuid default gen_random_uuid() primary key,
    userId uuid references public.profiles(id) on delete cascade not null,
    flightNumber varchar(50) not null,
    airline varchar(100) not null default 'Air Algérie',
    passengerName varchar(255) not null,
    departureCity varchar(100) not null,
    arrivalCity varchar(100) not null,
    departureTime timestamp with time zone not null,
    seatNumber varchar(10),
    ticketClass varchar(50) not null default 'Economy', -- Economy, Business, Gold First
    price decimal(10, 2) not null check (price >= 0),
    status booking_status not null default 'pending',
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings_flights enable row level security;

-- C. DEMANDES DE TAXI / CHAUFFEUR DÉSERT-VILLE
create table public.bookings_taxis (
    id uuid default gen_random_uuid() primary key,
    userId uuid references public.profiles(id) on delete cascade not null,
    driverName varchar(150),
    driverPhone varchar(50),
    vehicleInfo varchar(150),
    pickupLocation varchar(255) not null,
    destination varchar(255) not null,
    estimatedPrice decimal(10, 2) not null check (estimatedPrice >= 0),
    pickupTime timestamp with time zone not null,
    status booking_status not null default 'pending',
    latitude double precision,
    longitude double precision,
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings_taxis enable row level security;

-- ==========================================
-- 5. MODULE : CONVERSATIONS COMPAGNON IA RAHALA
-- ==========================================
create table public.ai_conversations (
    id uuid default gen_random_uuid() primary key,
    userId uuid references public.profiles(id) on delete cascade not null,
    title text default 'Nouvelle exploration',
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_conversations enable row level security;

create table public.ai_messages (
    id uuid default gen_random_uuid() primary key,
    conversationId uuid references public.ai_conversations(id) on delete cascade not null,
    sender varchar(10) not null check (sender in ('user', 'ai')),
    messageText text not null,
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_messages enable row level security;

-- ==========================================
-- 6. SYSTEME DE SECURITE & ALERTES SÉCURISÉES (SAFE TRAVEL)
-- ==========================================
create table public.safety_reports (
    id uuid default gen_random_uuid() primary key,
    title varchar(255) not null,
    description text not null,
    severity alert_severity not null default 'low',
    locationName varchar(255) not null, -- ex: "Col de Chréa", "Tamgout"
    latitude double precision not null,
    longitude double precision not null,
    reportedBy uuid references public.profiles(id) on delete set null,
    status varchar(50) not null default 'active', -- active, verified, archive
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.safety_reports enable row level security;

-- ==========================================
-- 7. PAIEMENTS & SOUSCRIPTIONS DE LICENCE (SUBSCRIPTIONS)
-- ==========================================
create table public.payments_transactions (
    id uuid default gen_random_uuid() primary key,
    userId uuid references public.profiles(id) on delete cascade not null,
    amount decimal(10, 2) not null check (amount >= 0),
    currency varchar(10) not null default 'DZD', -- Dinars Algériens ou EUR
    paymentProvider varchar(100) not null, -- "CIB", "Chargily", "Stripe"
    providerTransactionId varchar(255),
    planName varchar(100) not null, -- "GOLD VIP Exploration", "Premium Standard"
    status transaction_status not null default 'pending',
    createdAt timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments_transactions enable row level security;
```

---

## ⚡ Automatisation : Création automatique du profil (Trigger Supabase)

Pour vous assurer que **chaque compte créé** via le module d'inscription de Supabase reçoive automatiquement une ligne correspondante dans la table publique `public.profiles`, exécutez ce trigger PostgreSQL :

```sql
-- Fonction qui s'exécute lors d'une inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, fullName, email, avatarUrl, role, isPremium)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'fullName', 'Voyageur Rahala'),
    new.email,
    new.raw_user_meta_data->>'avatarUrl',
    'user',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Association à la table des inscriptions
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🔒 Règles de Sécurité Supabase (Row Level Security - RLS)

Les règles RLS garantissent qu'un voyageur ne puisse jamais accéder aux données d'un autre voyageur, tout en permettant aux administrateurs de tout contrôler.

### 👥 Profils (Chacun gère son profil)
```sql
-- Permettre la lecture publique de certains éléments (ex: nom pour l'avatar etc)
create policy "Les profils sont visibles par tous"
on public.profiles for select
using (true);

-- Permettre la modification de son propre profil uniquement
create policy "Les utilisateurs modifient uniquement leur profil"
on public.profiles for update
using (auth.uid() = id);
```

### 🏖️ Réservations (Strictement Privé)
Chaque utilisateur ne voit et ne modifie que ses propres réservations d'hôtels, de vols ou de taxis.
```sql
create policy "Voyageurs accèdent à leurs réservations d'hôtels"
on public.bookings_hotels for all
using (auth.uid() = userId);

create policy "Voyageurs accèdent à leurs réservations de vols"
on public.bookings_flights for all
using (auth.uid() = userId);

create policy "Voyageurs accèdent à leurs réservations de taxis"
on public.bookings_taxis for all
using (auth.uid() = userId);
```

### 🕌 Patrimoine & Sites Historiques (Tout le monde accède en lecture, Admin écrit)
```sql
create policy "Sites visibles par tout le monde"
on public.heritage_landmarks for select
using (true);

create policy "Seuls les administrateurs éditent les sites"
on public.heritage_landmarks for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
```

---

## 🛠️ Intégration Recommandée dans votre Front-end (React SDK)

Dans votre projet React, installez le client Supabase :
```bash
npm install @supabase/supabase-js
```

Puis configurez l'instance :
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Exemple de Requête : Récupérer les réservations d'hôtels de l'utilisateur connecté

```typescript
export async function getUserHotels() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookings_hotels')
    .select('*')
    .order('checkInDate', { ascending: true });

  if (error) {
    console.error("Erreur de récupération :", error);
    return [];
  }
  return data;
}
```
