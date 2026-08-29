import { createHash, timingSafeEqual } from "node:crypto";

function validSecret(provided: string | null, expected: string) {
  if (!provided || !expected) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function isTelegramIngestAuthorized(request: Request) {
  const expected = process.env.WEBSITE_INGEST_SECRET?.trim();
  const provided = request.headers.get("x-website-ingest-secret");
  return Boolean(expected && validSecret(provided, expected));
}
