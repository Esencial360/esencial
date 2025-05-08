import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { concatMap, from, map, toArray } from 'rxjs';
import { BunnystreamService } from '../../services/bunny-stream.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ClassesService } from '../../services/classes.service';

interface MoodOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  classes: ClassOption[];
}

interface ClassOption {
  id: string;
  imagePath: string;
  title: string;
  duration: string;
  instructor: string;
}

@Component({
  selector: 'app-mood-collection',
  templateUrl: './mood-collection.component.html',
  styleUrl: './mood-collection.component.css',
})
export class MoodCollectionComponent {
  videos!: any[];
  loadingClasses: boolean = true;
  pullZone = environment.pullZone;
  classesMetadata!: any;
  filteredVideos: any[] = [];
  moodConfig = [
    {
      id: 'relaxed',
      title: 'Con ganas de relajarte',
      subtitle: 'Quieres una práctica suave y restaurativa',
      icon: this.pullZone + '/assets/moon.png',
      category: 'hatha',
      subcategories: ['Restaurativo', 'Iyengar', 'Yin'],
    },
    {
      id: 'energetic',
      title: 'Activo/a y con energía',
      subtitle: 'Quieres una práctica dinámica que te rete.',
      icon: this.pullZone + '/assets/sun.png',
      category: 'vinyasa',
      subcategories: ['Power', 'Flow', 'Ashtanga'],
    },
    {
      id: 'restorative',
      title: 'Necesito soltar y resetear',
      subtitle: 'Buscas liberar y restaurar.',
      icon: this.pullZone + '/assets/wave.png',
      category: 'vinyasa',
      subcategory: 'ashtanga',
    },
  ];

  moodOptions: any[] = [];

  // moodOptions: MoodOption[] = [
  //   {
  //     id: 'energetic',
  //     title: 'Activo/a y con energía',
  //     subtitle: 'Quieres una práctica dinámica que te rete.',
  //     icon: this.pullZone + '/assets/sun.png',
  //     classes: [
  //       {
  //         id: 'class1',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '30 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //       {
  //         id: 'class2',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '45 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //       {
  //         id: 'class3',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '60 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'relaxed',
  //     title: 'Con ganas de relajarte',
  //     subtitle: 'Quieres una práctica suave y restaurativa',
  //     icon: this.pullZone + '/assets/moon.png',
  //     classes: [
  //       {
  //         id: 'class4',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '20 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //       {
  //         id: 'class5',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '30 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //       {
  //         id: 'class6',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '40 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'restorative',
  //     title: 'Necesito soltar y resetear',
  //     subtitle: 'Buscas liberar y restaurar.',
  //     icon: this.pullZone + '/assets/wave.png',
  //     classes: [
  //       {
  //         id: 'class7',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '25 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //       {
  //         id: 'class8',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '35 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //       {
  //         id: 'class9',
  //         imagePath: this.pullZone + '/assets/1.jpg',
  //         title: 'NOMBRE DE CLASE, DURACIÓN',
  //         duration: '50 MIN',
  //         instructor: 'INSTRUCTOR',
  //       },
  //     ],
  //   },
  // ];

  constructor(
    private bunnyStreamService: BunnystreamService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private classesService: ClassesService
  ) {}

  ngOnInit() {
    this.getAllClasses();
    this.getAllClassesMetadata();
    // this.filterClassesByMood();
  }

  filterClassesByMood() {
    const subcategoryToCategoryMap: Record<string, string> = {
      Restaurativo: 'hatha',
      Iyengar: 'hatha',
      Yin: 'hatha',
      Power: 'vinyasa',
      Flow: 'vinyasa',
      Ashtanga: 'vinyasa',
    };
    console.log('All videos:', this.videos);

    this.moodOptions = this.moodConfig.map((config) => {
      const filteredClasses = this.videos
        .filter((cls) => {
          const classCategory = subcategoryToCategoryMap[cls.subcategory];
          return (
            classCategory?.toLowerCase() === config.category.toLowerCase() &&
            config.subcategories?.includes(cls.subcategory)
          );
        })
        .slice(0, 3);

      return {
        ...config,
        classes: filteredClasses.map((cls) => ({
          id: cls._id,
          imagePath:
            cls.safeThumbnail?.changingThisBreaksApplicationSecurity ||
            this.pullZone + '/assets/placeholder.jpg',
          title: `${cls.title || 'NOMBRE DE CLASE'}, ${
            cls.duration || '0'
          } MIN`,
          duration: `${cls.duration || '0'} MIN`,
          instructor: cls.instructor?.firstname || 'INSTRUCTOR',
        })),
      };
    });

    console.log('Built moodOptions:', this.moodOptions);
  }

  selectClass(classOption: ClassOption): void {
    console.log('Selected class:', classOption);
    // Implement your navigation or selection logic here
  }

  seeMore(option: MoodOption): void {
    console.log('See more for:', option.title);
  }

  getAllClasses() {
    this.bunnyStreamService.getVideosList().subscribe(
      (response) => {
        this.getVideo(response.items);
        if (response.totalItems <= 0) {
          this.loadingClasses = false;
        } else {
          this.getVideo(response.items);
        }
      },
      (error) => {
        console.error('Unable to retrieve classes', error);
      }
    );
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

  getVideo(videos: any) {
    const videoIdsArray = videos.map((video: { guid: any }) => video.guid);
    if (videoIdsArray.length === 0) {
      return;
    }

    from(videoIdsArray)
      .pipe(
        concatMap((videoId) =>
          this.bunnyStreamService.getVideo(videoId).pipe(
            map((video) => {
              const metadata = this.classesMetadata.find(
                (meta: any) => meta.classId === video.guid
              );

              return {
                video: video,
                safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${
                    video.thumbnailFileName || 'thumbnail.jpg'
                  }`
                ),
                subcategory: metadata?.subcategory || null,
                difficulty: metadata?.difficulty || null,
                instructorId: metadata?.instructorId || null,
              };
            })
          )
        ),
        toArray()
      )
      .subscribe({
        next: (videos) => {
          this.videos = videos;
          this.filterClassesByMood();
          console.log(this.moodOptions);
          this.loadingClasses = false;
        },
        error: (error) => {
          console.error('Error retrieving videos:', error);
        },
      });
  }
}
