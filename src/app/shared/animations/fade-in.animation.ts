import { trigger, transition, style, animate, state } from '@angular/animations';

// export const fadeInAnimation = [
//     trigger('fadeIn', [
//       state('void', style({ opacity: 0, transform: 'translateY(-2%)' })),
//       transition(':enter', [
//         animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
//       ])
//     ])
//   ];

// export const fadeInAnimation = [
//     trigger('fadeIn', [
//       state('invisible', style({ opacity: 0 })),
//       state('visible', style({ opacity: 1 })),
//       transition('invisible => visible', animate('300ms ease-in'))
//     ])
//   ]

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-in', style({ opacity: 1 })),
  ]),
]);

  
