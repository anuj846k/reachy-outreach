export function buildLinkedInExtractionPrompt(
  linkedinData: Record<string, unknown>,
): string {
  return `Extract the company's offering details from this LinkedIn company data and return ONLY valid JSON.

LinkedIn Data:
${JSON.stringify(linkedinData, null, 2)}

Return format:
{
  "offeringSummary": "What the company does (2 sentences max)",
  "idealCustomerProfile": "Who they sell to / target audience",
  "customerProblems": "What customer pain points they solve (1 sentence)",
  "keyDifferentiators": "What makes them unique vs competitors",
  "proofPoints": "Evidence of credibility: employee count, founded year, followers, notable facts"
}`;
}

export function buildProspectExtractionPrompt(
  profileData: Record<string, unknown>,
): string {
  return `Extract prospect details from this LinkedIn profile or website data and return ONLY valid JSON.

Profile Data:
${JSON.stringify(profileData, null, 2)}

Return format:
{
  "name": "Full name",
  "jobTitle": "Current job title",
  "company": "Current company name",
  "companyDescription": "What their company does (1 sentence)",
  "bio": "Professional summary or about section (2-3 sentences)",
  "painPoints": "Inferred professional challenges based on role, industry, and experience",
  "skills": "Key skills or technologies mentioned, comma-separated"
}`;
}

export function parseProspectGeminiJson(text: string): {
  name: string | null;
  jobTitle: string | null;
  company: string | null;
  companyDescription: string | null;
  bio: string | null;
  painPoints: string | null;
  skills: string | null;
} {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    return {
      name: parsed.name || null,
      jobTitle: parsed.jobTitle || null,
      company: parsed.company || null,
      companyDescription: parsed.companyDescription || null,
      bio: parsed.bio || null,
      painPoints: parsed.painPoints || null,
      skills: parsed.skills || null,
    };
  } catch {
    return {
      name: null,
      jobTitle: null,
      company: null,
      companyDescription: null,
      bio: null,
      painPoints: null,
      skills: null,
    };
  }
}

export function parseGeminiJson(text: string): {
  offeringSummary: string | null;
  idealCustomerProfile: string | null;
  customerProblems: string | null;
  keyDifferentiators: string | null;
  proofPoints: string | null;
} {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    return {
      offeringSummary: parsed.offeringSummary || null,
      idealCustomerProfile: parsed.idealCustomerProfile || null,
      customerProblems: parsed.customerProblems || null,
      keyDifferentiators: parsed.keyDifferentiators || null,
      proofPoints: parsed.proofPoints || null,
    };
  } catch {
    return {
      offeringSummary: null,
      idealCustomerProfile: null,
      customerProblems: null,
      keyDifferentiators: null,
      proofPoints: null,
    };
  }
}
