import { createSelector, createFeatureSelector } from "@ngrx/store";
import { User } from "../shared/Models/User";

export const selectUsers = createFeatureSelector<ReadonlyArray<User>>('users')

export const selectActiveUser = createFeatureSelector<any>('user')
export const selectStreakState = createFeatureSelector<any>('user');

export const selectAllUsers = createSelector(
    selectUsers,
    (state) => state
)

export const selectActiveUsers = createSelector(
    selectActiveUser,
    (state) => state.user
)

export const selectStreak = createSelector(
    selectStreakState,
    (state) => state?.user.streak || 0 
  );
  

