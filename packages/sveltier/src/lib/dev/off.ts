// Production stand-ins for ./on.ts, imported as `#dev` outside the "development" condition:
// the same names and signatures, doing nothing.
import type * as On from './on.js';

export const DEV: boolean = false;
export const checkValue: typeof On.checkValue = () => {};
export const checkDate: typeof On.checkDate = () => {};
export const warnUnnamed: typeof On.warnUnnamed = () => {};
export const warnNamelessTrigger: typeof On.warnNamelessTrigger = () => {};
export const warnLostDescription: typeof On.warnLostDescription = () => {};
export const warnRenamed: typeof On.warnRenamed = () => {};
export const warnMisplaced: typeof On.warnMisplaced = () => {};
export const warnDuplicates: typeof On.warnDuplicates = () => {};
export const warnOutsideList: typeof On.warnOutsideList = () => {};
export const warnRadioGroups: typeof On.warnRadioGroups = () => {};
export const warnPinned: typeof On.warnPinned = () => {};
export const warnUnthemed: typeof On.warnUnthemed = () => {};
