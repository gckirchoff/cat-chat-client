import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import axios from 'axios';

import client from './utils/client';

axios.get(
  process.env.NODE_ENV === 'production'
    ? 'https://obscure-scrubland-67457.herokuapp.com/wakeup'
    : 'http://localhost:5000/wakeup'
);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
