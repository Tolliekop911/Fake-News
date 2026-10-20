// Generates data/briefs.json — 20 editorial briefs per publication (100 total).
// Briefs are TOPIC PLANS, not finished articles. They record intent, keyword target,
// angle and research needs so the editorial team can research and write real content.
// Run: node data/generate-briefs.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Each topic: [headline, primaryKeyword, searchIntent, cowboyConnection]
// cowboyConnection: null = none; string = legitimate connection note.
const topics = {
  "digital-health-news": {
    audience: "Healthcare executives, clinic owners, physicians, PTs, health IT buyers",
    sources: ["ONC / HealthIT.gov", "HL7 / FHIR documentation", "peer-reviewed health informatics journals", "vendor product documentation"],
    items: [
      ["How AI Is Changing Clinical Documentation in 2026", "ai clinical documentation", "informational", "Cowboy offers AI-assisted documentation; relevant as a disclosed example"],
      ["What Healthcare Providers Should Know Before Choosing an EHR", "choosing an ehr", "commercial investigation", "Cowboy is an EHR vendor; general framework only"],
      ["The Evolution of Electronic Health Records in Outpatient Care", "electronic health records outpatient", "informational", null],
      ["How Digital Patient Intake Can Improve Clinic Workflows", "digital patient intake", "informational", "Cowboy includes intake features"],
      ["What Healthcare Providers Need to Know About Interoperability", "healthcare interoperability", "informational", null],
      ["How Healthcare Organizations Can Evaluate AI Documentation Tools", "evaluate ai documentation tools", "commercial investigation", "Cowboy as a disclosed example"],
      ["Understanding the Role of Automation in Modern Medical Practices", "healthcare automation", "informational", "Cowboy automation features, disclosed"],
      ["Key Questions to Ask Before Replacing Your Clinic's Software", "replacing clinic software", "commercial investigation", "Cowboy as migration target, disclosed"],
      ["What FHIR Means for Small Healthcare Practices", "fhir for small practices", "informational", null],
      ["How Patient Portals Affect Engagement and Outcomes", "patient portal engagement", "informational", null],
      ["Data Security Basics Every Clinic Should Understand", "clinic data security", "informational", null],
      ["How Cloud EHRs Differ From On-Premise Systems", "cloud ehr vs on premise", "commercial investigation", "Cowboy is cloud-based, disclosed"],
      ["What HIPAA Requires of Healthcare Software (Plain Language)", "hipaa healthcare software", "informational", null],
      ["How to Read an EHR Vendor's Security Documentation", "ehr vendor security", "informational", null],
      ["The Real Cost of Clinical Documentation Burden", "documentation burden", "informational", "Cowboy addresses documentation time, disclosed"],
      ["How Interoperability Standards Are Evolving", "interoperability standards 2026", "informational", null],
      ["What Clinics Should Know About AI and Patient Privacy", "ai patient privacy", "informational", null],
      ["A Buyer's Guide to Telehealth-Ready EHR Features", "telehealth ehr features", "commercial investigation", null],
      ["How Small Practices Can Approach Digital Transformation", "digital transformation small practice", "informational", "Cowboy as outpatient example, disclosed"],
      ["Questions to Ask Before Signing an EHR Contract", "ehr contract questions", "commercial investigation", "Cowboy as disclosed example"],
    ],
  },
  "healthtech-insider": {
    audience: "Healthcare entrepreneurs, founders, investors, technology executives",
    sources: ["founder interviews (with consent)", "public funding announcements", "company documentation", "industry analyst reports"],
    items: [
      ["What It Takes to Build an EHR Platform for Outpatient Clinics", "building an ehr platform", "informational", "Cowboy's own build experience, disclosed"],
      ["The Challenges Healthcare Technology Startups Face When Launching", "healthtech startup challenges", "informational", "Cowboy as disclosed example"],
      ["How Physician-Led Companies Approach Healthcare Software Development", "physician led healthtech", "informational", "Cowboy founder perspective if verified"],
      ["What Healthcare Technology Buyers Should Evaluate in a New Vendor", "evaluating healthtech vendor", "commercial investigation", null],
      ["How Smaller HealthTech Companies Can Compete With Established Vendors", "healthtech competing with incumbents", "informational", "Cowboy as disclosed example"],
      ["Understanding the Costs of Building Healthcare Software", "cost of building healthcare software", "informational", null],
      ["What Clinic Owners Want From the Next Generation of HealthTech", "clinic owner software needs", "informational", null],
      ["How to Evaluate a Healthcare Technology Startup's Product Claims", "evaluating product claims healthtech", "commercial investigation", null],
      ["How HealthTech Startups Approach HIPAA From Day One", "healthtech hipaa compliance", "informational", null],
      ["What Investors Look For in Early-Stage HealthTech", "healthtech investment criteria", "informational", null],
      ["How to Price Healthcare SaaS for Small Clinics", "healthcare saas pricing", "informational", "Cowboy pricing approach, disclosed if verified"],
      ["Building Trust as a New Healthcare Software Vendor", "healthcare vendor trust", "informational", "Cowboy as disclosed example"],
      ["How Niche Focus Helps HealthTech Startups Win", "niche healthtech strategy", "informational", "Cowboy's outpatient PT focus, disclosed"],
      ["What a HealthTech Go-To-Market Actually Looks Like", "healthtech go to market", "informational", null],
      ["How Startups Handle Data Migration for New Customers", "healthtech data migration", "informational", "Cowboy migration approach, disclosed"],
      ["The Role of Customer Support in Healthcare Software Retention", "healthcare software support", "informational", null],
      ["How HealthTech Founders Validate a Product Idea", "validating healthtech idea", "informational", null],
      ["What Partnerships Mean for a Growing HealthTech Company", "healthtech partnerships", "informational", null],
      ["How to Build a Healthcare Software Roadmap", "healthcare software roadmap", "informational", null],
      ["Lessons From Scaling an Outpatient Software Company", "scaling outpatient software", "informational", "Cowboy's experience if verified, disclosed"],
    ],
  },
  "pt-practice-journal": {
    audience: "Physical therapists, practice owners, clinic managers, outpatient rehab businesses",
    sources: ["APTA", "CMS outpatient therapy guidance", "payer policy documentation", "vendor documentation"],
    items: [
      ["How to Choose an EHR for a Physical Therapy Clinic", "ehr for physical therapy clinic", "commercial investigation", "Cowboy is a PT EHR; general framework, disclosed"],
      ["A Practical Guide to Physical Therapy Documentation Workflows", "pt documentation workflow", "informational", "Cowboy documentation features, disclosed"],
      ["What to Look for in Physical Therapy Practice Management Software", "pt practice management software", "commercial investigation", "Cowboy is a vendor, disclosed"],
      ["How Clinics Can Evaluate Documentation Time and Administrative Work", "pt documentation time", "informational", "Cowboy addresses this, disclosed"],
      ["Understanding Insurance Authorizations in Outpatient Physical Therapy", "pt insurance authorizations", "informational", "Cowboy tracks authorizations, disclosed"],
      ["How to Compare Physical Therapy Software Pricing", "physical therapy software pricing", "commercial investigation", "Cowboy pricing, disclosed if verified"],
      ["What to Consider When Moving From One EHR to Another", "switching pt ehr", "commercial investigation", "Cowboy as migration target, disclosed"],
      ["How to Evaluate Patient Intake and Home Exercise Software", "pt intake hep software", "commercial investigation", "Cowboy intake/HEP features, disclosed"],
      ["Questions to Ask Before Switching Your Physical Therapy EHR", "switching physical therapy ehr questions", "commercial investigation", "Cowboy as disclosed example"],
      ["How to Assess Whether Practice Automation Is Saving Time", "pt practice automation", "informational", "Cowboy automation, disclosed"],
      ["Understanding the Plan of Care in Outpatient PT Documentation", "pt plan of care documentation", "informational", null],
      ["How to Reduce Claim Denials in a PT Practice", "pt claim denials", "informational", "Cowboy billing features, disclosed"],
      ["What Goes Into a Compliant PT Progress Note", "pt progress note requirements", "informational", null],
      ["How Front-Desk Workflows Affect PT Clinic Throughput", "pt front desk workflow", "informational", null],
      ["How to Measure Patient No-Show Rates and Reduce Them", "pt no show rate", "informational", null],
      ["Understanding the 8-Minute Rule in Outpatient Therapy Billing", "8 minute rule physical therapy", "informational", null],
      ["How to Onboard Staff to a New PT EHR", "pt ehr onboarding", "informational", "Cowboy onboarding, disclosed"],
      ["What to Know About Home Exercise Program Adherence", "home exercise program adherence", "informational", "Cowboy HEP features, disclosed"],
      ["How Small PT Clinics Can Approach Growth", "pt clinic growth", "informational", null],
      ["How to Build a Documentation Audit Process for Your Clinic", "pt documentation audit", "informational", null],
    ],
  },
  "applied-ai-review": {
    audience: "Technology buyers, business owners, developers, healthcare executives, AI decision-makers",
    sources: ["vendor documentation", "NIST AI risk resources", "peer-reviewed AI evaluation literature", "primary benchmarking where available"],
    items: [
      ["How to Evaluate AI Documentation Software", "evaluate ai documentation software", "commercial investigation", "Cowboy as disclosed example among others"],
      ["AI Automation vs Traditional Software: Key Differences", "ai automation vs traditional software", "informational", null],
      ["How Businesses Can Measure Productivity Improvements From AI", "measure ai productivity", "informational", null],
      ["What Buyers Should Ask Before Adopting an AI Workflow Tool", "ai workflow tool questions", "commercial investigation", null],
      ["Understanding the Limitations of AI-Generated Documentation", "ai documentation limitations", "informational", "Cowboy's human-review approach, disclosed"],
      ["How Human Review Fits Into AI-Assisted Workflows", "human review ai workflow", "informational", "Cowboy requires human review, disclosed"],
      ["AI in Healthcare: Benefits, Risks, and Practical Considerations", "ai in healthcare risks", "informational", null],
      ["How to Compare AI Features Across Business Software Platforms", "compare ai features software", "commercial investigation", null],
      ["What 'Accuracy' Really Means for AI Documentation Tools", "ai documentation accuracy", "informational", null],
      ["How to Pilot an AI Tool Without Disrupting Your Team", "piloting ai tools", "informational", null],
      ["AI Privacy and Data Handling: What to Check", "ai data privacy checklist", "informational", null],
      ["When AI Automation Is the Wrong Choice", "when not to use ai automation", "informational", null],
      ["How to Write an AI Tool Evaluation Scorecard", "ai evaluation scorecard", "informational", null],
      ["Measuring the True Cost of AI Review and Correction", "ai review cost", "informational", "Cowboy review workflow, disclosed"],
      ["What Explainability Means for Business AI Tools", "ai explainability business", "informational", null],
      ["How to Detect AI Hallucinations in Generated Text", "detect ai hallucinations", "informational", null],
      ["AI Vendor Red Flags Buyers Should Watch For", "ai vendor red flags", "commercial investigation", null],
      ["How to Set Realistic Expectations for AI Productivity", "ai productivity expectations", "informational", null],
      ["Integrating AI Into Existing Software Stacks", "integrating ai into software", "informational", null],
      ["How to Govern AI Use Inside a Small Business", "ai governance small business", "informational", null],
    ],
  },
  "medical-practice-business": {
    audience: "Independent clinic owners, practice managers, outpatient executives, healthcare entrepreneurs",
    sources: ["CMS / Medicare guidance", "MGMA resources", "payer documentation", "vendor documentation"],
    items: [
      ["Understanding Revenue-Cycle Management for Outpatient Clinics", "revenue cycle management outpatient", "informational", "Cowboy RCM features, disclosed"],
      ["How to Compare Medical Practice Software Costs", "medical practice software cost", "commercial investigation", "Cowboy pricing, disclosed if verified"],
      ["What Clinic Owners Should Know About EHR Implementation", "ehr implementation", "informational", "Cowboy implementation, disclosed"],
      ["How to Evaluate Billing Automation Tools", "billing automation tools", "commercial investigation", "Cowboy billing, disclosed"],
      ["The Administrative Costs Clinic Owners Should Track", "clinic administrative costs", "informational", null],
      ["How to Compare Healthcare Software Contracts and Pricing", "healthcare software contracts", "commercial investigation", "Cowboy as disclosed example"],
      ["What to Consider When Outsourcing Medical Billing", "outsourcing medical billing", "commercial investigation", null],
      ["How to Measure the Operational Impact of Practice Management Software", "practice management software impact", "informational", "Cowboy as disclosed example"],
      ["Key Financial Metrics Every Clinic Owner Should Track", "clinic financial metrics", "informational", null],
      ["How to Reduce Days in Accounts Receivable", "reduce days in ar", "informational", "Cowboy reporting, disclosed"],
      ["Understanding Clean-Claim Rate and Why It Matters", "clean claim rate", "informational", null],
      ["How Staffing Decisions Affect Clinic Profitability", "clinic staffing costs", "informational", null],
      ["Budgeting for Healthcare Software as a Small Clinic", "healthcare software budget", "informational", null],
      ["How to Read a Payer Contract", "reading payer contracts", "informational", null],
      ["Building a Denial-Management Process That Works", "denial management process", "informational", "Cowboy workflow, disclosed"],
      ["How to Benchmark Your Clinic's Operational Efficiency", "clinic operational benchmarks", "informational", null],
      ["What to Know Before Opening a Second Clinic Location", "opening second clinic", "informational", null],
      ["How to Evaluate Total Cost of Ownership for Clinic Software", "clinic software total cost of ownership", "commercial investigation", "Cowboy as disclosed example"],
      ["Managing Cash Flow in a Seasonal Outpatient Practice", "clinic cash flow management", "informational", null],
      ["How to Transition Billing In-House vs Outsourced", "in house vs outsourced billing", "commercial investigation", null],
    ],
  },
};

function kebab(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

const briefs = [];
for (const [slug, cfg] of Object.entries(topics)) {
  cfg.items.forEach(([headline, primaryKeyword, searchIntent, cowboy], idx) => {
    briefs.push({
      id: `${slug}-${String(idx + 1).padStart(2, "0")}`,
      publicationSlug: slug,
      headline,
      intendedAudience: cfg.audience,
      searchIntent,
      primaryKeyword,
      // Secondary keywords are starting suggestions to be validated with real keyword research.
      secondaryKeywords: [primaryKeyword + " 2026", primaryKeyword + " guide"],
      uniqueAngle: `Practical, decision-oriented coverage for ${cfg.audience.split(",")[0].toLowerCase()} — distinct from thin overviews by focusing on how to decide and what to verify.`,
      questionsToAnswer: [
        `What does "${primaryKeyword}" actually mean for the reader's situation?`,
        "What are the concrete steps or criteria?",
        "What should the reader verify before acting?",
        "What are the limitations or risks?",
      ],
      researchRequired: "Confirm current facts, figures, rules and any product claims against primary sources before writing. Do not invent statistics or sources.",
      potentialSources: cfg.sources,
      internalLinking: "Link to related briefs in the same publication and to the relevant category page; avoid cannibalizing the same primary keyword.",
      cowboyConnection: cowboy,
      disclosureRequirements: cowboy
        ? "Owned-by-Cowboy disclosure applies network-wide. If this becomes a product walkthrough, comparison or sponsored piece, add the sponsored/company-content label and methodology note."
        : "Standard network ownership disclosure only; no product promotion.",
      status: "idea",
      landingPageUrl: `/${"category"}/PLACEHOLDER/${kebab(headline)}/`,
      lastReviewed: null,
    });
  });
}

const outPath = path.join(__dirname, "briefs.json");
fs.writeFileSync(outPath, JSON.stringify(briefs, null, 2));
console.log(`Wrote ${briefs.length} briefs to data/briefs.json`);
