import { isTabbable, tabbable } from '@sveltier/ui';

const dialog = document.querySelector('dialog')!;
const confirm = dialog.querySelector('button')!;

const stops = tabbable(dialog); // what Tab reaches, in Tab order
stops[0]?.focus();
isTabbable(confirm); // false when disabled, hidden, inert, or tabindex="-1"
