import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import 'sanitize.css/sanitize.css';
import App from './App';
import './index.scss';
import { configureAppStore } from './store/configureStore';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports'; // Ajusta la ruta si es necesario

Amplify.configure(awsconfig);

const store = configureAppStore();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
