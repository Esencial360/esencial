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
      question: 'What types of yoga classes are available?',
      answer: 'We offer a variety of yoga classes including Hatha, Vinyasa, Yin, and more.',
      isOpen: false
    },
    {
      question: 'Can I join live sessions?',
      answer: 'Yes, we offer live streaming sessions that you can join from the comfort of your home.',
      isOpen: false
    },
    {
      question: 'Is there a community aspect in the app?',
      answer: 'Yes, our app includes community features like forums and group challenges.',
      isOpen: false
    },
    {
      question: 'Can instructors upload their sessions?',
      answer: 'Certified instructors can apply to become content creators and upload their sessions.',
      isOpen: false
    },
    {
      question: 'What are the subscription options?',
      answer: 'We offer monthly, quarterly, and annual subscription plans with various benefits.',
      isOpen: false
    },
    {
      question: 'Are there meditations and workshops?',
      answer: 'Yes, we provide guided meditations and specialized workshops on various topics.',
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
