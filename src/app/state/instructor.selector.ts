import { createSelector, createFeatureSelector } from "@ngrx/store";
import { Instructor } from "../shared/Models/Instructor";

export const selectInstructors = createFeatureSelector<ReadonlyArray<Instructor>>('instructors')

export const selectAllInstructors = createSelector(
    selectInstructors,
    (state) => state
)