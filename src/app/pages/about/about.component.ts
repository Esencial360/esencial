import { Component, OnInit } from '@angular/core';

interface Service {
  title: string;
  image: string;
  description?: string;
  special?: boolean;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent  implements OnInit{

  services: Service[] = []

  
  ngOnInit() {
    this.services = [
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg '},
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { 
        title: 'Ready to start your journey?', 
        image: '../../../assets/images/yoga.jpg',
        special: true
      },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
      { title: 'EJEMPLO', image: '../../../assets/images/yoga.jpg' },
    ]
  }

}
