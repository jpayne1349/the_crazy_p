<script lang="ts">
	import type { CrazyProduct } from '../../../customTypes';
	import type { Timestamp } from 'firebase/firestore';
	import { firebaseStore } from '../../../customStores';
	import { onMount } from 'svelte';
	import { ref, getDownloadURL } from 'firebase/storage';

	export let product: CrazyProduct;
	export let viewSold: boolean;
	let previewImageLoading = true;
	let imgSrc = '';
	let imgAlt = 'Hat';

	onMount(fetchPreviewImage);

	function timestampToDisplay(timestamp: Timestamp) {
		let date = new Date(timestamp.seconds * 1000);

		let stringDate = date.toDateString();
		// remove the day of the week
		stringDate = stringDate.slice(4, 10);

		return stringDate;
	}

	async function fetchPreviewImage() {
		if (!$firebaseStore) {
			setTimeout(fetchPreviewImage, 200);
			return;
		}
		let foundPrimary = false;
		for (let photo of product.photos) {
			if (photo.primary) {
				const imageStorageReference = ref(
					$firebaseStore.storage,
					'inventory/' + product.id + '/' + photo.filename
				);

				imgSrc = await getDownloadURL(imageStorageReference);
				foundPrimary = true;
			}
		}
		if (foundPrimary) {
			previewImageLoading = false;
		} else {
			imgAlt = 'No P!';
			previewImageLoading = false;
		}
	}
</script>

<a
	class="row-wrapper"
	href="/cms/product-inventory/{product.name}"
	class:show={viewSold != product.status}
>
	<div class="table-row">
		<p class="col photo">
			{#if previewImageLoading}
				<div class="button-spinner" />
			{:else}
				<img src={imgSrc} alt={imgAlt} />
			{/if}
		</p>
		<p class="col">{product.name}</p>
		<p class="col">
			{#if product.price != ''}
				${product.price}
			{/if}
		</p>
		{#if viewSold}
			<p class="col">
				{#if product.sold.timestamp}
					{timestampToDisplay(product.sold.timestamp)}
				{/if}
			</p>
		{:else}
			<p class="col">{timestampToDisplay(product.updated)}</p>
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
		grid-template-columns: 65px 2fr repeat(2, 1fr);

		border-bottom: 1px solid hsl(var(--n));

		height: 70px;
		line-height: 70px;
	}
	img {
		height: 50px;
		width: 50px;
		border-radius: 2px;
	}
	.col.photo {
		display: flex;
		align-items: center;
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
