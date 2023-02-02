<script lang="ts">
	import type { CustomOrderField } from '../../../../customTypes';
	import { customOrderTemplateStore, alertStore } from '../../../../customStores';
	import { createEventDispatcher } from 'svelte';

	let showInputs = false;
	let fieldWrapper: HTMLElement;

	let dispatch = createEventDispatcher();

	function saveNewField() {
		let fieldObject: CustomOrderField = {
			name: '',
			index: 0,
			options: []
		};

		let inputs = fieldWrapper.getElementsByTagName('input');

		let newOptions: { name: string; selected: boolean }[] = [];
		for (let input of inputs) {
			if (input.classList.contains('field-name')) {
				fieldObject.name = input.value.toUpperCase();

				if (input.value == '') {
					alertStore.set({
						show: true,
						type: 'error',
						message: 'Error! Field Name required.'
					});
					return;
				}
			} else {
				if (input.value === '') {
					input.remove();
					continue;
				}
				newOptions.push({
					name: input.value,
					selected: false
				});
			}
			input.value = '';
		}
		fieldObject.options = newOptions;
		fieldObject.index = $customOrderTemplateStore.fields.length;

		customOrderTemplateStore.update((data) => {
			data.fields.push(fieldObject);

			//console.log('new template data = ', data);
			return data;
		});

		dispatch('fieldAdded', true);

		showInputs = false;
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
</script>

{#if showInputs}
	<div class="wrapper-container" bind:this={fieldWrapper}>
		<div class="field-header">
			<input type="text" class="field-name" placeholder="Field Name" />
		</div>
		<div class="options-container">
			<div class="edit-container">
				<input class="option new" placeholder="Add Option" on:input={anotherNewOption} />
			</div>

			<div class="option other">Other</div>
		</div>

		<div class="footer">
			<button class="save" on:click={saveNewField}>STAGE</button>
		</div>

		<div class="separation-bar field" />
	</div>
{:else}
	<button class="add-field" on:click={() => (showInputs = true)}>ADD FIELD</button>
{/if}

<style>
	button {
		border-radius: 3px;
		width: 90px;
		height: 30px;
		margin-left: 15px;
		color: hsl(var(--n));
		font-family: lato-bold;
		font-size: 14px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 1px 1px grey;
		background-color: hsl(var(--su));
	}
	button.add-field {
		justify-content: flex-start;
		width: auto;
		padding: 0 10px;
		font-size: 18px;
		justify-self: center;
		margin-left: 0;
	}
	.footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 15px;
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
