import OpenAI from 'openai';

const MODEL = 'gpt-4o-mini';
const MAX_TOKENS = 150;
const TIMEOUT_MS = 15_000;
// High, for varied phrasing across leads (default is 1.0; the max is 2.0).
const TEMPERATURE = 1.7;

/** Whether the enrichment integration is configured (an API key is present). */
export function isEnrichmentConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Asks the LLM for a short company summary based on the lead's website.
 *
 * The client is built lazily inside the call on purpose: `new OpenAI()` throws
 * synchronously when there's no key, so constructing it at module load would
 * crash any import. Callers must gate on isEnrichmentConfigured() first.
 */
export async function researchCompany(website: string): Promise<string> {
  const client = new OpenAI({ maxRetries: 0, timeout: TIMEOUT_MS });

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    messages: [
      {
        role: 'system',
        content:
          'You write short, grounded company profiles for a sales CRM from a website domain. Keep it plain and neutral, not promotional, and vary the scale honestly — a solo operator, a small or regional firm, a mid-market business, a group, a large corporation, or anything else that fits; these are examples, not a fixed list, so use your best guess. Infer a specific, concrete industry from the domain and commit to it; avoid defaulting to a generic "consultancy" or "firm". Structure each profile as: a short size-and-type marker, then a gerund phrase for what it does ("operating…", "serving…", "building…"), covering its industry and rough size in 2-3 sentences. Do not name the company or begin with "The company".',
      },
      {
        role: 'user',
        content: `Company domain: ${website}. Write the profile.`,
      },
    ],
  });

  const summary = completion.choices[0]?.message.content?.trim();
  if (!summary) throw new Error('Enrichment returned an empty summary');
  return summary;
}
