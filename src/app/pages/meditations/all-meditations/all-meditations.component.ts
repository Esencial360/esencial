import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MeditationService } from '../../../shared/services/meditation.service';
import { Meditation } from '../../../shared/Models/Meditation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-meditations',
  templateUrl: './all-meditations.component.html',
  styleUrl: './all-meditations.component.css',
})
export class AllMeditationsComponent implements OnInit {
  pullZone = environment.pullZone;
  meditations: Meditation[] = [];
  loading!: boolean;

  constructor(
    private meditationService: MeditationService,
    private router: Router
  ) {}

  ngOnInit() {
      window.scrollTo(0, 0);
    this.loading = true
    this.meditationService.getAllMeditation().subscribe({
      next: (res) => {
        this.meditations = res;
        this.loading = false
      },
      error: (err) => {
        console.error('Error retrieving meditations', err.message);
        this.loading = false
      },
    });
  }

  onWatchMeditation(id: string) {
    this.router
      .navigate([`/meditaciones/${id}`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to meditaciones successful');
        } else {
          console.error('Navigation to meditaciones failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }
}
