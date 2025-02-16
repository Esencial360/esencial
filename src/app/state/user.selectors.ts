import { createSelector, createFeatureSelector } from "@ngrx/store";
import { User } from "../shared/Models/User";

export const selectUsers = createFeatureSelector<ReadonlyArray<User>>('users')

export const selectAllUsers = createSelector(
    selectUsers,
    (state) => state
)
