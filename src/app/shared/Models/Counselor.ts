export interface Counselor {
    _id: string,
    firstname: string, 
    lastname: string,
    title: string, 
    description: string,
    videos?: {
        videoId: string;
        status: string;
      }[];  
}