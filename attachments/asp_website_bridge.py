"""ASP News -> website bridge.

Copy this module next to ASPAPI.py and set these environment variables on the ASP machine:

    WEBSITE_INGEST_URL=https://ivory-vivid-wind-cinder-beige.vercel.app/api/news-ingest-v2
    WEBSITE_INGEST_SECRET=<same secret configured in Vercel>

The bridge is deliberately fail-open: a website outage must NEVER prevent ASP
from publishing to Telegram.

Pass up to two photo paths. The website shows a Telegram/X-style pair and
ignores a third or fourth image.
"""

import asyncio
import base64
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import aiohttp

logger = logging.getLogger(__name__)

WEBSITE_INGEST_URL = os.getenv(
    "WEBSITE_INGEST_URL",
    "https://ivory-vivid-wind-cinder-beige.vercel.app/api/news-ingest-v2",
).strip()
WEBSITE_INGEST_SECRET = os.getenv("WEBSITE_INGEST_SECRET", "").strip()
WEBSITE_CHANNEL = "AlphaSignalsPro"
MAX_PHOTO_BYTES = 2_500_000


def _photo_base64(path: Optional[Path]):
    if not path or not path.is_file():
        return None, None
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        return None, None
    try:
        data = path.read_bytes()
        if len(data) > MAX_PHOTO_BYTES:
            logger.warning(
                "Website photo skipped because it is larger than %.1f MB: %s",
                MAX_PHOTO_BYTES / 1_000_000,
                path.name,
            )
            return None, None
        mime = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
        }.get(path.suffix.lower(), "image/jpeg")
        return base64.b64encode(data).decode("ascii"), mime
    except Exception as exc:
        logger.warning("Could not read website photo %s: %s", path, exc)
        return None, None


async def publish_to_website(
    *,
    message_id: int,
    text: str,
    published_at: Optional[datetime] = None,
    photo_path: Optional[Path] = None,
    photo_path_2: Optional[Path] = None,
    chat_id: Optional[int] = None,
):
    """Send one successfully published ASP post to the website.

    Returns True on success and False on any website/network failure.
    Never raises into the Telegram publishing pipeline.
    """
    if not WEBSITE_INGEST_SECRET:
        logger.warning("Website integration disabled: WEBSITE_INGEST_SECRET is not configured")
        return False

    photo_base64, photo_mime = _photo_base64(photo_path)
    photo_base64_2, photo_mime_2 = _photo_base64(photo_path_2)
    if photo_base64 and photo_base64_2 and photo_base64 == photo_base64_2:
        photo_base64_2, photo_mime_2 = None, None

    when = (published_at or datetime.now(timezone.utc)).astimezone(timezone.utc).isoformat()
    payload = {
        "channel": WEBSITE_CHANNEL,
        "chatId": chat_id or WEBSITE_CHANNEL,
        "chatUsername": WEBSITE_CHANNEL,
        "chatTitle": WEBSITE_CHANNEL,
        "messageId": int(message_id),
        "text": text,
        "publishedAt": when,
        "messageUrl": f"https://t.me/{WEBSITE_CHANNEL}/{int(message_id)}",
        "photoBase64": photo_base64,
        "photoMimeType": photo_mime,
        "photoBase64_2": photo_base64_2,
        "photoMimeType_2": photo_mime_2,
    }

    headers = {
        "Content-Type": "application/json",
        "X-Website-Ingest-Secret": WEBSITE_INGEST_SECRET,
    }

    try:
        timeout = aiohttp.ClientTimeout(total=15, connect=5, sock_read=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(WEBSITE_INGEST_URL, json=payload, headers=headers, ssl=True) as response:
                if response.status >= 400:
                    body = (await response.text())[:300]
                    logger.warning("Website ingest failed: HTTP %s — %s", response.status, body)
                    return False
                logger.info(
                    "Website ingest successful for Telegram message %s (photos=%s)",
                    message_id,
                    int(bool(photo_base64)) + int(bool(photo_base64_2)),
                )
                return True
    except Exception as exc:
        logger.warning("Website ingest unavailable for message %s: %s", message_id, exc)
        return False


async def backfill_last_24_hours(client, channel="@AlphaSignalsPro", limit=200):
    """One-time backfill of recent AlphaSignalsPro posts using the existing Telethon account."""
    if not WEBSITE_INGEST_SECRET:
        logger.warning("Website backfill disabled: WEBSITE_INGEST_SECRET is not configured")
        return 0

    cutoff = datetime.now(timezone.utc).timestamp() - 24 * 60 * 60
    sent = 0
    seen_groups = set()

    async for message in client.iter_messages(channel, limit=limit):
        if not message.date or message.date.timestamp() < cutoff:
            break
        text = message.raw_text or ""
        if not text.strip() and not message.grouped_id:
            continue
        if message.grouped_id and message.grouped_id in seen_groups:
            continue
        if message.grouped_id:
            seen_groups.add(message.grouped_id)

        photo_paths = []
        try:
            album = [message]
            if message.grouped_id:
                album = []
                async for msg in client.iter_messages(channel, limit=30, min_id=message.id - 20, max_id=message.id + 20):
                    if msg.grouped_id == message.grouped_id:
                        album.append(msg)
                album.sort(key=lambda item: item.id)
            caption_source = next((item for item in album if item.raw_text), message)
            text = caption_source.raw_text or text
            for item in album:
                if not item.photo or len(photo_paths) >= 2:
                    continue
                downloaded = await client.download_media(item, file=bytes)
                if isinstance(downloaded, bytes) and len(downloaded) <= MAX_PHOTO_BYTES:
                    import tempfile
                    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                        tmp.write(downloaded)
                        photo_paths.append(Path(tmp.name))
        except Exception as exc:
            logger.warning("Backfill photo download failed for %s: %s", message.id, exc)

        if not text.strip():
            for path in photo_paths:
                try:
                    path.unlink(missing_ok=True)
                except Exception:
                    pass
            continue

        try:
            if await publish_to_website(
                message_id=message.id,
                text=text,
                published_at=message.date,
                photo_path=photo_paths[0] if photo_paths else None,
                photo_path_2=photo_paths[1] if len(photo_paths) > 1 else None,
                chat_id=getattr(message, "chat_id", None),
            ):
                sent += 1
        finally:
            for path in photo_paths:
                try:
                    path.unlink(missing_ok=True)
                except Exception:
                    pass
        await asyncio.sleep(0.15)

    logger.info("Website backfill completed: %s posts sent", sent)
    return sent
