export interface Instructor {
  _id?: string | undefined;
  firstname: string;
  lastname: string;
  title: string;
  email?: string;
  description: string;
  videos?: {
    videoId: string;
    status: string;
  }[];
  workshops?: {
    videoId: string;
    status: string;
  }[];
  meditations?: {
    meditationId: string;
  }[];
  profilePicture: File;
  referralCode?: string;
  referralURL?: string;
  qrImageDataURL?: string;
}
