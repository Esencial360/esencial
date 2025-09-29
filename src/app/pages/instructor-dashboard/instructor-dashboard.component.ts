import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../shared/services/users.service';
import { Store } from '@ngrx/store';
import { ActiveUserApiActions } from '../../state/user.actions';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { InstructorService } from '../../shared/services/instructor.service';
import { InstructorActions } from '../../state/instructor.actions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css',
})
export class InstructorDashboardComponent implements OnInit {
  isLoading!: boolean;
  userId: string = '';
  // filters = ['MIS CLASES', 'PAGOS', 'CODIGO'];
  filters = ['MIS CLASES', 'CODIGO', 'BADGES']
  pullZone: string = environment.pullZone
  instructorImage!: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private instructorService: InstructorService,
    private store: Store,
    public authService: AuthService,
    private router: Router,
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
              this.instructorService
                .getAllInstructors()
                .subscribe((instructors) => {
                  this.store.dispatch(
                    InstructorActions.retrievedInstructorList({ instructors })
                  );
                });
              this.instructorService.getInstructor(user.email).subscribe({
                next: (response) => {
                  this.instructorImage = response.profilePicture.toString()
                  console.log(response);
                  
                  this.store.dispatch(
                    ActiveUserApiActions.retrievedActiveUser({
                      user: response,
                    })
                  );
                },
                error: (error) => {
                  console.log('error getting Instructor', error);
                },
              });
            }
          });
        });
    }
  }

  onNewClass() {
    this.router.navigate(['/nuevo-video']);
  }
}
