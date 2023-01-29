import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';
import { Client, Environment } from 'square';
import type { Order } from 'square';
import { SQUARE_ENV } from '../../../../config';

(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

export const POST = (async ({ request }) => {
	const requestData = await request.json();

	let response: OrderResponse = {
		error: false
	};

	let orderResponse = (await getOrderInformation(requestData.orderId)) as OrderResponse;

	response = orderResponse;

	return json(response);
}) satisfies RequestHandler;

async function getOrderInformation(orderId: string) {
	const client = new Client({
		environment: Environment.Production,
		accessToken: SQUARE_ENV.productionToken
	});
	try {
		//@ts-ignore
		const response = await client.ordersApi.retrieveOrder(orderId);

		return {
			error: false,
			order: response
		};
	} catch (err) {
		console.log(err);
		return {
			error: true,
			order: err
		};
	}
}

interface OrderResponse {
	error: boolean;
	code?: string;
	order?: Order;
}
