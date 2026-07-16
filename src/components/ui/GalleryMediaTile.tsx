import { SmartImage } from "@/components/ui/SmartImage";
import { DriveVideoEmbed } from "@/components/ui/DriveVideoEmbed";
import { isDriveVideoUrl } from "@/lib/drive-video";

export type GalleryMediaItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  kind?: "image" | "video";
  driveVideoUrl?: string;
};

export function GalleryMediaTile({
  item,
  tall,
  className = "",
}: {
  item: GalleryMediaItem;
  tall?: boolean;
  className?: string;
}) {
  const isVideo =
    item.kind === "video" || Boolean(item.driveVideoUrl && isDriveVideoUrl(item.driveVideoUrl));

  return (
    <div
      className={`media-frame media-frame--dark glass-dark relative shrink-0 overflow-hidden rounded-xl ${
        tall ? "h-52 w-80 md:h-60 md:w-[24rem]" : "h-44 w-72 md:h-52 md:w-[22rem]"
      } ${className}`}
    >
      {isVideo && item.driveVideoUrl ? (
        <>
          <DriveVideoEmbed url={item.driveVideoUrl} title={item.alt} className="opacity-95" />
          <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-cream/20 bg-ink/50 px-2 py-0.5 text-[0.6rem] tracking-widest text-gold-soft uppercase backdrop-blur-sm">
            Video
          </div>
        </>
      ) : (
        <SmartImage
          src={item.src}
          alt={item.alt}
          fit="auto"
          frameRatio={tall ? 80 / 52 : 72 / 44}
          sizes="400px"
          className="opacity-90 transition hover:opacity-100"
        />
      )}
      {item.caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-10 text-[0.7rem] tracking-wide text-cream/90">
          {item.caption}
        </div>
      )}
    </div>
  );
}
