<script lang="ts">
	import type { Timestamp } from 'firebase/firestore';
	import type { CrazyCustomOrderForm } from '../../../customTypes';

	export let order: CrazyCustomOrderForm;
	export let viewFulfilled: boolean;

	function timestampToDisplay(timestamp: Timestamp) {
		let date = new Date(timestamp.seconds * 1000);

		let stringDate = date.toDateString();
		// remove the day of the week
		stringDate = stringDate.slice(4, 10);

		return stringDate;
	}
</script>

<a
	class="row-wrapper"
	href="/cms/custom-orders/{order.id}"
	class:show={viewFulfilled == order.fulfilled}
>
	<div class="table-row">
		<p class="col">{order.name}</p>
		<p class="col">
			{order.email}
		</p>
		{#if viewFulfilled}
			<p class="col">
				{#if order.sold}
					{timestampToDisplay(order.sold)}
				{/if}
			</p>
		{:else}
			<p class="col">
				{#if order.created}
					{timestampToDisplay(order.created)}
				{/if}
			</p>
		{/if}
	</div>
</a>

<style>
	.row-wrapper {
		display: none;
	}
	.row-wrapper.show {
		display: block;
	}
	.table-row {
		display: grid;
		grid-template-columns: 1fr 2fr 75px;

		border-bottom: 1px solid hsl(var(--n));

		height: 70px;
		line-height: 70px;
	}
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
