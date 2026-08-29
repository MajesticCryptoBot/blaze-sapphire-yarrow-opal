import { getSql } from "../../src/lib/db";

const CHANNEL = "alphasignalspro";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export default async function handler() {
  const sql = await getSql();
  const cutoff = new Date(Date.now() - MAX_AGE_MS).toISOString();

  const rows = await sql.query<{
    message_id: number | string;
    text: string;
    published_at: string;
    photo_data: Buffer | Uint8Array | null;
    message_url: string | null;
  }>(
    `select message_id, text, published_at, photo_data, message_url
       from telegram_posts
      where published_at >= $1
        and lower(replace(coalesce(chat_username, ''), '@', '')) = $2
      order by published_at desc
      limit 100`,
    [cutoff, CHANNEL],
  );

  return Response.json({
    channel: CHANNEL,
    posts: rows.map((row) => ({
      id: Number(row.message_id),
      text: row.text,
      publishedAt: row.published_at,
      hasPhoto: Boolean(row.photo_data),
      messageUrl: row.message_url,
    })),
    fetchedAt: new Date().toISOString(),
  });
}
