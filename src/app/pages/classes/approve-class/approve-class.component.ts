import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ClassesService } from '../../../shared/services/classes.service';
import { Classes } from '../../../shared/Models/Classes';
import { Instructor } from '../../../shared/Models/Instructor';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { InstructorService } from '../../../shared/services/instructor.service';

@Component({
  selector: 'app-approve-class',
  templateUrl: './approve-class.component.html',
  styleUrl: './approve-class.component.css',
})
export class ApproveClassComponent {
  activeVideoId!: any;
  linkVideo!: SafeResourceUrl;
  classInfo!: Classes;
  instructors!: Instructor[];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private classesService: ClassesService,
    private bunnystreamService: BunnystreamService,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeVideoId = params.get('id');
    });
    this.getVideo();
  }

  getVideo() {
    this.getSingleClass(this.activeVideoId);
    const link = `https://iframe.mediadelivery.net/embed/263508/${this.activeVideoId.guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`;
    this.linkVideo = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  getSingleClass(classId: string) {
    this.classesService.getClass(classId).subscribe({
      next: (response) => {
        this.classInfo = response;
      },
      error: (error) => {
        console.log('Error retrieving class', error);
      },
    });
  }
  goBack() {
    this.location.back();
  }
}
