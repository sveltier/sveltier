// Production stand-ins for ./on.ts, imported as `#dev` outside the "development" condition:
// the same names and signatures, doing nothing.
import type * as On from './on.js';

export const DEV: boolean = false;
export const checkValue: typeof On.checkValue = () => {};
export const warnUnnamed: typeof On.warnUnnamed = () => {};
export const warnNamelessTrigger: typeof On.warnNamelessTrigger = () => {};
export const warnMisplaced: typeof On.warnMisplaced = () => {};
export const warnDuplicates: typeof On.warnDuplicates = () => {};
