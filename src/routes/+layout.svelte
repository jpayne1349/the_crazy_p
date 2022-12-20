<script lang="ts">
	import './app.css';
	import InstaIcon from '../lib/InstaIcon.svelte';
	import FbIcon from '../lib/FbIcon.svelte';
	import Navigation from '../lib/Navigation.svelte';
	import { page } from '$app/stores';
</script>

<header>
	<Navigation>
		<a href="/" class="header" class:homepage={$page.url.pathname === '/'}>THE CRAZY P</a>
	</Navigation>
</header>
<div class="underline" />

<slot />

<footer>
	<div class="footer-row">
		<a class="footer-link" href="/contact-us">CONTACT</a>
		<a class="footer-link" href="/">&#169; THE CRAZY P</a>
		<a class="footer-link" href="/faq">FAQ</a>
	</div>
	<div class="footer-row">
		<a class="footer-link" href="/terms-of-service">TERMS OF SERVICE</a>
		<a class="footer-link" href="/privacy">PRIVACY POLICY</a>
	</div>
	<div class="footer-row">
		<a href="https://www.instagram.com/thecrazyp_/?hl=en"><InstaIcon /></a>
		<a href="https://www.facebook.com/TheCrazyP/"><FbIcon /></a>
	</div>
</footer>

<style>
	header {
		display: flex;
		position: absolute;
		top: 0;
		width: 100%;
		justify-content: center;
		align-items: center;
		height: 62px;
		box-shadow: 0 0px 4px hsl(var(--ac));
	}
	a.header {
		font-family: docktrin;
		color: hsl(var(--ac));
		z-index: 10;
		font-size: 36px;
	}
	a.header.homepage {
		color: hsl(var(--b2));
	}
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: hsl(var(--a));

		padding: 25px 0;
	}
	.underline {
		width: 100vw;
		height: 1px;
		/* background-color: hsl(var(--ac)); */
		position: absolute;
		top: 62px;
		left: 0;
	}
	.footer-row {
		display: flex;
		width: 300px;
		justify-content: space-evenly;
		font-size: 12px;
		padding: 5px 0;
	}
	.footer-link {
		font-family: lato-light;
		color: hsl(var(--ac));
	}

	@media screen and (max-width: 500px) {
	}
</style>
