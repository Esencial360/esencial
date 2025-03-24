import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject, takeUntil, tap } from 'rxjs';
import { CounselService } from '../../shared/services/counsel.service';

@Component({
  selector: 'app-counsel',
  templateUrl: './counsel.component.html',
  styleUrl: './counsel.component.css'
})
export class CounselComponent {

    counselors: any;
    private destroy$ = new Subject<void>();
  
    constructor(
      private router: Router,
      private counselService: CounselService
    ) {}
  
    ngOnInit(): void {
      window.scrollTo(0, 0); 
      this.getAllCounselors();
      // AOS.init({ once: true });
    }
  
    getAllCounselors() {
      this.counselService.getAllCounselors()
        .pipe(
          takeUntil(this.destroy$),
          tap((counselors) => {
            this.counselors = counselors;
          }),
          catchError((error) => {
            console.error('Error fetching instructors:', error);
            return [];
          })
        )
        .subscribe();
    }
  
    // onCounselor(id: number) {
    //   this.router.navigate([`/counselors/${id}`]);
    // }
    
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    scrollArrow() {
      const element = document.getElementById('scrollContent')
      if (element) {
        element.scrollIntoView({behavior: 'smooth'})
      } 
    }

}
