import { toDriveEmbedUrl } from "@/lib/drive-video";

export function DriveVideoEmbed({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const embed = toDriveEmbedUrl(url);
  if (!embed) {
    return (
      <div
        className={`flex items-center justify-center bg-ink/90 p-4 text-center text-xs text-cream/70 ${className}`}
      >
        Invalid Google Drive link — use Share → copy link
      </div>
    );
  }

  return (
    <iframe
      src={embed}
      title={title}
      className={`h-full w-full border-0 ${className}`}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  );
}
