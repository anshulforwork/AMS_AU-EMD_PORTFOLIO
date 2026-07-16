import type { Experience } from "@/lib/types";

export const experience: Experience[] = [
  {
    id: "aartech",
    company: "AARTECH",
    role: "Research Engineer",
    period: "2024 — Present",
    summary:
      "Energy storage and industrial R&D — control validation, PLC/embedded integration, and technical documentation.",
    highlights: [
      "Flywheel energy storage control",
      "EMS / SCADA monitoring concepts",
      "Industrial panel R&D support",
    ],
  },
  {
    id: "embedded-dev",
    company: "Independent Projects",
    role: "Embedded Developer",
    period: "2023 — 2024",
    summary:
      "Firmware and fieldbus prototypes with STM32, CAN, and bench validation practices.",
    highlights: [
      "STM32 sensor nodes",
      "CAN bus multi-node networks",
      "IoT telemetry demos",
    ],
  },
];

export const certifications = [
  { title: "PLC Fundamentals", issuer: "Industry Course", year: "2024" },
  { title: "Embedded Systems with C", issuer: "Coursera", year: "2023" },
  { title: "Industrial Automation Essentials", issuer: "Company Training", year: "2024" },
];
