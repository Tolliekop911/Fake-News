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
    logo: { mark: "DHN", style: "monogram" },
    brand: {
      palette: {
        bg: "#ffffff", surface: "#f5f7f8", ink: "#0b1220", muted: "#55606e",
        primary: "#0e7490", primaryInk: "#ffffff", accent: "#0e7490", border: "#e4e8ec",
      },
      fonts: { heading: "Archivo", body: "Inter" },
      radius: "2px",
      feel: "bold health-news desk",
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
        bg: "#ffffff", surface: "#f7f6f4", ink: "#17130f", muted: "#6b6459",
        primary: "#e4572e", primaryInk: "#ffffff", accent: "#e4572e", border: "#e8e4de",
      },
      fonts: { heading: "Space Grotesk", body: "Inter" },
      radius: "4px",
      feel: "bold startup trade magazine",
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
        bg: "#ffffff", surface: "#f4f7f4", ink: "#10211a", muted: "#566259",
        primary: "#1f7a46", primaryInk: "#ffffff", accent: "#1f7a46", border: "#e2e8e3",
      },
      fonts: { heading: "Chivo", body: "Inter" },
      radius: "3px",
      feel: "bold clinical practice journal",
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
    logo: { mark: "AIR", style: "bracket" },
    brand: {
      palette: {
        bg: "#ffffff", surface: "#f5f5f8", ink: "#141627", muted: "#5f6276",
        primary: "#5b2be0", primaryInk: "#ffffff", accent: "#5b2be0", border: "#e6e4ee",
      },
      fonts: { heading: "Sora", body: "Inter" },
      radius: "4px",
      feel: "bold technical product-review",
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
        bg: "#ffffff", surface: "#f4f5f6", ink: "#111827", muted: "#4b5563",
        primary: "#1152c9", primaryInk: "#ffffff", accent: "#1152c9", border: "#e3e7ec",
      },
      fonts: { heading: "Archivo", body: "Inter" },
      radius: "2px",
      feel: "bold business newsroom",
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
