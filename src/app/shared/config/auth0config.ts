// import { isPlatformBrowser } from '@angular/common';
// import { AuthConfig } from '@auth0/auth0-angular';
// import { environment } from '../../../environments/environment.development';

// export function auth0ConfigFactory(platformId: Object): AuthConfig {
//   return {
//     domain: environment.auth0.domain,
//     clientId: environment.auth0.clientId,
//     authorizationParams: {
//       redirect_uri: environment.auth0.redirectUri,
//     },
//     httpInterceptor: {
//       allowedList: [`${environment.dev.serverUrl}`]
//     },
//     skipRedirectCallback: !isPlatformBrowser(platformId)
//   };
// }