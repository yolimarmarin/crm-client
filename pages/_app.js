import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from '../config/apollo'
import StateOrder from '../context/orders/StateOrder'

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <StateOrder>
        <Component {...pageProps}/>
      </StateOrder>
    </ApolloProvider>
  );
}

export default MyApp;
