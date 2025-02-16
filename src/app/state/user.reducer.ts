import { createReducer, on } from '@ngrx/store';

import { UserApiActions } from './user.actions';
import { User } from '../shared/Models/User';

export const initialState: ReadonlyArray<User> = [];

export const userReducer = createReducer(
  initialState,
  on(UserApiActions.retrievedUserList, (_state, { users }) => users)
);
