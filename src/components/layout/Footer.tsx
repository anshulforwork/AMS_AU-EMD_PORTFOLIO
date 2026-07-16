import Link from "next/link";

export function Footer({
  name,
  linkedin,
  github,
  whatsapp,
}: {
  name: string;
  linkedin: string;
  github: string;
  whatsapp: string;
}) {
  return (
    <footer className="border-t border-cream/10 bg-accent">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-cream/50 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="display text-lg text-cream/90">{name}</p>
        <div className="flex flex-wrap gap-6">
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-soft">
            LinkedIn
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-soft">
            GitHub
          </a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-soft">
            WhatsApp
          </a>
          <Link href="/admin/login" className="transition hover:text-gold-soft">
            Admin
          </Link>
        </div>
        <p className="text-xs text-cream/35">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
