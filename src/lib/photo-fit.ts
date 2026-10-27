/**
 * The deck's photo gate — "check size, fit, or drop".
 *
 * Homepage cards use one uniform 16:9 frame. A photo earns a card slot only
 * when displaying it keeps at least 80% of its pixels visible (a center crop
 * of at most ~20% — the imperceptible range every major news desk uses).
 * Anything tighter than that — square logos, 4:3 screenshots, portrait
 * shots, extreme banners — is dropped from the card and shown only in the
 * full story view, where the frame adapts to the photo instead of the
 * other way around.
 *
 * Photo pairs share one 16:9 frame split in two halves, so each half-frame
 * is 8:9 (near-square); pair photos are checked against that ratio.
 */

/** Uniform card frame ratio (single photo). */
export const CARD_FRAME_RATIO = 16 / 9;
/** Half of the 16:9 frame — the ratio each photo in a pair is judged against. */
export const PAIR_FRAME_RATIO = 8 / 9;
/** Minimum share of the photo that must survive the fit for it to be shown. */
export const MIN_VISIBLE_FRACTION = 0.8;

export type PhotoFitInput = {
  hasPhoto: boolean;
  hasPhoto2?: boolean;
  photoW?: number | null;
  photoH?: number | null;
  photo2W?: number | null;
  photo2H?: number | null;
};

export type PhotoDisplayMode = "none" | "single" | "pair";

/** Fraction of the photo's area that stays visible inside the frame ratio. */
export function visibleFraction(photoRatio: number, frameRatio: number): number {
  if (!Number.isFinite(photoRatio) || !Number.isFinite(frameRatio) || photoRatio <= 0 || frameRatio <= 0) {
    return 0;
  }
  return Math.min(photoRatio, frameRatio) / Math.max(photoRatio, frameRatio);
}

function ratioOf(w?: number | null, h?: number | null): number {
  if (!w || !h || w <= 0 || h <= 0) return 0;
  return w / h;
}

export type PhotoFitResult = {
  mode: PhotoDisplayMode;
  /** Which photo the "single" mode renders (photo 2 only when photo 1 fails the gate). */
  solo: 1 | 2;
};

/**
 * Decide how a story's photos may appear in a 16:9 card frame.
 *  - "pair"   both photos fit their 8:9 half of a split frame
 *  - "single" one photo fits the full frame (photo 1 preferred, else photo 2)
 *  - "none"   nothing fits (or dimensions unknown) — render a text-first card
 *
 * A photo that only fits a half-frame but not the full frame is still
 * dropped: showing it full-screen would crop it past the threshold — the
 * exact failure this gate exists to prevent.
 */
export function fitCardPhotos(photo: PhotoFitInput): PhotoFitResult {
  if (!photo.hasPhoto) return { mode: "none", solo: 1 };

  const r1 = ratioOf(photo.photoW, photo.photoH);
  const r2 = ratioOf(photo.photo2W, photo.photo2H);
  const fit1Pair = visibleFraction(r1, PAIR_FRAME_RATIO) >= MIN_VISIBLE_FRACTION;
  const fit1Single = visibleFraction(r1, CARD_FRAME_RATIO) >= MIN_VISIBLE_FRACTION;
  const fit2Pair = visibleFraction(r2, PAIR_FRAME_RATIO) >= MIN_VISIBLE_FRACTION;
  const fit2Single = visibleFraction(r2, CARD_FRAME_RATIO) >= MIN_VISIBLE_FRACTION;

  if (photo.hasPhoto2 && fit1Pair && fit2Pair) return { mode: "pair", solo: 1 };
  if (fit1Single) return { mode: "single", solo: 1 };
  if (photo.hasPhoto2 && fit2Single) return { mode: "single", solo: 2 };
  return { mode: "none", solo: 1 };
}
