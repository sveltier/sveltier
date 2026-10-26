import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as off from './off.js';
import * as on from './on.js';

const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
afterEach(() => warn.mockClear());

describe('development checks', () => {
	it('warn about a value outside its list, with the valid ones and a hint', () => {
		on.checkValue(
			'Button',
			'variant',
			'primary',
			['flat', 'tonal'],
			'To colour it, use color="primary".'
		);
		expect(warn).toHaveBeenCalledWith(
			`[sveltier SV2002] <Button> got variant="primary". Valid values: 'flat' | 'tonal'. To colour it, use color="primary". https://sveltier.com/errors#SV2002`
		);
	});

	it('say nothing about valid or missing values', () => {
		on.checkValue('Button', 'size', 'md', ['sm', 'md']);
		on.checkValue('Button', 'size', undefined, ['sm', 'md']);
		expect(warn).not.toHaveBeenCalled();
	});

	it('warn about a date that is not an ISO date, but not about none', () => {
		on.checkDate('DatePicker', 'min', '2026-10-26T09:30:00Z');
		expect(warn).toHaveBeenCalledWith(
			`[sveltier SV5002] <DatePicker> got min="2026-10-26T09:30:00Z", which is not a date as YYYY-MM-DD. Pass an ISO date with no time, such as "2026-10-26", or null for none. https://sveltier.com/errors#SV5002`
		);
		warn.mockClear();
		for (const value of ['2026-10-26', '', null, undefined])
			on.checkDate('Calendar', 'value', value);
		expect(warn).not.toHaveBeenCalled();
		on.checkDate('Calendar', 'value', '2026-02-30');
		expect(warn).toHaveBeenCalledOnce();
	});

	it('warn once per message', () => {
		on.checkValue('Chip', 'size', 'huge', ['sm', 'md']);
		on.checkValue('Chip', 'size', 'huge', ['sm', 'md']);
		expect(warn).toHaveBeenCalledOnce();
	});

	it('have production stand-ins with the same names that do nothing', () => {
		expect(Object.keys(off).sort()).toEqual(Object.keys(on).sort());
		expect(on.DEV).toBe(true);
		expect(off.DEV).toBe(false);
		off.checkValue('Button', 'variant', 'primary', ['flat']);
		off.checkDate('DatePicker', 'value', 'tomorrow');
		off.warnUnnamed('TextField', null);
		off.warnNamelessTrigger('Tooltip', {} as HTMLElement);
		expect(warn).not.toHaveBeenCalled();
	});

	it('are chosen by the package import map: development checks, otherwise stand-ins', () => {
		const pkg = JSON.parse(
			readFileSync(join(import.meta.dirname, '..', '..', '..', 'package.json'), 'utf8')
		);
		// No `default` target: svelte-package would rewrite #dev into a fixed relative path. Every
		// import of this ESM-only package matches `import`.
		expect(pkg.imports['#dev']).toEqual({
			types: './src/lib/dev/off.ts',
			development: './dist/dev/on.js',
			import: './dist/dev/off.js'
		});
	});
});
