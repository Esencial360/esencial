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
import { AllMeditationsComponent } from './pages/meditations/all-meditations/all-meditations.component';
import { SingleMeditationComponent } from './pages/meditations/single-meditation/single-meditation.component';
import { UploadMeditationsComponent } from './pages/meditations/upload-meditations/upload-meditations.component';
import { SingleWorkshopComponent } from './pages/workshops/single-workshop/single-workshop.component';
import { AllWorkshopsComponent } from './pages/workshops/all-workshops/all-workshops.component';
import { UploadWorkshopComponent } from './pages/workshops/upload-workshop/upload-workshop.component';
import { LiveClassesListComponent } from './pages/live-classes/live-classes-list/live-classes-list.component';
import { LiveClassPlayerComponent } from './pages/live-classes/live-class-player/live-class-player.component';
import { AdminLiveClassComponent } from './pages/live-classes/admin-live-class/admin-live-class.component';
import { AdminLiveClassesListComponent } from './pages/live-classes/admin-live-classes-list/admin-live-classes-list.component';
import { ZoomClassesUserComponent } from './pages/zoom-classes/zoom-classes-user/zoom-classes-user.component';
import { AdminZoomClassFormComponent } from './pages/zoom-classes/admin-zoom-class-form/admin-zoom-class-form.component';
import { AdminZoomClassListComponent } from './pages/zoom-classes/admin-zoom-class-list/admin-zoom-class-list.component';

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
    path: 'taller',
    component: AllWorkshopsComponent,
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
    path: 'nuevo-taller',
    component: UploadWorkshopComponent,
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
    path: 'taller/:id',
    component: SingleWorkshopComponent,
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
    canActivate: [AuthGuard],
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
  {
    path: 'suscribe',
    component: SignUpComponent,
  },
  {
    path: 'meditaciones',
    component: AllMeditationsComponent,
  },
  {
    path: 'meditaciones/:id',
    component: SingleMeditationComponent,
  },
  {
    path: 'nueva-meditacion',
    component: UploadMeditationsComponent,
  },
  { path: 'clases-envivo', component: LiveClassesListComponent },
  { path: 'clase-envivo/:id', component: LiveClassPlayerComponent },
  { path: 'nueva-clase-envivo', component: AdminLiveClassComponent },
  { path: 'lista-clases-envivo', component: AdminLiveClassesListComponent },
  // { path: 'admin/create-live-class', component: CreateLiveClassComponent },
  { path: 'editar-clase-envivo/:id', component: AdminLiveClassComponent },
   {
    path: 'clases-zoom',
    component: AdminZoomClassListComponent,
  },
  {
    path: 'admin/clases-zoom/nueva',
    component: AdminZoomClassFormComponent,
    // canActivate: [AdminGuard]
  },
  {
    path: 'admin/clases-zoom/editar/:id',
    component: AdminZoomClassFormComponent,
  },
  
  // User routes (protected with auth guard)
  // {
  //   path: 'clases-zoom',
  //   component: AdminZoomClassListComponent,
  //   // canActivate: [AuthGuard] // Your auth guard
  // },
  
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // Catch-all for invalid routes (404)`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
