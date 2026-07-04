import { prisma } from '../src/lib/prisma';

/**
 * Seed script — populate the database with 10,000 realistic leads.
 *
 * Run with: npx prisma db seed
 *
 * Requirements:
 * - Names, companies, and emails should look plausible (not "User1")
 * - Statuses distributed across: 'new', 'qualified', 'unqualified', 'contacted'
 * - Scores between 0 and 100
 * - createdAt dates spread across the last 90 days
 * - Should only seed if the table is empty (idempotent)
 */

async function main() {

  console.log('Seeding 10,000 leads...');

  // TODO: implement seeding logic
  // Hint: use prisma.lead.createMany({ data: [...] }) for fast bulk inserts
  // Note: SQLite has a limit of ~999 variables per query, so batch in chunks
  //       e.g. 500 leads per createMany call

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
