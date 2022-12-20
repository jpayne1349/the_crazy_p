import { writable } from 'svelte/store';
import type { CustomFirebaseStore } from './customTypes';

export const firebaseStore = writable<CustomFirebaseStore>(undefined);

export async function connectToFirebase() {
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
