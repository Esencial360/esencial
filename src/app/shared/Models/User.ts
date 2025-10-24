
export interface User {
    badges: any;    
    _id: string,
    username: string, 
    password: string,
    refreskToken: string,
    roles?: {User: number}, 
    likedVideos?: string[],
    createdAt?: Date,
    streak?: {count: string, lastActive: Date}
}