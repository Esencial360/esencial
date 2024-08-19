import {domain, clientId, audience, serverUrl} from '../../auth_config.json'

function getRedirectUri() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Provide a default value or fetch from your server configuration
  return 'http://localhost:4200'; // Replace with your actual default URL
}


export const environment = {
    production: false,
    auth0: {
      domain,
      clientId,
      redirectUri: getRedirectUri(),
      audience
    },
    dev: {
      serverUrl
    }
  };

// import {domain, clientId, audience, serverUrl} from '../../auth_config.json'

// export const environment = {
//     auth0: {
//       domain,
//       clientId,
//       redirectUri: 'http://localhost:4200',
//     }
//   };

