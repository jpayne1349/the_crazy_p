<script lang="ts">
	import { inventoryStore, firebaseStore, alertStore } from '../../../customStores';
	import type { CrazyProduct } from '../../../customTypes';
	import InventoryTableItem from './InventoryTableItem.svelte';
	import { onMount } from 'svelte';
	import { collection, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	let viewSold = false;
	let storeLoading = true;
	let addingProduct = false;

	onMount(awaitStoreLoad);

	function awaitStoreLoad() {
		if ($inventoryStore) {
			$inventoryStore.sort((a, b) => {
				return b.updated.seconds - a.updated.seconds;
			});
			storeLoading = false;
			return;
		}
		setTimeout(awaitStoreLoad, 200);
	}

	async function addProduct() {
		if (addingProduct) return;
		addingProduct = true;
		// might have to do a firestore add to get a doc.id reference?
		try {
			let blankProduct: CrazyProduct = {
				id: 'temp',
				name: 'New Product',
				created: Timestamp.now(),
				updated: Timestamp.now(),
				status: true,
				price: '',
				description: '',
				photos: [],
				sold: {
					reference: '',
					to: '',
					price: ''
				}
			};

			let newDoc = await addDoc(collection($firebaseStore.db, 'inventory'), blankProduct);

			blankProduct.id = newDoc.id;

			let update = await updateDoc(newDoc, {
				id: newDoc.id
			});

			$inventoryStore = [...$inventoryStore, blankProduct];

			await goto('/cms/product-inventory/' + blankProduct.name);
		} catch (e) {
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
			addingProduct = false;
		}
	}
</script>

<div class="add-container">
	<button class="add-product" on:click={addProduct}>
		{#if addingProduct}
			<div class="button-spinner" />
		{:else}
			+ ADD PRODUCT
		{/if}
	</button>
</div>

<div class="sort-bar">
	<div class="button-container">
		<button
			class="text selected"
			class:selected={!viewSold}
			on:click={() => {
				viewSold = false;
			}}>Available</button
		>
		<button
			class="text"
			id="sold"
			class:selected={viewSold}
			on:click={() => {
				viewSold = true;
			}}>Sold</button
		>
	</div>
</div>

<div class="inventory-table">
	<div class="table-header">
		<p class="col-label" />
		<p class="col-label">Name</p>
		<p class="col-label">Price</p>
		{#if viewSold}
			<p class="col-label">Sold</p>
		{:else}
			<p class="col-label">Updated</p>
		{/if}
	</div>
	<div class="table-contents">
		{#if storeLoading}
			<div class="loading-container">
				<div class="loading-spinner" />
			</div>
		{:else}
			{#each $inventoryStore as product (product.id)}
				<InventoryTableItem {product} {viewSold} />
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
		grid-template-columns: 65px 2fr repeat(2, 1fr);
		margin-bottom: 0px;
	}
	.add-product {
		width: 150px;
		border-radius: 5px;
		background-color: hsl(var(--su));
		color: hsl(var(--b1));
		font-family: lato-bold;
		margin-bottom: -30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.add-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.sort-bar {
		display: flex;
		justify-content: space-between;
		margin-top: 25px;
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
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--b1));
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
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
