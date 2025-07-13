import { Component, OnInit } from '@angular/core';
import { BunnyCollectionsService } from '../../shared/services/bunny-collections.service';

@Component({
  selector: 'app-admin-collections',
  templateUrl: './admin-collections.component.html',
  styleUrl: './admin-collections.component.css',
})
export class AdminCollectionsComponent implements OnInit {
  collections: any[] = [];
  newCollection = '';
  loading = false;

  constructor(private bunnyService: BunnyCollectionsService) {}

  ngOnInit() {
    this.fetchCollections();
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
}
