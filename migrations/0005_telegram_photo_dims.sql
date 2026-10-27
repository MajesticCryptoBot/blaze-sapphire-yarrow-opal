-- Photo intrinsic dimensions for the homepage "check-size-fit" gate.
-- Populated at ingest time for new photos and one-time backfilled from the
-- stored blobs for existing ones (src/lib/telegram-feed.ts).
alter table telegram_posts add column if not exists photo_w int;
alter table telegram_posts add column if not exists photo_h int;
alter table telegram_posts add column if not exists photo2_w int;
alter table telegram_posts add column if not exists photo2_h int;
