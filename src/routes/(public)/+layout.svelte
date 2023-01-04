<script lang="ts">
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import type { LayoutData } from './$types';
	import type { CrazyProduct } from '../customTypes';
	import { inventoryStore, firebaseStore } from '../customStores';
	import { collection, getDocs } from 'firebase/firestore';

	export let data: LayoutData;
	let title: string;
	let crumbs: { name: string; path: string }[] = [];

	beforeUpdate(() => {
		title = data.title;
		crumbs = data.crumbs;
		loadInventory();
	});

	// lazy load the inventory data once to be accessible from within app
	async function loadInventory() {
		console.log('setting inventory store');
		const querySnapshot = await getDocs(collection($firebaseStore.db, 'inventory'));
		let productList: CrazyProduct[] = [];
		querySnapshot.forEach((doc) => {
			let loadedProduct = doc.data() as CrazyProduct;
			loadedProduct.id = doc.id;
			productList = [...productList, loadedProduct];
			inventoryStore.set(productList);
		});
	}
</script>

<h2 class="route-title">
	{#if title}
		{title}
	{/if}
</h2>

<div class="breaker-bar"><div /></div>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a href="/">Home</a></li>
		{#each crumbs as link}
			<li><a href={link.path}>{link.name}</a></li>
		{/each}
	</ul>
</div>

<section>
	<slot />
</section>

<style>
	.route-title {
		font-family: lato-light;
		padding-top: 65px;
		text-align: center;
		font-size: 22px;
		height: 100px;
	}
	.breaker-bar {
		display: flex;
		justify-content: center;
	}
	.breaker-bar div {
		width: 30px;
		height: 2px;
		border-radius: 5px;
		background-color: hsl(var(--ac));
		margin: 5px 0;
	}
	.breadcrumbs {
		padding: 5px 0;
	}
	ul {
		padding: 0 15px;
	}
	section {
		min-height: 600px;
		padding: 0 15px;
	}
</style>
