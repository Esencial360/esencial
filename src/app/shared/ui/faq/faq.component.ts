import { animate, state, style, transition, trigger } from '@angular/animations';
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
  styleUrl: './faq.component.css',
  animations: [
    trigger('faqToggle', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1 })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],

})
export class FaqComponent {

  constructor(private router: Router){}

  faqItems: FaqItem[] = [
    {
      question: '¿Qué tipo de yoga enseñan?',
      answer: `
        <p>En esencial360 ofrecemos distintos estilos de yoga para que encuentres la práctica ideal:</p>
        <ul>
          <li><strong>Vinyasa:</strong> Fluidez y movimiento sincronizado con la respiración.</li>
          <li><strong>Power:</strong> Yoga dinámico que fortalece y tonifica el cuerpo.</li>
          <li><strong>Hatha:</strong> Práctica pausada, enfocada en la alineación y la respiración.</li>
        </ul>
        <p>Elige el nivel y estilo que mejor se acomode a tu ritmo de vida.</p>
      `,
      isOpen: false
    },
    {
      question: '¿Hacen livestreams?',
      answer: `
        <p>💻 <strong>Sí, ofrecemos livestreams y talleres en vivo</strong> para enriquecer tu práctica.</p>
        <p>Mantente al tanto de nuestro calendario para no perderte ninguna sesión.</p>
      `,
      isOpen: false
    },
    {
      question: '¿Qué eventos hacen?',
      answer: `
        <p>📅 En esencial360 organizamos eventos diseñados para profundizar en tu bienestar y conectar con nuestra comunidad:</p>
        <ul>
          <li>🌿 <strong>Retiros</strong>: Yoga y meditación en entornos naturales.</li>
          <li>🎓 <strong>Workshops</strong>: Clases magistrales con expertos en bienestar.</li>
          <li>🤝 <strong>Encuentros</strong>: Prácticas en comunidad y experiencias compartidas.</li>
          <li>🎤 <strong>Charlas</strong>: Paneles con profesionales del bienestar.</li>
        </ul>
        <p>Mantente al tanto de nuestro calendario y redes sociales.</p>
      `,
      isOpen: false
    },
    {
      question: '¿Puedo producir dinero con e360?',
      answer: `
        <p>💰 <strong>Sí, a través de nuestro <em>programa para instructores</em></strong>, recibirás exposición y difusión para ti y tu estudio.</p>
        <p><strong>Beneficios:</strong></p>
        <ul>
          <li>📢 Mayor visibilidad como profesional.</li>
          <li>🎟️ Acceso a descuentos y beneficios exclusivos.</li>
        </ul>
        <p>Si estás interesado, consulta más detalles en nuestra sección para instructores.</p>
      `,
      isOpen: false
    },
    {
      question: '¿Qué es la comunidad e360?',
      answer: `
        <p>🌎 <strong>Es un espacio para latinas y latinos</strong> que buscan crecer y sentirse acompañados en su bienestar.</p>
        <p>Aquí no hay barreras ni etiquetas, solo inspiración, motivación y aprendizaje en comunidad, sin importar la distancia.</p>
      `,
      isOpen: false
    }
  ];
  
  toggleItem(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  onContact() {
    this.router.navigateByUrl('/contacto')
  }

}
