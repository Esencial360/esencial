export interface Instructor {
  _id?: string | undefined;
  firstname: string;
  lastname: string;
  title: string;
  description: string;
  videos?: {
    videoId: string;
    status: string;
  }[];
  profilePicture: File;
}
