<script lang="ts">
	import {
		customOrderForm,
		customOrderTemplateStore,
		firebaseStore,
		alertStore
	} from '../../customStores';
	import ChatBubble from './ChatBubble.svelte';
	import { goto } from '$app/navigation';
	import { collection, addDoc, Timestamp } from 'firebase/firestore';

	let triggeredTooltip = false;
	let formElement: HTMLFormElement;
	let invalidSubmit = false;
	let formSending = false;

	// build the form submittal object/store based on the template here.

	async function submitForm() {
		if (formSending) {
			return;
		}

		if (validateForm()) {
			formSending = true;
			// package data and submit to firebase, send also to backend for email trigger
			let contactForm = new FormData(formElement);

			$customOrderForm.name = contactForm.get('name')?.toString();
			$customOrderForm.email = contactForm.get('email')?.toString();
			$customOrderForm.phone = contactForm.get('phone')?.toString();

			let address = contactForm.get('address')?.toString();
			let city = contactForm.get('city')?.toString();
			let state = contactForm.get('state')?.toString();
			let postal = contactForm.get('postal')?.toString();

			let fullAddress = address + '\n' + city + ', ' + state + ' ' + postal;
			$customOrderForm.address = fullAddress;

			$customOrderForm.fulfilled = false;
			$customOrderForm.created = Timestamp.now();

			try {
				// save to firebase
				const docRef = await addDoc(
					collection($firebaseStore.db, 'custom-order'),
					$customOrderForm
				);

				// trigger notification email
				let serverRequest = await fetch('/api/trigger-email', {
					method: 'POST',
					body: JSON.stringify({
						payload: $customOrderForm,
						type: 'customOrder'
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				let response = await serverRequest.json();
			} catch (e) {
				console.log(e);

				alertStore.set({
					show: true,
					type: 'error',
					message: 'Error: Something Went Wrong!'
				});

				formSending = false;

				return;
			}

			// redirect to a thank you page..
			await goto('/custom-order/thank-you');
		}
	}

	function validateForm() {
		let formData = new FormData(formElement);

		for (let key of formData.keys()) {
			if (formData.get(key) == '') {
				// set required message and bool
				invalidSubmit = true;
				return false;
			}
		}
		invalidSubmit = false;
		return true;
	}
</script>

<form class="form-container" on:submit|preventDefault={submitForm} bind:this={formElement}>
	<p class="form-preface-message">
		Once I receive this completed request form I'll send a $100 deposit invoice through Square. With
		receipt of deposit I will place you on my list, we will decide on a hat, I will order you a hat
		and start working on a design sketch for you. The balance will be due upon completion and prior
		to shipping.
	</p>

	<p class="lead-time-message">Current lead time: {$customOrderTemplateStore.leadTime}</p>

	<h3 class="form-title">Order Form</h3>
	<div class="separation-bar" />

	{#each $customOrderForm.fields as field, index}
		<div class="field-header">
			<h4 class="field-name">{field.name}</h4>
			<div class="ttip tooltip-open tooltip-left" data-tip="Add Details!" data-tipIndex={index}>
				<button
					type="button"
					class="details-icon"
					class:visible={field.hasDetails}
					on:click={() => (field.hasDetails = !field.hasDetails)}
					><ChatBubble selected={field.hasDetails} /></button
				>
			</div>
		</div>
		<div class="options-container">
			{#each field.options as option (option.name)}
				<button
					type="button"
					class="option"
					on:click={() => {
						option.selected = !option.selected;
						if (!triggeredTooltip) {
							let closestBubble = document.querySelector('div[data-tipIndex="' + index + '"]');
							//console.log(closestBubble);
							closestBubble?.classList.toggle('tooltip');
							setTimeout(() => closestBubble?.classList.toggle('tooltip'), 3000);
							triggeredTooltip = true;
						}
					}}
					class:selected={option.selected}>{option.name}</button
				>
			{/each}
			{#if field.name != 'DESIGN'}
				<button
					type="button"
					class="option other"
					on:click={(event) => {
						let button = event.target;
						//@ts-ignore
						button.classList.toggle('selected');
						if (!field.hasDetails) {
							field.hasDetails = true;
						}
					}}>Other</button
				>
			{/if}
		</div>

		{#if field.hasDetails}
			{#if field.name == 'SIZE'}
				<textarea
					class="field-details"
					placeholder="Know your hat size number?"
					bind:value={field.details}
				/>
			{:else if field.name == 'DESIGN'}
				<textarea
					class="field-details"
					placeholder="Tell me your ideas!"
					bind:value={field.details}
				/>
			{:else}
				<textarea class="field-details" placeholder="Details" bind:value={field.details} />
			{/if}
		{/if}

		<div class="separation-bar field" />
	{/each}

	<h3 class="contact-title">CONTACT</h3>

	<input type="text" class="contact" autocomplete="name" placeholder="Name*" name="name" required />
	<input
		type="email"
		class="contact"
		autocomplete="email"
		placeholder="Email*"
		name="email"
		required
	/>
	<input type="tel" class="contact" autocomplete="tel" placeholder="Phone*" name="phone" required />

	<h4 class="shipping-title">SHIPPING</h4>
	<input
		type="text"
		class="contact"
		autocomplete="address-line1"
		placeholder="Address*"
		name="address"
		required
	/>
	<div class="combine-inputs">
		<input
			id="city"
			type="text"
			class="contact"
			autocomplete="address-level2"
			placeholder="City*"
			name="city"
			required
		/>
		<input
			id="state"
			type="text"
			class="contact"
			autocomplete="address-level1"
			placeholder="State*"
			name="state"
			required
		/>
	</div>

	<input
		type="text"
		class="contact"
		autocomplete="postal-code"
		placeholder="Postal Code*"
		name="postal"
		required
	/>

	<p class="contact-disclaimer">
		The provided details are used only to facilitate this order request and nothing else. Your
		contact information is never shared.
	</p>

	<p class="validation-message" class:show={invalidSubmit}>
		Please complete all contact information. Thanks!
	</p>
	<button class="form-submit" type="submit">
		{#if formSending}
			<div class="button-spinner" />
		{:else}
			SUBMIT REQUEST
		{/if}
	</button>
</form>

<style>
	.form-container {
		font-family: lato-regular;
		font-size: 18px;
		max-width: 700px;
		margin: 0 auto 100px;
	}
	.form-preface-message {
		text-align: center;
		margin-bottom: 15px;
		max-width: 900px;
		margin: 0 auto 15px;
	}
	.lead-time-message {
		font-family: lato-bold;
		color: hsl(var(--ac));
		max-width: 900px;
		margin: 0 auto 65px;
		text-align: center;
	}
	.form-title {
		font-size: 22px;
		text-align: center;
		font-family: lato-black;
		color: rgb(99, 99, 99);
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
	.field-header {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}
	.field-name {
		font-family: lato-bold;
		font-size: 17px;
		color: rgb(99, 99, 99);
	}
	.details-icon {
		width: 20px;
		height: 20px;
	}

	.options-container {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
		width: 96%;
		margin-left: 2%;
	}
	.option {
		padding: 3px 6px;
		margin-right: 8px;
		margin-bottom: 8px;
		border-radius: 3px;
		border: 1px solid hsl(var(--n));
		background-color: rgb(243, 243, 243);
		user-select: none;
		transition: all 0.2s;
		font-size: 18px;
	}
	.option.selected {
		color: white;
		background-color: hsl(var(--s));
	}
	.field-details {
		margin-top: 15px;
		font-size: 18px;
		width: 96%;
		height: 90px;
		border: 1px solid lightgray;
		margin-left: 2%;
		padding: 2px 5px;
		background-color: hsl(var(--bg));
		resize: none;
		outline: none;
	}
	.contact-disclaimer {
		text-align: center;
		font-family: lato-light;
		font-size: 13px;
		margin-top: 40px;
		margin: 10px 40px;
	}
	.contact-title,
	.shipping-title {
		font-family: lato-regular;
		font-size: 16px;
		color: rgb(99, 99, 99);
		margin-top: 45px;
	}
	.shipping-title {
		font-size: 15px;
		margin-top: 15px;
	}

	input {
		border: 1px solid hsl(var(--n));
		background-color: hsl(var(--bg));
		outline: none;
		padding: 8px 14px;
		margin: 10px 0;
		width: 100%;
		border-radius: 1px;
		font-family: lato-regular;
		font-size: 20px;
	}
	input::placeholder {
		font-family: lato-light;
		color: rgb(99, 99, 99);
	}
	.combine-inputs {
		display: flex;
	}
	input#city {
		flex-grow: 4;
		margin-right: 15px;
	}
	input#state {
		flex-basis: 200px;
	}
	.validation-message {
		font-family: lato-bold;
		font-size: 14px;
		text-align: center;
		color: hsl(var(--er));
		margin-top: 15px;
		opacity: 0;
		transition: all 0.5s;
		user-select: none;
	}
	.validation-message.show {
		opacity: 1;
	}
	button.form-submit {
		width: 100%;
		height: 60px;
		padding: 15px 20px;
		text-align: center;
		border: 1px solid rgb(137, 137, 137);
		margin-top: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid hsl(var(--a));
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

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
