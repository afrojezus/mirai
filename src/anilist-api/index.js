// Anilist 0.2 API wrapper for Mirai

// Fetch? Fuck that.
import axios from 'axios';

// Point to your configuration file
import { clientID, clientSecret } from '../utils/segoku/config.json';
const client = clientID;
const secret = clientSecret;

// Anilist GraphlQL url
const source = 'https://graphql.anilist.co';

// Headers for request
const headers = {
	headers: {
		'Content-type': 'application/json',
		Accept: 'application/json',
	},
};

// This gets thrown if you don't specify configuration file, or if it has any errors.
const noKey = () => new Error('No keys defined, API error.');

// Async get method for any kind of query.
const get = async (query, reqObj) => {
	try {
		if (!client && !secret) {
			throw noKey;
		}
		const { data } = await axios.post(source, {
			query,
			variables: reqObj,
		});
		return data;
	} catch (error) {
		return console.error(error);
	}
};

// Async get method for any kind of query, but with Fetch API instead.
const fGet = async (query, reqObj) => {
	try {
		if (!client && !secret) {
			throw noKey;
		}
		const request = await fetch({
			url: source,
			method: 'POST',
			headers,
			body: JSON.stringify({
				query,
				variables: reqObj,
			}),
		});
		const { data } = await request.json();
		return data;
	} catch (error) {
		return console.error(error);
	}
};

export default {
	get,
	fGet,
};
