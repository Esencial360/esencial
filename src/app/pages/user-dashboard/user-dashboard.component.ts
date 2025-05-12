import {
  Component,
  OnInit,
  Input,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
// import { AuthService } from '../../shared/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BunnystreamService } from '../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EmailService } from '../../shared/services/email.service';
import { Blog } from '../../shared/Models/Blog';
import { Instructor } from '../../shared/Models/Instructor';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../shared/services/users.service';
import { User } from '../../shared/Models/User';
import { Store } from '@ngrx/store';
import { UserApiActions, ActiveUserApiActions } from '../../state/user.actions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  @Input()
  blogs!: Blog[];

  @Input()
  instructors!: any[];

  @Input() users: ReadonlyArray<User> = [];

  @Output() add = new EventEmitter<string>();

  private ngUnsubscribe = new Subject<void>();
  videos!: any[];
  links: SafeResourceUrl[] = [];
  collectionList: any[] = [];
  isLoading!: boolean;
  userRoles: string[] = [];
  roles: string[] = [];
  userId: string = '';
  streak!: number;
  showRecommendation!: boolean;
  pullZone: string = environment.pullZone

  constructor(
    public authService: AuthService,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private emailService: EmailService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store
  ) {}

  async ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {
      this.store.dispatch(UserApiActions.retrievedUserList({ users }));
    });

    AOS.init({ once: true });
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
              const namespace = 'https://test-assign-roles.com/';
              this.roles = user[`${namespace}roles`][0] || [];
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
                        this.updateAndFetchStreak();
                        this.store.dispatch(
                          ActiveUserApiActions.retrievedActiveUser({
                            user: newUser,
                          })
                        );
                      });

                  } else {
                    this.userId = response._id;
                    this.updateAndFetchStreak();
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
    // this.getVideos();
    this.getCollectionList();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateAndFetchStreak() {
    this.userService.updateStreak(this.userId).subscribe((response) => {
      this.userService.getStreak(this.userId).subscribe((res) => {
        this.streak = res.streak;
      });
    });
  }

  onUploadVideo() {
    this.router.navigateByUrl('/nuevo-video');
  }

  sendTestEmail() {
    const emailData = {
      to: 'pablosalcido1@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email.',
      html: '<p>This is a <strong>test</strong> email.</p>',
    };
    this.emailService.sendEmail(emailData).subscribe({
      next: (response) => {},
      error: (error) => {},
    });
  }

  navigateToBlog() {
    this.router
      .navigateByUrl('/blog')
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to blog page successful');
        } else {
          console.error('Navigation to blog page failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }

  onNavigateToSingleBlog(id: string) {
    this.router
      .navigate([`/blog/${id}`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log(`Navigation to blog ${id} successful`);
        } else {
          console.error(`Navigation to blog ${id} failed`);
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }

  // getVideos() {
  //   this.bunnystreamService.getVideosList().subscribe(
  //     (response: any) => {
  //       this.videos = response.items;
  //       this.links = this.videos.map((video) => {
  //         const link =
  //           'https://iframe.mediadelivery.net/embed/248742/' +
  //           video.guid +
  //           '?autoplay=true&loop=false&muted=false&preload=true&responsive=true';
  //         return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  //       });
  //     },
  //     (error) => {
  //       console.error('Error retrieving videos:', error);
  //     }
  //   );
  // }

  getCollectionList() {
    this.bunnystreamService.getCollectionList().subscribe(
      (response: any) => {
        this.collectionList = response.items;
      },
      (error) => {
        console.error('Error retrieving collection:', error);
      }
    );
  }

  onRemoveRecommendation() {
    this.showRecommendation = false;
  }

  onAddRecommendation() {
    this.showRecommendation = true;
  }

  onRecommendationDone() {
    this.showRecommendation = false;
  }
}
