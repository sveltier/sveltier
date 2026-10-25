import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Size, Space } from '../../core/props/types.js';

/** The Container props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface ContainerDefaults {
	/**
	 * The most it spans, on half steps of φ: `xs` 42.36rem, `sm` 53.88rem, `md` 68.54rem, `lg`
	 * 87.19rem, `xl` 110.9rem.
	 * @default 'lg'
	 */
	size: Size;
}

/** The Row props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface RowDefaults {
	/**
	 * The space between columns and between rows of columns, on the space scale: `21` is
	 * `--sv-space-21`.
	 * @default 21
	 */
	gap: Space;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Container: ContainerDefaults;
		Row: RowDefaults;
	}
}

/**
 * The width of a page's content: centred, as wide as its `size` at most, with room at the sides
 * (13px on a phone, 21px from `sm` up). `fluid` takes the full width. `class`, `style`, `ref` and
 * other attributes go to the root `<div>`.
 *
 * @example
 * <Main>
 *   <Container>
 *     <h1>Payments</h1>
 *   </Container>
 * </Main>
 */
export type ContainerProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<ContainerDefaults> & {
		/**
		 * Takes the full width, whatever the size.
		 * @default false
		 */
		fluid?: boolean;
		/** The content. */
		children?: Snippet;
	}
>;

/** How many of a row's twelve columns a column spans. */
export const COLUMN_SPANS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type ColumnSpan = (typeof COLUMN_SPANS)[number];

/** Where columns sit in the height of their row. */
export const ROW_ALIGNS = ['stretch', 'start', 'center', 'end', 'baseline'] as const;
export type RowAlign = (typeof ROW_ALIGNS)[number];

/** Where a column's content sits across the columns it spans. */
export const ROW_JUSTIFIES = ['stretch', 'start', 'center', 'end'] as const;
export type RowJustify = (typeof ROW_JUSTIFIES)[number];

/**
 * Twelve equal columns on a CSS grid, for `Col`s to span. Columns that do not fit on a line go on
 * the next one, with the same `gap` between lines. `class`, `style`, `ref` and other attributes go
 * to the root `<div>`.
 *
 * @example
 * <Row>
 *   <Col cols={12} md={8}>Statement</Col>
 *   <Col cols={12} md={4}>Summary</Col>
 * </Row>
 */
export type RowProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	Partial<RowDefaults> & {
		/**
		 * Where the columns sit in the height of their line. `stretch` makes them all as tall as the
		 * tallest.
		 * @default 'stretch'
		 */
		align?: RowAlign;
		/**
		 * Where each column's content sits across the columns it spans. `stretch` fills them.
		 * @default 'stretch'
		 */
		justify?: RowJustify;
		/** The `Col`s. */
		children?: Snippet;
	}
>;

/**
 * A column of a `Row`, spanning some of its twelve columns. `cols` is the span on every screen;
 * `sm`, `md`, `lg`, `xl` and `xxl` take over from the width of that breakpoint up, as
 * `useDisplay()` names them, at their default widths (`md` is 960px). `class`, `style`, `ref` and
 * other attributes go to the root `<div>`.
 *
 * @example
 * <!-- One card a line on a phone, two from sm, three from md. -->
 * <Col cols={12} sm={6} md={4}>
 *   <Card title="Savings" />
 * </Col>
 */
export type ColProps = ElementProps<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>,
	{
		/**
		 * The columns it spans on every screen, unless a breakpoint's span takes over.
		 * @default 12
		 */
		cols?: ColumnSpan;
		/** The columns it spans from 600px up. */
		sm?: ColumnSpan;
		/** The columns it spans from 960px up. */
		md?: ColumnSpan;
		/** The columns it spans from 1280px up. */
		lg?: ColumnSpan;
		/** The columns it spans from 1920px up. */
		xl?: ColumnSpan;
		/** The columns it spans from 2560px up. */
		xxl?: ColumnSpan;
		/** The content. */
		children?: Snippet;
	}
>;
