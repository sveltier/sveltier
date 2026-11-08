// src/app.d.ts, or any .d.ts file in your project
import type { Color, Size } from '@sveltier/ui';

declare module '@sveltier/ui' {
	interface ComponentDefaults {
		PriceTag: { size: Size; color: Color; showSign: boolean };
	}
}
