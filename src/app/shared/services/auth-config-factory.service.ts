import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AuthConfig } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';

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