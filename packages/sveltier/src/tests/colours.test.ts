import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

// Every colour the library paints comes from the theme: --sv-color-*, --sv-on-* and what is
// mixed from them. A literal colour in a stylesheet would ignore the theme, its mode and the
// app's own colours, so none is allowed. Inside url(…) colours draw a mask's shape and are
// skipped; `transparent` and `currentColor` are not colours of their own.
const LIB = join(import.meta.dirname, '..', 'lib');

const NAMED = `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue
blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson
cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta
darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray
darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick
floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey
honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon
lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink
lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow
lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple
mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue
mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid
palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum
powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen
seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal
thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen`.split(/\s+/);

const LITERAL = new RegExp(
	[
		String.raw`#[0-9a-f]{3,8}\b`,
		String.raw`\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(`,
		String.raw`(?<![\w-])(?:${NAMED.join('|')})(?![\w-])`
	].join('|'),
	'i'
);

function stylesheets(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return stylesheets(path);
		return entry.name.endsWith('.css') ? [path] : [];
	});
}

/** The `property: value` pairs of a stylesheet, without comments and url(…). */
function declarations(css: string): [string, string][] {
	const plain = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\((?:[^()]|\([^()]*\))*\)/g, '');
	return [...plain.matchAll(/([\w-]+)\s*:\s*([^;{}]+);/g)].map((match) => [
		match[1]!,
		match[2]!.trim()
	]);
}

/** The literal colours in a stylesheet, as `property: value`. */
function literals(css: string): string[] {
	return declarations(css)
		.filter(([, value]) => LITERAL.test(value))
		.map(([property, value]) => `${property}: ${value}`);
}

describe('colours in stylesheets', () => {
	it('recognises a literal colour, and lets theme colours and masks through', () => {
		expect(literals('.a { color: #fff; }')).toEqual(['color: #fff']);
		expect(literals('.a { background: oklch(0.5 0.1 200 / 0.4); }')).toHaveLength(1);
		expect(literals('.a { border-color: white; }')).toEqual(['border-color: white']);
		expect(literals('.a { color: var(--sv-x, black); }')).toHaveLength(1);
		expect(
			literals(
				'.a { color: var(--sv-color-text); white-space: nowrap; border-color: transparent; fill: currentColor; }'
			)
		).toEqual([]);
		expect(
			literals('.a { mask: url("data:image/svg+xml,%3Csvg stroke=\'black\'%3E%3C/svg%3E"); }')
		).toEqual([]);
	});

	it('come from the theme, never from a literal', () => {
		const found = stylesheets(LIB).flatMap((file) =>
			literals(readFileSync(file, 'utf8')).map((hit) => `${relative(LIB, file)}: ${hit}`)
		);
		expect(found).toEqual([]);
	});
});
