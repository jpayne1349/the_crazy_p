<script lang="ts">
	import type { CrazyCarouselItem } from '../../../../customTypes';
	import DragHandle from '$lib/DragHandle.svelte';
	import {
		firebaseStore,
		inventoryStore,
		carouselStore,
		alertStore
	} from '../../../../customStores';
	import { getDownloadURL, ref } from 'firebase/storage';
	import { onMount, createEventDispatcher } from 'svelte';
	import { doc, updateDoc } from 'firebase/firestore';

	export let photo: CrazyCarouselItem;
	let imageUrl: string;
	let imageLoading = false;
	let placeHolderClass = false;
	let initialDataId = photo.index;

	let dispatch = createEventDispatcher();

	onMount(setImageUrl);

	const imageStorageReference = ref($firebaseStore.storage, 'homepageCarousel/' + photo.filename);

	async function setImageUrl() {
		imageUrl = await getDownloadURL(imageStorageReference);
		imageLoading = true;
	}

	function deleteItem() {
		dispatch('delete', photo.index);
	}

	async function updateLinkedProduct(this: HTMLInputElement, event: Event) {
		let selectedValue = this.value;
		if (selectedValue == 'None') {
			selectedValue = '';
		}

		for (let storePhoto of $carouselStore.photos) {
			if (storePhoto.index == photo.index) {
				storePhoto.inventoryName = selectedValue;
			}
		}

		try {
			let docRef = doc($firebaseStore.db, 'content-management', 'carousel');
			let update = await updateDoc(docRef, {
				photos: $carouselStore.photos
			});

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Changes Saved.'
			});
		} catch (e) {
			console.log(e);

			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
		}
	}
</script>

<div class="container" class:ghost={placeHolderClass} data-id={initialDataId}>
	<div class="col">
		{#if imageLoading}
			<img src={imageUrl} alt="carousel-item" />
		{/if}
		<div class="image-placeholder" />
		<button class="btn btn-primary remove" on:click={deleteItem}>REMOVE</button>
	</div>
	<div class="col two">
		<div class="row">
			<h3 class="link-product-label">Link To Product:</h3>
			<select class="select" on:change={updateLinkedProduct}>
				<option>None</option>
				{#each $inventoryStore as product (product.name)}
					{#if product.name == photo.inventoryName}
						<option selected>{product.name}</option>
					{:else}
						<option>{product.name}</option>
					{/if}
				{/each}
			</select>
		</div>
		<div class="row last">
			<p class="index">
				{photo.index}
			</p>
			<DragHandle />
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		padding: 15px;
		border: 1px solid hsl(var(--n));
		border-radius: 2px;
		margin-top: 25px;
		position: relative;
		justify-content: flex-start;
	}
	.container.ghost {
		opacity: 0.1;
	}
	img {
		position: absolute;
		width: 100px;
	}
	.image-placeholder {
		width: 100px;
		height: 100px;
		background-color: hsl(var(--n));
	}
	button.remove {
		margin-top: 10px;
		width: 100%;
		height: 20px !important;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: lato-regular;
		font-size: 18px;
		text-align: center;
	}
	.col.two {
		margin-left: 15px;
		flex-grow: 2;
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		width: 100%;
	}
	.row.last {
		margin-top: auto;
		justify-content: flex-end;
	}

	select {
		outline: none;
		margin: 10px;
	}
	.index {
		width: 25px;
		background-color: hsl(var(--n));
		border-radius: 6px;
		height: 30px;
		line-height: 30px;
		margin-right: 15px;
	}
</style>
