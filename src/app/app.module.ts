import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/ui/header/header.component';
import { FooterComponent } from './shared/ui/footer/footer.component';
import { ButtonComponent } from './shared/ui/button/button.component';
import { LandingComponent } from './pages/landing/landing.component';
import { VideosCatalogueComponent } from './pages/videos/videos-catalogue/videos-catalogue.component';
import { InstructorsCatalogueComponent } from './pages/instructors/instructors-catalogue/instructors-catalogue.component';
import { SingleInstructorComponent } from './pages/instructors/single-instructor/single-instructor.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BlogComponent } from './pages/blogs/blog/blog.component';
import { AboutComponent } from './pages/about/about.component';
import { SingleBlogComponent } from './pages/blogs/single-blog/single-blog.component';
import { SectionSneakPeakComponent } from './components/section-sneak-peak/section-sneak-peak.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { InstructorFilterComponent } from './shared/ui/instructor-filter/instructor-filter.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NewBlogComponent } from './pages/blogs/new-blog/new-blog.component';
import { NewsComponent } from './pages/news/news/news.component';
import { NewNewsComponent } from './pages/news/new-news/new-news.component';
import { SingleNewsComponent } from './pages/news/single-news/single-news.component';
import {
  provideAuth0,
  AuthModule,
  AuthHttpInterceptor,
  AuthClientConfig,
} from '@auth0/auth0-angular';
import { InstructorSingUpComponent } from './pages/instructor-sing-up/instructor-sing-up.component';
import { ClassesCatalogueComponent } from './pages/classes/classes-catalogue/classes-catalogue.component';
import { SingleCollectionClassesComponent } from './pages/classes/single-collection-classes/single-collection-classes.component';
import { UploadVideoComponent } from './pages/classes/upload-video/upload-video.component';
import { SingleClassComponent } from './pages/classes/single-class/single-class.component';
import { DialogComponent } from './shared/ui/dialog/dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ClassStatisticsComponent } from './pages/classes/class-statistics/class-statistics.component';
import { environment } from '../environments/environment';
import { PricingPlanComponent } from './components/pricing-plan/pricing-plan.component';
import { NewsAndBlogsComponent } from './components/news-and-blogs/news-and-blogs.component';
import { BannerComponent } from './components/banner/banner.component';
import { InstructorsOverviewComponent } from './components/instructors-overview/instructors-overview.component';
import { ScrollingBannerComponent } from './components/scrolling-banner/scrolling-banner.component';
import {
  provideCacheableAnimationLoader,
  provideLottieOptions,
} from 'ngx-lottie';
import player from 'lottie-web';
import { LoadingComponent } from './shared/ui/loading/loading.component';
import { CheckMarkComponent } from './shared/ui/check-mark/check-mark.component';
import { InstructorAdminViewComponent } from './pages/instructors/instructor-admin-view/instructor-admin-view.component';
import { isPlatformBrowser } from '@angular/common';
import { auth0ConfigFactory } from './shared/services/auth-config-factory.service';
import { ParallaxComponent } from './shared/ui/parallax/parallax.component';
import { DialogFormComponent } from './shared/ui/dialog-form/dialog-form.component';
import { CatalogueViewComponent } from './shared/ui/catalogue-view/catalogue-view.component';
import { FaqComponent } from './shared/ui/faq/faq.component';
import { PopularClassesAndInstructorsComponent } from './shared/ui/popular-classes-and-instructors/popular-classes-and-instructors.component';
import { ClassThumbnailComponent } from './shared/ui/class-thumbnail/class-thumbnail.component';
import { ClassFilterComponent } from './shared/ui/class-filter/class-filter.component';
import { FavoriteClassesComponent } from './pages/classes/favorite-classes/favorite-classes.component';
import { PreviousClassesComponent } from './pages/classes/previous-classes/previous-classes.component';
import { BadgesComponent } from './pages/user-profile/badges/badges.component';
import { PaymentsComponent } from './pages/user-profile/payments/payments.component';
import { QrComponent } from './pages/user-profile/qr/qr.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogPopupComponent } from './shared/ui/dialog-popup/dialog-popup.component';
import { PartnersComponent } from './pages/partners/partners.component';
import { CommunityComponent } from './pages/community/community.component';
import { RecommendationClassesComponent } from './shared/ui/recommendation-classes/recommendation-classes.component';
import { AppointmentSchedulerComponent } from './pages/appointment-scheduler/appointment-scheduler.component';
import { CreateBannerComponent } from './pages/create-banner/create-banner.component';
import { StoreModule } from '@ngrx/store';
import { userActiveReducer } from './state/user.reducer';
import { instructorReducer } from './state/instructor.reducer';
import { ModalComponent } from './shared/ui/modal/modal.component';
import { AllClassesComponent } from './pages/classes/all-classes/all-classes.component';
import { InstructorProfileComponent } from './pages/user-profile/instructor-profile/instructor-profile.component';
import { AdminProfileComponent } from './pages/user-profile/admin-profile/admin-profile.component';
import { StudentProfileComponent } from './pages/user-profile/student-profile/student-profile.component';
import { localStorageSync } from 'ngrx-store-localstorage';
import { BannerV2Component } from './shared/ui/banner-v2/banner-v2.component';
import { CounselComponent } from './pages/counsel/counsel.component';
import { InstructorCounselorPreviewComponent } from './shared/ui/instructor-counselor-preview/instructor-counselor-preview.component';
import { TitleV2Component } from './shared/ui/title-v2/title-v2.component';
import { MoodCollectionComponent } from './shared/ui/mood-collection/mood-collection.component';
import { BannerV3Component } from './shared/ui/banner-v3/banner-v3.component';
import { ButtonV2Component } from './shared/ui/button-v2/button-v2.component';
import { InstructorDashboardComponent } from './pages/instructor-dashboard/instructor-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { FormatDurationPipe } from './shared/pipes/format-duration.pipe';
import { ClassStatusComponent } from './shared/ui/class-status/class-status.component';
import { ApproveClassComponent } from './pages/classes/approve-class/approve-class.component';
import { SubscriptionManagementComponent } from './components/subscription-management/subscription-management.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { AllMeditationsComponent } from './pages/meditations/all-meditations/all-meditations.component';
import { SingleMeditationComponent } from './pages/meditations/single-meditation/single-meditation.component';
import { MeditationThumbnailComponent } from './shared/ui/meditation-thumbnail/meditation-thumbnail.component';
import { UploadMeditationsComponent } from './pages/meditations/upload-meditations/upload-meditations.component';
import { AllWorkshopsComponent } from './pages/workshops/all-workshops/all-workshops.component';
import { SingleWorkshopComponent } from './pages/workshops/single-workshop/single-workshop.component';
import { UploadWorkshopComponent } from './pages/workshops/upload-workshop/upload-workshop.component';
import { WeeklyPlanComponent } from './components/weekly-plan/weekly-plan.component';
import { AdminWeeklyPlanComponent } from './components/admin-weekly-plan/admin-weekly-plan.component';
import { AdminCollectionsComponent } from './components/admin-collections/admin-collections.component';
import { QuillModule } from 'ngx-quill';

export function localStorageSyncReducer(reducer: any) {
  return localStorageSync({ keys: ['user', 'instructors'], rehydrate: true })(reducer);
}
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ButtonComponent,
    LandingComponent,
    VideosCatalogueComponent,
    SingleClassComponent,
    InstructorsCatalogueComponent,
    SingleInstructorComponent,
    UserProfileComponent,
    BlogComponent,
    AboutComponent,
    SingleBlogComponent,
    SectionSneakPeakComponent,
    PageTitleComponent,
    InstructorFilterComponent,
    SignInComponent,
    SignUpComponent,
    UserDashboardComponent,
    ForgotComponent,
    ContactComponent,
    NewBlogComponent,
    NewsComponent,
    NewNewsComponent,
    SingleNewsComponent,
    InstructorSingUpComponent,
    ClassesCatalogueComponent,
    SingleCollectionClassesComponent,
    UploadVideoComponent,
    DialogComponent,
    ClassStatisticsComponent,
    PricingPlanComponent,
    NewsAndBlogsComponent,
    BannerComponent,
    InstructorsOverviewComponent,
    ScrollingBannerComponent,
    InstructorAdminViewComponent,
    ParallaxComponent,
    DialogFormComponent,
    CatalogueViewComponent,
    FaqComponent,
    PopularClassesAndInstructorsComponent,
    ClassThumbnailComponent,
    ClassFilterComponent,
    FavoriteClassesComponent,
    PreviousClassesComponent,
    BadgesComponent,
    PaymentsComponent,
    QrComponent,
    DialogPopupComponent,
    PartnersComponent,
    CommunityComponent,
    RecommendationClassesComponent,
    AppointmentSchedulerComponent,
    CreateBannerComponent,
    ModalComponent,
    AllClassesComponent,
    InstructorProfileComponent,
    AdminProfileComponent,
    StudentProfileComponent,
    BannerV2Component,
    CounselComponent,
    InstructorCounselorPreviewComponent,
    TitleV2Component,
    MoodCollectionComponent,
    BannerV3Component,
    ButtonV2Component,
    InstructorDashboardComponent,
    AdminDashboardComponent,
    FormatDurationPipe,
    ClassStatusComponent,
    ApproveClassComponent,
    SubscriptionManagementComponent,
    AllMeditationsComponent,
    SingleMeditationComponent,
    MeditationThumbnailComponent,
    UploadMeditationsComponent,
    AllWorkshopsComponent,
    SingleWorkshopComponent,
    UploadWorkshopComponent,
    WeeklyPlanComponent,
    AdminWeeklyPlanComponent,
    AdminCollectionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingComponent,
    CheckMarkComponent,
    MatTabsModule,
    QuillModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AuthModule.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.redirectUri,
        audience: environment.auth0.audience,
        scope: 'openid profile email',
      },
      httpInterceptor: {
        allowedList: [`${environment.dev.serverUrl}`],
      },
    }),
    StoreModule.forRoot(
      {
        user: userActiveReducer,
        instructors: instructorReducer,
      },
      { metaReducers: [localStorageSyncReducer] }
    ),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: 'AUTH0_CLIENT_INIT',
      useFactory: (platformId: Object) => {
        if (isPlatformBrowser(platformId)) {
          return provideAuth0({
            domain: environment.auth0.domain,
            clientId: environment.auth0.clientId,
            authorizationParams: {
              redirect_uri: environment.auth0.redirectUri,
              audience: environment.auth0.audience,
              scope: 'openid profile email',
            },
          });
        }
        return [];
      },
      deps: [PLATFORM_ID],
    },
    provideClientHydration(),
    provideHttpClient(withFetch()),
    [provideAnimationsAsync(), provideAnimations()],
    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideAnimations(),
    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
