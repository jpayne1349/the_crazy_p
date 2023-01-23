<script lang="ts">
	import { firebaseStore, alertStore, ownerStore } from '../../customStores';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let loggingIn = false;
	let loginForm: HTMLFormElement;

	async function loginUser() {
		if (loggingIn) return;

		loggingIn = true;

		let formData = new FormData(loginForm);
		let email = formData.get('email') as string;
		let password = formData.get('password') as string;

		try {
			let loginAttempt = await signInWithEmailAndPassword($firebaseStore.auth, email, password);

			await goto('/cms');
		} catch (e) {
			console.log(e);

			loginForm.reset();

			loggingIn = false;

			alertStore.set({
				show: true,
				type: 'error',
				message: 'SIGN IN FAILED'
			});
		}
	}
</script>

<h1 class="cms-title">OWNER LOGIN</h1>
<div class="breaker-bar">
	<div />
</div>

<form class="login-form" on:submit|preventDefault={loginUser} bind:this={loginForm}>
	<input type="text" name="email" autocomplete="email" placeholder="Email" required />
	<input type="password" name="password" autocomplete="password" placeholder="Password" required />

	<button type="submit">
		{#if loggingIn}
			<div class="button-spinner" />
		{:else}
			LOGIN
		{/if}
	</button>
</form>

<style>
	.login-form {
		min-height: 75vh;
		max-width: 500px;
		margin: 25px auto;
		padding: 0 25px;
	}
	.cms-title {
		font-family: lato-regular;
		padding-top: 65px;
		text-align: center;
		font-size: 26px;
		height: 100px;
	}
	.breaker-bar {
		display: flex;
		justify-content: center;
	}
	.breaker-bar div {
		width: 30px;
		height: 2px;
		border-radius: 5px;
		background-color: hsl(var(--ac));
		margin: 5px 0;
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
	button {
		width: 100%;
		height: 60px;
		padding: 15px 20px;
		text-align: center;
		border: 1px solid rgb(137, 137, 137);
		margin-top: 45px;
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
