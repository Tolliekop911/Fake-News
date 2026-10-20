// Publication configurations for the media network.
// Each entry drives one independent publication (its own domain, brand, categories,
// authors live in content/<slug>/authors.json). Working names/domains are provisional
// until the trademark + domain checks in docs/COMPLIANCE-CHECKLIST.md are completed.

export const network = {
  // Transparent ownership disclosure applied network-wide (see PART 7 of the brief).
  owner: "Cowboy Systems",
  ownerUrl: "https://www.cowboy-systems.com/",
  disclosure:
    "This publication is owned and operated by Cowboy Systems, a healthcare software company. " +
    "Coverage that features Cowboy Systems products is clearly labelled. We do not present " +
    "company-controlled content as independent journalism.",
  defaultLocale: "en-US",
};

/**
 * @typedef {Object} Publication
 * brand.fonts are Google Fonts families; see lib/design.js for how a palette becomes CSS.
 */
export const publications = [
  {
    slug: "digital-health-news",
    name: "Digital Health News",
    // Provisional — verify availability before purchase.
    domain: "digitalhealthnews.example",
    tagline: "Reporting on the technology reshaping care delivery.",
    description:
      "Digital Health News covers electronic health records, interoperability, AI-assisted " +
      "clinical documentation and the software transforming how clinics operate.",
    positioning: "Newsroom / industry news desk",
    logo: { mark: "◢◣", style: "monogram" },
    brand: {
      palette: {
        bg: "#ffffff", surface: "#f4f7fb", ink: "#0b1f3a", muted: "#5a6b84",
        primary: "#0b63c4", primaryInk: "#ffffff", accent: "#00b3a4", border: "#dce4ef",
      },
      fonts: { heading: "Libre Franklin", body: "Source Serif 4" },
      radius: "4px",
      feel: "crisp broadsheet news",
    },
    categories: [
      { slug: "ehr", name: "EHR & Records" },
      { slug: "interoperability", name: "Interoperability" },
      { slug: "ai-documentation", name: "AI Documentation" },
      { slug: "patient-engagement", name: "Patient Engagement" },
      { slug: "regulation-security", name: "Regulation & Security" },
      { slug: "products", name: "Products" },
    ],
    newsArticleEligible: true,
  },
  {
    slug: "healthtech-insider",
    name: "HealthTech Insider",
    domain: "healthtechinsider.example",
    tagline: "The business of building healthcare technology.",
    description:
      "HealthTech Insider follows the founders, products and partnerships behind digital-health " +
      "startups serving outpatient clinics.",
    positioning: "Founder / startup trade magazine",
    logo: { mark: "HTi", style: "wordmark" },
    brand: {
      palette: {
        bg: "#0e1116", surface: "#171c24", ink: "#f2f5f8", muted: "#9aa6b5",
        primary: "#ff6a3d", primaryInk: "#120a06", accent: "#ffd23f", border: "#2a313c",
      },
      fonts: { heading: "Space Grotesk", body: "Inter" },
      radius: "10px",
      feel: "dark, modern startup editorial",
    },
    categories: [
      { slug: "founders", name: "Founders" },
      { slug: "product", name: "Product" },
      { slug: "funding", name: "Funding & M&A" },
      { slug: "partnerships", name: "Partnerships" },
      { slug: "adoption", name: "Adoption" },
    ],
    newsArticleEligible: false,
  },
  {
    slug: "pt-practice-journal",
    name: "The PT Practice Journal",
    domain: "ptpracticejournal.example",
    tagline: "Running a better physical therapy practice.",
    description:
      "The PT Practice Journal is a practical resource for outpatient physical therapy owners and " +
      "managers on documentation, EHR selection, authorizations and clinic growth.",
    positioning: "Professional practice journal (primary Cowboy-relevant title)",
    logo: { mark: "PT", style: "seal" },
    brand: {
      palette: {
        bg: "#fbfaf7", surface: "#ffffff", ink: "#1c2b24", muted: "#5d6f66",
        primary: "#2f6d4f", primaryInk: "#ffffff", accent: "#c9892f", border: "#e2ddd1",
      },
      fonts: { heading: "Fraunces", body: "Newsreader" },
      radius: "2px",
      feel: "warm, trustworthy clinical journal",
    },
    categories: [
      { slug: "ehr-selection", name: "EHR Selection" },
      { slug: "documentation", name: "Documentation" },
      { slug: "authorizations", name: "Authorizations" },
      { slug: "revenue-cycle", name: "Revenue Cycle" },
      { slug: "patient-intake", name: "Intake & HEP" },
      { slug: "practice-growth", name: "Practice Growth" },
    ],
    newsArticleEligible: false,
  },
  {
    slug: "applied-ai-review",
    name: "Applied AI Review",
    domain: "appliedaireview.example",
    tagline: "Evaluating AI where it actually does the work.",
    description:
      "Applied AI Review evaluates AI documentation and workflow tools for business buyers, with a " +
      "clear eye on limitations, human review and measurable productivity.",
    positioning: "Technical evaluation / buyer review desk",
    logo: { mark: "/AI/", style: "bracket" },
    brand: {
      palette: {
        bg: "#0b0f1a", surface: "#13182a", ink: "#eef1f8", muted: "#8b94ad",
        primary: "#7c5cff", primaryInk: "#ffffff", accent: "#19c37d", border: "#262c42",
      },
      fonts: { heading: "Sora", body: "IBM Plex Sans" },
      radius: "12px",
      feel: "precise, technical, product-review",
    },
    categories: [
      { slug: "evaluations", name: "Evaluations" },
      { slug: "automation", name: "Automation" },
      { slug: "privacy-security", name: "Privacy & Security" },
      { slug: "productivity", name: "Productivity" },
      { slug: "limitations", name: "Limitations & Risk" },
    ],
    newsArticleEligible: false,
  },
  {
    slug: "medical-practice-business",
    name: "Medical Practice Business",
    domain: "medicalpracticebusiness.example",
    tagline: "The operational and financial side of running a clinic.",
    description:
      "Medical Practice Business covers revenue-cycle management, billing, software costs and the " +
      "operations of independent outpatient clinics.",
    positioning: "Business / operations trade publication",
    logo: { mark: "MPB", style: "wordmark" },
    brand: {
      palette: {
        bg: "#ffffff", surface: "#f3f4f6", ink: "#111827", muted: "#4b5563",
        primary: "#1f4e5f", primaryInk: "#ffffff", accent: "#d08700", border: "#e5e7eb",
      },
      fonts: { heading: "Archivo", body: "Lora" },
      radius: "6px",
      feel: "sober business broadsheet",
    },
    categories: [
      { slug: "revenue-cycle", name: "Revenue Cycle" },
      { slug: "billing", name: "Billing" },
      { slug: "software-costs", name: "Software Costs" },
      { slug: "operations", name: "Operations" },
      { slug: "vendor-selection", name: "Vendor Selection" },
    ],
    newsArticleEligible: false,
  },
];

export const bySlug = Object.fromEntries(publications.map((p) => [p.slug, p]));
