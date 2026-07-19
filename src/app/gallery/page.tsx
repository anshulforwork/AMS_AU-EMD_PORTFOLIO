import { getPortfolio } from "@/lib/portfolio";
import { GalleryView } from "@/components/gallery/GalleryView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gallery — Anshul Sahu" };

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ photo?: string }>;
}) {
  const { photo } = await searchParams;
  const data = await getPortfolio();

  return (
    <div className="band-paper border-b border-stone">
      <GalleryView gallery={data.gallery} initialId={photo} />
    </div>
  );
}
