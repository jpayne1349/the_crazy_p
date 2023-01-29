let process: NodeJS.ProcessEnv | undefined;

const p = process?.env ? process.env : import.meta.env;

export const SENDGRID_ENV = {
	//@ts-ignore
	apiKey: p.VITE_SENDGRID_API_KEY
};

export const firebaseClientConfig = {
	//@ts-ignore
	apiKey: p.VITE_FIREBASE_CLIENT_APIKEY,
	//@ts-ignore
	authDomain: p.VITE_FIREBASE_CLIENT_AUTHDOMAIN,
	//@ts-ignore
	projectId: p.VITE_FIREBASE_CLIENT_PROJECTID,
	//@ts-ignore
	storageBucket: p.VITE_FIREBASE_CLIENT_STORAGEBUCKET,
	//@ts-ignore
	messagingSenderId: p.VITE_FIREBASE_CLIENT_MESSAGINGSENDERID,
	//@ts-ignore
	appId: p.VITE_FIREBASE_CLIENT_APPID,
	//@ts-ignore
	measurementId: p.VITE_FIREBASE_CLIENT_MEASUREMENTID
};

export const SQUARE_ENV = {
	//@ts-ignore
	sandboxToken: p.VITE_SQUARE_SANDBOX_TOKEN,
	//@ts-ignore
	productionToken: p.VITE_SQUARE_PROD_TOKEN
};
