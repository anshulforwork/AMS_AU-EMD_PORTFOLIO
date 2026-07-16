/**
 * Convert a Google Drive share link into an embeddable preview URL.
 * Supports /file/d/ID/view, open?id=, and uc?id= formats.
 */
export function extractDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function toDriveEmbedUrl(url: string): string | null {
  const id = extractDriveFileId(url);
  if (!id) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function isDriveVideoUrl(url?: string) {
  return Boolean(url && toDriveEmbedUrl(url));
}
