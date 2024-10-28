import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
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

  private ngUnsubscribe = new Subject<void>();
  videos!: any[];
  links: SafeResourceUrl[] = [];
  collectionList: any[] = [];
  isLoading!: boolean;
  userRoles: string[] = [];
  roles: string[] = [];
  showRecommendation!: boolean

  constructor(
    public authService: AuthService,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private emailService: EmailService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    AOS.init({ once: true });
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      this.authService.user$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user) => {
          if (user) {
            console.log('User:', user);
            this.isLoading = false;
          }
          this.authService.user$.subscribe((user) => {
            if (user) {
              const namespace = 'https://test-assign-roles.com';
              this.roles = user[`${namespace}roles`][0] || [];
              console.log(this.roles);
              
            }
          });
        });
    }
    this.getVideos();
    this.getCollectionList();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      next: (response) => {
        console.log('Email sent successfully:', response);
        // Handle success (e.g., show a success message)
      },
      error: (error) => {
        console.error('Error sending email:', error);
        // Handle error (e.g., show an error message)
      },
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

  getVideos() {
    this.bunnystreamService.getVideosList().subscribe(
      (response: any) => {
        this.videos = response.items;
        console.log(this.videos);
        console.log(this.videos[0].guid);
        this.links = this.videos.map((video) => {
          const link =
            'https://iframe.mediadelivery.net/embed/248742/' +
            video.guid +
            '?autoplay=true&loop=false&muted=false&preload=true&responsive=true';
          return this.sanitizer.bypassSecurityTrustResourceUrl(link);
        });
      },
      (error) => {
        console.error('Error retrieving videos:', error);
      }
    );
  }

  getCollectionList() {
    this.bunnystreamService.getCollectionList().subscribe(
      (response: any) => {
        this.collectionList = response.items;
        console.log(this.collectionList);
      },
      (error) => {
        console.error('Error retrieving collection:', error);
      }
    );
  }

  onRemoveRecommendation() {
    this.showRecommendation = false
  }

  onAddRecommendation() {
    this.showRecommendation = true
  }

  onRecommendationDone() {
    this.showRecommendation = false
  }
}
