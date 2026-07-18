"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { PortfolioData } from "@/content/defaultPortfolio";
import type { Project } from "@/lib/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { uploadImage } from "@/lib/upload-client";

const DEFAULT_PROFILE_IMAGE = "/media/profile/anshul.jpg";
const DEFAULT_COVER_IMAGE = "/media/brand/ams_logo.png";

type Tab =
  | "site"
  | "projects"
  | "experience"
  | "education"
  | "skills"
  | "certs"
  | "gallery"
  | "achievements";

const emptyProject = (): Project => ({
  slug: `project-${Date.now()}`,
  title: "New Project",
  shortTitle: "New",
  tagline: "Short description",
  coverImage: "/media/brand/ams_logo.png",
  problem: "",
  solution: "",
  architecture: "",
  technologies: [],
  duration: "",
  company: "",
  role: "",
  results: [],
  futureScope: [],
  images: [],
  downloads: [],
  featured: true,
});

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [tab, setTab] = useState<Tab>("site");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");

  useEffect(() => {
    (async () => {
      const session = await fetch("/api/admin/session").then((r) => r.json());
      if (!session.authenticated) {
        router.replace("/admin/login");
        return;
      }
      const json = await fetch("/api/admin/portfolio").then((r) => r.json());
      if (!json.achievements) json.achievements = [];
      if (!json.certifications) json.certifications = [];
      setData(json);

      // Warn early if the deployment is missing storage config
      try {
        const health = (await fetch("/api/admin/health").then((r) => r.json())) as {
          vercel?: boolean;
          redisConfigured?: boolean;
          blobConfigured?: boolean;
        };
        if (health.vercel) {
          const missing: string[] = [];
          if (!health.redisConfigured) missing.push("Redis (needed to save edits)");
          if (!health.blobConfigured) missing.push("Blob storage (needed for image uploads)");
          if (missing.length) {
            setStorageWarning(
              `Storage not fully configured on Vercel: ${missing.join(" and ")}. ` +
                "Open Vercel → Storage, connect them to this project, then Redeploy.",
            );
          }
        }
      } catch {
        /* health check is best-effort */
      }
    })();
  }, [router]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/admin/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    setSaving(false);
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    setStatus(
      res.ok
        ? "Saved successfully. Refresh the public site."
        : json.message || json.error || "Save failed",
    );
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function upload(file: File, apply: (url: string) => void) {
    setStatus("Uploading image…");
    const result = await uploadImage(file);
    if (result.error !== undefined) {
      setStatus(`Upload failed: ${result.error}`);
      return;
    }
    apply(result.url);
    setStatus(`Uploaded: ${result.url}`);
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 text-ink-soft">Loading admin…</div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "site", label: "Profile" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "certs", label: "Certifications" },
    { id: "gallery", label: "Gallery" },
    { id: "achievements", label: "Achievements" },
  ];

  const fieldClass =
    "w-full rounded-xl border border-stone bg-cream/80 px-3 py-2 text-sm outline-none focus:border-platinum";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-label mb-1">Full CMS</p>
          <h1 className="display text-3xl text-ink">Edit everything</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Profile, projects, images, skills, certs, experience — all editable.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save all"}
          </button>
          <button type="button" onClick={logout} className="btn-ghost">
            Logout
          </button>
        </div>
      </div>

      {storageWarning && (
        <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {storageWarning}
        </p>
      )}
      {status && <p className="mb-4 rounded-xl bg-accent/10 px-4 py-2 text-sm text-accent">{status}</p>}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === t.id ? "bg-accent text-white" : "border border-stone text-ink-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "site" && (
        <div className="space-y-3">
          {(
            [
              ["name", "Name"],
              ["title", "Title (shows Automation · Embedded)"],
              ["tagline", "Tagline"],
              ["bio", "Bio"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["whatsapp", "WhatsApp digits"],
              ["linkedin", "LinkedIn"],
              ["github", "GitHub"],
              ["location", "Location"],
              ["resumeUrl", "Resume URL"],
              ["profileImage", "Profile image path"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block text-ink-soft">{label}</span>
              {key === "bio" || key === "tagline" ? (
                <textarea
                  value={data.site[key]}
                  onChange={(e) =>
                    setData({ ...data, site: { ...data.site, [key]: e.target.value } })
                  }
                  rows={key === "bio" ? 6 : 2}
                  className={fieldClass}
                />
              ) : (
                <input
                  value={data.site[key]}
                  onChange={(e) =>
                    setData({ ...data, site: { ...data.site, [key]: e.target.value } })
                  }
                  className={fieldClass}
                />
              )}
            </label>
          ))}
          <label className="block text-sm">
            <span className="mb-1 block text-ink-soft">Roles (one per line)</span>
            <textarea
              className={fieldClass}
              rows={4}
              value={data.site.roles.join("\n")}
              onChange={(e) =>
                setData({
                  ...data,
                  site: {
                    ...data.site,
                    roles: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                  },
                })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-ink-soft">Domains (comma separated)</span>
            <input
              className={fieldClass}
              value={data.site.domains.join(", ")}
              onChange={(e) =>
                setData({
                  ...data,
                  site: {
                    ...data.site,
                    domains: e.target.value.split(",").map((x) => x.trim()).filter(Boolean),
                  },
                })
              }
            />
          </label>
          <ImageUploadField
            label="Profile photo"
            value={data.site.profileImage}
            onUploaded={(url) => {
              setData({ ...data, site: { ...data.site, profileImage: url } });
              setStatus(`Profile photo: ${url}`);
            }}
            onClear={() => {
              setData({
                ...data,
                site: { ...data.site, profileImage: DEFAULT_PROFILE_IMAGE },
              });
              setStatus("Profile photo reset to the default image. Click Save all to apply.");
            }}
          />
        </div>
      )}

      {tab === "projects" && (
        <div className="space-y-6">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setData({ ...data, projects: [emptyProject(), ...data.projects] })}
          >
            + Add project
          </button>
          {data.projects.map((p, idx) => (
            <div key={idx} className="surface space-y-3 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="display text-2xl">{p.title}</h3>
                <button
                  type="button"
                  className="text-sm text-red-700"
                  onClick={() =>
                    setData({
                      ...data,
                      projects: data.projects.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Delete project
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {(
                  [
                    ["title", "Title"],
                    ["shortTitle", "Short title"],
                    ["slug", "Slug (URL)"],
                    ["company", "Company"],
                    ["role", "Role"],
                    ["duration", "Duration"],
                    ["coverImage", "Cover image path"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="text-sm">
                    <span className="mb-1 block text-ink-soft">{label}</span>
                    <input
                      className={fieldClass}
                      value={String(p[key] ?? "")}
                      onChange={(e) => {
                        const projects = [...data.projects];
                        projects[idx] = { ...p, [key]: e.target.value };
                        setData({ ...data, projects });
                      }}
                    />
                  </label>
                ))}
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-ink-soft">Tagline</span>
                  <textarea
                    className={fieldClass}
                    rows={2}
                    value={p.tagline}
                    onChange={(e) => {
                      const projects = [...data.projects];
                      projects[idx] = { ...p, tagline: e.target.value };
                      setData({ ...data, projects });
                    }}
                  />
                </label>
                {(["problem", "solution", "architecture"] as const).map((field) => (
                  <label key={field} className="text-sm md:col-span-2">
                    <span className="mb-1 block capitalize text-ink-soft">{field}</span>
                    <textarea
                      className={fieldClass}
                      rows={3}
                      value={p[field]}
                      onChange={(e) => {
                        const projects = [...data.projects];
                        projects[idx] = { ...p, [field]: e.target.value };
                        setData({ ...data, projects });
                      }}
                    />
                  </label>
                ))}
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-ink-soft">Technologies (comma separated)</span>
                  <input
                    className={fieldClass}
                    value={p.technologies.join(", ")}
                    onChange={(e) => {
                      const projects = [...data.projects];
                      projects[idx] = {
                        ...p,
                        technologies: e.target.value.split(",").map((x) => x.trim()).filter(Boolean),
                      };
                      setData({ ...data, projects });
                    }}
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-ink-soft">Results (one per line)</span>
                  <textarea
                    className={fieldClass}
                    rows={3}
                    value={p.results.join("\n")}
                    onChange={(e) => {
                      const projects = [...data.projects];
                      projects[idx] = {
                        ...p,
                        results: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                      };
                      setData({ ...data, projects });
                    }}
                  />
                </label>
              </div>

              <div className="space-y-4 border-t border-stone/60 pt-4">
                <p className="text-sm font-semibold text-ink">Project cover & gallery images</p>
                <ImageUploadField
                  label="Cover image (main card photo)"
                  value={p.coverImage}
                  onUploaded={(url) => {
                    const projects = [...data.projects];
                    projects[idx] = { ...p, coverImage: url };
                    setData({ ...data, projects });
                    setStatus(`Cover updated: ${url}`);
                  }}
                  onClear={() => {
                    const projects = [...data.projects];
                    projects[idx] = { ...p, coverImage: DEFAULT_COVER_IMAGE };
                    setData({ ...data, projects });
                    setStatus("Cover reset to the default logo. Click Save all to apply.");
                  }}
                />
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-ink-soft">
                    Google Drive video URL (optional — replaces cover on project page)
                  </span>
                  <input
                    className={fieldClass}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    value={p.driveVideoUrl ?? ""}
                    onChange={(e) => {
                      const projects = [...data.projects];
                      projects[idx] = { ...p, driveVideoUrl: e.target.value };
                      setData({ ...data, projects });
                    }}
                  />
                </label>

                <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
                  <p className="mb-2 text-xs font-semibold tracking-wide text-accent uppercase">
                    Gallery images for this project
                  </p>
                  <div className="mb-3 grid gap-3 sm:grid-cols-2">
                    {p.images.map((img, ii) => (
                      <div key={`${img.src}-${ii}`} className="rounded-lg border border-stone bg-white/70 p-2">
                        <div className="relative mb-2 aspect-video overflow-hidden rounded-md bg-cream-deep">
                          <Image src={img.src} alt="" fill className="object-cover" sizes="200px" />
                        </div>
                        <input
                          className={`${fieldClass} mb-2`}
                          placeholder="Caption"
                          value={img.caption ?? ""}
                          onChange={(e) => {
                            const projects = [...data.projects];
                            const images = [...p.images];
                            images[ii] = { ...img, caption: e.target.value };
                            projects[idx] = { ...p, images };
                            setData({ ...data, projects });
                          }}
                        />
                        <input
                          className={`${fieldClass} mb-2`}
                          placeholder="Google Drive video URL (optional)"
                          value={img.driveVideoUrl ?? ""}
                          onChange={(e) => {
                            const projects = [...data.projects];
                            const images = [...p.images];
                            images[ii] = {
                              ...img,
                              driveVideoUrl: e.target.value,
                              kind: e.target.value ? "video" : "image",
                            };
                            projects[idx] = { ...p, images };
                            setData({ ...data, projects });
                          }}
                        />
                        <div className="flex flex-wrap gap-2">
                          <label className="cursor-pointer rounded-full bg-accent px-3 py-1 text-xs text-white">
                            Replace photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                upload(f, (url) => {
                                  const projects = [...data.projects];
                                  const images = [...p.images];
                                  images[ii] = { ...img, src: url };
                                  projects[idx] = { ...p, images };
                                  setData({ ...data, projects });
                                  setStatus(`Gallery image updated: ${url}`);
                                });
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="text-xs text-red-700"
                            onClick={() => {
                              const projects = [...data.projects];
                              projects[idx] = {
                                ...p,
                                images: p.images.filter((_, j) => j !== ii),
                              };
                              setData({ ...data, projects });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label className="inline-flex cursor-pointer items-center rounded-full bg-accent px-4 py-2 text-xs text-white hover:bg-accent-soft">
                    + Upload new gallery image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        upload(f, (url) => {
                          const projects = [...data.projects];
                          projects[idx] = {
                            ...p,
                            images: [
                              ...p.images,
                              { src: url, alt: p.title, caption: "Project photo" },
                            ],
                          };
                          setData({ ...data, projects });
                          setStatus(`Added gallery image: ${url}`);
                        });
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "experience" && (
        <div className="space-y-4">
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setData({
                ...data,
                experience: [
                  {
                    id: `exp-${Date.now()}`,
                    company: "Company",
                    role: "Role",
                    period: "Period",
                    summary: "",
                    highlights: [],
                  },
                  ...data.experience,
                ],
              })
            }
          >
            + Add experience
          </button>
          {data.experience.map((job, idx) => (
            <div key={job.id} className="surface space-y-2 rounded-2xl p-4">
              <div className="flex justify-between">
                <p className="font-medium">{job.role}</p>
                <button
                  type="button"
                  className="text-sm text-red-700"
                  onClick={() =>
                    setData({
                      ...data,
                      experience: data.experience.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Delete
                </button>
              </div>
              {(["role", "company", "period", "summary"] as const).map((key) => (
                <label key={key} className="block text-sm">
                  <span className="mb-1 block capitalize text-ink-soft">{key}</span>
                  {key === "summary" ? (
                    <textarea
                      className={fieldClass}
                      rows={3}
                      value={job[key]}
                      onChange={(e) => {
                        const experience = [...data.experience];
                        experience[idx] = { ...job, [key]: e.target.value };
                        setData({ ...data, experience });
                      }}
                    />
                  ) : (
                    <input
                      className={fieldClass}
                      value={job[key]}
                      onChange={(e) => {
                        const experience = [...data.experience];
                        experience[idx] = { ...job, [key]: e.target.value };
                        setData({ ...data, experience });
                      }}
                    />
                  )}
                </label>
              ))}
              <label className="block text-sm">
                <span className="mb-1 block text-ink-soft">Highlights (one per line)</span>
                <textarea
                  className={fieldClass}
                  rows={4}
                  value={job.highlights.join("\n")}
                  onChange={(e) => {
                    const experience = [...data.experience];
                    experience[idx] = {
                      ...job,
                      highlights: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    };
                    setData({ ...data, experience });
                  }}
                />
              </label>
              <ImageUploadField
                label="Experience image / photo"
                value={job.image}
                onUploaded={(url) => {
                  const experience = [...data.experience];
                  experience[idx] = { ...job, image: url };
                  setData({ ...data, experience });
                  setStatus(`Experience image: ${url}`);
                }}
                onClear={() => {
                  const experience = [...data.experience];
                  experience[idx] = { ...job, image: undefined };
                  setData({ ...data, experience });
                }}
              />
            </div>
          ))}
        </div>
      )}

      {tab === "education" && (
        <div className="space-y-4">
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setData({
                ...data,
                education: [
                  ...data.education,
                  {
                    id: `edu-${Date.now()}`,
                    school: "School",
                    degree: "Degree",
                    period: "",
                    score: "",
                  },
                ],
              })
            }
          >
            + Add education
          </button>
          {data.education.map((ed, idx) => (
            <div key={ed.id} className="surface grid gap-2 rounded-2xl p-4 md:grid-cols-2">
              {(["degree", "school", "period", "score", "image"] as const).map((key) => (
                <label key={key} className="text-sm">
                  <span className="mb-1 block capitalize text-ink-soft">{key}</span>
                  <input
                    className={fieldClass}
                    value={String(ed[key] ?? "")}
                    onChange={(e) => {
                      const education = [...data.education];
                      education[idx] = { ...ed, [key]: e.target.value };
                      setData({ ...data, education });
                    }}
                  />
                </label>
              ))}
              <div className="md:col-span-2">
                <ImageUploadField
                  label="Education photo"
                  value={ed.image}
                  onUploaded={(url) => {
                    const education = [...data.education];
                    education[idx] = { ...ed, image: url };
                    setData({ ...data, education });
                    setStatus(`Education image: ${url}`);
                  }}
                  onClear={() => {
                    const education = [...data.education];
                    education[idx] = { ...ed, image: undefined };
                    setData({ ...data, education });
                  }}
                />
              </div>
              <button
                type="button"
                className="text-left text-sm text-red-700"
                onClick={() =>
                  setData({
                    ...data,
                    education: data.education.filter((_, i) => i !== idx),
                  })
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div className="space-y-4">
          <p className="text-sm text-ink-soft">
            Add or remove skills below. Use category like Automation, Embedded, Communication, Tools.
          </p>
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setData({
                ...data,
                skills: [...data.skills, { name: "New skill", category: "General" }],
              })
            }
          >
            + Add skill
          </button>
          <div className="space-y-4">
            {data.skills.map((s, idx) => (
              <div key={idx} className="surface space-y-2 rounded-2xl p-4">
                <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    className={fieldClass}
                    placeholder="Skill name"
                    value={s.name}
                    onChange={(e) => {
                      const skills = [...data.skills];
                      skills[idx] = { ...s, name: e.target.value };
                      setData({ ...data, skills });
                    }}
                  />
                  <input
                    className={fieldClass}
                    placeholder="Category"
                    value={s.category}
                    onChange={(e) => {
                      const skills = [...data.skills];
                      skills[idx] = { ...s, category: e.target.value };
                      setData({ ...data, skills });
                    }}
                  />
                  <button
                    type="button"
                    className="text-sm text-red-700"
                    onClick={() =>
                      setData({
                        ...data,
                        skills: data.skills.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <ImageUploadField
                  label="Skill icon / image (optional)"
                  value={s.image}
                  onUploaded={(url) => {
                    const skills = [...data.skills];
                    skills[idx] = { ...s, image: url };
                    setData({ ...data, skills });
                    setStatus(`Skill image: ${url}`);
                  }}
                  onClear={() => {
                    const skills = [...data.skills];
                    skills[idx] = { ...s, image: undefined };
                    setData({ ...data, skills });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "certs" && (
        <div className="space-y-4">
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setData({
                ...data,
                certifications: [
                  ...data.certifications,
                  { title: "New certification", issuer: "Issuer", year: "2025" },
                ],
              })
            }
          >
            + Add certification
          </button>
          {data.certifications.map((c, idx) => (
            <div key={idx} className="surface space-y-3 rounded-2xl p-4">
              <div className="grid gap-2 md:grid-cols-3">
                {(["title", "issuer", "year"] as const).map((key) => (
                  <input
                    key={key}
                    className={fieldClass}
                    placeholder={key}
                    value={c[key]}
                    onChange={(e) => {
                      const certifications = [...data.certifications];
                      certifications[idx] = { ...c, [key]: e.target.value };
                      setData({ ...data, certifications });
                    }}
                  />
                ))}
              </div>
              <ImageUploadField
                label="Certificate image / photo"
                value={c.image}
                onUploaded={(url) => {
                  const certifications = [...data.certifications];
                  certifications[idx] = { ...c, image: url };
                  setData({ ...data, certifications });
                  setStatus(`Certificate image: ${url}`);
                }}
                onClear={() => {
                  const certifications = [...data.certifications];
                  certifications[idx] = { ...c, image: undefined };
                  setData({ ...data, certifications });
                }}
              />
              <button
                type="button"
                className="text-sm text-red-700"
                onClick={() =>
                  setData({
                    ...data,
                    certifications: data.certifications.filter((_, i) => i !== idx),
                  })
                }
              >
                Delete certification
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "gallery" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                setData({
                  ...data,
                  gallery: [
                    ...data.gallery,
                    {
                      id: `g${Date.now()}`,
                      kind: "image",
                      src: "/media/brand/ams_logo.png",
                      alt: "New",
                      caption: "New photo",
                    },
                  ],
                })
              }
            >
              + Add photo
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                setData({
                  ...data,
                  gallery: [
                    ...data.gallery,
                    {
                      id: `v${Date.now()}`,
                      kind: "video",
                      src: "/media/brand/ams_logo.png",
                      alt: "Drive video",
                      caption: "Project video",
                      driveVideoUrl: "",
                    },
                  ],
                })
              }
            >
              + Add Drive video
            </button>
          </div>
          {data.gallery.map((g, idx) => (
            <div key={g.id} className="surface space-y-3 rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-accent uppercase">
                  {g.kind === "video" || g.driveVideoUrl ? "Drive video" : "Photo"}
                </span>
                <select
                  className="rounded-lg border border-stone bg-cream/80 px-2 py-1 text-xs"
                  value={g.kind === "video" || g.driveVideoUrl ? "video" : "image"}
                  onChange={(e) => {
                    const gallery = [...data.gallery];
                    const isVideo = e.target.value === "video";
                    gallery[idx] = {
                      ...g,
                      kind: isVideo ? "video" : "image",
                      driveVideoUrl: isVideo ? g.driveVideoUrl ?? "" : undefined,
                    };
                    setData({ ...data, gallery });
                  }}
                >
                  <option value="image">Photo</option>
                  <option value="video">Drive video</option>
                </select>
              </div>
              <input
                className={fieldClass}
                placeholder="Caption"
                value={g.caption ?? ""}
                onChange={(e) => {
                  const gallery = [...data.gallery];
                  gallery[idx] = { ...g, caption: e.target.value, alt: e.target.value || g.alt };
                  setData({ ...data, gallery });
                }}
              />
              {(g.kind === "video" || g.driveVideoUrl) && (
                <>
                  <input
                    className={fieldClass}
                    placeholder="Google Drive share link (Share → Copy link)"
                    value={g.driveVideoUrl ?? ""}
                    onChange={(e) => {
                      const gallery = [...data.gallery];
                      gallery[idx] = {
                        ...g,
                        kind: "video",
                        driveVideoUrl: e.target.value,
                        alt: g.alt || g.caption || "Drive video",
                      };
                      setData({ ...data, gallery });
                    }}
                  />
                  <p className="text-xs text-ink-soft">
                    In Google Drive: right-click video → Share → General access → Anyone with the link.
                  </p>
                </>
              )}
              {g.kind !== "video" && !g.driveVideoUrl && (
                <ImageUploadField
                  label="Gallery photo"
                  value={g.src}
                  onUploaded={(url) => {
                    const gallery = [...data.gallery];
                    gallery[idx] = { ...g, src: url, kind: "image" };
                    setData({ ...data, gallery });
                    setStatus(`Gallery image: ${url}`);
                  }}
                  onClear={() => {
                    const gallery = [...data.gallery];
                    gallery[idx] = { ...g, src: DEFAULT_COVER_IMAGE, kind: "image" };
                    setData({ ...data, gallery });
                    setStatus("Gallery photo reset to the default logo. Click Save all to apply.");
                  }}
                />
              )}
              <button
                type="button"
                className="text-sm text-red-700"
                onClick={() =>
                  setData({
                    ...data,
                    gallery: data.gallery.filter((_, i) => i !== idx),
                  })
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "achievements" && (
        <div className="space-y-4">
          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setData({
                ...data,
                achievements: [
                  ...(data.achievements ?? []),
                  { title: "New achievement", detail: "" },
                ],
              })
            }
          >
            + Add achievement
          </button>
          {(data.achievements ?? []).map((a, idx) => (
            <div key={idx} className="surface space-y-3 rounded-2xl p-4">
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className={fieldClass}
                  value={a.title}
                  onChange={(e) => {
                    const achievements = [...(data.achievements ?? [])];
                    achievements[idx] = { ...a, title: e.target.value };
                    setData({ ...data, achievements });
                  }}
                />
                <input
                  className={fieldClass}
                  value={a.detail}
                  onChange={(e) => {
                    const achievements = [...(data.achievements ?? [])];
                    achievements[idx] = { ...a, detail: e.target.value };
                    setData({ ...data, achievements });
                  }}
                />
              </div>
              <ImageUploadField
                label="Achievement image"
                value={a.image}
                onUploaded={(url) => {
                  const achievements = [...(data.achievements ?? [])];
                  achievements[idx] = { ...a, image: url };
                  setData({ ...data, achievements });
                  setStatus(`Achievement image: ${url}`);
                }}
                onClear={() => {
                  const achievements = [...(data.achievements ?? [])];
                  achievements[idx] = { ...a, image: undefined };
                  setData({ ...data, achievements });
                }}
              />
              <button
                type="button"
                className="text-sm text-red-700"
                onClick={() =>
                  setData({
                    ...data,
                    achievements: (data.achievements ?? []).filter((_, i) => i !== idx),
                  })
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
