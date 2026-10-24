import { describe, expect, it } from 'vitest';
import { createLocale } from '../locale/locale.js';
import { textConstraintMessage, type TextConstraints } from './constraints.js';

const { t } = createLocale(() => ({}));
const check = (value: string, constraints: TextConstraints) =>
	textConstraintMessage(value, constraints, t);

describe('textConstraintMessage', () => {
	it('lets an empty value break only required', () => {
		expect(check('', { required: true, minlength: 3, type: 'email' })).toBe('Required');
		expect(check('', { minlength: 3, type: 'email', pattern: '\\d+' })).toBeUndefined();
	});

	it('counts as HTML does: spaces are a value', () => {
		expect(check('   ', { required: true })).toBeUndefined();
	});

	it('checks the lengths', () => {
		expect(check('ab', { minlength: 3 })).toBe('Enter at least 3 characters');
		expect(check('abcd', { maxlength: 3 })).toBe('Enter no more than 3 characters');
		expect(check('abc', { minlength: 3, maxlength: 3 })).toBeUndefined();
	});

	it('checks email addresses as the HTML specification defines them', () => {
		expect(check('ada@example.com', { type: 'email' })).toBeUndefined();
		expect(check('ada@localhost', { type: 'email' })).toBeUndefined();
		expect(check('ada', { type: 'email' })).toBe('Enter a valid email address');
		expect(check('ada@-example.com', { type: 'email' })).toBe('Enter a valid email address');
	});

	it('checks web addresses', () => {
		expect(check('https://sveltier.com/docs', { type: 'url' })).toBeUndefined();
		expect(check('sveltier.com', { type: 'url' })).toBe('Enter a valid web address');
	});

	it('matches the whole value against the pattern, and ignores an invalid pattern', () => {
		expect(check('12345', { pattern: '\\d{5}' })).toBeUndefined();
		expect(check('123456', { pattern: '\\d{5}' })).toBe('Enter a value in the requested format');
		expect(check('anything', { pattern: '(' })).toBeUndefined();
	});

	it('uses the app’s translation', () => {
		const french = createLocale(() => ({ messages: { required: 'Obligatoire' } }));
		expect(textConstraintMessage('', { required: true }, french.t)).toBe('Obligatoire');
	});
});
