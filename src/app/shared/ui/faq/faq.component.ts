import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

  constructor(private router: Router){}

  faqItems: FaqItem[] = [
    {
      question: '¿Qué tipo de yoga enseñan?',
      answer: 'En esencial360 ofrecemos distintos estilos de yoga para que encuentres la práctica que mejor se adapte a ti: Vinyasa: Fluidez y movimiento sincronizado con la respiración. Power: Yoga dinámico que fortalece y tonifica el cuerpo. Hatha: Práctica más pausada, enfocada en la alineación y la respiración. Puedes elegir el nivel y estilo que mejor se acomode a tus necesidades y ritmo de vida.',
      isOpen: false
    },
    {
      question: '¿Hacen livestreams?',
      answer: 'Sí, tendremos livestreams y talleres en vivo diseñados para enriquecer tu práctica y acompañarte en tu proceso de crecimiento. Mantente al tanto de nuestro calendario para no perderte ninguna sesión.',
      isOpen: false
    },
    {
      question: '¿Qué eventos hacen?',
      answer: 'En esencial360 organizamos eventos diseñados para profundizar en tu bienestar y conectar con nuestra comunidad. Algunos de ellos incluyen: Retiros de yoga y meditación en entornos naturales para desconectarte y reconectar contigo. Workshops y masterclasses con expertos en bienestar, crecimiento personal y mindfulness. Encuentros en vivo para practicar en comunidad y compartir experiencias. Charlas y paneles con profesionales que inspiran y guían en el camino del bienestar. Mantente al tanto de nuestro calendario y nuestras redes sociales para conocer las próximas fechas.',
      isOpen: false
    },
    {
      question: '¿Puedo producir dinero con e360?',
      answer: 'Sí. A través de nuestro programa para instructores, formarás parte de esta comunidad de profesionales y recibirás exposición y difusión para ti y tu estudio, ayudándote a seguir creciendo. Además, tendrás acceso a múltiples beneficios y descuentos exclusivos. Si estás interesado en unirte, consulta más detalles en nuestra sección para instructores.',
      isOpen: false
    },
    {
      question: '¿Qué es la comunidad e360?',
      answer: 'Es un punto de encuentro para latinas y latinos que buscan crecer y sentirse acompañados en su camino de bienestar. Aquí no hay barreras ni etiquetas, solo un espacio seguro donde la inspiración, la motivación y el aprendizaje nos unen, sin importar la distancia.',
      isOpen: false
    },
  ];

  toggleItem(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  onContact() {
    this.router.navigateByUrl('/contacto')
  }

}
