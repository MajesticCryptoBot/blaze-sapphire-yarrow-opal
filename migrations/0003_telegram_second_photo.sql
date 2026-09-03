alter table telegram_posts add column if not exists photo_data_2 bytea;
alter table telegram_posts add column if not exists photo_mime_type_2 text;
