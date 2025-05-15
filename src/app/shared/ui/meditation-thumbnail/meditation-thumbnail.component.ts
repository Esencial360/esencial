import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Meditation } from '../../Models/Meditation';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-meditation-thumbnail',
  templateUrl: './meditation-thumbnail.component.html',
  styleUrl: './meditation-thumbnail.component.css',
})
export class MeditationThumbnailComponent {
  pullZone = environment.pullZone;

  meditationImages = [
    this.pullZone + '/assets/1.png',
    this.pullZone + '/assets/2.png',
    this.pullZone + '/assets/11.png',
    this.pullZone + '/assets/4.png',
    this.pullZone + '/assets/8.png',
    this.pullZone + '/assets/7.png',
    this.pullZone + '/assets/14.jpg',
  ];

  randomImageMap = new Map<string, string>();
  @Input() meditations!: Meditation[];

  @Output()
  actionMeditationSelected = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['meditations']) {
      console.log('meditations changed:');
    }
  }

  setAudioDuration(event: Event, meditation: any): void {
    const audioElement = event.target as HTMLAudioElement;
    meditation.audioDuration = Math.floor(audioElement.duration);
  }
  getImageForMeditation(meditation: any): string {
    const id = meditation?.video?.guid ?? meditation?.id;

    if (!this.randomImageMap.has(id)) {
      const randomIndex = Math.floor(
        Math.random() * this.meditationImages.length
      );
      this.randomImageMap.set(id, this.meditationImages[randomIndex]);
    }

    return this.randomImageMap.get(id)!;
  }

  onMeditationSelected($event: string | undefined) {
    this.actionMeditationSelected.emit($event);
  }
}
