import { notFound } from "next/navigation";
import Link from "next/link";
import { getPortfolio, getProjectFromPortfolio } from "@/lib/portfolio";
import { SmartImage } from "@/components/ui/SmartImage";

export async function generateStaticParams() {
  const data = await getPortfolio();
  return data.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolio();
  const project = getProjectFromPortfolio(data, slug);
  return { title: project ? `${project.title} — Anshul Sahu` : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolio();
  const project = getProjectFromPortfolio(data, slug);
  if (!project) notFound();

  return (
    <article className="band-paper border-b border-stone">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <Link
          href="/#work"
          className="mb-8 inline-block text-sm text-ink-soft transition hover:text-platinum"
        >
          ← Back to work
        </Link>

        <p className="section-label mb-3">
          {project.company ?? "Project"} · {project.duration}
        </p>
        <h1 className="display mb-4 text-4xl text-ink md:text-5xl">{project.title}</h1>
        <p className="mb-8 max-w-2xl text-lg text-ink-soft">{project.tagline}</p>
        <p className="mb-10 text-sm text-accent">{project.role}</p>

        <div className="media-frame relative mb-12 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-stone">
          <SmartImage
            src={project.coverImage}
            alt={project.title}
            fit="auto"
            frameRatio={16 / 10}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <div className="mb-12 grid gap-10 md:grid-cols-2">
          <div className="surface rounded-2xl p-6">
            <h2 className="display mb-3 text-2xl text-ink">Problem</h2>
            <p className="leading-relaxed text-ink-soft">{project.problem}</p>
          </div>
          <div className="surface rounded-2xl p-6">
            <h2 className="display mb-3 text-2xl text-ink">Solution</h2>
            <p className="leading-relaxed text-ink-soft">{project.solution}</p>
          </div>
          <div className="surface rounded-2xl p-6 md:col-span-2">
            <h2 className="display mb-3 text-2xl text-ink">Architecture</h2>
            <p className="leading-relaxed text-ink-soft">{project.architecture}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="display mb-4 text-2xl text-ink">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full border border-stone bg-cream px-3 py-1.5 text-sm text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="surface rounded-2xl p-6">
            <h2 className="display mb-3 text-2xl text-ink">Results</h2>
            <ul className="space-y-2 text-ink-soft">
              {project.results.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-2xl p-6">
            <h2 className="display mb-3 text-2xl text-ink">Next</h2>
            <ul className="space-y-2 text-ink-soft">
              {project.futureScope.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          </div>
        </div>

        {project.images.length > 0 && (
          <div className="mb-8">
            <h2 className="display mb-6 text-2xl text-ink">Gallery</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {project.images.map((img) => (
                <figure key={img.src} className="surface overflow-hidden rounded-2xl">
                  <div className="media-frame relative aspect-[4/3]">
                    <SmartImage
                      src={img.src}
                      alt={img.alt}
                      fit="auto"
                      frameRatio={4 / 3}
                      sizes="400px"
                    />
                  </div>
                  {(img.caption || img.date) && (
                    <figcaption className="border-t border-stone bg-paper p-3 text-sm text-ink-soft">
                      {img.caption}
                      {img.date ? ` · ${img.date}` : ""}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
