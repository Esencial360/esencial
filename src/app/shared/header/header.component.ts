import { Component, Renderer2, Input, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { burgerMenuAnimation } from '../animations/burger-menu.animations';
// import { AuthService } from '../services/auth.service';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [burgerMenuAnimation],
})
export class HeaderComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;
  userInfo: any;

  @Input()
  userConnected!: boolean;

  isOpen: boolean = false;

  constructor(
    private route: Router,
    private renderer: Renderer2,
    public authService: AuthService,
    @Inject(DOCUMENT) public document: Document, @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.getUserInfo();
  }

  ngOnInit() {
    // Check if running in the browser

    }

    // getUserInfo(): void {
    //   this.authService.getUserInfo().subscribe(
    //     info => this.userInfo = info,
    //     error => console.error('Failed to get user info', error)
    //   );
    // }

  onHome() {
    this.route.navigate(['']);
  }

  onMenu() {
    this.route.navigate(['/menu']);
  }

  onSignIn() {
    this.route.navigate(['/iniciar-sesion']);
  }

  onSignUp() {
    this.route.navigate(['/subscribirse']);
  }

  onContact() {
    this.route.navigate(['/contacto']);
  }

  onUserSettings () {
    this.route.navigate(['/ajustes'])
  }

  onInstructors() {
    this.route.navigate(['/instructores'])
  }
  

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.renderer.addClass(this.document.body, 'menu-opened');
    } else {
      this.renderer.removeClass(this.document.body, 'menu-opened');
    }
  }

  public signOut(): void {
    this.authService.logout({
      logoutParams: { returnTo: '' }
    });
  }


  // login(): void {
  //   this.authService.login();
  // }

  // logout(): void {
  //   this.authService.logout();
  // }
}
