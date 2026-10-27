/**
 * Pure-JS image dimension reader — no dependencies, works on raw bytes
 * (Uint8Array / ArrayBuffer / Node Buffer) in any server runtime.
 *
 * Supports the formats that actually arrive on the wire:
 *   JPEG (SOF0–SOF15), PNG (IHDR), WebP (VP8 / VP8L / VP8X), GIF.
 *
 * Returns null for anything unparsable — callers treat that as
 * "dimensions unknown" and the photo-fit gate keeps the photo off the deck.
 */
export type ImageDims = { w: number; h: number };

function u16be(b: Uint8Array, o: number): number {
  return (b[o] << 8) | b[o + 1];
}

function u24le(b: Uint8Array, o: number): number {
  return b[o] | (b[o + 1] << 8) | (b[o + 2] << 16);
}

function u32be(b: Uint8Array, o: number): number {
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
}

function u32le(b: Uint8Array, o: number): number {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
}

/** JPEG: walk segment markers until a Start-Of-Frame segment gives dimensions. */
function jpegDims(b: Uint8Array): ImageDims | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let o = 2;
  while (o + 9 < b.length) {
    // Skip fill bytes between markers.
    if (b[o] !== 0xff) {
      o += 1;
      continue;
    }
    let marker = b[o + 1];
    while (marker === 0xff && o + 2 < b.length) {
      o += 1;
      marker = b[o + 1];
    }
    // Markers without a length payload.
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
      o += 2;
      continue;
    }
    const len = u16be(b, o + 2);
    if (len < 2) return null;
    // SOF0–SOF15 except DHT (0xC4), JPG (0xC8), DAC (0xCC).
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      if (o + 9 > b.length) return null;
      const h = u16be(b, o + 5);
      const w = u16be(b, o + 7);
      if (w > 0 && h > 0) return { w, h };
      return null;
    }
    o += 2 + len;
  }
  return null;
}

/** PNG: fixed IHDR layout after the 8-byte signature. */
function pngDims(b: Uint8Array): ImageDims | null {
  if (b.length < 24) return null;
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < 8; i += 1) if (b[i] !== sig[i]) return null;
  if (b[12] !== 0x49 || b[13] !== 0x48 || b[14] !== 0x44 || b[15] !== 0x52) return null; // "IHDR"
  const w = u32be(b, 16);
  const h = u32be(b, 20);
  if (w > 0 && h > 0 && w <= 1 << 24 && h <= 1 << 24) return { w, h };
  return null;
}

/** WebP: walk RIFF chunks to the first VP8 / VP8L / VP8X payload. */
function webpDims(b: Uint8Array): ImageDims | null {
  if (b.length < 16) return null;
  if (b[0] !== 0x52 || b[1] !== 0x49 || b[2] !== 0x46 || b[3] !== 0x46) return null; // "RIFF"
  if (b[8] !== 0x57 || b[9] !== 0x45 || b[10] !== 0x42 || b[11] !== 0x50) return null; // "WEBP"
  let o = 12;
  while (o + 8 <= b.length) {
    const tag = String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
    const size = u32le(b, o + 4);
    const payload = o + 8;
    if (tag === "VP8 ") {
      if (payload + 10 > b.length) return null;
      // Frame tag (3 bytes) + start code 0x9d 0x01 0x2a, then 14-bit dims LE.
      if (b[payload + 3] !== 0x9d || b[payload + 4] !== 0x01 || b[payload + 5] !== 0x2a) return null;
      const w = (b[payload + 6] | (b[payload + 7] << 8)) & 0x3fff;
      const h = (b[payload + 8] | (b[payload + 9] << 8)) & 0x3fff;
      if (w > 0 && h > 0) return { w, h };
      return null;
    }
    if (tag === "VP8L") {
      if (payload + 5 > b.length) return null;
      if (b[payload] !== 0x2f) return null;
      const n = u32le(b, payload + 1); // 14-bit w-1 | 14-bit h-1 packed
      const w = (n & 0x3fff) + 1;
      const h = ((n >> 14) & 0x3fff) + 1;
      if (w > 0 && h > 0) return { w, h };
      return null;
    }
    if (tag === "VP8X") {
      if (payload + 10 > b.length) return null;
      const w = u24le(b, payload + 4) + 1;
      const h = u24le(b, payload + 7) + 1;
      if (w > 0 && h > 0) return { w, h };
      return null;
    }
    o = payload + size + (size % 2); // chunks are word-aligned
  }
  return null;
}

/** GIF: logical screen descriptor at fixed offset. */
function gifDims(b: Uint8Array): ImageDims | null {
  if (b.length < 10) return null;
  if (b[0] !== 0x47 || b[1] !== 0x49 || b[2] !== 0x46) return null; // "GIF"
  const w = b[6] | (b[7] << 8);
  const h = b[8] | (b[9] << 8);
  if (w > 0 && h > 0) return { w, h };
  return null;
}

function asBytes(data: Uint8Array | ArrayBuffer): Uint8Array {
  if (data instanceof Uint8Array) return data;
  return new Uint8Array(data);
}

/** Read intrinsic pixel dimensions from an encoded image, or null. */
export function getImageDims(data: Uint8Array | ArrayBuffer | null | undefined): ImageDims | null {
  if (!data) return null;
  const b = asBytes(data);
  if (b.length < 10) return null;
  try {
    if (b[0] === 0xff && b[1] === 0xd8) return jpegDims(b);
    if (b[0] === 0x89 && b[1] === 0x50) return pngDims(b);
    if (b[0] === 0x52 && b[1] === 0x49) return webpDims(b);
    if (b[0] === 0x47 && b[1] === 0x49) return gifDims(b);
  } catch {
    return null;
  }
  return null;
}
