import { describe, expect, it } from 'vitest';
import { monolith, monolithDark, monolithLight } from '../../themes/monolith.js';
import { defineTheme } from './define.js';
import { themeCss, themeHead, themeScript } from './css.js';

const themes = monolith;
const light = 'monolith-light';
const dark = 'monolith-dark';

describe('themeCss', () => {
	const css = themeCss({ themes, light, dark, fallback: 'system' });

	it('wraps everything in the tokens layer after the layer order statement', () => {
		expect(css.startsWith('@layer sv.tokens,sv.base,sv.components,sv.utilities;')).toBe(true);
		expect(css).toContain('@layer sv.tokens{');
	});

	it('emits one rule per theme with colours, on- colours, variables and color-scheme', () => {
		expect(css).toContain('[data-sv-theme="monolith-dark"]{color-scheme:dark;');
		expect(css).toContain('[data-sv-theme="monolith-light"]{color-scheme:light;');
		expect(css).toContain(`--sv-color-primary:${monolithDark.colors.primary}`);
		expect(css).toContain(`--sv-on-primary:${monolithDark.colors['on-primary']}`);
		expect(css).toContain(`--sv-font-ui:${monolithLight.variables['font-ui']}`);
		expect(css).toContain(`--sv-duration-normal:${monolithLight.variables['duration-normal']}`);
	});

	it('maps "system" and a bare <html> to prefers-color-scheme', () => {
		expect(css).toContain(
			'@media (prefers-color-scheme:dark){[data-sv-theme="system"],:root:not([data-sv-theme]){color-scheme:dark;'
		);
		expect(css).toContain(
			'@media (prefers-color-scheme:light){[data-sv-theme="system"],:root:not('
		);
	});

	it('maps a bare <html> to a named fallback theme', () => {
		const named = themeCss({ themes, light, dark, fallback: dark });
		expect(named).toContain(':root:not([data-sv-theme]){color-scheme:dark;');
		expect(named).not.toContain(',:root:not(');
	});

	it('rejects unsafe names and values', () => {
		expect(() =>
			themeCss({
				themes: { 'a"]{}': monolithDark },
				light: 'a"]{}',
				dark: 'a"]{}',
				fallback: 'system'
			})
		).toThrow(/invalid theme name/);
		expect(() =>
			themeCss({
				themes: { system: monolithDark },
				light: 'system',
				dark: 'system',
				fallback: 'system'
			})
		).toThrow(/invalid theme name/);
		const evil = defineTheme({ colors: { primary: 'red}</style><script>alert(1)</script>' } });
		expect(() =>
			themeCss({ themes: { evil }, light: 'evil', dark: 'evil', fallback: 'system' })
		).toThrow(/unsafe value for "color-primary"/);
	});

	it('emits custom colours under --sv-color-*, whatever their name', () => {
		const custom = defineTheme({ colors: { 'ui-brand': 'oklch(0.5 0.1 300)' } });
		const out = themeCss({
			themes: { custom },
			light: 'custom',
			dark: 'custom',
			fallback: 'system'
		});
		expect(out).toContain('--sv-color-ui-brand:oklch(0.5 0.1 300)');
		expect(out).toContain('--sv-on-ui-brand:oklch(0.985 0.005 300)');
	});

	it('rejects unknown light, dark or fallback names', () => {
		expect(() => themeCss({ themes, light: 'paper', dark, fallback: 'system' })).toThrow(
			/unknown theme "paper"/
		);
	});
});

describe('themeScript', () => {
	it('only applies stored values from the allowed list', () => {
		const script = themeScript('sv-theme', ['system', dark, light]);
		expect(script).toContain('localStorage.getItem("sv-theme")');
		expect(script).toContain('["system","monolith-dark","monolith-light"].indexOf(t)>-1');
	});

	it('escapes "<" so the script cannot close its own tag', () => {
		expect(themeScript('</script>', [dark])).not.toContain('</script>');
	});
});

describe('themeHead', () => {
	it('adds a validated nonce to both tags', () => {
		expect(themeHead('a{}', 'x()', 'abc123+/=')).toBe(
			'<style id="sv-theme" nonce="abc123+/=">a{}</style><script nonce="abc123+/=">x()</script>'
		);
		expect(() => themeHead('a{}', '', '" onload="x')).toThrow(/invalid nonce/);
	});

	it('omits the script when there is none', () => {
		expect(themeHead('a{}', '')).toBe('<style id="sv-theme">a{}</style>');
	});
});
