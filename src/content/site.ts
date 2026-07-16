export const site = {
  name: "Anshul Sahu",
  shortName: "AS",
  title: "Embedded Systems & Industrial Automation Engineer",
  roles: ["Embedded Systems", "Industrial Automation", "Energy Storage R&D"],
  tagline:
    "I design and validate control systems for industrial and energy applications — from embedded nodes to PLC-driven plants.",
  bio: "Research-minded engineer working across embedded firmware, PLC automation, EMS concepts, and flywheel energy storage. I care about clean architecture, safe systems, and work that reads clearly to both engineers and decision-makers.",
  email: "anshul.sahu@example.com",
  phone: "+91 9000000000",
  whatsapp: "919000000000",
  whatsappMessage:
    "Hi Anshul,%0A%0AI saw your portfolio.%0AI'd like to discuss...",
  linkedin: "https://linkedin.com/in/anshulsahu",
  github: "https://github.com/anshulsahu",
  calendly: "https://calendly.com",
  resumePath: "/media/resume/Anshul_Sahu_Resume.pdf",
  profileImage: "/media/profile/anshul.svg",
  domains: ["Embedded", "PLC", "EMS", "CAN", "IoT", "Flywheel", "SCADA"],
} as const;

export function whatsappUrl() {
  return `https://wa.me/${site.whatsapp}?text=${site.whatsappMessage}`;
}
