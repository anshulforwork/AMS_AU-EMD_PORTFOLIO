import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SoftWhatsApp } from "@/components/ui/SoftWhatsApp";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { getPortfolio } from "@/lib/portfolio";
import { whatsappUrl } from "@/content/defaultPortfolio";

export const dynamic = "force-dynamic";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const data = await getPortfolio();
  const wa = whatsappUrl(data.site);

  return (
    <div className="relative flex min-h-screen flex-col">
      <AmbientBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar
          name={data.site.name}
          resumeUrl={data.site.resumeUrl}
          logoSrc="/media/brand/ams_logo.png"
        />
        <main className="flex-1">{children}</main>
        <Footer
          name={data.site.name}
          linkedin={data.site.linkedin}
          github={data.site.github}
          whatsapp={wa}
        />
        <SoftWhatsApp href={wa} />
      </div>
    </div>
  );
}
