
export interface User {
    badges: import("c:/Users/BOOK/Documents/Projects/esencial/src/app/shared/services/badge.service").Badge[];
    _id: string,
    username: string, 
    password: string,
    refreskToken: string,
    roles?: {User: number}, 
    likedVideos?: string[],
    createdAt?: Date,
    streak?: {count: string, lastActive: Date}
}