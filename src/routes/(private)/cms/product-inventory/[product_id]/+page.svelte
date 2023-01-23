<script lang="ts">
	import type { CrazyProduct } from 'src/routes/customTypes';
	import { Timestamp } from 'firebase/firestore';
	import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
	import { firebaseStore, inventoryStore, alertStore } from '../../../../customStores';
	import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let storeLoading = true;
	let dataLoaded = false;
	let photoSrcListPopulated = false;
	let photoSrcList: string[] = [];
	let data: CrazyProduct;
	let photoInput: HTMLInputElement;
	let uploadPhotoButton: HTMLButtonElement;
	let addingPhoto = false;
	let dataFormElem: HTMLFormElement;
	let savingProductData = false;
	let ghostClass = false;

	onMount(awaitStoreLoad);

	function awaitStoreLoad() {
		if ($inventoryStore) {
			storeLoading = false;
			getProductData();
			return;
		}
		setTimeout(awaitStoreLoad, 200);
	}

	function getProductData() {
		let productName = $page.params.product_id;

		for (let product of $inventoryStore) {
			if (product.name == productName) {
				data = product;
				dataLoaded = true;
				getPhotoUrls(product);
			}
		}
	}

	function fullTimestampToDisplay(timestamp: Timestamp) {
		let date = timestamp.toDate();

		let stringDate = date.toLocaleString();

		return stringDate;
	}

	async function getPhotoUrls(loadedProduct: CrazyProduct) {
		photoSrcList = [];
		for (let photoObject of loadedProduct.photos) {
			const imageStorageReference = ref(
				$firebaseStore.storage,
				'inventory/' + loadedProduct.id + '/' + photoObject.filename
			);

			let srcUrl = await getDownloadURL(imageStorageReference);

			photoSrcList = [...photoSrcList, srcUrl];
		}
		//console.log(photoSrcList);
		photoSrcListPopulated = true;
	}

	async function setPrimaryPhoto(photoClicked: {
		filename: string;
		index: string;
		primary: boolean;
	}) {
		for (let photo of data.photos) {
			if (photo.filename == photoClicked.filename) {
				photo.primary = true;
			} else {
				photo.primary = false;
			}
		}
		data.photos = data.photos;

		try {
			let docRef = doc($firebaseStore.db, 'inventory', data.id);
			let update = await updateDoc(docRef, {
				photos: data.photos
			});
		} catch (e) {
			console.log(e);
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Primary photo not set.'
			});
		}
	}

	async function addPhotoHandler() {
		if (photoInput.files) {
			addingPhoto = true;

			let fileObject = photoInput.files[0];

			const storageRef = ref(
				$firebaseStore.storage,
				'inventory/' + data.id + '/' + fileObject.name
			);

			try {
				let snapshot = await uploadBytes(storageRef, fileObject);

				let primaryOrNot = false;
				if (data.photos.length == 0) {
					primaryOrNot = true;
				}
				// add photo to photosList of data
				data.photos.push({
					filename: fileObject.name,
					primary: primaryOrNot,
					index: ''
				});

				let docRef = doc($firebaseStore.db, 'inventory', data.id);
				let update = await updateDoc(docRef, {
					photos: data.photos
				});

				photoSrcListPopulated = false;

				getPhotoUrls(data);

				alertStore.set({
					show: true,
					type: 'success',
					message: 'Success! Photo added.'
				});
				alertStore.set({
					show: true,
					type: 'info',
					message: 'Please review aspect ratio and file size.'
				});

				addingPhoto = false;
			} catch (e) {
				console.log(e);
				alertStore.set({
					show: true,
					type: 'error',
					message: 'Error! Something went wrong.'
				});

				addingPhoto = false;
			}
		}
	}

	async function deletePhotoHandler(event: MouseEvent, filename: string) {
		let buttonElem = event.target as HTMLButtonElement;
		buttonElem.textContent = '';
		buttonElem.classList.add('button-spinner');

		let existingPhotoWrapper = buttonElem.parentElement;
		existingPhotoWrapper?.remove();

		const photoStorageRef = ref($firebaseStore.storage, 'inventory/' + data.id + '/' + filename);

		try {
			let snapshot = await deleteObject(photoStorageRef);

			// splice object out of photos array
			for (let n = 0; n < data.photos.length; n++) {
				if (data.photos[n].filename == filename) {
					data.photos.splice(n, 1);
				}
			}

			let docRef = doc($firebaseStore.db, 'inventory', data.id);
			let update = await updateDoc(docRef, {
				photos: data.photos
			});

			photoSrcListPopulated = false;

			data.photos = data.photos;

			getPhotoUrls(data);
			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Photo deleted.'
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

	async function saveAndUpdate() {
		if (savingProductData) return;
		savingProductData = true;

		let formData = new FormData(dataFormElem);
		let name = formData.get('name');
		let price = formData.get('price');
		let description = formData.get('description');
		let status = formData.get('status');

		if (name == null) {
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Name cannot be empty.'
			});
			return;
		}

		try {
			data.name = name == null ? '' : name.toString().trim();
			data.price = price == null ? '' : price.toString();
			data.description = description == null ? '' : description.toString();
			data.status = status == null ? false : true;

			let docRef = doc($firebaseStore.db, 'inventory', data.id);
			let update = await updateDoc(docRef, {
				name: data.name,
				price: data.price,
				description: data.description,
				status: data.status,
				updated: Timestamp.now()
			});

			for (let n = 0; n < $inventoryStore.length; n++) {
				if ($inventoryStore[n].id == data.id) {
					$inventoryStore[n] == data;
					break;
				}
			}
			$inventoryStore = $inventoryStore;

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Product updated.'
			});
			savingProductData = false;

			await goto('/cms/inventory');
		} catch (e) {
			console.log(e);
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});
			savingProductData = false;
		}
	}

	async function removeProduct(this: HTMLButtonElement) {
		if (this.textContent == 'CONFIRM') {
			this.textContent = 'DELETING...';

			let docRef = doc($firebaseStore.db, 'inventory', data.id);

			try {
				for (let photoObject of data.photos) {
					let photoStorageRef = ref(
						$firebaseStore.storage,
						'/inventory/' + data.id + '/' + photoObject.filename
					);
					let deletePhoto = await deleteObject(photoStorageRef);
				}

				let removeDoc = await deleteDoc(docRef);

				for (let n = 0; n < $inventoryStore.length; n++) {
					if ($inventoryStore[n].id == data.id) {
						$inventoryStore.splice(n, 1);
						break;
					}
				}
				$inventoryStore = $inventoryStore;

				alertStore.set({
					show: true,
					type: 'success',
					message: 'Success! Product deleted.'
				});

				await goto('/cms/inventory');
			} catch (e) {
				console.log(e);
				alertStore.set({
					show: true,
					type: 'error',
					message: 'Error! Something went wrong.'
				});
			}
			return;
		}
		this.classList.add('confirm');
		this.textContent = 'CONFIRM';
	}
</script>

<h2>EDIT PRODUCT</h2>
<div class="separation-bar" />
<div class="product-content-container">
	<div class="photos-container">
		{#if photoSrcListPopulated}
			{#each data.photos as photoObject, index (photoObject.filename)}
				<div class="photo-wrapper">
					<button
						class="delete-photo"
						on:click={function (evt) {
							deletePhotoHandler(evt, photoObject.filename);
						}}
						in:fade
					>
						DELETE
					</button>
					<button on:click={() => setPrimaryPhoto(photoObject)}>
						<img src={photoSrcList[index]} alt="hat" in:fade />
						{#if photoObject.primary}
							<p class="primary-photo-label" in:fade>PRIMARY</p>
						{/if}
					</button>
				</div>
			{/each}
			{#if data.photos.length < 4}
				<form class="photo">
					<label class="add-photo" for="photoInput">
						{#if addingPhoto}
							<div class="button-spinner" />
						{:else}
							+
						{/if}
					</label>
					<input
						bind:this={photoInput}
						type="file"
						id="photoInput"
						accept="image/png, image/jpeg, image/jpg"
						on:change={addPhotoHandler}
					/>
				</form>
			{/if}
		{:else}
			<div class="loading-container">
				<div class="loading-spinner" />
			</div>
		{/if}
	</div>
	<p class="photo-note">
		Note: Photos should be square-shaped (aspect ratio 1:1). File size &lt; 5MB.
	</p>
	<div class="breaker-bar"><div /></div>

	{#if dataLoaded}
		<form bind:this={dataFormElem} class="data" on:submit|preventDefault={saveAndUpdate}>
			<label for="name">NAME</label>
			<input class="text-input" type="text" id="name" name="name" value={data.name} />

			<label for="price">PRICE</label>
			<input class="text-input" type="text" id="price" name="price" value={data.price} />

			<label for="description">DESCRIPTION</label>
			<textarea class="text-input" id="description" name="description" value={data.description} />

			<div class="status-row">
				<p class="closed-label">Sold</p>
				<input
					name="status"
					type="checkbox"
					class="toggle toggle-lg toggle-success"
					bind:checked={data.status}
				/>
				<p class="open-label">Available</p>
			</div>
			<div class="info-row">
				<p class="info-label">CREATED:</p>
				<p class="info-data">{fullTimestampToDisplay(data.created)}</p>
			</div>
			<div class="info-row">
				<p class="info-label">UPDATED:</p>
				<p class="info-data">{fullTimestampToDisplay(data.updated)}</p>
			</div>
			{#if !data.status}
				<div class="info-row">
					<p class="info-label">SOLD:</p>
					<p class="info-data">
						{#if data.sold.timestamp}
							{fullTimestampToDisplay(data.sold.timestamp)}
						{/if}
					</p>
				</div>
				<div class="sold-info">
					<div class="info-row">
						<p class="info-label">TO:</p>
						<p class="info-data">{data.sold.to}</p>
					</div>
					<div class="info-row">
						<p class="info-label">PRICE:</p>
						<p class="info-data">{data.sold.price}</p>
					</div>
					<div class="info-row">
						<p class="info-label">REFERENCE:</p>
						<p class="info-data">{data.sold.reference}</p>
					</div>
				</div>
			{/if}

			<div class="button-container">
				<button
					class="button remove"
					class:confirm={ghostClass}
					type="button"
					on:click={removeProduct}>REMOVE PRODUCT</button
				>
				<button class="button save" type="submit">
					{#if savingProductData}
						<div class="button-spinner" />
					{:else}
						SAVE & UPDATE
					{/if}</button
				>
			</div>
		</form>
	{/if}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		margin-top: 25px;
	}
	label,
	.info-label {
		font-size: 14px;
		font-family: lato-light;
		margin-bottom: -8px;
	}
	.text-input {
		border: 1px solid hsl(var(--n));
		background-color: hsl(var(--bg));
		outline: none;
		padding: 8px 14px;
		margin: 10px 0;
		width: 100%;
		border-radius: 1px;
		font-family: lato-regular;
		font-size: 18px;
	}
	textarea {
		min-height: 200px;
	}
	.button-container {
		display: flex;
		justify-content: space-between;
		margin: 40px 0;
	}
	.button {
		border: 1px solid hsl(var(--ac));
		font-family: lato-regular;
		font-size: 16px;
		padding: 15px 0px;
		border-radius: 2px;
		font-size: 14px;
		width: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.5s;
	}
	button.confirm {
		border-color: hsl(var(--n));
		color: hsl(var(--n));
		background-color: hsl(var(--er));
	}
	.info-row {
		display: flex;
		margin-top: 10px;
		align-items: baseline;
	}
	.info-data {
		font-family: lato-regular;
		margin-left: 10px;
	}
	.status-row {
		display: flex;
		justify-content: center;

		font-size: 20px;
		margin: 20px 0;
	}
	.toggle {
		margin: 0 10px;
	}
	.open-label {
		color: hsl(var(--su));
	}
	.open-label,
	.closed-label {
		width: 100px;
	}
	.closed-label {
		text-align: right;
	}
	.sold-info {
		margin-left: 15px;
	}
	h2 {
		text-align: center;
		font-family: lato-light;
		font-size: 24px;
	}
	.separation-bar {
		width: 100%;
		height: 1px;
		background-color: hsl(var(--n));
		border-radius: 1px;
	}
	.product-content-container {
		position: relative;
		width: 100%;
	}

	.photos-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		height: 160px;
		margin-top: 15px;
	}
	.photo-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.primary-photo-label,
	.delete-photo {
		font-family: lato-bold;
		font-size: 12px;
		width: 100%;
		text-align: center;
		background-color: hsl(var(--in));
		margin-top: 4px;
		color: hsl(var(--n));
		opacity: 0.9;
		border: 1px solid hsl(var(--n));
		border-radius: 5px;
	}
	.delete-photo {
		background-color: hsl(var(--p));
		margin-bottom: 10px;
		height: 35px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	img {
		height: 75px;
	}
	form.photo {
		margin-top: 50px;
		display: flex;
		text-align: center;
		line-height: 75px;
	}
	label.add-photo {
		width: 75px;
		height: 75px;
		background-color: hsl(var(--n));
		border-radius: 2px;
		align-self: flex-start;
		font-size: 40px;
		color: hsl(var(--nf));
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#photoInput {
		display: none;
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
	.photo-note {
		font-family: lato-light;
		color: black;
		font-size: 11px;
		text-align: center;
	}

	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--nf));
		border-right: 2px solid transparent;
		width: 20px;
		height: 20px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 0px;
	}
	.loading-container {
		width: 100%;
		min-height: 160px;
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
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
