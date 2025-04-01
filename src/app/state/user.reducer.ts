import { createReducer, on } from '@ngrx/store';

import { UserApiActions, ActiveUserApiActions } from './user.actions';
import { User } from '../shared/Models/User';

export const initialStateList: ReadonlyArray<User> = [];
export const initialUserActive: any = [];

export const userReducer = createReducer(
  initialStateList,
  on(UserApiActions.retrievedUserList, (_state, { users }) => users)
);

export const userActiveReducer = createReducer(
  initialUserActive,
  on(ActiveUserApiActions.retrievedActiveUser, (state, { user }) => {
    console.log('Reducer received user:', user);
    return user;
  })
);
