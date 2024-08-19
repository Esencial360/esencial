// import { isPlatformBrowser } from '@angular/common';
// import { PLATFORM_ID } from '@angular/core';
// import { AuthConfig, AuthClientConfig } from '@auth0/auth0-angular';
// import { environment } from '../../../environments/environment.development';

// export function auth0ConfigFactory(platformId: Object): AuthClientConfig {
//   const isBrowser = isPlatformBrowser(platformId);

//   const config: AuthConfig = {
//     domain: environment.auth0.domain,
//     clientId: environment.auth0.clientId,
//     authorizationParams: {
//       redirect_uri: isBrowser ? environment.auth0.redirectUri : undefined,
//     },
//     httpInterceptor: {
//       allowedList: isBrowser ? [`${environment.dev.serverUrl}`] : []
//     },
//     skipRedirectCallback: !isBrowser,
//   };

//   return new AuthClientConfig(config);
// }

// auth-config-factory.service.ts
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthConfig } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment.development';

export function auth0ConfigFactory(platformId: Object): AuthConfig {
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    // Return a minimal config for SSR
    return {
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {},
      skipRedirectCallback: true,
      cacheLocation: 'memory',  // Use memory storage in SSR
    };
  }

  // Full config for browser environment
  return {
    ...environment.auth0,
    authorizationParams: {
      redirect_uri: environment.auth0.redirectUri,
    },
    httpInterceptor: {
      allowedList: [`${environment.dev.serverUrl}`]
    },
  };
}