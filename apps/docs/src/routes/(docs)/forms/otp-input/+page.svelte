<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import OtpInputDemo from '#lib/docs/otp-input/OtpInputDemo.svelte';
	import { otpInputUsage } from '#lib/snippets/forms.js';
	import OTP_INPUT_PROPS from 'virtual:sveltier-api/OtpInputProps';
</script>

<DocPage
	title="OtpInput"
	lede="A one-time code, such as the code of a two-factor sign-in, shown one character per box: one input under the boxes, so the code the phone offers from a text message, a paste and typing all work."
>
	<h2 id="usage">Usage</h2>
	<p>
		Bind the <code>value</code>, the code typed so far. It has <code>length</code> characters (6
		unless you set it), one box each. <code>oncomplete</code> runs when the user fills the last box:
		check or submit the code there, without a button to press. Try <code>000000</code> below for a code
		the server refuses.
	</p>
	<OtpInputDemo />
	<Code title="Verify.svelte" code={otpInputUsage} />

	<h2 id="typing">Typing and pasting</h2>
	<ul>
		<li>
			The input has <code>autocomplete="one-time-code"</code>, so phones offer the code from a text
			message above the keyboard, and password managers can fill it.
		</li>
		<li>
			Characters outside the <code>type</code> are dropped: a pasted <code>123-456</code> or
			<code>123 456</code> becomes <code>123456</code>. <code>type="alphanumeric"</code> takes
			letters and digits, uppercased, with a text keyboard; the default <code>numeric</code> brings up
			the number pad.
		</li>
		<li>
			The caret stays at the end, so the boxes fill in order and <kbd>Backspace</kbd> removes the last
			character.
		</li>
	</ul>

	<h2 id="validation">Validation</h2>
	<p>
		A code that is started but shorter than <code>length</code> is invalid ("Enter all 6
		characters"), and <code>required</code> refuses an empty one. <code>rules</code> run once the
		code is complete. Show the server's answer with <code>error</code>. <code>validateOn</code> and
		form reset work as on a <a href={resolve('forms/text-field')}>TextField</a>.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			It is one text input with its label linked, so screen readers hear one field and its whole
			value, not six unnamed boxes. The boxes are only seen.
		</li>
		<li>
			The hint, such as where the code was sent, and the error are the input's description. The
			message for a short code comes from the locale (<code>otpIncomplete</code>).
		</li>
		<li>
			Do not submit on a timer or move focus away when the code is complete without saying so: a
			refused code shows its error in the field, where the user can type it again.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="OtpInput props" rows={OTP_INPUT_PROPS} />
</DocPage>
