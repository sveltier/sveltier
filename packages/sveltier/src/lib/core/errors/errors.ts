import type { ErrorCode } from './codes.js';

/** The docs page that explains every error code, each under its own anchor. */
export const ERRORS_URL = 'https://sveltier.com/errors';

/**
 * An error of the library: `[sveltier SV4001] What happened and what to do. <link>`. The
 * message carries the values involved; the linked entry explains the code.
 */
export const sveltierError = (code: ErrorCode, message: string): Error =>
	new Error(`[sveltier ${code}] ${message} ${ERRORS_URL}#${code}`);
