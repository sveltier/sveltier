import { resolve } from '$app/paths';

/**
 * The URL of a docs page from its nav path. resolve() type-checks literal paths, but a union
 * of every route is more than TypeScript checks against its overloads, so nav paths go
 * through as strings; the prerender crawl and the e2e suite check that each page exists.
 */
export const pageHref = (path: string): string => (resolve as (pathname: string) => string)(path);
