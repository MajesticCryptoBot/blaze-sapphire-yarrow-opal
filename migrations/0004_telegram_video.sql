-- Local PGlite parity: video columns the Turso bootstrap adds in code
-- (src/lib/db.ts) but that were missing from the PGlite migration set.
alter table telegram_posts add column if not exists video_data bytea;
alter table telegram_posts add column if not exists video_mime_type text;
alter table telegram_posts add column if not exists video_url text;
