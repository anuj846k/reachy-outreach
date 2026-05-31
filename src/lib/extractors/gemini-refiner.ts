import { z } from 'zod';

export const offeringExtractionSchema = z.object({
  offeringSummary: z
    .string()
    .describe('What the company or product does (2 sentences max)'),
  idealCustomerProfile: z
    .string()
    .describe('Who they sell to / target audience'),
  customerProblems: z
    .string()
    .describe('What customer pain points they solve (1 sentence)'),
  keyDifferentiators: z
    .string()
    .describe('What makes them unique vs competitors'),
  proofPoints: z
    .string()
    .describe(
      'Evidence of credibility: employee count, founded year, followers, notable facts',
    ),
});

export type OfferingExtraction = z.infer<typeof offeringExtractionSchema>;

export const prospectExtractionSchema = z.object({
  name: z.string().describe('Full name of the person'),
  jobTitle: z.string().describe('Current job title or role'),
  company: z.string().describe('Current company or organization'),
  companyDescription: z
    .string()
    .describe('What their company does (1 sentence)'),
  bio: z
    .string()
    .describe('Professional summary or about section (2-3 sentences)'),
  painPoints: z
    .string()
    .describe(
      'Inferred professional challenges based on role, industry, and experience',
    ),
  skills: z
    .string()
    .describe('Key skills or technologies mentioned, comma-separated'),
});

export type ProspectExtraction = z.infer<typeof prospectExtractionSchema>;

export function buildLinkedInExtractionPrompt(
  linkedinData: Record<string, unknown>,
): string {
  return `Extract the company's offering details from this LinkedIn company data.

LinkedIn Data:
${JSON.stringify(linkedinData, null, 2)}`;
}

export function buildProspectExtractionPrompt(
  profileData: Record<string, unknown>,
): string {
  return `Extract prospect details from this LinkedIn profile or website data.

Profile Data:
${JSON.stringify(profileData, null, 2)}`;
}
