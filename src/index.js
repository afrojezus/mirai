// @flow
/* eslint-disable react/jsx-filename-extension */
// TODO: Fix every single eslint-airbnb issue
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client-preset';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import store, { history } from './store';
import registerServiceWorker from './registerServiceWorker';
import Index from './pages/index';
import './index.css';

const client = new ApolloClient({
	link: new HttpLink({ uri: 'https://graphql.anilist.co' }),
	cache: new InMemoryCache()
});

const rootElement = document.querySelector('#root');
if (rootElement) {
	render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Index />
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>,
		rootElement
	);

	if (module.hot)
		module.hot.accept('./pages/index', () => {
			// eslint-disable-next-line
			const NewLoad = require('./pages/index').default;
			render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <NewLoad />
      </ConnectedRouter>
    </Provider>
  </ApolloProvider>,
				rootElement
			);
		});
}
registerServiceWorker();
