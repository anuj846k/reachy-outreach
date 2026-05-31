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
