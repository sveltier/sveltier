export const SIZE_DIR = '.size';

/** @param {string} name */
export function slug(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
