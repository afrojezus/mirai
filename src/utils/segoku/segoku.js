/**
 * Segoku Engine - The Nani Replacement AniList API-wrapper for yura 0.2+
 *
 *  Who the fuck wants to use Apollo for weeb shit when you got this?
 */

// TODO - MAYBE CONSIDER APOLLO?

// TODO: Fix every single eslint-airbnb issue

import { clientID, clientSecret } from './config.json';

import {
	entryQuery,
	entryQueryM,
	bigFuckingQuery,
	bigFuckingQueryS,
	bigFuckingQueryM,
	feedQuery,
	smolQuery,
	tagQuery
} from './queries';

class Segoku {
	segoku = {
		id: clientID,
		secret: clientSecret,
		entryQuery,
		entryQueryM,
		bigFuckingQuery,
		bigFuckingQueryS,
		bigFuckingQueryM,
		feedQuery,
		smolQuery,
		tagQuery,
		source: 'https://graphql.anilist.co',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json'
		}
	};

	customQuery = async (query, requestObject) => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query,
				variables: requestObject
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};
	getSingle = async requestObject => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.entryQuery,
				variables: requestObject
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};
	getSingleManga = async requestObject => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.entryQueryM,
				variables: requestObject
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};
	getSmol = async requestObject => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.smolQuery,
				variables: requestObject
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};
	getFromTag = async requestObject => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.tagQuery,
				variables: requestObject
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	getSimilar = async requestObjects => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.bigFuckingQueryS,
				variables: requestObjects
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

    getSimilarM = async requestObjects => {
        const opt = {
            method: 'POST',
            headers: this.segoku.headers,
            body: JSON.stringify({
                query: this.segoku.bigFuckingQueryM,
                variables: requestObjects
            })
        };

        try {
            const response = await fetch(this.segoku.source, opt);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
        return null;
    };

	get = async requestObjects => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.bigFuckingQuery,
				variables: requestObjects
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	getM = async requestObjects => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.bigFuckingQueryM,
				variables: requestObjects
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	// TODO - Make it get feeds.
	getFeed = async requestObjects => {
		const opt = {
			method: 'POST',
			headers: this.segoku.headers,
			body: JSON.stringify({
				query: this.segoku.feedQuery,
				variables: requestObjects
			})
		};

		try {
			const response = await fetch(this.segoku.source, opt);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
		return null;
	};

	// TODO - Mutation methods for authenticated users.
}

export default Segoku;
