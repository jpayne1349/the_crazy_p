<script>
	import './app.css';
	import { onMount } from 'svelte';
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

		console.log(app, auth, db, storage);
	}
</script>

<header>
	<h1>The Crazy P</h1>

	<button class="btn"> Button </button>
</header>


<section>
	<slot />
</section>

<footer />

<style>
</style>
