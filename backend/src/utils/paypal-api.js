const Cart = require('../Models/Cart');
const getCart = require('./getCart');

// set some important variables
const { CLIENT_ID, APP_SECRET } = process.env;
const base = 'https://api-m.sandbox.paypal.com';

// call the create order method
async function createOrder(userId) {
	const { cart } = await getCart(userId);
	let total = 0;
	const items = cart.cartItems.map((item) => {
		total += item.discounted_price * item.qty;
		return {
			name: item.name,
			unit_amount: {
				currency_code: 'CAD',
				value: item.discounted_price,
			},
			quantity: item.qty,
			
		};
	});

	const accessToken = await generateAccessToken();
	const url = `${base}/v2/checkout/orders`;
	const response = await fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			intent: 'CAPTURE',
			purchase_units: [
				{
					items,
                    amount: {
                        currency_code: 'CAD',
                        value: total + total * 18 / 100 + 5,
                        breakdown: {
                            item_total: {
                                currency_code: 'CAD',
                                value: total,
                            },
                            tax_total: {
                                currency_code: 'CAD',
                                value: total * 18 / 100,
                            },
                            shipping: {
                                currency_code: 'CAD',
                                value: 5,
                            }
                        }
					},
				},
			],
		}),
	});
	return handleResponse(response);
}

// capture payment for an order
async function capturePayment(orderId) {
	const accessToken = await generateAccessToken();
	const url = `${base}/v2/checkout/orders/${orderId}/capture`;
	const response = await fetch(url, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return handleResponse(response);
}

// generate access token
async function generateAccessToken() {
	const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64');
	const response = await fetch(`${base}/v1/oauth2/token`, {
		method: 'post',
		body: 'grant_type=client_credentials',
		headers: {
			Authorization: `Basic ${auth}`,
		},
	});
	const jsonData = await handleResponse(response);
	return jsonData.access_token;
}

// generate client token
async function generateClientToken() {
	const accessToken = await generateAccessToken();
	const response = await fetch(`${base}/v1/identity/generate-token`, {
		method: 'post',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Accept-Language': 'en_US',
			'Content-Type': 'application/json',
		},
	});

	const jsonData = await handleResponse(response);
	return jsonData.client_token;
}

async function handleResponse(response) {
	if (response.status === 200 || response.status === 201) {
		return response.json();
	}
	const errorMessage = await response.text();
	throw new Error(errorMessage);
}

module.exports = {
	createOrder,
	capturePayment,
	generateAccessToken,
	generateClientToken,
};
