<script lang="ts">
	import type { CrazyProduct } from '../../customTypes';
	import { fade } from 'svelte/transition';
	import { firebaseStore } from '../../customStores';
	import { getDownloadURL, ref } from 'firebase/storage';

	export let productObject: CrazyProduct;

	let imageUrl: string = '';
	let primaryImageLoaded: boolean = false;
	let primaryPhotoFilename: string = '';

	productObject.photos.forEach((photo) => {
		console.log(photo);
		if (photo.primary) {
			primaryPhotoFilename = photo.filename;
		}
	});

	const imageStorageReference = ref(
		$firebaseStore.storage,
		'inventory/' + productObject.id + '/' + primaryPhotoFilename
	);

	async function setImageUrl() {
		imageUrl = await getDownloadURL(imageStorageReference);
		primaryImageLoaded = true;
	}

	setImageUrl();

	// pull down image from firebase storage, etc.
</script>

<div class="container">
	{#if primaryImageLoaded}
		<img src={imageUrl} alt={productObject.name} in:fade />
	{:else}
		<div class="image-placeholder active" />
	{/if}

	<p class="name">{productObject.name}</p>

	<p class="price">${productObject.price}.00</p>
</div>

<style>
	.container {
		cursor: pointer;
	}
	img {
		width: 100%;
	}
	.image-placeholder {
		width: 100%;
	}
	.name {
		text-align: center;
		font-family: lato-regular;
		font-size: 14px;
	}
	.price {
		text-align: center;
		font-family: lato-lightitalic;
		font-size: 10px;
	}
	.image-placeholder.active {
		animation-duration: 4.2s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: shimmer;
		animation-timing-function: linear;
		background: hsl(var(--b3));
		background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
		background-size: 1200px 100%;
		width: 100%;
		padding-bottom: 100%;
		border-radius: 10px;
		/* position: absolute; */
		display: block;
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
