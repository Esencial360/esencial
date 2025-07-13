import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WeeklyPlanService } from '../../shared/services/weekly-plan.service';
import { BunnystreamService } from '../../shared/services/bunny-stream.service';

interface WeeklyPlan {
  day: string;
  type: 'clase' | 'meditacion';
  category: string;
  subcategory: string;
}

@Component({
  selector: 'app-admin-weekly-plan',
  templateUrl: './admin-weekly-plan.component.html',
  styleUrl: './admin-weekly-plan.component.css',
})
export class AdminWeeklyPlanComponent implements OnInit {
  configForm: FormGroup;
  loading = false;
  successMessage = '';
  days = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  types = ['clase', 'meditacion', 'talleres'];
  category = [];
  subcategory = [];
  collectionList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private weeklyPlanService: WeeklyPlanService,
    private bunnystreamService: BunnystreamService
  ) {
    this.configForm = this.fb.group({
      day: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.configForm.invalid) return;
    this.loading = true;

    const config: WeeklyPlan = this.configForm.value;

    this.weeklyPlanService.saveConfig(config).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.loading = false;
        this.configForm.reset();
      },
      error: (err) => {
        console.error('Error saving config', err);
        this.loading = false;
      },
    });
  }

  getCollectionList() {
    this.bunnystreamService.getCollectionList().subscribe(
      (response: any) => {
        this.collectionList = response.items;
        console.log(this.collectionList);
      },
      (error) => {
        console.error('Error retrieving collection:', error);
      }
    );
  }
}
