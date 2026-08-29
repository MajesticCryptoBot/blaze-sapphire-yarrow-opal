create table if not exists telegram_posts (
  id bigserial primary key,
  chat_id text not null,
  message_id bigint not null,
  chat_username text,
  chat_title text,
  text text not null default '',
  published_at timestamptz not null,
  photo_file_id text,
  photo_data bytea,
  photo_mime_type text,
  message_url text,
  updated_at timestamptz not null default now(),
  unique (chat_id, message_id)
);

alter table telegram_posts add column if not exists photo_data bytea;
alter table telegram_posts add column if not exists photo_mime_type text;

create index if not exists telegram_posts_published_at_idx
  on telegram_posts (published_at desc);

create index if not exists telegram_posts_chat_id_idx
  on telegram_posts (chat_id);
