import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ZoomClassService, ZoomClass } from '../../../shared/services/zoom-class.service';
import { LiveClassService } from '../../../shared/services/live-class.service';
import { LiveClass } from '../../../shared/services/live-class.service';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-live-classes-overview',
  templateUrl: './live-classes-overview.component.html',
  styleUrls: ['./live-classes-overview.component.css']
})
export class LiveClassesOverviewComponent implements OnInit, OnDestroy {
  
  currentTime = new Date();
  
  // Combined live status
  isLiveNow = false;
  upcomingClassTitle = '';
  liveViewersCount = 0;
  nextClassTime: Date | null = null;
  
  // YouTube Live Classes
  youtubeLiveClasses: LiveClass[] = [];
  youtubeUpcomingClasses: LiveClass[] = [];
  nextYouTubeClass: LiveClass | null = null;
  hasYouTubeLiveClasses = false;
  loadingYouTubeLiveClasses = false;
  
  // Zoom Classes
  upcomingZoomClasses: ZoomClass[] = [];
  liveZoomClasses: ZoomClass[] = [];
  nextZoomClass: ZoomClass | null = null;
  hasZoomClasses = false;
  loadingZoomClasses = false;
  
  // Overall status
  hasAnyLiveClasses = false;
  nextClass: { type: 'youtube' | 'zoom', class: LiveClass | ZoomClass, time: Date } | null = null;
  
  // Animation states
  pulseAnimation = true;
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  private pollingInterval: any;
  
  constructor(
    private router: Router,
    private zoomClassService: ZoomClassService,
    private liveClassService: LiveClassService
  ) {}
  
  ngOnInit(): void {
    // Load both Zoom and YouTube classes
    this.loadAllClasses();
    
    // Update time and refresh every minute
    this.pollingInterval = setInterval(() => {
      this.currentTime = new Date();
      this.updateLiveStatus();
    }, 60000); // Update every minute
    
    // Refresh data every 5 minutes
    setInterval(() => {
      this.loadAllClasses();
    }, 300000);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Clear interval
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
  
  /**
   * Load all classes (YouTube Live + Zoom)
   */
  // loadAllClasses(): void {
  //   this.loadingYouTubeLiveClasses = true;
  //   this.loadingZoomClasses = true;
    
  //   // Use forkJoin to load both simultaneously
  //   const youtubeUpcoming$ = this.liveClassService.getUpcomingClasses();
  //   const youtubeLive$ = this.liveClassService.getLiveClasses();
  //   const zoomUpcoming$ = this.zoomClassService.getUpcomingClasses(10);
    
  //   const sub = forkJoin({
  //     youtubeUpcoming: youtubeUpcoming$,
  //     youtubeLive: youtubeLive$,
  //     zoomUpcoming: zoomUpcoming$
  //   }).subscribe({
  //     next: (results) => {
  //       // Process YouTube classes
  //       if (results.youtubeUpcoming.success && Array.isArray(results.youtubeUpcoming.data)) {
  //         this.youtubeUpcomingClasses = results.youtubeUpcoming.data;
  //       }
        
  //       if (results.youtubeLive.success && Array.isArray(results.youtubeLive.data)) {
  //         this.youtubeLiveClasses = results.youtubeLive.data;
  //         this.hasYouTubeLiveClasses = this.youtubeLiveClasses.length > 0;
  //       }
        
  //       // Process Zoom classes
  //       if (results.zoomUpcoming.success && Array.isArray(results.zoomUpcoming.data)) {
  //         this.upcomingZoomClasses = results.zoomUpcoming.data;
  //         this.hasZoomClasses = this.upcomingZoomClasses.length > 0;
  //       }
        
  //       // Update statuses
  //       this.updateLiveStatus();
  //       this.findNextClass();
        
  //       this.loadingYouTubeLiveClasses = false;
  //       this.loadingZoomClasses = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading classes:', error);
  //       this.loadingYouTubeLiveClasses = false;
  //       this.loadingZoomClasses = false;
  //     }
  //   });
    
  //   this.subscriptions.push(sub);
  // }
  loadAllClasses(): void {
  this.loadingYouTubeLiveClasses = true;
  this.loadingZoomClasses = true;
  
  // Use forkJoin to load both simultaneously
  const youtubeUpcoming$ = this.liveClassService.getUpcomingClasses();
  const youtubeLive$ = this.liveClassService.getLiveClasses();
  const zoomUpcoming$ = this.zoomClassService.getUpcomingClasses(20);
  const zoomLive$ = this.zoomClassService.getLiveZoomClasses(); // ✅ NEW: Get live Zoom classes
  
  const sub = forkJoin({
    youtubeUpcoming: youtubeUpcoming$,
    youtubeLive: youtubeLive$,
    zoomUpcoming: zoomUpcoming$,
    zoomLive: zoomLive$ // ✅ NEW
  }).subscribe({
    next: (results) => {
      console.log(results);
      
      // Process YouTube classes
      if (results.youtubeUpcoming.success && Array.isArray(results.youtubeUpcoming.data)) {
        this.youtubeUpcomingClasses = results.youtubeUpcoming.data;
      }
      
      if (results.youtubeLive.success && Array.isArray(results.youtubeLive.data)) {
        this.youtubeLiveClasses = results.youtubeLive.data;
        this.hasYouTubeLiveClasses = this.youtubeLiveClasses.length > 0;
      }
      
      // Process Zoom classes
      if (results.zoomUpcoming.success && Array.isArray(results.zoomUpcoming.data)) {
        this.upcomingZoomClasses = results.zoomUpcoming.data;
        this.hasZoomClasses = this.upcomingZoomClasses.length > 0;
        console.log(this.upcomingZoomClasses);
      }
      
      if (results.zoomLive.success && Array.isArray(results.zoomLive.data)) {
        console.log(results.zoomLive.data);
        
        this.liveZoomClasses = results.zoomLive.data;
        console.log(this.liveZoomClasses);
        
      }
      
      // Update statuses
      this.updateLiveStatus();
      this.findNextClass();
      
      this.loadingYouTubeLiveClasses = false;
      this.loadingZoomClasses = false;
    },
    error: (error) => {
      console.error('Error loading classes:', error);
      this.loadingYouTubeLiveClasses = false;
      this.loadingZoomClasses = false;
    }
  });
  
  this.subscriptions.push(sub);
}
  
  /**
   * Update which classes are currently live
   */
  // updateLiveStatus(): void {
  //   // Check Zoom classes for live status
  //   this.liveZoomClasses = this.upcomingZoomClasses.filter(zoomClass => 
  //     this.zoomClassService.isClassLive(zoomClass.scheduledDate, zoomClass.duration)
  //   );
    
  //   // Check YouTube classes for live status (they come from getLiveClasses())
  //   // But also verify with time calculation
  //   const liveYouTubeClasses = this.youtubeLiveClasses.filter(liveClass =>
  //     this.liveClassService.isCurrentlyLive(liveClass)
  //   );
    
  //   // Determine overall live status
  //   this.hasAnyLiveClasses = this.liveZoomClasses.length > 0 || liveYouTubeClasses.length > 0;
  //   this.isLiveNow = this.hasAnyLiveClasses;
    
  //   // Set live class details
  //   if (this.liveZoomClasses.length > 0) {
  //     const firstLiveZoom = this.liveZoomClasses[0];
  //     this.upcomingClassTitle = firstLiveZoom.title;
  //     this.liveViewersCount = firstLiveZoom.registeredUsers?.length || 0;
  //   } else if (liveYouTubeClasses.length > 0) {
  //     const firstLiveYouTube = liveYouTubeClasses[0];
  //     this.upcomingClassTitle = firstLiveYouTube.title;
  //     this.liveViewersCount = firstLiveYouTube.registeredUsers?.length || 0;
  //   }
  // }
  
  /**
   * Find the next upcoming class (from both YouTube and Zoom)
   */
  findNextClass(): void {
    const now = new Date();
    const futureClasses: Array<{ type: 'youtube' | 'zoom', class: LiveClass | ZoomClass, time: Date }> = [];
    
    // Add future YouTube classes
    this.youtubeUpcomingClasses.forEach(liveClass => {
      const classTime = new Date(liveClass.scheduledTime);
      if (classTime > now) {
        futureClasses.push({
          type: 'youtube',
          class: liveClass,
          time: classTime
        });
      }
    });
    
    // Add future Zoom classes
    this.upcomingZoomClasses.forEach(zoomClass => {
      const classTime = new Date(zoomClass.scheduledDate);
      if (classTime > now) {
        futureClasses.push({
          type: 'zoom',
          class: zoomClass,
          time: classTime
        });
      }
    });
    
    // Sort by time and get the earliest
    if (futureClasses.length > 0) {
      futureClasses.sort((a, b) => a.time.getTime() - b.time.getTime());
      this.nextClass = futureClasses[0];
      this.nextClassTime = this.nextClass.time;
      
      // Set next class details
      if (this.nextClass.type === 'youtube') {
        this.nextYouTubeClass = this.nextClass.class as LiveClass;
        this.upcomingClassTitle = this.nextYouTubeClass.title;
      } else {
        this.nextZoomClass = this.nextClass.class as ZoomClass;
        this.upcomingClassTitle = this.nextZoomClass.title;
      }
    } else {
      this.nextClass = null;
      this.nextClassTime = null;
      this.nextYouTubeClass = null;
      this.nextZoomClass = null;
    }
  }
  
  /**
   * Get time until next class starts
   */
  getTimeUntilNextClass(): string {
    if (!this.nextClassTime) return '';
    
    const diff = this.nextClassTime.getTime() - this.currentTime.getTime();
    
    if (diff < 0) return 'Ya comenzó';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutos`;
  }
  
  /**
   * Navigate to YouTube live classes
   */
  goToLiveClasses(): void {
    this.router.navigate(['/lista-clases-envivo']);
  }
  
  /**
   * Navigate to Zoom classes
   */
  goToZoomClasses(): void {
    this.router.navigate(['/clases-zoom']);
  }
  
  /**
   * Get greeting based on time of day
   */
  getDayGreeting(): string {
    const hour = this.currentTime.getHours();
    
    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }
  
  /**
   * Get stats about upcoming classes this week
   */
  getWeeklyStats(): { classCount: number, instructorCount: number, youtubeCount: number, zoomCount: number } {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Filter YouTube classes this week
    const weekYouTubeClasses = this.youtubeUpcomingClasses.filter(liveClass => {
      const classDate = new Date(liveClass.scheduledTime);
      return classDate >= now && classDate <= weekFromNow;
    });
    
    // Filter Zoom classes this week
    const weekZoomClasses = this.upcomingZoomClasses.filter(zoomClass => {
      const classDate = new Date(zoomClass.scheduledDate);
      return classDate >= now && classDate <= weekFromNow;
    });
    
    // Combine instructors from both
    const youtubeInstructors = new Set(weekYouTubeClasses.map(c => c.instructor?.name || c.instructor));
    const zoomInstructors = new Set(weekZoomClasses.map(c => c.instructorName));
    const allInstructors = new Set([...youtubeInstructors, ...zoomInstructors]);
    
    return {
      classCount: weekYouTubeClasses.length + weekZoomClasses.length,
      instructorCount: allInstructors.size,
      youtubeCount: weekYouTubeClasses.length,
      zoomCount: weekZoomClasses.length
    };
  }
  
  /**
   * Get total live classes count
   */
  getTotalLiveCount(): number {
    return this.liveZoomClasses.length + this.youtubeLiveClasses.length;
  }
  
  /**
   * Check if there are any classes available
   */
  hasAnyClasses(): boolean {
    return this.hasYouTubeLiveClasses || this.hasZoomClasses;
  }
  
  /**
   * Check if loading any data
   */
  isLoading(): boolean {
    return this.loadingYouTubeLiveClasses || this.loadingZoomClasses;
  }


/**
 * Update which classes are currently live
 */
updateLiveStatus(): void {
  // Zoom live classes are now fetched from the backend
  // But we can still verify with client-side calculation as backup
  const clientSideLiveZoom = this.upcomingZoomClasses.filter(zoomClass => 
    this.zoomClassService.isClassLive(zoomClass.scheduledDate, zoomClass.duration)
  );
  
  // Merge backend live classes with client-side calculation
  // Use a Set to avoid duplicates
  const liveZoomIds = new Set([
    ...this.liveZoomClasses.map(c => c._id),
    ...clientSideLiveZoom.map(c => c._id)
  ]);
  
  this.liveZoomClasses = this.upcomingZoomClasses.filter(c => 
    c._id && liveZoomIds.has(c._id)
  );
  
  // Check YouTube classes for live status
  const liveYouTubeClasses = this.youtubeLiveClasses.filter(liveClass =>
    this.liveClassService.isCurrentlyLive(liveClass)
  );
  
  // Determine overall live status
  this.hasAnyLiveClasses = this.liveZoomClasses.length > 0 || liveYouTubeClasses.length > 0;
  this.isLiveNow = this.hasAnyLiveClasses;
  
  // Set live class details
  if (this.liveZoomClasses.length > 0) {
    const firstLiveZoom = this.liveZoomClasses[0];
    this.upcomingClassTitle = firstLiveZoom.title;
    this.liveViewersCount = firstLiveZoom.registeredUsers?.length || 0;
  } else if (liveYouTubeClasses.length > 0) {
    const firstLiveYouTube = liveYouTubeClasses[0];
    this.upcomingClassTitle = firstLiveYouTube.title;
    this.liveViewersCount = firstLiveYouTube.registeredUsers?.length || 0;
  }
}
}