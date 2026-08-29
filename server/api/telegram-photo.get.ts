import { getSql } from "../../src/lib/db";

export default async function handler(event: { url: URL }) {
  const messageId = Number(event.url.searchParams.get("id"));
  if (!Number.isSafeInteger(messageId) || messageId <= 0) {
    return new Response("Missing or invalid id", { status: 400 });
  }

  const sql = await getSql();
  const rows = await sql.query<{ photo_data: Buffer | Uint8Array | null; photo_mime_type: string | null }>(
    `select photo_data, photo_mime_type
       from telegram_posts
      where message_id = $1
        and lower(replace(coalesce(chat_username, ''), '@', '')) = 'alphasignalspro'
      order by published_at desc
      limit 1`,
    [messageId],
  );

  const row = rows[0];
  if (!row?.photo_data) return new Response("Photo not found", { status: 404 });

  const body = row.photo_data instanceof Uint8Array ? row.photo_data : new Uint8Array(row.photo_data);
  const headers = new Headers();
  headers.set("Content-Type", row.photo_mime_type ?? "image/jpeg");
  headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  return new Response(body, { status: 200, headers });
}
