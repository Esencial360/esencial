import { createReducer, on } from '@ngrx/store';
import { InstructorActions } from './instructor.actions';
import { Instructor } from '../shared/Models/Instructor';

export const initialStateList: ReadonlyArray<Instructor> = [];

export const instructorReducer = createReducer(
  initialStateList,
  on(InstructorActions.retrievedInstructorList, (_state, { instructors }) => {
    return instructors;
  })
);

