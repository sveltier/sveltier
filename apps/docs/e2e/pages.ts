import { FLAT } from '../src/lib/docs/nav.ts';

/** Every page of the docs: the landing page plus every navigation entry. */
export const PAGES = ['/', ...FLAT.map((item) => `/${item.path}`)];
