<script lang="ts">
	import './app.css';
	import { onMount } from 'svelte';
	import InstaIcon from '../lib/InstaIcon.svelte';
	import FbIcon from '../lib/FbIcon.svelte';
	import Navigation from '../lib/Navigation.svelte';
	import { firebaseStore } from './customStores.js';

	// temporary firebases connection
	onMount(connectToFirebase);

	/**
	 * Imports firebase modules and initializes the app
	 * Eventually will set a global store that can be referenced throughout the app
	 *
	 * **/
	async function connectToFirebase() {
		const appModule = await import('firebase/app');
		const firestoreModule = await import('firebase/firestore');
		const storageModule = await import('firebase/storage');
		const authModule = await import('firebase/auth');
		const analyticsModule = await import('firebase/analytics');

		// TODO: firestore, storage, etc need to be added

		// ** PUBLIC VARIABLES **
		const firebaseConfig = {
			apiKey: 'AIzaSyD8hzVsjGmzIGxUKk-Rrv1pQ0w6i9M95Ps',
			authDomain: 'thecrazyp-3709c.firebaseapp.com',
			projectId: 'thecrazyp-3709c',
			storageBucket: 'thecrazyp-3709c.appspot.com',
			messagingSenderId: '488243290640',
			appId: '1:488243290640:web:002eb6d3c79c3f1e312095',
			measurementId: 'G-907CL0X3CB'
		};

		// Initialize Firebase
		const app = appModule.initializeApp(firebaseConfig, 'TheCrazyP');
		const auth = authModule.getAuth(app);
		const db = firestoreModule.getFirestore(app);
		const storage = storageModule.getStorage(app);
		//const analytics = getAnalytics(app);});

		firebaseStore.set({
			app: app,
			auth: auth,
			db: db,
			storage: storage
		});
	}
</script>

<header>
	<Navigation>
		<a href="/" class="text-4xl header">THE CRAZY P</a>
	</Navigation>
</header>

<section>
	<slot />
</section>

<footer>
	<div class="footer-row">
		<a class="footer-link" href="/contact">CONTACT</a>
		<a class="footer-link" href="/">&#169; THE CRAZY P</a>
		<a class="footer-link" href="/faq">FAQ</a>
	</div>
	<div class="footer-row">
		<a class="footer-link" href="/terms">TERMS OF SERVICE</a>
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
		height: 60px;
	}
	a.header {
		font-family: docktrin;
		color: hsl(var(--b2));
		z-index: 10;
	}

	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: hsl(var(--a));

		padding: 25px 0;
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
