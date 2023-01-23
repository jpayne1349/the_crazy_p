<script lang="ts">
	import type { CrazyCustomOrderForm } from '../../../customTypes';
	import { onMount } from 'svelte';
	import { customOrdersStore, firebaseStore } from '../../../customStores';
	import OrderTableItem from './OrderTableItem.svelte';
	import { getDocs, collection } from 'firebase/firestore';

	let viewFulfilled = false;
	let storeLoading = true;

	onMount(async () => {
		await fetchOrderData();
		awaitStoreLoad();
	});

	function awaitStoreLoad() {
		if (!$customOrdersStore) {
			setTimeout(awaitStoreLoad, 200);
			return;
		}
		storeLoading = false;
	}

	async function fetchOrderData() {
		// pull data down from firebase here instead of at root layout...
		// no need to slow down ux if only needed in CMS.
		if ($customOrdersStore) {
			return;
		}

		const customOrdersSnapshot = await getDocs(collection($firebaseStore.db, 'custom-order'));
		let customOrderList: CrazyCustomOrderForm[] = [];
		customOrdersSnapshot.forEach((doc) => {
			let order = doc.data() as CrazyCustomOrderForm;
			order.id = doc.id;
			customOrderList.push(order);
		});
		customOrderList.sort((a, b) => {
			if (a.created && b.created) {
				return b.created.seconds - a.created.seconds;
			}
			return 0;
		});
		customOrdersStore.set(customOrderList);
	}
</script>

<div class="sort-bar">
	<div class="button-container">
		<button
			class="text selected"
			class:selected={!viewFulfilled}
			on:click={() => {
				viewFulfilled = false;
			}}>Open</button
		>
		<button
			class="text"
			id="sold"
			class:selected={viewFulfilled}
			on:click={() => {
				viewFulfilled = true;
			}}>Fulfilled</button
		>
	</div>
</div>

<div class="inventory-table">
	<div class="table-header">
		<p class="col-label">Name</p>
		<p class="col-label">Email</p>
		{#if viewFulfilled}
			<p class="col-label">Sold</p>
		{:else}
			<p class="col-label">Created</p>
		{/if}
	</div>
	<div class="table-contents">
		{#if storeLoading}
			<div class="loading-container">
				<div class="loading-spinner" />
			</div>
		{:else}
			{#each $customOrdersStore as order (order.id)}
				<OrderTableItem {order} {viewFulfilled} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.loading-container {
		min-height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--a));
		border-right: 2px solid transparent;
		width: 40px;
		height: 40px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}
	.inventory-table {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-bottom: 50px;
	}
	.table-contents {
		max-height: 60vh;
		overflow-y: scroll;
	}
	.table-header {
		display: grid;
		border-bottom: 1px solid hsl(var(--nf));
		grid-template-columns: 1fr 2fr 75px;
		margin-bottom: 0px;
		color: grey;
	}

	.sort-bar {
		display: flex;
		justify-content: space-between;
		margin-top: 0px;
		margin-bottom: 15px;
		border-bottom: 1px solid hsl(var(--ac));
		font-family: lato-regular;
		font-size: 18px;
	}

	.button-container {
		display: flex;
	}
	button {
		padding: 0 5px;
		margin: 0 5px -1px 0px;
		margin-bottom: -1px;
		/* transition: all 0.2s linear; */
		-webkit-tap-highlight-color: rgba(245, 245, 245, 0.265);
	}
	button.text.selected {
		color: hsl(var(--a));
		border-bottom: 1px solid hsl(var(--a));
	}
</style>
