import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const burgerMenuAnimation = trigger('menuAnimation', [
  state('open', style({
    transform: 'translateY(0%)'
  })),
  state('closed', style({
    transform: 'translateY(-100%)'
  })),
  transition('closed => open', [
    animate('0.7s ease-out')
  ]),
  transition('open => closed', [
    animate('0.7s ease-out')
  ])
])
