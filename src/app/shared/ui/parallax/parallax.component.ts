import { Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.css']
})
export class ParallaxComponent {
  @Input() imagePath!: string;
  @Input() parallaxSpeed: number = 0.5;
  private container!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.container = this.el.nativeElement.querySelector('.parallax-container');
    this.setBackgroundImage();
  }

  private setBackgroundImage() {
    this.renderer.setStyle(this.container, 'backgroundImage', `url(${this.imagePath})`);
    this.renderer.setStyle(this.container, 'backgroundSize', 'cover');
    this.renderer.setStyle(this.container, 'backgroundAttachment', 'fixed');
    this.renderer.setStyle(this.container, 'backgroundPosition', 'center center');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    const yPos = -(scrollPosition * this.parallaxSpeed);
    this.renderer.setStyle(this.container, 'backgroundPosition', `center ${yPos}px`);
  }
}
