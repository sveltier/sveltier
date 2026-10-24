import { getContext, hasContext, setContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import { sveltierError } from '../errors/errors.js';

/** Breakpoints, from the narrowest viewport to the widest. */
export const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

/** The minimum width, in CSS px, of every breakpoint above `xs`. */
export type DisplayThresholds = Record<Exclude<Breakpoint, 'xs'>, number>;

export interface DisplayOptions {
	/** Minimum widths in CSS px. Defaults: sm 600, md 960, lg 1280, xl 1920, xxl 2560. */
	thresholds?: Partial<DisplayThresholds>;
	/** `mobile` is true below this breakpoint. Defaults to `md`. */
	mobileBreakpoint?: Exclude<Breakpoint, 'xs'>;
	/** Viewport width assumed during server rendering. Defaults to 0, mobile first. */
	ssrWidth?: number;
}

type Flags = { readonly [Name in Breakpoint]: boolean } & {
	readonly [
		Name in Exclude<Breakpoint, 'xs' | 'xxl'> as `${Name}AndUp` | `${Name}AndDown`
	]: boolean;
};

/** The viewport as `useDisplay()` sees it. Every field is reactive. */
export interface DisplayInstance extends Flags {
	/** The current breakpoint. */
	readonly name: Breakpoint;
	/** Whether the viewport is narrower than the mobile breakpoint. */
	readonly mobile: boolean;
	readonly thresholds: Readonly<DisplayThresholds>;
}

const DEFAULT_THRESHOLDS: DisplayThresholds = { sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 };

/**
 * Builds the breakpoint flags on one `MediaQuery` per threshold. Each flag reads only the
 * queries it needs, so a component is updated only when its own threshold is crossed.
 */
export function createDisplay({
	thresholds: custom,
	mobileBreakpoint = 'md',
	ssrWidth = 0
}: DisplayOptions = {}): DisplayInstance {
	const thresholds: DisplayThresholds = { ...DEFAULT_THRESHOLDS, ...custom };
	const widths = BREAKPOINTS.slice(1).map((name) => thresholds[name as keyof DisplayThresholds]);
	if (widths.some((width, i) => i > 0 && width <= widths[i - 1]!)) {
		throw sveltierError(
			'SV2001',
			`Display thresholds must increase from sm to xxl; got ${widths.join(', ')}.`
		);
	}
	const queries = widths.map((min) => new MediaQuery(`(min-width: ${min}px)`, ssrWidth >= min));
	// Whether the viewport is at breakpoint `i` or wider; every viewport is at least xs.
	const atLeast = (i: number): boolean => i === 0 || (queries[i - 1]?.current ?? false);
	const mobile = BREAKPOINTS.indexOf(mobileBreakpoint);

	const display = {
		get name() {
			let i = queries.length;
			while (i > 0 && !atLeast(i)) i--;
			return BREAKPOINTS[i];
		},
		get mobile() {
			return !atLeast(mobile);
		},
		thresholds
	};
	BREAKPOINTS.forEach((name, i) => {
		const define = (key: string, get: () => boolean) =>
			Object.defineProperty(display, key, { get, enumerable: true });
		define(name, () => atLeast(i) && !atLeast(i + 1));
		if (i > 0 && i < queries.length) {
			define(`${name}AndUp`, () => atLeast(i));
			define(`${name}AndDown`, () => !atLeast(i + 1));
		}
	});
	return display as DisplayInstance;
}

const KEY = Symbol('sveltier.display');
let shared: DisplayInstance | undefined;

/** Gives a subtree its display instance, built from the root's options. */
export const setDisplayContext = (display: DisplayInstance): DisplayInstance =>
	setContext(KEY, display);

/**
 * Returns the viewport breakpoints. Call it during component initialisation. Without a
 * provider it returns one shared instance with the default options.
 */
export function useDisplay(): DisplayInstance {
	return hasContext(KEY) ? getContext<DisplayInstance>(KEY) : (shared ??= createDisplay());
}
