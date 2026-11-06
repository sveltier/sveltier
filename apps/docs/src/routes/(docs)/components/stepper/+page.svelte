<script lang="ts">
	import Code from '#lib/docs/Code.svelte';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import StepperDemo from '#lib/docs/stepper/StepperDemo.svelte';
	import StepperVerticalDemo from '#lib/docs/stepper/StepperVerticalDemo.svelte';
	import { stepperUsage, stepperVertical } from '#lib/snippets/components.js';
	import STEPPER_ITEM from 'virtual:sveltier-api/StepperItem';
	import STEPPER_PROPS from 'virtual:sveltier-api/StepperProps';
</script>

<DocPage
	title="Stepper"
	lede="The steps of a task done in order, and where the user is: opening an account, verifying an identity, making a transfer."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the steps as <code>items</code> and bind <code>value</code> to the current one; without a
		value, the first step is current. The steps before it are done. The stepper does not hold the
		content of a step: show it from <code>value</code>, and move forward with your own button once
		the step is valid.
	</p>
	<StepperDemo />
	<Code title="Transfer.svelte" code={stepperUsage} />

	<h2 id="going-back">Going back</h2>
	<ul>
		<li>
			A done step is a button that takes the user back to it, calling <code>onchange</code>. Later
			steps are text, so the user cannot skip a check by clicking ahead.
		</li>
		<li>
			<code>linear=&#123;false&#125;</code> makes every step a button, for steps that can be filled in
			any order.
		</li>
		<li>A <code>disabled</code> step is never a button.</li>
	</ul>

	<h2 id="vertical">In a column</h2>
	<p>
		<code>orientation="vertical"</code> stacks the steps, with room for longer descriptions. Mark a
		step that needs attention with <code>error</code>: it shows <code>!</code> in the error colour, done
		or not.
	</p>
	<StepperVerticalDemo />
	<Code code={stepperVertical} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			An ordered list, so screen readers say how many steps there are and which one this is. The
			current step is marked <code>aria-current="step"</code>.
		</li>
		<li>
			A done step adds "Completed" and a step with an error adds "Error", read after its label; the
			numbers and checks are only seen. Both words come from the locale (<code>stepCompleted</code>,
			<code>stepError</code>).
		</li>
		<li>
			The steps that can be clicked are buttons in the tab order. Name the stepper with
			<code>aria-label</code> when the page has more than one.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Stepper props" rows={STEPPER_PROPS} />
	<ApiTable label="StepperItem" rows={STEPPER_ITEM} />
</DocPage>
