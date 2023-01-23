<script lang="ts">
	import { firebaseStore, inventoryStore } from '../../customStores';
	import type { CrazyProduct } from '../../customTypes';
	import { onMount } from 'svelte';

	import Product from './Product.svelte';

	let viewSold = false;
	let singleCol = false;

	let productList: CrazyProduct[] = [];

	onMount(setProductList);

	function setProductList() {
		if (!$inventoryStore) {
			setTimeout(setProductList, 500);
			return;
		}
		productList = $inventoryStore;
	}
</script>

<div class="inventory-container">
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

		<div class="button-container">
			<button
				id="single-col"
				on:click={() => {
					singleCol = true;
				}}
			/>
			<button
				id="double-col"
				on:click={() => {
					singleCol = false;
				}}
				><div />
				<div />
				<div />
				<div /></button
			>
		</div>
	</div>

	<div class="products" class:single-col={singleCol}>
		{#each productList as product}
			<Product productObject={product} {viewSold} />
		{/each}
	</div>
</div>

<style>
	.inventory-container {
		max-width: 900px;
		margin: 0 auto;
	}
	.sort-bar {
		display: flex;
		justify-content: space-between;
		margin-top: 5px;
		margin-bottom: 15px;
		border-bottom: 1px solid hsl(var(--ac));
		font-family: lato-regular;
		font-size: 18px;
	}
	/* default to the two wide display */
	.products {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
	}
	.products.single-col {
		grid-template-columns: repeat(2, 1fr);
		gap: 30px;
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
	#single-col {
		width: 19px;
		height: 19px;
		background-color: hsl(var(--ac));
	}
	#double-col {
		display: inline-grid;
		grid-template: repeat(2, 9px) / repeat(2, 9px);
		gap: 1px;
		place-items: center;
	}
	#double-col div {
		width: 100%;
		height: 100%;
		background-color: hsl(var(--ac));
	}
	@media screen and (max-width: 800px) {
		.products {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}
		.products.single-col {
			grid-template-columns: 100%;
			gap: 30px;
		}
	}
</style>
