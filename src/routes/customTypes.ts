import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore, Timestamp } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

export interface CustomFirebaseStore {
	app: FirebaseApp;
	auth: Auth;
	db: Firestore;
	storage: FirebaseStorage;
}

export interface CrazyProduct {
	id: string;
	name: string;
	price: string;
	created: Timestamp;
	updated: Timestamp;
	description: string;
	photos: { filename: string; index: string; primary: boolean }[];
	status: string;
	sold: { reference: string; price: string; to: string; timestamp: Timestamp };
}
