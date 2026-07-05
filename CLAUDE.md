# Project instructions for Claude

## Rules

1. **Never commit without asking.** Do not run `git commit` or `git push` unless I
   explicitly ask for it in that same message. Staging changes, showing diffs, and
   preparing a commit message are fine — but always wait for my explicit go-ahead
   before actually creating a commit.

2. **Implement only when I ask.** A question is not an instruction. When I ask
   "how come…", "shouldn't we…", "what is…", "is there…", just answer — don't edit
   code, change the schema, or run migrations. Propose the change and wait for my "yes".

3. **Check framework best practices before implementing.** Before writing Next.js
   (or other framework) code, consult current best-practice/docs first — e.g. thin
   route handlers, `request.nextUrl.searchParams`, Zod schema validation, a stable
   secondary sort key for pagination, cursor pagination for large datasets.

4. **Layered API, thin controllers.** Structure API code as
   `route.ts → schema → service/repository → Prisma`. The route only parses the
   request, validates input (schema), calls the service/repository, and returns the
   response — no Prisma calls or business logic in the handler.

5. **Do not over-engineer.** Favor the simplest solution that works for this project's
   scale (a take-home leads table, not a distributed system). Follow **KISS** (prefer
   the obvious, boring solution over a clever one), **DRY** (extract only after real
   duplication appears, not speculatively), and **SOLID** (small, single-purpose units
   with clear boundaries) — but never add an abstraction, layer, config option, or
   dependency before it earns its place. No premature generalization, no dead code,
   no speculative "for later" hooks. Match effort to the task: easy, clean, readable,
   effective.

6. **Meaningful names — no single-letter variables.** Never name a variable with a
   single letter (`d`, `r`, `x`, …). Use a descriptive name that says what it holds
   (`date`, `rowIndex`, `lead`, `response`). The only accepted exception is a bare `_`
   for a genuinely unused argument.
