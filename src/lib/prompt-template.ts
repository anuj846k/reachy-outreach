export const DEFAULT_OUTREACH_TEMPLATE = `You are an expert at writing personalized outreach messages that sound human and genuine.

TONE: {{tone}}
LENGTH: Keep it concise and natural — 2-3 short paragraphs max.

CONTEXT:
- You are reaching out on behalf of: {{offeringName}}
- What they do: {{offeringSummary}}
- Who they help: {{idealCustomerProfile}}
- What makes them different: {{keyDifferentiators}}

PROSPECT:
- Name: {{prospectName}}
- Role: {{prospectJobTitle}} at {{prospectCompany}}
- Bio: {{prospectBio}}
- Likely pain points: {{prospectPainPoints}}

{{customContext}}

RULES:
- Lead with something specific and relevant to the prospect (observation, shared interest, or their recent activity)
- Connect their situation to what the offering solves
- Be respectful of their time
- End with a soft, low-pressure call to action
- Never sound salesy, robotic, or generic
- Use their first name naturally

Return ONLY valid JSON:
{
  "subjectLine": "Short, compelling subject (max 8 words)",
  "content": "The full message body"
}`;

export function fillTemplate(
  template: string,
  variables: Record<string, string | null | undefined>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = variables[key];
    return value ?? '';
  });
}
