import { Component } from '@angular/core';


interface MoodOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  classes: ClassOption[];
}

interface ClassOption {
  id: string;
  imagePath: string;
  title: string;
  duration: string;
  instructor: string;
}

@Component({
  selector: 'app-mood-collection',
  templateUrl: './mood-collection.component.html',
  styleUrl: './mood-collection.component.css'
})
export class MoodCollectionComponent {

  
  moodOptions: MoodOption[] = [
    {
      id: 'energetic',
      title: 'Activo/a y con energía',
      subtitle: 'Quieres una práctica dinámica que te rete.',
      icon: 'assets/images/sun.png',
      classes: [
        {
          id: 'class1',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '30 MIN',
          instructor: 'INSTRUCTOR'
        },
        {
          id: 'class2',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '45 MIN',
          instructor: 'INSTRUCTOR'
        },
        {
          id: 'class3',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '60 MIN',
          instructor: 'INSTRUCTOR'
        }
      ]
    },
    {
      id: 'relaxed',
      title: 'Con ganas de relajarte',
      subtitle: 'Quieres una práctica suave y restaurativa',
      icon: 'assets/images/moon.png',
      classes: [
        {
          id: 'class4',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '20 MIN',
          instructor: 'INSTRUCTOR'
        },
        {
          id: 'class5',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '30 MIN',
          instructor: 'INSTRUCTOR'
        },
        {
          id: 'class6',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '40 MIN',
          instructor: 'INSTRUCTOR'
        }
      ]
    },
    {
      id: 'restorative',
      title: 'Necesito soltar y resetear',
      subtitle: 'Buscas liberar y restaurar.',
      icon: 'assets/images/wave.png',
      classes: [
        {
          id: 'class7',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '25 MIN',
          instructor: 'INSTRUCTOR'
        },
        {
          id: 'class8',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '35 MIN',
          instructor: 'INSTRUCTOR'
        },
        {
          id: 'class9',
          imagePath: 'assets/images/1.jpg',
          title: 'NOMBRE DE CLASE, DURACIÓN',
          duration: '50 MIN',
          instructor: 'INSTRUCTOR'
        }
      ]
    }
  ];

  selectClass(classOption: ClassOption): void {
    console.log('Selected class:', classOption);
    // Implement your navigation or selection logic here
  }

  seeMore(option: MoodOption): void {
    console.log('See more for:', option.title);
    // Implement your navigation or load more logic here
  }
}
