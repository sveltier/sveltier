// Registers the test probe with the defaults system, the same way a component (or an app's
// own component) does.
import type { Density, Size, Variant } from '../../lib/core/props/types.js';

declare module '../../lib/core/defaults/context.js' {
	interface ComponentDefaults {
		Probe: { size: Size; variant: Variant; density: Density };
	}
}
