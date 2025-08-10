import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { concatMap, from, map, toArray } from 'rxjs';
import { BunnystreamService } from '../../shared/services/bunny-stream.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClassesService } from '../../shared/services/classes.service';
import { WeeklyPlanService } from '../../shared/services/weekly-plan.service';

@Component({
  selector: 'app-weekly-plan',
  templateUrl: './weekly-plan.component.html',
})
export class WeeklyPlanComponent implements OnInit {
  selectedType: string = 'class';

  pullZone = environment.pullZone;
  classesMetadata!: any;

  weeklyPlan!: any;
  videosByDay: { [key: string]: any[] } = {};

  daysOfWeek: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  constructor(
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private classesService: ClassesService,
    private weeklyPlanService: WeeklyPlanService
  ) {}

  ngOnInit(): void {
    this.getAllClassesMetadata();
    this.fetchWeeklyPlan();
  }

  changeType(type: string) {
    this.selectedType = type;
  }

  getVideosForDay(day: string) {
    console.log(this.weeklyPlan);

    const planEntry = this.weeklyPlan.find(
      (entry: { day: string }) => entry.day === day
    );
    if (!planEntry) return;

    const matchingClasses = this.classesMetadata.filter(
      (cls: any) => cls.subcategory === planEntry.subcategory
    );

    console.log('matchingClasses');
    console.log(matchingClasses);

    const classIds = matchingClasses.map(
      (cls: { classId: any }) => cls.classId
    );

    if (classIds.length === 0) return;

    from(classIds)
      .pipe(
        concatMap((classId: any) =>
          this.bunnystreamService.getVideo('video', classId).pipe(
            map((video) => {
              const meta = this.classesMetadata.find(
                (c: any) => c.classId === classId
              );
              return {
                video,
                safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${
                    video.thumbnailFileName || 'thumbnail.jpg'
                  }`
                ),
                subcategory: meta?.subcategory || null,
                difficulty: meta?.difficulty || null,
                instructorId: meta?.instructorId || null,
              };
            })
          )
        ),
        toArray()
      )
      .subscribe({
        next: (videos) => {
          console.log(videos);

          this.videosByDay[day] = videos;
          console.log(this.videosByDay[day]);
        },
        error: (err) => {
          console.error('Error fetching videos for day:', day, err);
        },
      });
  }

  getAllClassesMetadata() {
    this.classesService.getAllClasses().subscribe({
      next: (res) => {
        this.classesMetadata = res;
      },
      error: (err) => {
        console.error('Error retrieving classes metadata', err);
      },
    });
  }

  fetchWeeklyPlan() {
    this.weeklyPlanService.getConfigs().subscribe({
      next: (res) => {
        this.weeklyPlan = res;
        this.daysOfWeek.forEach((day: string) => this.getVideosForDay(day));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

    onWatchSingleClass(id: string) {
    this.router
      .navigate([`/clases/${id}`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to class successful');
        } else {
          console.error('Navigation to class failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }
}
