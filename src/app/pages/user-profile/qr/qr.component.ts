import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Instructor } from '../../../shared/Models/Instructor';
import { InstructorService } from '../../../shared/services/instructor.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css',
})
export class QrComponent implements OnInit {
  totalReferrals = 0;
  referralCode = '';
  @Input() instructor!: Instructor;

  constructor(private instructorService: InstructorService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['instructor']) {
      this.instructorService.getReferrals(this.instructor._id).subscribe({
        next: (res) => {
          this.totalReferrals = res.totalReferrals;
          this.referralCode = res.referralCode;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  stripeInstructorSetup() {
    this.instructorService.stripeOnboarding(this.instructor._id).subscribe({
      next: (res) => (window.location.href = res.url),
      error: (err) => console.error(err),
    });
  }
}
