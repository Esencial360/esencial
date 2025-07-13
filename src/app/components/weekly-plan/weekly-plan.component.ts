import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-weekly-plan',
  templateUrl: './weekly-plan.component.html',
})
export class WeeklyPlanComponent {
  selectedType: string = 'class';


  pullZone = environment.pullZone

  weeklyPlan = [
    {
      day: 'Lunes',
      date: '13 de enero',
      sessions: [
        {
          title: 'Flujo matutino',
          subtitle: 'Despertar suave',
          duration: '15 min',
          level: 'Principiante',
        },
        {
          title: 'Estiramiento nocturno',
          subtitle: 'Flujo relajante',
          duration: '20 min',
          level: 'Todos los niveles',
        },
      ],
    },
    {
      day: 'Martes',
      date: '14 de enero',
      sessions: [
        {
          title: 'Yoga de poder',
          subtitle: 'Constructor de fuerza',
          duration: '20 min',
          level: 'Intermedio',
        },
      ],
    },
    {
      day: 'Miércoles',
      date: '15 de enero',
      sessions: [
        {
          title: 'Restaurativo',
          subtitle: 'Relajación profunda',
          duration: '25 min',
          level: 'Todos los niveles',
        },
        {
          title: 'Apertura de caderas',
          subtitle: 'Enfoque en flexibilidad',
          duration: '18 min',
          level: 'Principiante',
        },
      ],
    },
    {
      day: 'Jueves',
      date: '16 de enero',
      sessions: [
        {
          title: 'Flujo central',
          subtitle: 'Fuerza del núcleo',
          duration: '22 min',
          level: 'Intermedio',
        },
      ],
    },
    {
      day: 'Viernes',
      date: '17 de enero',
      sessions: [
        {
          title: 'Flujo Vinyasa',
          subtitle: 'Movimiento dinámico',
          duration: '25 min',
          level: 'Todos los niveles',
        },
        {
          title: 'Yin Yoga',
          subtitle: 'Estiramiento profundo',
          duration: '40 min',
          level: 'Principiante',
        },
      ],
    },
    {
      day: 'Sábado',
      date: '18 de enero',
      sessions: [
        {
          title: 'Flujo de fin de semana',
          subtitle: 'Práctica consciente',
          duration: '45 min',
          level: 'Todos los niveles',
        },
      ],
    },
    {
      day: 'Domingo',
      date: '19 de enero',
      sessions: [
        {
          title: 'Día de descanso',
          subtitle: 'Estiramiento suave',
          duration: '20 min',
          level: 'Principiante',
        },
      ],
    },
  ];

  changeType(type: string) {
    this.selectedType = type;
  }
}
