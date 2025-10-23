import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-classes-overview',
  templateUrl: './live-classes-overview.component.html',
  styleUrl: './live-classes-overview.component.css'
})
export class LiveClassesOverviewComponent {

    
  currentTime = new Date();
  nextClassTime: Date | null = null;
  isLiveNow = false;
  upcomingClassTitle = '';
  liveViewersCount = 0;
  
  // Animation states
  pulseAnimation = true;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Check if there's a live class or get next scheduled class
    this.checkLiveClassStatus();
    
    // Update time every minute
    setInterval(() => {
      this.currentTime = new Date();
      this.checkLiveClassStatus();
    }, 60000);
  }
  
  checkLiveClassStatus(): void {
    // This would normally call your live class service
    // For demo purposes, we'll simulate some data
    
    // Simulate checking for live classes
    const currentHour = this.currentTime.getHours();
    
    // Simulate live class during certain hours (e.g., 9-10am, 6-7pm)
    if ((currentHour === 9 || currentHour === 18)) {
      this.isLiveNow = true;
      this.liveViewersCount = Math.floor(Math.random() * 50) + 10;
      this.upcomingClassTitle = 'Vinyasa Flow Matutino';
    } else {
      this.isLiveNow = false;
      // Set next class time
      this.calculateNextClassTime();
    }
  }
  
  calculateNextClassTime(): void {
    const now = new Date();
    const nextClass = new Date();
    
    // If it's before 9am, next class is at 9am
    if (now.getHours() < 9) {
      nextClass.setHours(9, 0, 0, 0);
    } 
    // If it's between 10am and 6pm, next class is at 6pm
    else if (now.getHours() < 18) {
      nextClass.setHours(18, 0, 0, 0);
    } 
    // Otherwise, next class is tomorrow at 9am
    else {
      nextClass.setDate(nextClass.getDate() + 1);
      nextClass.setHours(9, 0, 0, 0);
    }
    
    this.nextClassTime = nextClass;
    this.upcomingClassTitle = this.getRandomClassTitle();
  }
  
  getRandomClassTitle(): string {
    const titles = [
      'Hatha Yoga Restaurativo',
      'Vinyasa Flow Dinámico',
      'Yin Yoga Relajante',
      'Power Yoga Energético',
      'Meditación Guiada',
      'Ashtanga Tradicional'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }
  
  getTimeUntilNextClass(): string {
    if (!this.nextClassTime) return '';
    
    const diff = this.nextClassTime.getTime() - this.currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutos`;
  }
  
  goToLiveClasses(): void {
    this.router.navigate(['/lista-clases-envivo']);
  }
  
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

}
