/**
 * @jest-environment node
 *
 * Auto-grading tests for GET /api/leads and POST /api/leads/[id]/enrich
 *
 * These run against the live Next.js dev server.
 * CoderPad will execute them via the runCommand in .coderpad/settings.json
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// ─── Types ──────────────────────────────────────────────

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  website: string;
  status: 'new' | 'qualified' | 'unqualified' | 'contacted';
  score: number;
  enrichment: string | null;
  createdAt: string;
}

interface LeadsResponse {
  data: Lead[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ─── Helpers ────────────────────────────────────────────

async function fetchLeads(params: Record<string, string> = {}): Promise<Response> {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${BASE_URL}/api/leads?${qs}` : `${BASE_URL}/api/leads`;
  return fetch(url);
}

async function fetchLeadsJson(params: Record<string, string> = {}): Promise<LeadsResponse> {
  const res = await fetchLeads(params);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── Connection check ───────────────────────────────────

beforeAll(async () => {
  const maxRetries = 60;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fetch(BASE_URL);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('Dev server did not start within 60 seconds');
}, 90_000);

// ═══════════════════════════════════════════════════════════════════
// 1. SEED DATA
// ═══════════════════════════════════════════════════════════════════

describe('Seed data', () => {
  test('seeds approximately 10,000 leads', async () => {
    const res = await fetchLeadsJson({ limit: '1' });
    expect(res.total).toBeGreaterThanOrEqual(9_000);
    expect(res.total).toBeLessThanOrEqual(11_000);
  });

  test('seeded leads have all required fields', async () => {
    const res = await fetchLeadsJson({ limit: '5' });
    for (const lead of res.data) {
      expect(lead).toHaveProperty('id');
      expect(lead).toHaveProperty('name');
      expect(lead).toHaveProperty('company');
      expect(lead).toHaveProperty('email');
      expect(lead).toHaveProperty('website');
      expect(lead).toHaveProperty('status');
      expect(lead).toHaveProperty('score');
      expect(lead).toHaveProperty('enrichment');
      expect(lead).toHaveProperty('createdAt');

      expect(typeof lead.id).toBe('string');
      expect(typeof lead.name).toBe('string');
      expect(typeof lead.company).toBe('string');
      expect(typeof lead.email).toBe('string');
      expect(typeof lead.website).toBe('string');
      expect(typeof lead.score).toBe('number');
      expect(typeof lead.createdAt).toBe('string');
    }
  });

  test('seeded leads have realistic data (not placeholder names)', async () => {
    const res = await fetchLeadsJson({ limit: '20' });
    const names = res.data.map((l) => l.name);
    const companies = res.data.map((l) => l.company);

    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBeGreaterThan(1);

    const uniqueCompanies = new Set(companies);
    expect(uniqueCompanies.size).toBeGreaterThan(1);

    for (const name of names) {
      expect(name).not.toMatch(/^User\d+$/i);
      expect(name.length).toBeGreaterThan(1);
    }
    for (const company of companies) {
      expect(company).not.toMatch(/^Company\d+$/i);
      expect(company.length).toBeGreaterThan(1);
    }
  });

  test('seeded leads have all 4 statuses represented', async () => {
    const res = await fetchLeadsJson({ limit: '100' });
    const statuses = new Set(res.data.map((l) => l.status));
    expect(statuses).toContain('new');
    expect(statuses).toContain('qualified');
    expect(statuses).toContain('unqualified');
    expect(statuses).toContain('contacted');
  });

  test('seeded leads have varied scores (not all identical)', async () => {
    const res = await fetchLeadsJson({ limit: '50' });
    const scores = new Set(res.data.map((l) => l.score));
    expect(scores.size).toBeGreaterThan(5);

    for (const lead of res.data) {
      expect(lead.score).toBeGreaterThanOrEqual(0);
      expect(lead.score).toBeLessThanOrEqual(100);
    }
  });

  test('seeded leads have createdAt dates spread over the last 90 days', async () => {
    // Sort by name (not the default createdAt desc) so the 100-row sample isn't
    // just the newest leads — which bunch into a few days — but is spread across
    // the full 90-day range.
    const res = await fetchLeadsJson({ limit: '100', sortBy: 'name' });
    const now = Date.now();
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

    const timestamps = res.data.map((l) => new Date(l.createdAt).getTime());
    const uniqueDays = new Set(
      timestamps.map((t) => new Date(t).toISOString().slice(0, 10))
    );

    for (const ts of timestamps) {
      expect(ts).toBeGreaterThan(ninetyDaysAgo - 24 * 60 * 60 * 1000);
      expect(ts).toBeLessThanOrEqual(now + 24 * 60 * 60 * 1000);
    }

    expect(uniqueDays.size).toBeGreaterThan(5);
  });

  test('seeded leads have valid email addresses', async () => {
    const res = await fetchLeadsJson({ limit: '20' });
    for (const lead of res.data) {
      expect(lead.email).toMatch(/.+@.+\..+/);
    }
  });

  test('seeded leads have plausible website domains', async () => {
    const res = await fetchLeadsJson({ limit: '20' });
    for (const lead of res.data) {
      expect(lead.website).toMatch(/.+\..+/);
      expect(lead.website.length).toBeGreaterThan(3);
    }
  });

  test('seeded leads have enrichment set to null', async () => {
    const res = await fetchLeadsJson({ limit: '20' });
    for (const lead of res.data) {
      expect(lead.enrichment).toBeNull();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 2. RESPONSE SHAPE
// ═══════════════════════════════════════════════════════════════════

describe('Response shape', () => {
  test('returns all required top-level fields', async () => {
    const res = await fetchLeadsJson();
    expect(res).toHaveProperty('data');
    expect(res).toHaveProperty('total');
    expect(res).toHaveProperty('limit');
    expect(res).toHaveProperty('offset');
    expect(res).toHaveProperty('hasMore');

    expect(Array.isArray(res.data)).toBe(true);
    expect(typeof res.total).toBe('number');
    expect(typeof res.limit).toBe('number');
    expect(typeof res.offset).toBe('number');
    expect(typeof res.hasMore).toBe('boolean');
  });

  test('defaults to limit=20 and offset=0', async () => {
    const res = await fetchLeadsJson();
    expect(res.limit).toBe(20);
    expect(res.offset).toBe(0);
    expect(res.data.length).toBe(20);
  });

  test('each lead includes website and enrichment fields', async () => {
    const res = await fetchLeadsJson({ limit: '5' });
    for (const lead of res.data) {
      expect(lead).toHaveProperty('website');
      expect(lead).toHaveProperty('enrichment');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 3. PAGINATION
// ═══════════════════════════════════════════════════════════════════

describe('Pagination', () => {
  test('respects custom limit', async () => {
    const res = await fetchLeadsJson({ limit: '5' });
    expect(res.data.length).toBe(5);
    expect(res.limit).toBe(5);
  });

  test('respects custom offset', async () => {
    const page1 = await fetchLeadsJson({ limit: '5', offset: '0' });
    const page2 = await fetchLeadsJson({ limit: '5', offset: '5' });

    const ids1 = page1.data.map((l) => l.id);
    const ids2 = page2.data.map((l) => l.id);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });

  test('hasMore is true when more results exist', async () => {
    const res = await fetchLeadsJson({ limit: '5', offset: '0' });
    expect(res.hasMore).toBe(true);
  });

  test('hasMore is false when at the end of results', async () => {
    const first = await fetchLeadsJson({ limit: '1' });
    const total = first.total;

    const res = await fetchLeadsJson({
      limit: '10',
      offset: String(total - 5),
    });
    expect(res.hasMore).toBe(false);
    expect(res.data.length).toBeLessThanOrEqual(5);
  });

  test('total reflects all matching leads, not just the page', async () => {
    const res = await fetchLeadsJson({ limit: '5' });
    expect(res.total).toBeGreaterThan(res.data.length);
    expect(res.total).toBeGreaterThanOrEqual(9_000);
  });

  test('offset beyond total returns empty data with correct total', async () => {
    const first = await fetchLeadsJson({ limit: '1' });
    const total = first.total;

    const res = await fetchLeadsJson({ offset: String(total + 1000) });
    expect(res.data.length).toBe(0);
    expect(res.total).toBe(total);
    expect(res.hasMore).toBe(false);
  });

  test('limit is capped at 100', async () => {
    const res = await fetchLeadsJson({ limit: '100' });
    expect(res.data.length).toBe(100);
  });
});

// ═══════════════════════════════════════════════════════════════════
// 4. FILTERING
// ═══════════════════════════════════════════════════════════════════

describe('Status filter', () => {
  test('filters by status=qualified', async () => {
    const res = await fetchLeadsJson({ status: 'qualified', limit: '50' });
    for (const lead of res.data) {
      expect(lead.status).toBe('qualified');
    }
    expect(res.data.length).toBeGreaterThan(0);
  });

  test('filters by status=new', async () => {
    const res = await fetchLeadsJson({ status: 'new', limit: '50' });
    for (const lead of res.data) {
      expect(lead.status).toBe('new');
    }
    expect(res.data.length).toBeGreaterThan(0);
  });

  test('total reflects filtered count, not full dataset', async () => {
    const all = await fetchLeadsJson({ limit: '1' });
    const qualified = await fetchLeadsJson({ status: 'qualified', limit: '1' });
    expect(qualified.total).toBeLessThan(all.total);
    expect(qualified.total).toBeGreaterThan(0);
  });

  test('pagination works correctly with status filter', async () => {
    const page1 = await fetchLeadsJson({
      status: 'qualified',
      limit: '5',
      offset: '0',
    });
    const page2 = await fetchLeadsJson({
      status: 'qualified',
      limit: '5',
      offset: '5',
    });

    for (const lead of [...page1.data, ...page2.data]) {
      expect(lead.status).toBe('qualified');
    }

    const ids1 = page1.data.map((l) => l.id);
    const ids2 = page2.data.map((l) => l.id);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });
});

describe('Search filter', () => {
  test('search matches on name, company, or email (case-insensitive)', async () => {
    const sample = await fetchLeadsJson({ limit: '1' });
    const targetLead = sample.data[0];

    const companySubstr = targetLead.company.slice(0, 4).toLowerCase();
    const res = await fetchLeadsJson({ search: companySubstr, limit: '100' });

    expect(res.data.length).toBeGreaterThan(0);

    for (const lead of res.data) {
      const matchesName = lead.name.toLowerCase().includes(companySubstr);
      const matchesCompany = lead.company.toLowerCase().includes(companySubstr);
      const matchesEmail = lead.email.toLowerCase().includes(companySubstr);
      expect(matchesName || matchesCompany || matchesEmail).toBe(true);
    }
  });

  test('search total reflects filtered results', async () => {
    const all = await fetchLeadsJson({ limit: '1' });
    const searched = await fetchLeadsJson({ search: 'zzzznonexistent', limit: '1' });
    expect(searched.total).toBe(0);
    expect(searched.data.length).toBe(0);
    expect(all.total).toBeGreaterThan(0);
  });

  test('search combined with status filter', async () => {
    const qualified = await fetchLeadsJson({ status: 'qualified', limit: '1' });
    if (qualified.data.length === 0) return;

    const targetName = qualified.data[0].name.slice(0, 3).toLowerCase();
    const res = await fetchLeadsJson({
      search: targetName,
      status: 'qualified',
      limit: '50',
    });

    for (const lead of res.data) {
      expect(lead.status).toBe('qualified');
      const matches =
        lead.name.toLowerCase().includes(targetName) ||
        lead.company.toLowerCase().includes(targetName) ||
        lead.email.toLowerCase().includes(targetName);
      expect(matches).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 5. SORTING
// ═══════════════════════════════════════════════════════════════════

describe('Sorting', () => {
  test('sorts by score descending', async () => {
    const res = await fetchLeadsJson({
      sortBy: 'score',
      sortOrder: 'desc',
      limit: '20',
    });
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i - 1].score).toBeGreaterThanOrEqual(res.data[i].score);
    }
  });

  test('sorts by score ascending', async () => {
    const res = await fetchLeadsJson({
      sortBy: 'score',
      sortOrder: 'asc',
      limit: '20',
    });
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i - 1].score).toBeLessThanOrEqual(res.data[i].score);
    }
  });

  test('sorts by name ascending', async () => {
    const res = await fetchLeadsJson({
      sortBy: 'name',
      sortOrder: 'asc',
      limit: '20',
    });
    for (let i = 1; i < res.data.length; i++) {
      expect(
        res.data[i - 1].name.localeCompare(res.data[i].name)
      ).toBeLessThanOrEqual(0);
    }
  });

  test('sorts by createdAt descending (default)', async () => {
    const res = await fetchLeadsJson({ limit: '20' });
    for (let i = 1; i < res.data.length; i++) {
      const prev = new Date(res.data[i - 1].createdAt).getTime();
      const curr = new Date(res.data[i].createdAt).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  test('sorting works with filters applied', async () => {
    const res = await fetchLeadsJson({
      status: 'qualified',
      sortBy: 'score',
      sortOrder: 'asc',
      limit: '20',
    });
    for (const lead of res.data) {
      expect(lead.status).toBe('qualified');
    }
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i - 1].score).toBeLessThanOrEqual(res.data[i].score);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// 6. VALIDATION (400 errors)
// ═══════════════════════════════════════════════════════════════════

describe('Input validation', () => {
  test('returns 400 for negative limit', async () => {
    const res = await fetchLeads({ limit: '-1' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for non-numeric limit', async () => {
    const res = await fetchLeads({ limit: 'abc' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for limit exceeding 100', async () => {
    const res = await fetchLeads({ limit: '101' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for negative offset', async () => {
    const res = await fetchLeads({ offset: '-5' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for non-numeric offset', async () => {
    const res = await fetchLeads({ offset: 'xyz' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for invalid status value', async () => {
    const res = await fetchLeads({ status: 'banana' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for invalid sortBy value', async () => {
    const res = await fetchLeads({ sortBy: 'invalid' });
    expect(res.status).toBe(400);
  });

  test('returns 400 for invalid sortOrder value', async () => {
    const res = await fetchLeads({ sortOrder: 'sideways' });
    expect(res.status).toBe(400);
  });

  test('400 response includes an error message', async () => {
    const res = await fetchLeads({ limit: '-1' });
    const body = await res.json();
    const hasError =
      body.error || body.message || body.errors || body.detail;
    expect(hasError).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════════════
// 7. BONUS: ENRICHMENT ENDPOINT
// ═══════════════════════════════════════════════════════════════════

describe('Enrichment endpoint (bonus)', () => {
  test('returns 404 for non-existent lead', async () => {
    const res = await fetch(`${BASE_URL}/api/leads/nonexistent-id-12345/enrich`, {
      method: 'POST',
    });
    expect(res.status).toBe(404);
  });

  test('returns 400 for already enriched lead', async () => {
    // First, get a lead
    const leads = await fetchLeadsJson({ limit: '1' });
    if (leads.data.length === 0) return;
    const lead = leads.data[0];

    // Enrich it
    const firstEnrich = await fetch(`${BASE_URL}/api/leads/${lead.id}/enrich`, {
      method: 'POST',
    });

    // If enrichment isn't implemented, skip this test
    if (firstEnrich.status === 501 || firstEnrich.status === 404) return;

    // Try to enrich again — should get 400
    const secondEnrich = await fetch(`${BASE_URL}/api/leads/${lead.id}/enrich`, {
      method: 'POST',
    });
    expect(secondEnrich.status).toBe(400);
  });

  test('enrichment returns updated lead with enrichment text', async () => {
    // Get a lead that hasn't been enriched
    const leads = await fetchLeadsJson({ limit: '10' });
    const unenriched = leads.data.find((l) => l.enrichment === null);
    if (!unenriched) return;

    const res = await fetch(`${BASE_URL}/api/leads/${unenriched.id}/enrich`, {
      method: 'POST',
    });

    // If enrichment isn't implemented, skip
    if (res.status === 501) return;

    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.enrichment).toBeTruthy();
    expect(typeof updated.enrichment).toBe('string');
    expect(updated.enrichment.length).toBeGreaterThan(10);
    expect(updated.id).toBe(unenriched.id);
  });

  test('enrichment persists in the database', async () => {
    // Get a lead that has been enriched (from previous test)
    const leads = await fetchLeadsJson({ limit: '10' });
    const enriched = leads.data.find((l) => l.enrichment !== null);

    // If no enriched leads found, bonus wasn't implemented — skip
    if (!enriched) return;

    expect(enriched.enrichment).toBeTruthy();
    expect(typeof enriched.enrichment).toBe('string');
    expect(enriched.enrichment!.length).toBeGreaterThan(10);
  });
});