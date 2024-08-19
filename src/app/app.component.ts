import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { routerAnimations } from './shared/animations/router-animations';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routerAnimations]
})
export class AppComponent implements OnInit {
  title = 'esencial';
  outlet!: RouterOutlet
  constructor(public route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Code that interacts with the 'document' object goes here
      AOS.init(); // Or any other AOS-related code
    }
  }
}
