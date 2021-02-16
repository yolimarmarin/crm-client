import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from 'apollo-link-http'
import { fetch } from 'node-fetch'

const httpLink = createHttpLink({
  uri: "https://gentle-bayou-92065.herokuapp.com/",
  fetch,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*'
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),

});

export default client;
