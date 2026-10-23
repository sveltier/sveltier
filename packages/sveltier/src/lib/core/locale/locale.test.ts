import { render } from 'svelte/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LocaleProbe from '../../../tests/fixtures/LocaleProbe.svelte';
import { createLocale, type LocaleOptions } from './locale.js';

const NOON = Date.UTC(2026, 9, 23, 12);

describe('locale formatting', () => {
	const en = createLocale(() => ({}));

	it('formats numbers, money and ratios for en-US by default', () => {
		expect(en.locale).toBe('en-US');
		expect(en.currency).toBe('USD');
		expect(en.formatNumber(1234.5)).toBe('1,234.5');
		expect(en.formatCurrency(1250)).toBe('$1,250.00');
		expect(en.formatPercent(0.0184, { minimumFractionDigits: 2 })).toBe('1.84%');
	});

	it('takes fraction digits from the currency and native options for the rest', () => {
		expect(en.formatCurrency(1250, 'JPY')).toBe('¥1,250');
		expect(en.formatCurrency(-3.5, 'EUR', { signDisplay: 'exceptZero' })).toBe('-€3.50');
		expect(en.formatNumber(2.5, { signDisplay: 'exceptZero' })).toBe('+2.5');
		expect(en.formatNumber(12_400_000, { notation: 'compact' })).toBe('12M');
		expect(en.formatNumber(12345678901234567890n)).toBe('12,345,678,901,234,567,890');
	});

	it('formats dates in the configured time zone, or the one passed per call', () => {
		const tokyo = createLocale(() => ({ timeZone: 'Asia/Tokyo' }));
		const evening = Date.UTC(2026, 9, 23, 20);
		expect(tokyo.formatDate(evening, { dateStyle: 'medium' })).toBe('Oct 24, 2026');
		expect(tokyo.formatDate(evening, { dateStyle: 'medium', timeZone: 'UTC' })).toBe(
			'Oct 23, 2026'
		);
	});

	it('follows the locale setting', () => {
		const gb = createLocale(() => ({ locale: 'en-GB', currency: 'GBP', timeZone: 'UTC' }));
		expect(gb.formatCurrency(1250)).toBe('£1,250.00');
		expect(gb.formatDate(NOON, { dateStyle: 'medium' })).toBe('23 Oct 2026');
	});

	it('describes time relative to now in the largest unit that fits', () => {
		expect(en.formatRelative(NOON, NOON)).toBe('now');
		expect(en.formatRelative(NOON - 120_000, NOON)).toBe('2 minutes ago');
		expect(en.formatRelative(NOON + 86_400_000, NOON)).toBe('tomorrow');
		expect(en.formatRelative(NOON - 3 * 86_400_000, NOON)).toBe('3 days ago');
		expect(en.formatRelative(new Date(NOON + 400 * 86_400_000), new Date(NOON))).toBe('next year');
	});
});

describe('locale messages', () => {
	it('returns English messages and merges overrides over them', () => {
		expect(createLocale(() => ({})).t('close')).toBe('Close');
		const de = createLocale(() => ({ messages: { close: 'Schließen' } }));
		expect(de.t('close')).toBe('Schließen');
		expect(de.t('loading')).toBe('Loading');
	});

	it('fills placeholders and leaves unknown ones as written', () => {
		const custom = createLocale(() => ({ messages: { loading: 'Loading {what} ({count})' } }));
		expect(custom.t('loading', { what: 'prices', count: 3 })).toBe('Loading prices (3)');
		expect(custom.t('loading', { what: 'prices' })).toBe('Loading prices ({count})');
	});
});

describe('locale engine', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('builds each Intl formatter once per locale and options', () => {
		const spy = vi.spyOn(Intl, 'NumberFormat');
		const au = createLocale(() => ({ locale: 'en-AU' }));
		au.formatNumber(1);
		au.formatNumber(2);
		au.formatCurrency(3);
		au.formatCurrency(4);
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('reads its settings on every call, so a provider can change them', () => {
		const settings: LocaleOptions = { currency: 'USD' };
		const locale = createLocale(() => settings);
		expect(locale.formatCurrency(5)).toBe('$5.00');
		settings.currency = 'EUR';
		expect(locale.currency).toBe('EUR');
		expect(locale.formatCurrency(5)).toBe('€5.00');
	});

	it('keeps working when its functions are destructured', () => {
		const { formatCurrency, t } = createLocale(() => ({ currency: 'EUR' }));
		expect(formatCurrency(1)).toBe('€1.00');
		expect(t('close')).toBe('Close');
	});

	it('renders through useLocale without browser globals', () => {
		const { body } = render(LocaleProbe, { props: { value: 1250 } });
		expect(body).toContain('$1,250.00|Close');
	});
});
