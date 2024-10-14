import { Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.css']
})
export class ParallaxComponent {
  @Input() imagePath!: string;
  @Input() parallaxSpeed: number = 0.5;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setBackgroundImage();
  }

  private setBackgroundImage() {
    const container = this.el.nativeElement.querySelector('.parallax-container');
    this.renderer.setStyle(container, 'backgroundImage', `url(${this.imagePath})`);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    const container = this.el.nativeElement.querySelector('.parallax-container');
    const yPos = -(scrollPosition * this.parallaxSpeed);
    this.renderer.setStyle(container, 'backgroundPositionY', `${yPos}px`);
  }
}
