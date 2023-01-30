<script lang="ts">
	import type { CustomOrderField } from '../../../../customTypes';
	import { customOrderTemplateStore } from '../../../../customStores';
	import DragHandle from '$lib/DragHandle.svelte';
	import type { Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	let editMode = false;
	let deleteRequested = false;
	let fakeVariable = false;
	let fieldWrapper: HTMLElement;

	let dispatch = createEventDispatcher();

	export let fieldObject: CustomOrderField;
	export let updateTracker: Writable<{
		templateUpdated: boolean;
		firebaseUpdated: boolean;
	}>;

	async function processEdit() {
		// also cancels the delete..
		if (deleteRequested) {
			deleteRequested = false;
			return;
		}
		//changing to edit mode
		if (!editMode) {
			editMode = true;
			return;
		}

		// saving edits..
		// gather all inputs and update fieldObject here
		let inputs = fieldWrapper.getElementsByTagName('input');

		let newOptions: { name: string; selected: boolean }[] = [];
		for (let input of inputs) {
			if (input.value === '') {
				input.remove();
				continue;
			}

			if (input.className.includes('field-name')) {
				fieldObject.name = input.value;
			} else {
				newOptions.push({
					name: input.value,
					selected: false
				});
			}
		}
		fieldObject.options = newOptions;

		// now update the globalStore
		customOrderTemplateStore.update((data) => {
			for (let n = 0; n < data.fields.length; n++) {
				if (data.fields[n].index == fieldObject.index) {
					data.fields[n] = fieldObject;
				}
			}
			console.log('new template data = ', data);
			return data;
		});

		$updateTracker.templateUpdated = true;

		editMode = false;
	}

	async function processDelete() {
		//ask for confirm
		if (!deleteRequested) {
			deleteRequested = true;
			return;
		}

		// full delete
		for (let n = 0; n < $customOrderTemplateStore.fields.length; n++) {
			if ($customOrderTemplateStore.fields[n].name == fieldObject.name) {
				customOrderTemplateStore.update((data) => {
					data.fields.splice(n, 1);
					console.log('updated store', data);
					return data;
				});
				deleteRequested = false;
				$updateTracker.templateUpdated = true;
				dispatch('delete', 'requested');
			}
		}
	}

	function anotherNewOption(this: HTMLInputElement) {
		if (this.value != '') {
			if (this.classList.contains('another')) return;

			let anotherOptionInput = document.createElement('input');
			anotherOptionInput.placeholder = 'Add Option';
			anotherOptionInput.value = '';
			anotherOptionInput.addEventListener('input', anotherNewOption);
			anotherOptionInput.className = this.className;
			anotherOptionInput.classList.add('added');
			this.after(anotherOptionInput);
			this.classList.add('another');
		} else {
			if (this.nextElementSibling?.classList.contains('added')) {
				let notNeededInput = this.nextElementSibling;
				notNeededInput.remove();
				this.classList.remove('another');
			}
		}
	}

	function removeOption(this: HTMLElement) {
		let parent = this.parentElement;
		parent?.remove();
	}
</script>

<div class="wrapper-container" class:ghost={fakeVariable} bind:this={fieldWrapper}>
	<div class="field-header">
		{#if editMode}
			<input type="text" class="field-name" value={fieldObject.name} />
		{:else}
			<h4 class="field-name">{fieldObject.name}</h4>
		{/if}
	</div>
	<div class="options-container">
		{#if editMode}
			<div class="edit-container">
				{#each fieldObject.options as option}
					<div class="option-input-container" in:fade>
						<input type="text" class="option" value={option.name} />
						<button class="delete-option" on:click={removeOption}>X</button>
					</div>
				{/each}
				<input class="option new" placeholder="Add Option" on:input={anotherNewOption} />
			</div>
		{:else}
			{#each fieldObject.options as option}
				<div class="option">{option.name}</div>
			{/each}
		{/if}
		<div class="option other">Other</div>
	</div>

	<div class="footer">
		{#if !editMode}
			<button class="btn delete" on:click={processDelete}>
				{#if deleteRequested}
					CONFIRM
				{:else}
					DELETE
				{/if}
			</button>
		{/if}
		<button class="btn edit" class:save={editMode} on:click={processEdit}>
			{#if deleteRequested}
				CANCEL
			{:else if editMode}
				STAGE
			{:else}
				EDIT
			{/if}
		</button>
		<p class="position-label">POSTION:</p>
		<p class="position">{fieldObject.index}</p>
		<DragHandle />
	</div>

	<div class="separation-bar field" />
</div>

<style>
	.wrapper-container.ghost {
		opacity: 0.1;
	}
	button {
		border-radius: 3px;
		width: 90px;
		height: 20px;
		margin-left: 15px;
		color: hsl(var(--n));
		font-family: lato-bold;
		font-size: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		/* box-shadow: 0px 1px 1px grey; */
	}
	button.edit {
		background-color: hsl(var(--in));
	}
	button.edit.save {
		background-color: hsl(var(--su));
	}
	button.delete {
		background-color: hsl(var(--er));
	}
	.footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 15px;
	}
	.position-label {
		font-family: lato-bold;
		font-size: 16px;
		color: rgb(99, 99, 99);
	}
	.position {
		width: 25px;
		background-color: hsl(var(--n));
		border-radius: 6px;
		height: 30px;
		line-height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-family: lato-bold;
		font-size: 18px;
	}
	.field-header {
		display: flex;
		margin-bottom: 15px;
		margin-top: 25px;
	}
	.field-name {
		font-family: lato-bold;
		font-size: 18px;
		color: rgb(99, 99, 99);
		margin-right: auto;
	}
	input {
		flex-grow: 2;
	}
	input.field-name {
		padding: 5px;
	}
	.edit-container {
		width: 98%;
	}
	.option-input-container {
		display: flex;
	}
	.delete-option {
		color: white;
		margin-left: -45px;
		width: 23px;
		font-size: 24px;
		font-family: lato-light;
		height: 35px;
		box-shadow: none;
		background-color: hsl(var(--er));
		padding: 5px;
		margin-top: 5px;
		opacity: 0.8;
	}
	.options-container {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
		width: 96%;
		margin-left: 2%;
	}
	.option,
	input.field-name {
		padding: 8px 12px;
		margin-right: 18px;
		margin-bottom: 18px;
		border-radius: 3px;
		border: 1px solid hsl(var(--n));
		background-color: rgb(243, 243, 243);
		user-select: none;
		transition: all 0.2s;
		font-size: 18px;
	}
	.separation-bar {
		width: 100%;
		height: 1px;
		background-color: hsl(var(--n));
		border-radius: 1px;
	}
	.separation-bar.field {
		margin-top: 25px;
	}
</style>
