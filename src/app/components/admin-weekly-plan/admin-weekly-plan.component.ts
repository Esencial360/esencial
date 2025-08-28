import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WeeklyPlanService } from '../../shared/services/weekly-plan.service';
import { BunnystreamService } from '../../shared/services/bunny-stream.service';
import { CategoryConfigService } from '../../shared/services/category-config.service';
import { CategoryConfig } from '../../shared/Models/CategoryConfig';

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
  types = ['clase'];
  category = [];
  subcategory!: any;
  collectionList: any[] = [];
  categoryConfigs: CategoryConfig[] = [];

  constructor(
    private fb: FormBuilder,
    private weeklyPlanService: WeeklyPlanService,
    private bunnystreamService: BunnystreamService,
    private configService: CategoryConfigService
  ) {
    this.configForm = this.fb.group({
      day: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategoryConfigs();
    this.getCollectionList();

    this.configForm.get('category')?.valueChanges.subscribe((collectionId) => {
      this.updateSubcategories(collectionId);
    });
  }

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

  loadCategoryConfigs() {
    this.configService.getCategoryConfigs().subscribe({
      next: (configs) => {
        this.categoryConfigs = configs;
      },
      error: (err) => {
        console.error('Error loading category configs', err);
      },
    });
  }

  getCollectionList() {
    this.bunnystreamService.getCollectionList().subscribe({
      next: (res) => {
        this.collectionList = res.items;
      },
      error: (err) => {
        console.error('Error retrieving collection:', err);
      },
    });
  }

  updateSubcategories(collectionId: string) {
    const config = this.categoryConfigs.find(
      (cfg) => cfg.collectionId === collectionId
    );
    this.subcategory = config?.subcategories || [];
    this.configForm.get('subcategory')?.reset(); // reset on change
  }
}
