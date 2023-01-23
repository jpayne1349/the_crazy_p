<script lang="ts">
	import logo from '$lib/assets/fullLogo.png';
	import { collection, addDoc, Timestamp } from 'firebase/firestore';
	import { firebaseStore, alertStore } from '../../customStores';

	let formSending = false;
	let contactForm: HTMLFormElement;

	async function submitForm() {
		if (formSending) return;

		formSending = true;

		try {
			let formData = new FormData(contactForm);

			let newFormObject = {
				name: formData.get('name'),
				phone: formData.get('phone'),
				email: formData.get('email'),
				details: formData.get('details'),
				created: Timestamp.now()
			};

			let newDoc = await addDoc(collection($firebaseStore.db, 'contact-form'), newFormObject);

			// trigger notification email
			let serverRequest = await fetch('/api/trigger-email', {
				method: 'POST',
				body: JSON.stringify({
					payload: newFormObject,
					type: 'contact'
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let response = await serverRequest.json();

			if (response.error) {
				throw new Error(response.error);
			}

			contactForm.reset();

			formSending = false;

			alertStore.set({
				show: true,
				type: 'success',
				message: 'Form Submitted! Thank you.'
			});
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

		// TODO: clear form or redirect
	}
</script>

<p class="message">
	Thank you for your interest in a Crazy P lid. Please contact us with any questions you may have.
	We look forward to hearing from you!
</p>

<form class="contact-form" on:submit|preventDefault={submitForm} bind:this={contactForm}>
	<input type="text" class="contact" autocomplete="name" placeholder="Name*" name="name" required />
	<input type="tel" class="contact" autocomplete="tel" placeholder="Phone*" name="phone" required />
	<input
		type="email"
		class="contact"
		autocomplete="email"
		placeholder="Email*"
		name="email"
		required
	/>

	<textarea class="field-details" placeholder="Details" name="details" />

	<button class="form-submit" type="submit">
		{#if formSending}
			<div class="button-spinner" />
		{:else}
			SEND
		{/if}
	</button>
</form>

<picture>
	<source srcset={logo} />
	<img class="bg-img" src={logo} alt="company-logo" />
</picture>

<div class="direct-contact">
	<p>OR CONTACT US DIRECTLY AT:</p>

	<a href="mailto:k.thecrazyp@gmail.com">k.thecrazyp@gmail.com</a>
</div>

<style>
	.message {
		font-family: lato-regular;
		font-size: 18px;
		text-align: center;
		max-width: 500px;
		margin: 15px auto 25px;
	}
	form {
		max-width: 500px;
		margin: 0px auto 50px;
	}
	input,
	textarea {
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
	input::placeholder,
	textarea::placeholder {
		font-family: lato-light;
		color: rgb(99, 99, 99);
	}
	.field-details {
		resize: none;
		height: 250px;
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

	img {
		width: 300px;
		margin: 0 auto 50px;
	}
	.direct-contact {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		text-align: center;
		margin-bottom: 50px;
	}
	.direct-contact p {
		margin-bottom: 15px;
	}
	.direct-contact a {
		text-decoration: underline;
	}
	@media screen and (max-width: 800px) {
		.field-details {
			resize: none;
			height: 150px;
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
