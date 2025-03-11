import {
  Component,
  Renderer2,
  Input,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { burgerMenuAnimation } from '../../animations/burger-menu.animations';
// import { AuthService } from '../services/auth.service';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { selectStreak } from '../../../state/user.selectors';
import { selectActiveUser } from '../../../state/user.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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

  @Input()
  newLanding!: boolean;

  isOpen: boolean = false;
  user$: any;
  streak!: any;

  constructor(
    private route: Router,
    private renderer: Renderer2,
    public authService: AuthService,
    private store: Store,
    @Inject(DOCUMENT) public document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user$ = this.store.select(selectActiveUser).subscribe((user) => {
      this.streak = user.streak.count;
    });
  }

  ngOnInit() {}
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

  onAbout() {
    this.route.navigate(['/nosotros']);
  }

  onUserSettings() {
    this.route.navigate(['/ajustes']);
  }

  onInstructors() {
    this.route.navigate(['/instructores']);
  }

  onCommunity() {
    this.route.navigate(['/comunidad']);
  }

  onClasses() {
    this.route.navigate(['clases']);
  }

  onCounsel() {
    this.route.navigate(['consejo'])
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
      logoutParams: { returnTo: '' },
    });
  }

  // login(): void {
  //   this.authService.login();
  // }

  // logout(): void {
  //   this.authService.logout();
  // }
}
