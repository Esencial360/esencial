import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../shared/services/users.service';
import { Store } from '@ngrx/store';
import { ActiveUserApiActions } from '../../state/user.actions';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css',
})
export class InstructorDashboardComponent implements OnInit {
  isLoading!: boolean;
  userId: string = '';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private store: Store,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      this.authService.user$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user) => {
          if (user) {
            this.isLoading = false;
          }
          this.authService.user$.subscribe((user) => {
            if (user) {
              this.userService.getUser(user.email).subscribe({
                next: (response) => {
                  if (!response) {
                    const newUser = {
                      email: user.email,
                      firstname: user.given_name,
                      lastname: user.family_name,
                    };
                    this.userService
                      .createUser(newUser)
                      .subscribe((newUser) => {
                        this.userId = newUser._id;
                        this.store.dispatch(
                          ActiveUserApiActions.retrievedActiveUser({
                            user: newUser,
                          })
                        );
                      });
                  } else {
                    this.userId = response._id;
                    this.store.dispatch(
                      ActiveUserApiActions.retrievedActiveUser({
                        user: response,
                      })
                    );
                  }
                },
                error: (err) => {
                  console.error('Error fetching user:', err);
                },
              });
            }
          });
        });
    }
  }
}
