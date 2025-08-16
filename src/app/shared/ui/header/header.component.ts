import {
  Component,
  Renderer2,
  Input,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { burgerMenuAnimation } from '../../animations/burger-menu.animations';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { selectActiveUser } from '../../../state/user.selectors';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [burgerMenuAnimation]
})
export class HeaderComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;
  userInfo: any;

  isStepsOpen!: boolean;

  @Input()
  userConnected!: boolean;

  @Input()
  newLanding!: boolean;

  roles!: string;
  isOpen: boolean = false;
  user$: any;
  streak!: any;
  pullZone: string = environment.pullZone;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private renderer: Renderer2,
    public authService: AuthService,
    private store: Store,
    @Inject(DOCUMENT) public document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user$ = this.store.select(selectActiveUser).subscribe((user) => {
      this.streak = user.streak?.count;
    });
  }

  ngOnInit() {
    this.authService.user$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (user) {
          const namespace = 'https://test-assign-roles.com/';
          this.roles = user[`${namespace}roles`][0] || 'User';
          console.log(this.roles);
        }
      });
  }


  onSubscribe() {
    this.authService.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
      appState: { target: '/suscribe' },
    });
  }
  onCloseSteps() {
    this.isStepsOpen = false
  }

  onConfirmedSteps() {
    this.onSubscribe()
    this.isStepsOpen = false
  }

   getAuthenticatedHeaderClasses(): string {
    if (!this.newLanding) {
      return 'bg-white text-black montserrat-normal text-strongBrown w-full';
    } else {
      return 'text-white text-black montserrat-normal text-strongBrown absolute w-full';
    }
  }

  // Get non-authenticated header classes  
  getNonAuthenticatedHeaderClasses(): string {
    if (!this.newLanding) {
      return 'bg-white text-black montserrat-normal text-strongBrown w-full';
    } else {
      return 'text-white text-black montserrat-normal text-strongBrown absolute w-full';
    }
  }

  // Get header box shadow
  getHeaderBoxShadow(): { [key: string]: string } {
    if (this.newLanding) {
      return {};
    }
    return {
      'box-shadow': 'rgba(0, 0, 0, 0.06) 0px 1px 4px, rgba(35, 41, 54, 0.08) 0px 8px 16px'
    };
  }

  // Get logo source
  getLogoSource(): string {
    if (this.newLanding) {
      return `${this.pullZone}/assets/logoWhite.png`;
    }
    return `${this.pullZone}/assets/blueLogo.png`;
  }

  // Get logo text class
  getLogoTextClass(): string {
    if (this.newLanding) {
      return 'text-white text-2xl';
    }
    return 'text-veige';
  }

  // Get mobile menu icon class
  getMobileMenuIconClass(): string {
    if (this.newLanding) {
      return 'material-symbols-outlined text-white text-xl w-4 mr-6 font-bold cursor-pointer';
    }
    return 'material-symbols-outlined text-blue w-4 mr-6 font-bold cursor-pointer';
  }

  // Enhanced toggle method
  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  // Navigation methods (keep your existing ones, just add toggle() calls for mobile)
  onHome(): void {
    this.router.navigate(['/']);
    if (this.isOpen) this.toggle();
  }

  onClasses(): void {
    this.router.navigate(['/clases']);
    if (this.isOpen) this.toggle();
  }

  onMeditations(): void {
    this.router.navigate(['/meditaciones']);
    if (this.isOpen) this.toggle();
  }

  onInstructors(): void {
    this.router.navigate(['/instructores']);
    if (this.isOpen) this.toggle();
  }

  onCounsel(): void {
    this.router.navigate(['/consejo']);
    if (this.isOpen) this.toggle();
  }

  onContact(): void {
    this.router.navigate(['/contacto']);
    if (this.isOpen) this.toggle();
  }

  onUserSettings(): void {
    this.router.navigate(['/ajustes']);
    if (this.isOpen) this.toggle();
  }

  onStartProcess(): void {
   this.isStepsOpen = true
  }

  signOut(): void {
    this.authService.logout();
    if (this.isOpen) this.toggle();
  }
}
