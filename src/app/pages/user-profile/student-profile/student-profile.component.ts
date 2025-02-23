import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css',
})
export class StudentProfileComponent implements OnInit {
  @Input() filters!: string[];

  passwordForm!: FormGroup;
  message!: string;
  badges = [
    {
      name: 'Badge 1',
    },
    {
      name: 'Badge 2',
    },
    {
      name: 'Badge 3',
    },
    {
      name: 'Badge 4',
    },
    {
      name: 'Badge 5',
    },
    {
      name: 'Badge 6',
    },
  ];
  futureBadges = [
    {
      name: 'Badge 1',
    },
    {
      name: 'Badge 2',
    },
    {
      name: 'Badge 3',
    },
    {
      name: 'Badge 4',
    },
    {
      name: 'Badge 5',
    },
    {
      name: 'Badge 6',
    },
  ];

  favoriteClasses = [
    {
      name: 'Clase 1',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 2',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 3',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
  ];

  previousClasses = [
    {
      name: 'Clase 1',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 2',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 3',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
  ];

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    const newPassword = this.passwordForm.get('newPassword')?.value;

    try {
      this.message = 'Password changed successfully';
      this.passwordForm.reset();
    } catch (error) {
      this.message = 'Error changing password. Please try again.';
      console.error('Error changing password:', error);
    }
  }
}
