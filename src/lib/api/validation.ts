import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

/** Format a Zod validation failure into a 400 response ({ error, issues }). */
export function validationError(error: ZodError, message = 'Invalid query parameters') {
  return NextResponse.json(
    { error: error.issues[0]?.message ?? message, issues: error.issues },
    { status: 400 },
  );
}

/** Parse a URLSearchParams against a Zod schema (return type is inferred from the schema). */
export function parseSearchParams<T extends z.ZodTypeAny>(searchParams: URLSearchParams, schema: T) {
  return schema.safeParse(Object.fromEntries(searchParams));
}
