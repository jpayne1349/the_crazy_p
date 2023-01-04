<script lang="ts">
	import type { CrazyProduct } from 'src/routes/customTypes';
	import { firebaseStore, inventoryStore } from '../../../customStores';
	import type { PageData } from './$types';
	import { getDownloadURL, ref } from 'firebase/storage';
	import { beforeUpdate } from 'svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	let dataLoaded = false;
	let photoSrcListPopulated = false;
	let photoSrcList: string[] = [];
	let focusedPhotoSrc: string = '';

	beforeUpdate(verifyData);

	function verifyData() {
		if (!data.name) {
			// the product data wasnt found in the selectedProductStore within the page.ts load
			awaitInventoryStoreUpdate();
			return;
		}
		dataLoaded = true;
	}

	function awaitInventoryStoreUpdate() {
		// inventoryStore takes time to load data from firestore
		if ($inventoryStore == undefined) {
			setTimeout(awaitInventoryStoreUpdate, 500);
			return;
		}
		let productName = $page.params.product_id;
		for (let product of $inventoryStore) {
			if (product.name == productName) {
				data = product;
			}
		}
		dataLoaded = true;
	}

	$: if (dataLoaded) {
		getPhotoUrls(data as CrazyProduct);
	}

	async function getPhotoUrls(loadedProduct: CrazyProduct) {
		for (let photoObject of loadedProduct.photos) {
			console.log(loadedProduct.photos);
			const imageStorageReference = ref(
				$firebaseStore.storage,
				'inventory/' + loadedProduct.id + '/' + photoObject.filename
			);

			let srcUrl = await getDownloadURL(imageStorageReference);

			if (photoObject.primary) {
				focusedPhotoSrc = srcUrl;
			}

			photoSrcList = [...photoSrcList, srcUrl];
		}
		console.log(photoSrcList);
		photoSrcListPopulated = true;
	}
</script>

<div class="product-content-container">
	{#if photoSrcListPopulated}
		<img
			class="focused-photo"
			src={focusedPhotoSrc}
			alt="Primary View"
			in:fade={{ duration: 500 }}
		/>
	{/if}

	<div class="focused-photo-loader shimmering" />

	<div class="photos-container">
		{#if photoSrcListPopulated}
			{#each photoSrcList as photoSrc (photoSrc)}
				<button
					class="set-focused-photo"
					on:click={() => {
						focusedPhotoSrc = photoSrc;
					}}
				>
					<img src={photoSrc} alt="Alternative View" in:fade={{ duration: 500 }} />
				</button>
			{/each}
		{/if}

		<div class="photos-container-loader ">
			<div class="shimmering" />
			<div class="shimmering" />
			<div class="shimmering" />
			<div class="shimmering" />
		</div>
	</div>

	<div class="breaker-bar"><div /></div>

	{#if dataLoaded}
		<div class="description-container">
			<h4 class="description-title">DESCRIPTION</h4>

			<p class="description-content">{data.description}</p>
		</div>

		<button class="buy-now">
			<p>BUY NOW &nbsp;&#183;&nbsp;</p>
			<p>${data.price}.00</p>
		</button>
		<p class="secure-payment">SECURE CHECKOUT PROVIDED BY SQUARE</p>

		<button class="custom-touch">Customize this hat</button>
	{/if}
</div>

<style>
	.product-content-container {
		position: relative;
		width: 100%;
	}
	.focused-photo-loader {
		width: 100%;
		padding-bottom: 100%;
	}
	.focused-photo {
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
	}
	.photos-container,
	.photos-container-loader {
		width: 100%;
		height: 75px;
		display: flex;
		justify-content: space-between;
		margin-top: 5px;
		margin-bottom: 15px;
	}
	.photos-container button {
		width: 75px;
	}
	.photos-container-loader {
		position: absolute;
		z-index: -1;
	}
	.photos-container-loader div {
		width: 75px;
	}
	.breaker-bar {
		display: flex;
		justify-content: center;
	}
	.breaker-bar div {
		width: 100%;
		height: 2px;
		border-radius: 5px;
		background-color: #ededed;
		margin: 5px 0;
	}
	.description-title {
		font-family: lato-light;
		font-size: 12px;
		margin-top: 10px;
	}
	.description-content {
		font-family: lato-light;
		font-size: 16px;
		margin: 15px 0;
	}
	button.buy-now {
		display: flex;
		width: 100%;
		border: 1px solid rgb(125, 124, 124);
		justify-content: center;
		align-items: center;
		height: 55px;
		font-size: 14px;
		font-family: lato-regular;
		margin-top: 30px;
	}
	.secure-payment {
		width: 100%;
		text-align: center;
		font-size: 10px;
		font-family: lato-light;
		margin-top: 3px;
		margin-bottom: 30px;
	}
	.custom-touch {
		font-family: lato-italic;
		text-decoration: underline;
		display: block;
		margin-bottom: 35px;
		width: 100%;
		text-align: center;
	}

	.shimmering {
		animation-duration: 4.2s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: shimmer;
		animation-timing-function: linear;
		background: hsl(var(--b3));
		background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%) fixed;
		background-size: 1200px 100%;
	}
	@-webkit-keyframes shimmer {
		0% {
			background-position: -100% 0;
		}
		100% {
			background-position: 100% 0;
		}
	}
	@keyframes shimmer {
		0% {
			background-position: -1200px 0;
		}
		100% {
			background-position: 1200px 0;
		}
	}
</style>
