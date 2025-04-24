import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface RetreatFeature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-news-and-blogs',
  templateUrl: './news-and-blogs.component.html',
  styleUrl: './news-and-blogs.component.css',
})
export class NewsAndBlogsComponent implements OnInit {
  @Input()
  instructorView!: boolean;

  @Input()
  aboutView!: boolean;

  @Input()
  instructorCatalogueView!: boolean;

  retreatFeatures: RetreatFeature[] = [];
  pullZone: string = environment.pullZone;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.instructorView) {
      this.retreatFeatures = [
        {
          title: 'Comunidad',
          description:
            '¡Esta es la comunidad que estabas esperando! Aquí encontrarás tanto a colegas instructores y facilitadores, que como tú, aportan crecimiento y bienestar a través de su experiencia y capacidades. Además, tendrás a tu disposición la plataforma y sus contenidos, para seguirte entrenando de manera continua, aprendiendo de Maestros con sólidas trayectorias, que están listos para asesorarte si así lo deseas.',
        },
        {
          title: 'Beneficios',
          description:
            'Súmate y goza de todos los beneficios que esencial360 ha planeado para hacer que tus clases  y tus conocimientos, cobren otra dimensión, y sumes a tu crecimiento personal y profesional',
        },
        {
          title: 'Proceso',
          description:
            'Estás a un paso de ser parte de esta maravillosa comunidad de crecimiento y bienestar compartido. Para nosotros, eres ESENCIAL. Estamos seguros de que esta plataforma diseñada para ti, es el lugar perfecto para compartir tu experiencia y unicidad, con cientos de alumnos y usuarios que se suman a diario a ESENCIAL360.',
        },
      ];
    } else if (this.aboutView) {
      this.retreatFeatures = [
        {
          title: 'Nuestra Mision',
          description:
            "Our retreats are designed to fit your needs, whether you're a yoga novice or expert. Find the perfect balance of activity and relaxation, and connect with like-minded individuals.",
        },
        {
          title: 'Nuestra Vision',
          description:
            'Experience a variety of yoga styles to enrich your practice. Our expert instructors guide you in finding the style that speaks to you, from calming Yin to dynamic Ashtanga.',
        },
        {
          title: 'Valores',
          description:
            'Connect with the calming power of nature. Our retreats are set in beautiful, peaceful locations that offer a perfect backdrop for mindfulness and growth.',
        },
      ];
    } else {
      this.retreatFeatures = [
        {
          title: 'Retreats Tailored to You',
          description:
            "Our retreats are designed to fit your needs, whether you're a yoga novice or expert. Find the perfect balance of activity and relaxation, and connect with like-minded individuals.",
        },
        {
          title: 'Diverse Yoga Practices',
          description:
            'Experience a variety of yoga styles to enrich your practice. Our expert instructors guide you in finding the style that speaks to you, from calming Yin to dynamic Ashtanga.',
        },
        {
          title: 'Nature and Nurture',
          description:
            'Connect with the calming power of nature. Our retreats are set in beautiful, peaceful locations that offer a perfect backdrop for mindfulness and growth.',
        },
      ];
    }
  }

  onInstructorContact() {
    this.router
      .navigateByUrl('/carrera-instructor')
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to carrera-instructor page successful');
        } else {
          console.error('Navigation to carrera-instructor page failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }

  onInstructorCatalogue() {
    this.router
      .navigateByUrl('/instructores')
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to instructoresr page successful');
        } else {
          console.error('Navigation to instructoresr page failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }
}
