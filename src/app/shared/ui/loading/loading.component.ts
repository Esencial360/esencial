import { Component, Input } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  private animationItem: AnimationItem | undefined;

  @Input()
  width!: string;

  @Input()
  height!: string;

  options: AnimationOptions = {
    path: '/assets/lottie/loading.json',
    loop: true,
    autoplay: true
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

}
