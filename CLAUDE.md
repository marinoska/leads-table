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
