import entries from './size.config.js';
import { SIZE_DIR, slug } from './scripts/size-shared.js';

export default entries.map((entry) => ({
	name: entry.name,
	path: [`${SIZE_DIR}/out/${slug(entry.name)}/*.js`, `${SIZE_DIR}/out/${slug(entry.name)}/*.css`],
	limit: entry.limit,
	gzip: true
}));
