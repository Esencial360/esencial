
export interface User {
    _id: string,
    username: string, 
    password: string,
    refreskToken: string,
    roles?: {User: number}, 
    likedVideos?: string[],
    streak?: {count: string, lastActive: Date}
}