import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

// const httpLink = createHttpLink({
//   uri: 'http://localhost:3005/graphql',
// });

const httpLink = createUploadLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://whispering-woodland-35698.herokuapp.com/graphql'
      : 'http://localhost:3005/graphql',
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
