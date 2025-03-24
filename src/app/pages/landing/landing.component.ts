import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InstructorService } from '../../shared/services/instructor.service';
import { BlogService } from '../../shared/services/blog.service';
import { Blog } from '../../shared/Models/Blog';
import { Instructor } from '../../shared/Models/Instructor';
import { AuthService } from '@auth0/auth0-angular';
// import { AuthService } from '../../shared/services/auth.service';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface ClassOverview {
  image: string;
  title: string;
  description: string;
  link: string;
}

interface InstructorsOverview {
  image: string;
  name: string;
  title: string;
}

interface BlogOverview {
  image: string;
  title: string;
  description: string;
}

interface Service {
  title: string;
  image: string;
  description?: string;
  special?: boolean;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  animations: [fadeInAnimation]
})
export class LandingComponent implements OnInit  {
  elementState = 'invisible';
  classes: ClassOverview[] = [];
  instructors: Instructor[] = [];
  blogs: Blog[] = [];
  services: Service[] = [];
  roles!: string;
  backgroundImageUrl = '../../../assets/images/yoga.jpg';
  isLoading!: boolean;
  welcomeLines = [
    {title: 'Clases de yoga', description: 'Diferentes estilos, instructores y duraciones, que se adaptan a tus necesidades y nivel.'},
    {title: 'Meditaciones guiadas', description: 'Para comenzar o atravesar el día con intención, claridad y equilibrio.'},
    {title: 'Charlas y foros', description: 'Espacios para encontrar inspiración y conocimiento wellness, impartido por expertas y expertos.'},
    {title: 'Asesorías personalizadas', description: 'Sesiones guiadas por expertos que te ayudarán a profundizar en tu crecimiento personal y expandir tu bienestar.'},
    {title: '¡Descuentos y acceso exclusivo!', description: 'A cursos y talleres cuidadosamente seleccionados para enriquecer tu práctica.'},

  ]
  
  private ngUnsubscribe = new Subject<void>();

  @ViewChild('marqueeContainer') marqueeContainer!: ElementRef;
  @ViewChild('marqueeContent') marqueeContent!: ElementRef;


  constructor(
    private router: Router,
    private blogService: BlogService,
    private instructorService: InstructorService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngOnInit(): void {
    window.scrollTo(0, 0); 
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
          this.authService.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
      if (user) {
        this.isLoading = false;
        const namespace = 'https://test-assign-roles.com';
        this.roles = user[`${namespace}roles`][0] || [];
      } else {
        this.isLoading = false;
      }
    });
    }
    this.services = [
      { title: 'YOGA', image: '../../../assets/images/6.png'},
      { title: 'MEDITACIONES', image: '../../../assets/images/7.png' },
      { title: 'TALLERES', image: '../../../assets/images/8.png' },
    ];
    this.fetchBlogs();
    this.fetchInstructors();
  }

  // ngOnDestroy() {
  //   this.instructors.unsubscribe()
  // }

  onInView() {
    this.elementState = 'visible';
  }

  async fetchBlogs() {
    await this.blogService.getAllBlogs().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (blogs: Blog[]) => {
        this.blogs = blogs;
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  async fetchInstructors() {
    await this.instructorService.getAllInstructors().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (instructors: Instructor[]) => {
        this.instructors = instructors;
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
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

  navigateToInstructors() {
    this.router
      .navigateByUrl('/instructores')
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to instructores page successful');
        } else {
          console.error('Navigation to instructores page failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }

  onInstructorContact() {
    this.router
    .navigateByUrl('/carrera-instructor')
    .then((navigationSuccess) => {
      if (navigationSuccess) {
        console.log('Navigation to carrera-instructor page successful');
      } else {
        console.error('Navigation to carrera-instructor page failed');
      }
    })
    .catch((error) => {
      console.error(`An error occurred during navigation: ${error.message}`);
    });
  }

  scrollArrow() {
    const element = document.getElementById('scrollContent')
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    } 
  }
}
