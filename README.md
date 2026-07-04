# Full-Stack Leads Table

Build a paginated API route and an infinite-scroll React table inside this Next.js app.  
The dataset is **10,000 leads** — your solution must handle this without loading them all at once.

---

## Setup

```bash
npm install
npm run prisma:db-init
npm run dev
```

In a second terminal, run the test suite:

```bash
npm test
```

> `npm test` boots the dev server automatically via `start-server-and-test`, so you don't
> need to keep `npm run dev` running — but it's useful for manual exploration.

Prisma is already configured with SQLite. The schema is in `prisma/schema.prisma`.

For the bonus AI task, copy `.env.example` to `.env` and fill in `OPENAI_API_KEY`.

---

## Schema

The `Lead` model is already defined in `prisma/schema.prisma`:

```prisma
model Lead {
  id         String   @id @default(cuid())
  name       String
  company    String
  email      String
  website    String
  status     String   // 'new' | 'qualified' | 'unqualified' | 'contacted'
  score      Int      // 0–100
  enrichment String?  // nullable — empty until AI-enriched
  createdAt  DateTime @default(now())

  @@index([status])
  @@index([score])
  @@index([createdAt])
}
```

A Prisma client instance is exported from `lib/prisma.ts`.

---

## Part 1 — API (`app/api/leads/route.ts`)

### Task 1: Seed the Database

Implement a seed script or seed-on-first-request mechanism that populates the database with **10,000 leads**.

- Names, companies, and emails should look plausible (not `"User1"`, `"Company2"`)
- Websites should match the company (e.g. company "Acme Corp" → `acme.com`)
- Statuses distributed across all 4 values: `new`, `qualified`, `unqualified`, `contacted`
- Scores vary between 0 and 100
- `createdAt` dates spread across the **last 90 days**
- `enrichment` should be `null` for all seeded leads
- Seeding should only run once (don't re-seed on every request)

> **Hint:** You can seed in `prisma/seed.ts` and run it via `npx prisma db seed`,
> or seed on first request if the table is empty — your choice.

### Task 2: GET /api/leads

Implement a paginated API route that queries the database with these **query params**:

| Param       | Type   | Default     | Notes                                                                     |
| ----------- | ------ | ----------- | ------------------------------------------------------------------------- |
| `limit`     | number | `20`        | Max `100`                                                                 |
| `offset`    | number | `0`         |                                                                           |
| `status`    | string | —           | Optional. One of: `new`, `qualified`, `unqualified`, `contacted`          |
| `search`    | string | —           | Optional. Case-insensitive partial match on `name`, `company`, or `email` |
| `sortBy`    | string | `createdAt` | One of: `name`, `score`, `createdAt`                                      |
| `sortOrder` | string | `desc`      | `asc` or `desc`                                                           |

**Response shape:**

```json
{
  "data": [],
  "total": 0,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

- `total` = total matching leads **after filters**, not the page size
- `hasMore` = `true` when more results exist beyond `offset + limit`
- Each lead in `data` should include all fields: `id`, `name`, `company`, `email`, `website`, `status`, `score`, `enrichment`, `createdAt`
- Use **Prisma queries** — not raw SQL, not fetching all records and filtering in JS

### Task 3: Validation

Return **400** with a clear error message for invalid inputs:

- Negative or non-numeric `limit` / `offset`
- `limit` exceeding 100
- Unknown `status` value
- Unknown `sortBy` value
- `sortOrder` not `asc` or `desc`

---

## Part 2 — React UI (`app/page.tsx` + components)

Build a `<LeadsTable />` component that consumes the API above.

### Task 4: Table

- Columns: **Name**, **Company**, **Email**, **Website**, **Status** (colored badge), **Score**, **Created At**
- Each row should render cleanly — no layout shifts
- Show a loading skeleton or spinner at the bottom while fetching

### Task 5: Infinite Scroll

- Load **20 leads** on initial render
- When the user scrolls near the bottom (~200px threshold), **fetch the next page** automatically
- Use the `offset` and `limit` params from the API
- **Stop fetching** when `hasMore` is `false`
- Show an **"All leads loaded"** indicator when done

### Task 6: Filtering & Search

> ⚠️ All filtering must happen **server-side via the API** — not client-side.

- **Search input** → calls API with `?search=` param (debounced, 300ms)
- **Status dropdown** → calls API with `?status=` param
  - Options: All / New / Qualified / Unqualified / Contacted
- When any filter changes, **reset to offset 0** and clear existing results

### Task 7: Sorting

- Click a **column header** to sort via `?sortBy=` and `?sortOrder=` API params
- **Toggle** between `asc` and `desc` on repeated clicks
- Show a **sort indicator arrow** on the active column

### Task 8: Error & Loading States

- **Full-page spinner** on initial load
- **Inline error** with a retry button if a fetch fails
- **No duplicate fetches** — disable scroll-loading while a request is in flight

---

## Part 3 — Bonus: AI Enrichment

> ⭐ This section is optional. Complete it after finishing Parts 1 and 2.

Add an AI-powered enrichment feature that researches a lead's company based on their website and saves a short summary.

### Task 9: Enrichment API (`app/api/leads/[id]/enrich/route.ts`)

Build a `POST /api/leads/[id]/enrich` endpoint:

- Looks up the lead by `id` from the database
- Calls an LLM (API key provided via `OPENAI_API_KEY` env var) with a prompt like:
  > "Research this company based on their website domain: {website}. Return a 2-3 sentence summary covering what the company does, their industry, and approximate size."
- Saves the LLM response to the lead's `enrichment` field in the database
- Returns the updated lead as JSON
- Returns **404** if the lead doesn't exist
- Returns **400** if the lead is already enriched (don't re-enrich)

### Task 10: Enrichment UI

Add an **Enrichment** column to the table:

- If `enrichment` is `null` → show an **"Enrich"** button in the cell
- Clicking the button:
  - Shows a **loading spinner** in that specific cell (not a full-page loader)
  - Calls `POST /api/leads/[id]/enrich`
  - On success: replaces the button with the enrichment text
  - On error: shows an error message with a **retry** button
- If `enrichment` already has content → display the text (no button)
- **Per-row loading** — enriching one lead should NOT block or affect other rows

---

## Hints

- All filtering, searching, and sorting is **server-side** — Prisma does the heavy lifting
- For the bonus: use any AI SDK you prefer (e.g. OpenAI SDK, Vercel AI SDK, LangChain, etc.) — install it via the terminal
- You can use any libraries already in `package.json` (or install new ones via the terminal)

---

## Evaluation

Your submission will be evaluated on:

1. ✅ **Correctness** — all automated tests pass (`npm test`)
2. 🧹 **Code quality** — clean structure, good naming, no dead code
3. 🔒 **Edge cases** — proper validation, error handling, empty states
4. ⚡ **Performance** — efficient Prisma queries (not fetching all 10k and filtering in JS)
5. ⭐ **Bonus** — AI enrichment working with per-row loading states

---

## Submission

Submit your solution by sharing **both** of the following together:

### 1. GitHub repository

- Push your completed code to a **public GitHub repository** (or a private repo with access granted to the reviewer)
- Make sure the repo includes everything needed to run the project (do **not** commit `node_modules/`, `.env`, or `prisma/dev.db`)
- The reviewer should be able to clone, run `npm install`, `npm run prisma:db-init`, `npm run dev`, and `npm test` without any extra steps

### 2. Loom video walkthrough

Record a **Loom video** (keep it **under 10 minutes**) that covers:

1. **Setup & run** — show `npm install`, `npm run prisma:db-init`, and `npm run dev` working
2. **Task-by-task UI demo** — walk through **each task one by one from the UI**, demonstrating:
   - Task 4: the rendered table with all columns
   - Task 5: infinite scroll loading more leads and the "All leads loaded" indicator
   - Task 6: search input and status dropdown filtering (server-side)
   - Task 7: clicking column headers to sort, with the active sort indicator
   - Task 8: loading spinner, error state, and retry behavior
   - Task 9 & 10 (if completed): the Enrich button, per-row loading, and saved enrichment text
3. **API demo** — hit the API in the browser or via curl, showing pagination, filtering, sorting, and validation errors
4. **Code walkthrough** — briefly explain your code structure and key decisions

### Sharing

Share **both the GitHub link and the Loom link together** in your submission message.
