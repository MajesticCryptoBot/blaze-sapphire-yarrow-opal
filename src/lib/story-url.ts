export function storyPath(idOrSlug: number | string) {
  if (typeof idOrSlug === "number") return `/n/telegram-${idOrSlug}`;
  if (idOrSlug.startsWith("telegram-") || idOrSlug.startsWith("/")) {
    return idOrSlug.startsWith("/") ? idOrSlug : `/n/${idOrSlug}`;
  }
  return `/n/${idOrSlug}`;
}

export function storyAbsoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}
