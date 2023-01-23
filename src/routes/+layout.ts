import { firebaseStore, connectToFirebase } from './customStores';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

export const load = async () => {
	console.log('running layout.ts load function');

	if (!browser) {
		return;
	}

	if (!get(firebaseStore)) {
		await connectToFirebase();
		console.log('connected to firebase');
	} else {
		console.log('already connected to firebase');
	}

	return;
};
