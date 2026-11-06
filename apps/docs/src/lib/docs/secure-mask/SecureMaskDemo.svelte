<script lang="ts">
	// The secrets of an account page: an IBAN that can be shown for 30 seconds, a card number
	// and an API key that stays hidden.
	import { SecureMask } from '@sveltier/ui';
</script>

<div class="docs-demo">
	<dl class="docs-deltas docs-secrets">
		<div>
			<dt>IBAN</dt>
			<dd>
				<SecureMask label="IBAN" value="DE89370400440532013000" toggle hideAfter={30000} />
			</dd>
		</div>
		<div>
			<dt>Card</dt>
			<dd><SecureMask label="Card number" value="4821" /></dd>
		</div>
		<div>
			<dt>API key</dt>
			<dd><SecureMask label="API key" value="sk_live_51Hx9" visible={0} /></dd>
		</div>
	</dl>
</div>

<style>
	.docs-secrets {
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	}
</style>
