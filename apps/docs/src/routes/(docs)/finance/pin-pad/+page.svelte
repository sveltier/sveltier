<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import PinPadDemo from '#lib/docs/pin-pad/PinPadDemo.svelte';
	import { pinPadUsage } from '#lib/snippets/finance.js';
	import PIN_PAD_PROPS from 'virtual:sveltier-api/PinPadProps';
</script>

<DocPage
	title="PinPad"
	lede="A PIN or passcode entered on a keypad of its own: dots that fill as digits go in, and large keys in the phone layout."
>
	<h2 id="usage">Usage</h2>
	<p>
		Name the pad with <code>label</code> and bind its <code>value</code>.
		<code>oncomplete</code> runs with the PIN once the last of its <code>length</code> digits, six
		by default, goes in. Check the PIN there, and on a wrong one set <code>error</code> and clear the
		value: the dots shake once for each new error.
	</p>
	<PinPadDemo />
	<Code title="ConfirmOrder.svelte" code={pinPadUsage} />

	<h2 id="keys">Keys</h2>
	<p>
		The keys are 1 to 9, then 0 between an <code>extra</code> key and Delete. Put a button to sign
		in with a fingerprint or a face in <code>extra</code>. While focus is in the pad, digits on the
		keyboard type and Backspace deletes. <code>shuffle</code> puts the digits in a random order, set once
		the pad is in the page, against someone watching over a shoulder.
	</p>

	<h2 id="pin-or-code">PinPad or OtpInput</h2>
	<p>
		A PIN is a secret the user knows, entered on the app's own keypad and never shown. A one-time
		code arrives by text message or email and can be pasted or filled in by the phone: that is an
		<a href={resolve('forms/otp-input')}>OtpInput</a>.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			A group named by its label. Each key is a button named by its digit; Delete is named by the
			locale's <code>pinDelete</code>.
		</li>
		<li>
			The digits are never shown or read aloud. The dots are hidden from assistive technology, and a
			polite live region says how many digits are in: <q>2 of 4 digits entered</q>.
		</li>
		<li>The error describes the group, so it is read with it.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="PinPad props" rows={PIN_PAD_PROPS} />
</DocPage>
