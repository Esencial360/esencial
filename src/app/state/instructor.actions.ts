import { createActionGroup, props } from "@ngrx/store";
import { Instructor } from "../shared/Models/Instructor";

export const InstructorActions = createActionGroup({
    source: 'Instructors',
    events: {
        'Retrieved instructor list': props<{instructors: ReadonlyArray<Instructor>}>()
    }
})
