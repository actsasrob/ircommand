import { Environment } from './environment.type';

import { domain, clientId } from '../auth_config.json';

export const environment: Environment = {
  production: true,
  apiUrl: 'http://changeme:3000',
  localOnly: false,
  auth: {
     domain,
     clientId,
     redirectUri: window.location.origin,
  },
};
