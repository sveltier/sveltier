import entries from './size.config.js';
import { SIZE_DIR, slug } from './scripts/size-shared.js';

const EXTENSIONS = { js: ['js'], css: ['css'], all: ['js', 'css'] };

export default entries.map((entry) => ({
	name: entry.name,
	path: EXTENSIONS[entry.measure ?? 'all'].map(
		(extension) => `${SIZE_DIR}/out/${slug(entry.name)}/*.${extension}`
	),
	limit: entry.limit,
	gzip: true
}));
