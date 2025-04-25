import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  pullZone: string = environment.pullZone

  constructor(private route: Router) {}

  onContact() {
    this.route.navigate(['/contacto'])
  }

  onBecomeInstructor() {
    this.route.navigate(['/carrera-instructor'])
  }

  onHome() {
    this.route.navigate(['']);
  }

  onMenu() {
    this.route.navigate(['/menu']);
  }

  onSignIn() {
    this.route.navigate(['/iniciar-sesion']);
  }

  onSignUp() {
    this.route.navigate(['/subscribirse']);
  }

  onAbout() {
    this.route.navigate(['/nosotros']);
  }

  onUserSettings() {
    this.route.navigate(['/ajustes']);
  }

  onInstructors() {
    this.route.navigate(['/instructores']);
  }

  onCommunity() {
    this.route.navigate(['/comunidad']);
  }

  onClasses() {
    this.route.navigate(['clases']);
  }

  onCounsel() {
    this.route.navigate(['consejo'])
  }

}
