import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private route: Router) {}

  onContact() {
    this.route.navigate(['/contacto'])
  }

  onBecomeInstructor() {
    this.route.navigate(['/carrera-instructor'])
  }

}
