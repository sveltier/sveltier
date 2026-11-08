import { defineTheme } from '@sveltier/ui';
import { aurora, auroraDark } from '@sveltier/ui/themes/aurora';

// Aurora with a teal primary; everything else is Aurora's.
const teal = defineTheme({ colors: { primary: 'oklch(0.78 0.11 190)' } }, auroraDark);

export const themes = { ...aurora, 'aurora-teal': teal };
