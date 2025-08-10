import { Component, OnInit } from '@angular/core';
import { BunnyCollectionsService } from '../../shared/services/bunny-collections.service';
import { CategoryConfig } from '../../shared/Models/CategoryConfig';
import { CategoryConfigService } from '../../shared/services/category-config.service';

@Component({
  selector: 'app-admin-collections',
  templateUrl: './admin-collections.component.html',
  styleUrl: './admin-collections.component.css',
})
export class AdminCollectionsComponent implements OnInit {
  collections: any[] = [];
  newCollection = '';
  loading = false;
  selectedCollection: any;
  subcategories: string[] = [];
  newSubcategory = '';
  categoryConfigs: CategoryConfig[] = [];

  constructor(
    private bunnyService: BunnyCollectionsService,
    private configService: CategoryConfigService
  ) {}

  ngOnInit() {
    this.fetchCollections();
    this.fetchConfigs()
  }

  fetchCollections() {
    this.loading = true;
    this.bunnyService.getCollections().subscribe({
      next: (res: any) => {
        this.collections = res.items || res;
        this.loading = false;
        console.log(res.items);
      },
      error: () => (this.loading = false),
    });
  }

  createCollection() {
    if (!this.newCollection.trim()) return;
    this.bunnyService.createCollection(this.newCollection).subscribe({
      next: () => {
        this.newCollection = '';
        this.fetchCollections();
      },
    });
  }

  deleteCollection(id: string) {
    console.log(id);

    if (!confirm('¿Eliminar esta colección?')) return;
    this.bunnyService.deleteCollection(id).subscribe({
      next: () => this.fetchCollections(),
    });
  }

  fetchConfigs() {
    this.configService.getCategoryConfigs().subscribe({
      next: (configs) => {
        this.categoryConfigs = configs;
        if (this.selectedCollection) {
          this.loadSubcategoriesForSelected();
        }
      },
      error: (err) => {
        console.error('Error fetching category configs', err);
      },
    });
  }

  onSelectCollection(collection: any) {
    this.selectedCollection = collection;
    this.loadSubcategoriesForSelected(); // load existing subcategories
  }

  addSubcategory() {
    if (!this.newSubcategory.trim()) return;
    this.subcategories.push(this.newSubcategory.trim());
    this.newSubcategory = '';
  }

  saveCategoryConfig() {
    const config: CategoryConfig = {
      collectionId: this.selectedCollection.guid,
      collectionName: this.selectedCollection.name,
      subcategories: this.subcategories,
    };

    this.configService.saveCategoryConfig(config).subscribe({
      next: () => {
        console.log('Config saved');
        this.fetchConfigs(); // refresh the list
      },
    });
  }

  loadSubcategoriesForSelected() {
    if (!this.selectedCollection || !this.categoryConfigs) {
      this.subcategories = [];
      return;
    }

    const match = this.categoryConfigs.find(
      (cfg) => cfg.collectionId === this.selectedCollection.guid
    );

    this.subcategories = match?.subcategories || [];
  }

  removeSubcategory(sub: string) {
    if (!this.selectedCollection) return;

    if (!confirm(`¿Eliminar la subcategoría "${sub}"?`)) return;

    this.configService
      .deleteSubcategory(this.selectedCollection.guid, sub)
      .subscribe({
        next: () => {
          this.subcategories = this.subcategories.filter(
            (s) => s.toLowerCase() !== sub.toLowerCase()
          );
        },
        error: (err) => console.error('Error deleting subcategory', err),
      });
  }

  onSelectCollectionById(collectionId: string) {
  const collection = this.collections.find((c) => c.guid === collectionId);
  if (!collection) return;

  this.selectedCollection = collection;
  this.loadSubcategoriesForSelected();
}

deleteCategoryConfig(collectionId: string) {
  if (!confirm('¿Eliminar esta configuración de categoría?')) return;

  this.configService.deleteCategoryConfig(collectionId).subscribe({
    next: () => {
      this.categoryConfigs = this.categoryConfigs.filter(
        (c) => c.collectionId !== collectionId
      );

      if (this.selectedCollection?.guid === collectionId) {
        this.selectedCollection = null;
        this.subcategories = [];
      }
    },
    error: (err) => console.error('Error deleting category config', err),
  });
}

}
