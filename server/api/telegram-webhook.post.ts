import { getSql } from "../../src/lib/db";

function normalizeUsername(value: string | undefined | null) {
  return (value ?? "").replace(/^@/, "").toLowerCase();
}

export default async function handler(event: {
  req: { headers: Headers; json: () => Promise<unknown> };
}) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!expectedSecret) {
    return Response.json({ error: "TELEGRAM_WEBHOOK_SECRET is not configured" }, { status: 503 });
  }

  const suppliedSecret = event.req.headers.get("x-telegram-bot-api-secret-token");
  if (suppliedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = (await event.req.json()) as {
    channel_post?: TelegramMessage;
    edited_channel_post?: TelegramMessage;
  };
  const message = update.channel_post ?? update.edited_channel_post;
  if (!message) return Response.json({ ok: true, ignored: true });

  const configuredChannel = normalizeUsername(process.env.TELEGRAM_CHANNEL_USERNAME ?? "AlphaSignalsPro");
  const receivedChannel = normalizeUsername(message.chat?.username);
  if (configuredChannel && receivedChannel !== configuredChannel) {
    return Response.json({ ok: true, ignored: true });
  }

  const text = message.text ?? message.caption ?? "";
  const photoFileId = message.photo?.at(-1)?.file_id ?? null;
  const chatId = String(message.chat.id);
  const username = message.chat.username ?? null;
  const messageUrl = username
    ? `https://t.me/${username.replace(/^@/, "")}/${message.message_id}`
    : null;
  const publishedAt = new Date((message.date || Math.floor(Date.now() / 1000)) * 1000).toISOString();

  const sql = await getSql();
  await sql.query(
    `insert into telegram_posts
      (chat_id, message_id, chat_username, chat_title, text, published_at, photo_file_id, message_url, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, now())
     on conflict (chat_id, message_id) do update set
       chat_username = excluded.chat_username,
       chat_title = excluded.chat_title,
       text = excluded.text,
       published_at = excluded.published_at,
       photo_file_id = excluded.photo_file_id,
       message_url = excluded.message_url,
       updated_at = now()`,
    [
      chatId,
      message.message_id,
      username,
      message.chat.title ?? null,
      text,
      publishedAt,
      photoFileId,
      messageUrl,
    ],
  );

  await sql.query("delete from telegram_posts where published_at < now() - interval '48 hours'");
  return Response.json({ ok: true });
}

type TelegramMessage = {
  message_id: number;
  date: number;
  text?: string;
  caption?: string;
  photo?: Array<{ file_id: string; width: number; height: number }>;
  chat: {
    id: number | string;
    username?: string;
    title?: string;
  };
};
