import { createActionGroup, props } from "@ngrx/store";
import { User } from "../shared/Models/User";

export const UserActions = createActionGroup({
    source: 'Users',
    events: {
       'Add Book': props<{ bookId: string }>(),
    }
})

export const UserApiActions = createActionGroup({
    source: 'Users API',
    events: {
        'Retrieved user list': props<{users: ReadonlyArray<User>}>()
    }
})

export const ActiveUserApiActions = createActionGroup({
    source: 'User API',
    events: {
        'Retrieved active user': props<{user: any}>()
    }
})