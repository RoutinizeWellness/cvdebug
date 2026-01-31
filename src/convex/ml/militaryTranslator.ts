/**
 * Military to Civilian Translator
 * Helps veterans bridge the gap by identifying military jargon that confuses ATS systems.
 */

export interface MilitaryTranslation {
    term: string;
    civilian: string;
    category: "leadership" | "operations" | "technical" | "general";
    impact: string;
}

const MILITARY_DICTIONARY: Record<string, MilitaryTranslation> = {
    // Leadership & Management
    "ncoic": {
        term: "NCOIC",
        civilian: "Department Manager / Team Lead",
        category: "leadership",
        impact: "Clarifies supervisory experience"
    },
    "oic": {
        term: "OIC",
        civilian: "Project Manager / Operations Director",
        category: "leadership",
        impact: "Demonstrates high-level accountability"
    },
    "xo": {
        term: "XO",
        civilian: "Chief of Staff / Operations Manager",
        category: "leadership",
        impact: "Highlights executive support role"
    },
    "co": {
        term: "CO",
        civilian: "CEO / Director",
        category: "leadership",
        impact: "Translates command to corporate leadership"
    },
    "commander": {
        term: "Commander",
        civilian: "Director / Senior Manager",
        category: "leadership",
        impact: "Shows senior leadership capacity"
    },
    "platoon leader": {
        term: "Platoon Leader",
        civilian: "Team Lead",
        category: "leadership",
        impact: "Supervisory role for 30+ personnel"
    },
    "squad leader": {
        term: "Squad Leader",
        civilian: "Team Supervisor",
        category: "leadership",
        impact: "Frontline management experience"
    },

    // Operations & Logistics
    "mos": {
        term: "MOS",
        civilian: "Job Specialty / Role",
        category: "general",
        impact: "Removes confusing code terminology"
    },
    "logistics": { // Specifically military phrasing often needs expanding
        term: "S4 / Supply Officer",
        civilian: "Supply Chain Manager / Logistics Coordinator",
        category: "operations",
        impact: "Aligns with corporate supply chain roles"
    },
    "operations officer": {
        term: "S3 / Operations Officer",
        civilian: "Operations Manager / COO",
        category: "operations",
        impact: "Direct translation to ops management"
    },
    "mission": {
        term: "Mission",
        civilian: "Project / Initiative",
        category: "general",
        impact: "Corporate-friendly project terminology"
    },
    "combat": {
        term: "Combat Experience",
        civilian: "High-pressure Crisis Management",
        category: "general",
        impact: "Reframes hazard pay as resilience"
    },

    // Technical & Comms
    "comms": {
        term: "Comms",
        civilian: "IT / Network Telecommunications",
        category: "technical",
        impact: "Expands slang to industry standard"
    },
    "signal": {
        term: "Signal Corps",
        civilian: "IT / Telecommunications Department",
        category: "technical",
        impact: "Identifies tech sector relevance"
    },
    "intel": {
        term: "Intelligence",
        civilian: "Data Analysis / Information Security",
        category: "technical",
        impact: "Pivots spy-talk to data science"
    }
};

export function detectMilitaryJargon(text: string): MilitaryTranslation[] {
    const findings: MilitaryTranslation[] = [];
    const lowerText = text.toLowerCase();

    for (const [key, translation] of Object.entries(MILITARY_DICTIONARY)) {
        // Use word boundaries to avoid false positives (e.g. 'command' inside 'recommend')
        // Escape the key just in case
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');

        if (regex.test(lowerText)) {
            findings.push(translation);
        }
    }

    return findings;
}

export function generateMilitaryTranslationReport(findings: MilitaryTranslation[]): string[] {
    return findings.map(f =>
        `Military Lingo Detected: "${f.term}". ATS may ignore this. 💡 Fix: Change to "${f.civilian}" to unlock ${f.impact}.`
    );
}
