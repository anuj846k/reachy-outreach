import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN!,
});

export function isLinkedInUrl(url: string): boolean {
  return url.includes('linkedin.com');
}

export async function scrapeLinkedInCompany(url: string) {
  const run = await client.actor('LpVuK3Zozwuipa5bp').call({
    queries: [url],
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items[0] as Record<string, unknown> | undefined;
}

