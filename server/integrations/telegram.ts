import type { Client } from "pg";

export type TelegramPostInput = {
  messageId: number;
  chatId?: string | null;
  text: string;
  publishedAt: string;
  telegramUrl: string;
  photoFileId?: string | null;
};

export async function upsertTelegramPost(client: Client, post: TelegramPostInput) {
  await client.query(
    `
      INSERT INTO telegram_posts
        (message_id, chat_id, text, published_at, telegram_url, photo_file_id, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (message_id) DO UPDATE SET
        chat_id = EXCLUDED.chat_id,
        text = EXCLUDED.text,
        published_at = EXCLUDED.published_at,
        telegram_url = EXCLUDED.telegram_url,
        photo_file_id = EXCLUDED.photo_file_id,
        updated_at = NOW()
    `,
    [post.messageId, post.chatId ?? null, post.text, post.publishedAt, post.telegramUrl, post.photoFileId ?? null],
  );
}
