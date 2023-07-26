import axios from 'axios';

class APIService {
	headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	};
	constructor() {}
	static async GET(route, othersOptions) {
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				...othersOptions?.headers,
			},
			...othersOptions,
		};
		const resp = await axios(
			`${import.meta.env.VITE_PUBLIC_API_URL}${route}`,
			options,
		);
		return resp;
	}
	static async POST(route, data, othersOptions) {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				...othersOptions?.headers,
			},
			...othersOptions,
			data,
		};
		const resp = await axios(
			`${import.meta.env.VITE_PUBLIC_API_URL}${route}`,
			options,
		);
		return resp;
	}
	static async PUT(route, data, othersOptions) {
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				...othersOptions?.headers,
			},
			...othersOptions,
			data,
		};
		const resp = await axios(
			`${import.meta.env.VITE_PUBLIC_API_URL}${route}`,
			options,
		);
		return resp;
	}
	static async DELETE(route, othersOptions) {
		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				...othersOptions?.headers,
			},
			...othersOptions,
		};
		const resp = await axios(
			`${import.meta.env.VITE_PUBLIC_API_URL}${route}`,
			options,
		);
		return resp;
	}
}

export default APIService;
