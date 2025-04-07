import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AboutComponent } from './pages/about/about.component';
import { InstructorsCatalogueComponent } from './pages/instructors/instructors-catalogue/instructors-catalogue.component';
import { SingleInstructorComponent } from './pages/instructors/single-instructor/single-instructor.component';
import { VideosCatalogueComponent } from './pages/videos/videos-catalogue/videos-catalogue.component';
import { BlogComponent } from './pages/blogs/blog/blog.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SingleBlogComponent } from './pages/blogs/single-blog/single-blog.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NewBlogComponent } from './pages/blogs/new-blog/new-blog.component';
import { NewsComponent } from './pages/news/news/news.component';
import { NewNewsComponent } from './pages/news/new-news/new-news.component';
import { SingleNewsComponent } from './pages/news/single-news/single-news.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { InstructorSingUpComponent } from './pages/instructor-sing-up/instructor-sing-up.component';
import { SingleCollectionClassesComponent } from './pages/classes/single-collection-classes/single-collection-classes.component';
import { UploadVideoComponent } from './pages/classes/upload-video/upload-video.component';
import { SingleClassComponent } from './pages/classes/single-class/single-class.component';
import { ClassStatisticsComponent } from './pages/classes/class-statistics/class-statistics.component';
import { InstructorAdminViewComponent } from './pages/instructors/instructor-admin-view/instructor-admin-view.component';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PlatformService } from './shared/services/platform.service';
import { firstValueFrom } from 'rxjs';
import { PartnersComponent } from './pages/partners/partners.component';
import { CommunityComponent } from './pages/community/community.component';
import { AppointmentSchedulerComponent } from './pages/appointment-scheduler/appointment-scheduler.component';
import { CreateBannerComponent } from './pages/create-banner/create-banner.component';
import { AllClassesComponent } from './pages/classes/all-classes/all-classes.component';
import { CounselComponent } from './pages/counsel/counsel.component';
import { ApproveClassComponent } from './pages/classes/approve-class/approve-class.component';
import { animate } from '@angular/animations';

// export const Auth0Guard = async () => {
//   const platformService = inject(PlatformService);

//   if (!platformService.getIsBrowser()) {
//     return false;
//   }
//   const authService = inject(AuthService);

//   const isAuthenticated = await firstValueFrom(authService.isAuthenticated$);

//   if (!isAuthenticated) {
//     authService.loginWithRedirect();
//     return false;
//   }
//   return true;
// };

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: { animation: 'openClosePage' },
  }, // Default route (empty path)
  // { path: 'dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    // canActivate: [AuthGuard],
    data: { animation: 'openClosePage' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'blog/:id',
    component: SingleBlogComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'clases',
    component: AllClassesComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'instructores',
    component: InstructorsCatalogueComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'instructores/:id',
    component: SingleInstructorComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'user-settings',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: { animation: 'openClosePage' },
  },
  {
    path: 'iniciar-sesion',
    component: SignInComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'subscribirse',
    component: SignUpComponent,
    data: { animation: 'openClosePage' },
  },
  { path: 'olvido', component: ForgotComponent },
  {
    path: 'contacto',
    component: ContactComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'nuevo-blog',
    component: NewBlogComponent,
    canActivate: [AuthGuard],
    data: { animation: 'openClosePage' },
  },
  {
    path: 'noticias',
    component: NewsComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'nosotros',
    component: AboutComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'nueva-noticia',
    component: NewNewsComponent,
    canActivate: [AuthGuard],
    data: { animation: 'openClosePage' },
  },
  { path: 'noticias/:id', component: SingleNewsComponent },
  {
    path: 'carrera-instructor',
    component: InstructorSingUpComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'ajustes',
    component: UserProfileComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'nuevo-video',
    component: UploadVideoComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'collection/:id',
    component: SingleCollectionClassesComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'collection/:collectionName/:id',
    component: SingleClassComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'clases/:id',
    component: SingleClassComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'revision/:id',
    component: ApproveClassComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'estadisticas',
    component: ClassStatisticsComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'instructor-previa/:id',
    component: InstructorAdminViewComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'socios',
    component: PartnersComponent,
  },
  {
    path: 'comunidad',
    component: CommunityComponent,
  },
  {
    path: 'asesorias',
    component: AppointmentSchedulerComponent,
  },
  {
    path: 'banner',
    component: CreateBannerComponent,
  },
  {
    path: 'consejo',
    component: CounselComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // Catch-all for invalid routes (404)`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
