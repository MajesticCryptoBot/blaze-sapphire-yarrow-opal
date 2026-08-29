export default async function handler(event: { url: URL }) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return new Response("Telegram bot is not configured", { status: 503 });

  const fileId = event.url.searchParams.get("file_id");
  if (!fileId) return new Response("Missing file_id", { status: 400 });

  const response = await fetch(
    `https://api.telegram.org/bot${encodeURIComponent(token)}/getFile?file_id=${encodeURIComponent(fileId)}`,
  );
  if (!response.ok) return new Response("Telegram file lookup failed", { status: 502 });

  const payload = (await response.json()) as {
    ok?: boolean;
    result?: { file_path?: string };
  };
  if (!payload.ok || !payload.result?.file_path) {
    return new Response("Telegram file is unavailable", { status: 404 });
  }

  const media = await fetch(`https://api.telegram.org/file/bot${token}/${payload.result.file_path}`);
  if (!media.ok || !media.body) return new Response("Telegram media fetch failed", { status: 502 });

  const headers = new Headers();
  headers.set("Content-Type", media.headers.get("content-type") ?? "image/jpeg");
  headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return new Response(media.body, { status: 200, headers });
}
