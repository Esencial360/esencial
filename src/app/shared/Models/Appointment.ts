export interface Appointment {
    _id?: string;
    name: string;
    email: string;
    date: string;
    time: string;
    notes?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: Date;
  }