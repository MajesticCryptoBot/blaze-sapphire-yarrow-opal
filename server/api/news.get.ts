import { listTelegramPosts } from "../../src/lib/telegram-feed";

export default async function handler() {
  const posts = await listTelegramPosts(100);
  return Response.json({
    channel: "alphasignalspro",
    posts,
    fetchedAt: new Date().toISOString(),
  });
}
