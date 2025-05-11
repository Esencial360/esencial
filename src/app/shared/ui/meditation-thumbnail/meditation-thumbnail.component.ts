import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Meditation } from '../../Models/Meditation';

@Component({
  selector: 'app-meditation-thumbnail',
  templateUrl: './meditation-thumbnail.component.html',
  styleUrl: './meditation-thumbnail.component.css',
})
export class MeditationThumbnailComponent {
  @Input() meditations!: Meditation[];

  @Output()
  actionMeditationSelected = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['meditations']) {
      console.log('meditations changed:', this.meditations);
    }
  }

  onMeditationSelected($event: string | undefined) {
    this.actionMeditationSelected.emit($event);
  }
}
