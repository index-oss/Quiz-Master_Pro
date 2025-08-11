-- Supabase schema for QuizVerse
create extension if not exists "pgcrypto";

-- profiles (optional)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text,
  username text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  host_id uuid references profiles(id) on delete set null,
  topic text,
  difficulty text,
  status text default 'waiting',
  created_at timestamptz default now()
);

create table if not exists room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  username text,
  avatar_url text,
  score int default 0,
  is_host boolean default false,
  joined_at timestamptz default now()
);

create table if not exists game_state (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  question_index int default 0,
  question_text text,
  options jsonb,
  correct_option int,
  time_left int,
  phase text default 'waiting',
  updated_at timestamptz default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  question_index int,
  selected_option int,
  is_correct boolean,
  answered_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic text,
  difficulty text,
  question_text text,
  options jsonb,
  correct_option int,
  created_at timestamptz default now()
);

-- sample seed questions
insert into questions (topic, difficulty, question_text, options, correct_option)
values
('Grammar','Easy','Choose the correct form: He ____ to school every day.'::text, '["go","goes","gone","going"]'::jsonb, 1),
('Spelling','Easy','Which is the correct spelling?','["accomodate","accommodate","acommodate","accomadate"]'::jsonb, 1)
on conflict do nothing;

-- Indexes
create index if not exists idx_room_players_room_id on room_players (room_id);
create index if not exists idx_game_state_room_id on game_state (room_id);

-- Optional: simple RPC to increment score (create this in supabase SQL editor)
create or replace function increment_score(p_room_id uuid, p_user_id uuid, p_inc int)
returns void as $$
begin
  update room_players set score = score + p_inc where room_id = p_room_id and user_id = p_user_id;
end;
$$ language plpgsql;
