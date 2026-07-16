import { getPortfolio } from "@/lib/portfolio";
import { HeroProfile } from "@/components/home/HeroProfile";
import { AboutSection } from "@/components/home/AboutSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { EducationSection } from "@/components/home/EducationSection";
import { WorkSection } from "@/components/home/WorkSection";
import { GalleryMarquee } from "@/components/home/GalleryMarquee";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { CertificationsSection } from "@/components/home/CertificationsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { SectionDivider } from "@/components/layout/SectionDivider";

/** Always read live portfolio from Redis/KV on Vercel so Admin saves show for HR. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPortfolio();

  return (
    <>
      <HeroProfile site={data.site} />
      <SectionDivider label="About" />
      <AboutSection site={data.site} />
      <SectionDivider label="Skills" />
      <SkillsSection skills={data.skills} />
      <SectionDivider label="Education" />
      <EducationSection education={data.education} />
      <SectionDivider label="Work" />
      <WorkSection projects={data.projects} />
      <SectionDivider label="Gallery" tone="dark" />
      <GalleryMarquee gallery={data.gallery} />
      <SectionDivider label="Experience" />
      <ExperienceSection
        experience={data.experience}
        achievements={data.achievements ?? []}
      />
      <SectionDivider label="Credentials" />
      <CertificationsSection certifications={data.certifications ?? []} />
      <SectionDivider label="Contact" tone="dark" />
      <ContactSection site={data.site} />
    </>
  );
}
