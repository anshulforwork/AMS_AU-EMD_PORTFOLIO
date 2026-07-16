import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "oxto-flywheel",
    title: "OXTO Flywheel Energy Storage",
    shortTitle: "Flywheel Storage",
    tagline: "High-speed kinetic storage with closed-loop motor control and EMS integration.",
    coverImage: "/media/projects/oxto-flywheel/overview.svg",
    problem:
      "Sites need fast energy buffering without the cycle wear of chemical batteries.",
    solution:
      "Designed and validated flywheel control loops, power electronics interfaces, and monitoring for safe spin-up, hold, and regenerative discharge.",
    architecture:
      "Motor and drive → encoder feedback → supervisory control → Modbus/CAN telemetry → EMS with safety interlocks.",
    technologies: ["STM32", "PLC", "CAN", "Modbus", "Python", "MATLAB"],
    duration: "2024 — Present",
    company: "Energy Storage R&D",
    role: "Research / Control Engineer",
    results: [
      "Stable closed-loop speed control across the operating envelope",
      "Real-time telemetry for RPM and system health",
      "Documented safety interlocks for overspeed and faults",
    ],
    futureScope: [
      "Predictive maintenance from vibration signatures",
      "Multi-unit fleet coordination via EMS",
    ],
    images: [
      {
        src: "/media/projects/oxto-flywheel/overview.svg",
        alt: "Flywheel system overview",
        caption: "System overview",
        date: "2024",
      },
      {
        src: "/media/projects/oxto-flywheel/testbench.svg",
        alt: "Flywheel test bench",
        caption: "Lab test bench",
        date: "2025",
      },
    ],
    downloads: [],
    featured: true,
  },
  {
    slug: "plc-edge-gateway",
    title: "Smart PLC Edge Gateway",
    shortTitle: "PLC Edge Gateway",
    tagline: "Shop-floor PLC traffic bridged cleanly to modern dashboards and EMS.",
    coverImage: "/media/projects/plc-edge-gateway/architecture.svg",
    problem:
      "Legacy PLCs speak Modbus while modern tools expect clean MQTT or REST data with buffering.",
    solution:
      "Built a Linux edge gateway that polls PLCs, normalizes tags, buffers offline, and publishes structured telemetry.",
    architecture:
      "PLC (Modbus TCP) → Edge Gateway → MQTT → operator dashboard and alarm path.",
    technologies: ["PLC", "Codesys", "Modbus", "Node-RED", "MQTT", "Docker", "Linux"],
    duration: "6 months",
    company: "Industrial Automation",
    role: "Automation Engineer",
    results: [
      "Unified tag model across PLC vendors",
      "Offline buffer prevented data loss during WAN outages",
    ],
    futureScope: ["TLS mutual auth", "Historian retention policies"],
    images: [
      {
        src: "/media/projects/plc-edge-gateway/architecture.svg",
        alt: "Gateway architecture",
        caption: "Edge data path",
        date: "2024",
      },
    ],
    downloads: [],
    featured: true,
  },
  {
    slug: "ems-scada",
    title: "EMS & SCADA Monitoring",
    shortTitle: "EMS / SCADA",
    tagline: "Energy management views with clear KPIs and operator-friendly screens.",
    coverImage: "/media/projects/ems-scada/dashboard.svg",
    problem:
      "Operators need one pane for storage, loads, and generation — not raw PLC tags.",
    solution:
      "Designed EMS screens, KPI aggregation, and alarm priorities that map to real decisions.",
    architecture:
      "Field I/O → PLC → tags → EMS visualization → operator setpoints.",
    technologies: ["SCADA", "EMS", "PLC", "Modbus", "Python"],
    duration: "Ongoing",
    role: "Systems Engineer",
    results: [
      "KPI board for power, SOC, and availability",
      "Severity-based alarm philosophy",
    ],
    futureScope: ["Forecast-aware dispatch", "Mobile operator view"],
    images: [
      {
        src: "/media/projects/ems-scada/dashboard.svg",
        alt: "EMS dashboard",
        caption: "Operator dashboard concept",
        date: "2025",
      },
    ],
    downloads: [],
    featured: true,
  },
  {
    slug: "can-stm32-control",
    title: "CAN Bus STM32 Control Node",
    shortTitle: "CAN / STM32",
    tagline: "Deterministic embedded node for sensors and actuators over CAN.",
    coverImage: "/media/projects/can-stm32-control/pcb.svg",
    problem:
      "Distributed devices need a robust fieldbus with priority and low latency.",
    solution:
      "Implemented STM32 firmware with CAN framing, heartbeat, and fault containment.",
    architecture:
      "Sensors → STM32 → CAN transceiver → supervisory PLC or gateway.",
    technologies: ["STM32", "C", "CAN", "FreeRTOS", "KiCAD"],
    duration: "4 months",
    role: "Embedded Developer",
    results: [
      "Stable multi-node heartbeat network",
      "Documented message map and bus-off recovery tests",
    ],
    futureScope: ["CAN FD migration", "OTA firmware pipeline"],
    images: [
      {
        src: "/media/projects/can-stm32-control/pcb.svg",
        alt: "PCB node",
        caption: "Control node concept",
        date: "2024",
      },
    ],
    downloads: [],
    featured: true,
  },
  {
    slug: "automation-rd-panel",
    title: "Industrial Automation R&D Panel",
    shortTitle: "R&D Panel",
    tagline: "Panel engineering for prototype cells — safety, I/O, and commissioning.",
    coverImage: "/media/projects/automation-rd-panel/cabinet.svg",
    problem:
      "R&D cells need flexible panels that stay safe while engineers iterate quickly.",
    solution:
      "Laid out cabinet logic, labeled I/O, and commissioning checklists aligned with PLC programs.",
    architecture:
      "Field devices → terminals → PLC I/O → HMI → safety relay chain.",
    technologies: ["TIA Portal", "Codesys", "TwinCAT", "HMI"],
    duration: "Project-based",
    company: "AARTECH",
    role: "Research Engineer",
    results: [
      "Faster bring-up with labeled I/O maps",
      "Safety relay chain verified before process enable",
    ],
    futureScope: ["Digital twin of panel wiring"],
    images: [
      {
        src: "/media/projects/automation-rd-panel/cabinet.svg",
        alt: "Control cabinet",
        caption: "Cabinet layout concept",
        date: "2025",
      },
    ],
    downloads: [],
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
