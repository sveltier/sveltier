import { contrast, parseOklch } from '@sveltier/ui';
import { monolithLight } from '@sveltier/ui/themes/monolith';

const { text, background } = monolithLight.colors;
const ratio = contrast(parseOklch(text)!, parseOklch(background)!);
// ≥ 4.5 for body text (WCAG 1.4.3)
if (ratio < 4.5) console.warn(`Body text contrast is ${ratio.toFixed(2)}:1`);
