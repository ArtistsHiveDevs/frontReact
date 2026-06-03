import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import 'sanitize.css/sanitize.css';
import App from './App';
import './index.scss';
import { configureAppStore } from './store/configureStore';

import { Amplify } from 'aws-amplify';
import { parseAmplifyConfig } from 'aws-amplify/utils';
import outputs from '../amplify_outputs.json';

const resourcesConfig = parseAmplifyConfig(outputs);

async function configureAmplify() {
  if (import.meta.env.VITE_USE_LOCAL_COGNITO === 'true') {
    try {
      const adminUrl = import.meta.env.VITE_COGNITO_ADMIN_URL;
      const response = await fetch(`${adminUrl}/config`);
      const localCognito = await response.json();

      resourcesConfig.Auth = {
        Cognito: {
          ...resourcesConfig.Auth?.Cognito,
          userPoolId: localCognito.userPoolId,
          userPoolClientId: localCognito.userPoolClientId,
          userPoolEndpoint: localCognito.userPoolEndpoint,
          identityPoolId: undefined,
        },
      } as typeof resourcesConfig.Auth & { Cognito: { userPoolEndpoint?: string } };
    } catch (error) {
      console.warn('No se pudo obtener la configuración de cognito-local, usando AWS:', error);
    }
  }

  Amplify.configure(resourcesConfig);
}

configureAmplify().then(() => {
  const store = configureAppStore();
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

  root.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  );
});
