import { Component, Input } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';


@Component({
  selector: 'app-check-mark',
  templateUrl: './check-mark.component.html',
  styleUrl: './check-mark.component.css',
  standalone: true,
  imports: [LottieComponent],
})
export class CheckMarkComponent {

  @Input()
  width!: string;

  @Input()
  height!: string;

  private animationItem: AnimationItem | undefined;
  options: AnimationOptions = {
    path: '/assets/lottie/check.json',
    loop: true,
    autoplay: true
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

}
