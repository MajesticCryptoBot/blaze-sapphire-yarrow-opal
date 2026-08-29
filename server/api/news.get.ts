import { getSql } from "../../src/lib/db";

const CHANNEL = (process.env.TELEGRAM_CHANNEL_USERNAME ?? "AlphaSignalsPro").replace(/^@/, "").toLowerCase();
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export default async function handler() {
  const sql = await getSql();
  const cutoff = new Date(Date.now() - MAX_AGE_MS).toISOString();

  const rows = await sql.query<{
    message_id: number | string;
    chat_username: string | null;
    chat_title: string | null;
    text: string;
    published_at: string;
    photo_file_id: string | null;
    message_url: string | null;
  }>(
    `select message_id, chat_username, chat_title, text, published_at, photo_file_id, message_url
       from telegram_posts
      where published_at >= $1
        and (lower(coalesce(chat_username, '')) = $2 or lower(coalesce(chat_username, '')) = ('@' || $2))
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
      photoFileId: row.photo_file_id,
      messageUrl: row.message_url,
    })),
    fetchedAt: new Date().toISOString(),
  });
}
