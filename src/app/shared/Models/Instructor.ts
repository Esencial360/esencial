export interface Instructor {
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