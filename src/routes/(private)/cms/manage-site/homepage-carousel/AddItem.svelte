<script lang="ts">
	import { carouselStore, firebaseStore, alertStore } from '../../../../customStores';
	import { doc, updateDoc } from 'firebase/firestore';
	import { ref, uploadBytes } from 'firebase/storage';
	import type { CrazyCarouselItem } from '../../../../customTypes';

	let input: HTMLInputElement;
	let previewElem: HTMLElement;
	let readyToSave = false;
	let previewSrc = '';
	let uploadedAspectRatio: string;
	let saving = false;
	let formElem: HTMLFormElement;

	async function addCarouselItem() {}

	function loadPreviewImage(evt: Event) {
		let file: File | undefined;
		if (input.files) {
			file = input.files[0];
		}

		if (file) {
			let fileUrl = URL.createObjectURL(file);

			let img = new Image();
			img.src = fileUrl;
			img.onload = function () {
				// check width and height before allowing save button to display...
				let previewImage = this as HTMLImageElement;
				uploadedAspectRatio = '1.00 : ' + (previewImage.width / previewImage.height).toPrecision(3);

				readyToSave = true;
			};
			if (previewElem.children.length > 0) {
				previewElem.removeChild(previewElem.children[0]);
			}
			previewElem.appendChild(img);
		}
	}

	async function addNewCarouselItem() {
		// upload photo to storage, then add to carousel store and update firestore
		if (saving) return;
		saving = true;

		// check for file exist on input
		let file: File | undefined;
		if (input.files) {
			file = input.files[0];
		} else {
			saving = false;
			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! No file found.'
			});
			return;
		}

		//check for duplicate name in storage already
		for (let photo of $carouselStore.photos) {
			if (photo.filename == file.name) {
				alertStore.set({
					show: true,
					type: 'error',
					message: 'Error! Filename already exists.'
				});
				saving = false;
				readyToSave = false;
				return;
			}
		}

		const storageRef = ref($firebaseStore.storage, '/homepageCarousel/' + file.name);

		try {
			let snapshot = await uploadBytes(storageRef, file);

			//set the carousel store and update firestore..
			let newCarouselItem: CrazyCarouselItem = {
				filename: file.name,
				index: $carouselStore.photos.length,
				inventoryName: ''
			};

			$carouselStore.photos = [...$carouselStore.photos, newCarouselItem];

			let docRef = doc($firebaseStore.db, 'content-management', 'carousel');
			let update = await updateDoc(docRef, {
				photos: $carouselStore.photos
			});

			saving = false;
			readyToSave = false;
			formElem.reset();
			previewElem.removeChild(previewElem.children[0]);

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Success! Photo added.'
			});
		} catch (e) {
			console.log(e);

			alertStore.set({
				show: true,
				type: 'error',
				message: 'Error! Something went wrong.'
			});

			saving = false;
			readyToSave = false;
			formElem.reset();
			previewElem.removeChild(previewElem.children[0]);
		}
	}
</script>

<div class="new-item-container">
	<div class="col">
		<div class="preview-image-container" bind:this={previewElem} />
		<div class="image-placeholder" />
		<form bind:this={formElem} on:submit|preventDefault={addNewCarouselItem}>
			{#if readyToSave}
				<button class="btn btn-success save" type="submit">
					{#if saving}
						<div class="button-spinner" />
					{:else}
						SAVE
					{/if}
				</button>
			{/if}
			<label for="photoInput" class="btn btn-info add" class:hide={readyToSave}>ADD</label>
			<input
				bind:this={input}
				type="file"
				id="photoInput"
				accept="image/png, image/jpeg, image/jpg"
				on:change={loadPreviewImage}
			/>
		</form>
	</div>
	<div class="col two">
		<p>Preferred Aspect Ratio</p>
		<p>1.00 : 1.00</p>
		<p style="margin-top:15px">Uploaded Aspect Ratio</p>
		<p>
			{#if uploadedAspectRatio}
				{uploadedAspectRatio}
			{/if}
		</p>
	</div>
</div>

<style>
	.new-item-container {
		display: flex;
		border: 1px solid hsl(var(--n));
		border-radius: 2px;
		position: relative;
		justify-content: flex-start;
		padding: 15px;
		margin: 25px 100px;
	}
	.preview-image-container {
		position: absolute;
		width: 100px;
	}
	.image-placeholder {
		width: 100px;
		height: 100px;
		background-color: hsl(var(--n));
	}
	form {
		width: 100%;
	}
	label,
	button {
		margin-top: 10px;
		width: 100%;
		height: 20px !important;
	}
	label.hide {
		display: none;
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
	}
	input {
		display: none;
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--n));
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
	@media screen and (max-width: 800px) {
		.new-item-container {
			display: flex;
			padding: 15px;
			margin: 25px 0;
		}
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
