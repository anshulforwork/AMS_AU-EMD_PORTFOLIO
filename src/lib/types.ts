export type MediaItem = {
  src: string;
  alt: string;
  caption?: string;
  date?: string;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  coverImage: string;
  problem: string;
  solution: string;
  architecture: string;
  technologies: string[];
  duration: string;
  company?: string;
  role: string;
  results: string[];
  futureScope: string[];
  images: MediaItem[];
  downloads: { label: string; href: string }[];
  googleDocUrl?: string;
  featured?: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
};
