import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client-preset";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import store, { history } from "./store";
import registerServiceWorker from "./registerServiceWorker";
import Index from "./pages/index";
import "./index.css";
import uuidv4 from "uuid/v4";

const nonce = new Buffer(uuidv4()).toString("base64");

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://graphql.anilist.co" }),
  cache: new InMemoryCache()
});

// This helps avoid some jankiness in fighting against the browser's
// default scroll behavior on `POP` transitions.
if ("scrollRestoration" in window.history) {
  this._oldScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = "manual";
} else {
  this._oldScrollRestoration = null;
}

const rootElement = document.querySelector("#root");
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
    module.hot.accept("./pages/index", () => {
      const NewLoad = require("./pages/index").default;
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
