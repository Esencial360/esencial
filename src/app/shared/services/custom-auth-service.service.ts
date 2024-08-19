// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { AuthService } from '@auth0/auth0-angular';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomAuthService {
//   constructor(
//     private auth: AuthService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   handleAuthCallback(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       const params = window.location.search;
//       if (params.includes('code=') && params.includes('state=')) {
//         this.auth.handleRedirectCallback().subscribe();
//       }
//     }
//   }
// }