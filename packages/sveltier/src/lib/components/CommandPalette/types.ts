import type { Component, Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
import type { CloseReason, TriggerAttributes } from '../../core/overlay/types.js';
import type { ElementProps } from '../../core/props/element.js';
import type { DialogDefaults } from '../Dialog/types.js';

/** The CommandPalette props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export type CommandPaletteDefaults = DialogDefaults;

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		CommandPalette: CommandPaletteDefaults;
	}
}

/** A command the palette can run. */
export interface CommandItem {
	/** What the command says, and what typing matches first. */
	label: string;
	/** An identifier for `onselect` to tell the commands apart. */
	value?: string;
	/** A second line under the label, such as a venue or a path. Typing matches it too. */
	description?: string;
	/**
	 * An icon before the label, drawn at the size and colour of the text: an SVG path on a
	 * 24×24 grid, as Material Design Icons export them (`mdiCog`), or an icon component of any
	 * other set, such as `Gear` from phosphor-svelte. The component renders with no props.
	 */
	// Any props: a component's props are checked the other way round, so a narrower type would
	// turn away icon sets whose props take every SVG attribute.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: string | Component<any>;
	/** A keyboard shortcut shown at the end, such as `Ctrl+,`. Showing it does not bind it. */
	shortcut?: string;
	/**
	 * The name of the group the command shows under. Groups show in the order they first appear.
	 */
	group?: string;
	/** More words typing matches, which are not shown, such as `['preferences']` for Settings. */
	keywords?: readonly string[];
	/** Shown but not run, and skipped by the arrow keys. */
	disabled?: boolean;
}

/**
 * A search box over the app's commands in a modal dialog, opened from anywhere with a shortcut
 * (Ctrl+K, ⌘K on Apple platforms) or from a `trigger`. Typing filters the commands, ignoring
 * case and diacritics, and points at the first match, so a few letters and Enter run it; the
 * arrows move, a click runs one too, and Escape closes. Focus goes back where it was. Commands
 * may carry more properties, which `onselect` and the `item` snippet receive typed. `class`,
 * `style`, `ref` and other attributes go to the `<dialog>`.
 *
 * @example
 * <script lang="ts">
 * 	import { CommandPalette, type CommandItem } from '@sveltier/ui';
 * 	import { goto } from '$app/navigation';
 *
 * 	type Command = CommandItem & { href: string };
 * 	const commands: Command[] = [
 * 		{ label: 'BTC/USDT', description: 'Binance', group: 'Markets', href: '/m/btc-usdt' },
 * 		{ label: 'Settings', keywords: ['preferences'], group: 'Pages', href: '/settings' }
 * 	];
 * </script>
 *
 * <CommandPalette label="Go to" items={commands} onselect={(command) => goto(command.href)} />
 */
export type CommandPaletteProps<I extends CommandItem = CommandItem> = ElementProps<
	HTMLDialogElement,
	Omit<HTMLDialogAttributes, 'open' | 'title' | 'children'>,
	Partial<CommandPaletteDefaults> & {
		/** Names the palette and its search box, such as "Go to" or "Commands". */
		label: string;
		/** The commands, in order. Commands of a `group` show together under its name. */
		items: readonly I[];
		/** Called with the command the user runs, after the palette has closed. */
		onselect?: (item: I) => void;
		/**
		 * Whether it is open. Bindable; it sets this to `false` when it closes itself.
		 * @default false
		 */
		open?: boolean;
		/**
		 * The keys that open it from anywhere on the page: modifiers and a key joined with `+`.
		 * `Mod` is ⌘ on Apple platforms and Ctrl elsewhere. `false` binds nothing.
		 * @default 'Mod+K'
		 */
		shortcut?: string | false;
		/** The control that opens it. Spread the attributes it receives onto it. */
		trigger?: Snippet<[TriggerAttributes]>;
		/**
		 * What is typed; empty each time it opens. Bindable, to search elsewhere as it changes:
		 * then pass `filter={false}` and the commands found.
		 */
		query?: string;
		/**
		 * Which commands match what is typed. By default every word typed must appear in the
		 * label, the description or the keywords, ignoring case and diacritics. `false` shows the
		 * commands as given.
		 */
		filter?: ((item: I, query: string) => boolean) | false;
		/**
		 * Commands are on their way: the list says "Loading" while it has none.
		 * @default false
		 */
		loading?: boolean;
		/** What the search box shows while it is empty. */
		placeholder?: string;
		/** A command's content, in place of its icon, label, description and shortcut. */
		item?: Snippet<[item: I]>;
		/** Called when it closes itself, with the reason; `'action'` after a command runs. */
		onclose?: (reason: CloseReason) => void;
	}
>;
