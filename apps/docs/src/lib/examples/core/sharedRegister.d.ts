// app.d.ts
import type { Color, Size, Variant } from '@sveltier/ui';

declare module '@sveltier/ui' {
	interface ComponentDefaults {
		Pill: { variant: Variant; size: Size; color: Color };
	}
}
