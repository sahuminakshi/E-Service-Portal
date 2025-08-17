export enum Role {
  User = 'user',
  Technician = 'technician',
  Admin = 'admin',
}

export enum RequestStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  InProgress = 'In Progress',
  Completed = 'Completed', // Work is done, invoice is pending
  AwaitingPayment = 'Awaiting Payment', // Invoice sent
  Paid = 'Paid', // Invoice paid
  Cancelled = 'Cancelled',
}

export enum TechnicianStatus {
  Available = 'Available',
  Busy = 'Busy',
  Offline = 'Offline',
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  registeredAt: Date;
  address?: string;
  contactPhone?: string;
}

export interface Technician {
  id: string; // Corresponds to a User id
  name: string;
  specialty: string;
  rating: number; // out of 5
  status: TechnicianStatus;
  busyUntil?: string; // e.g., '4:00 PM'
  avatarUrl: string;
  jobsCompleted: number;
}

export interface Rating {
  value: number; // 1-5
  feedback?: string;
  ratedAt: Date;
}

export interface ServiceRequest {
  id: string;
  userId: string; // ID of the user who created it
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  requestedAt: Date;
  requestedTimeslot?: {
    date: string; // ISO date string: "YYYY-MM-DD"
    time: string; // e.g., "9:00 AM"
  };
  address?: string;
  contactPhone: string;
  completedAt?: Date;
  assignedTechnicianId?: string | null;
  cost?: number;
  cancellationReason?: string;
  invoice?: {
    id: string;
    issuedAt: Date;
    paidAt?: Date;
    items: { description: string; amount: number }[];
    tax: number;
    total: number;
  };
  userRating?: Rating;
  technicianRating?: Rating;
  media?: Media[];
  messages?: Message[];
}

export type ViewType = 'dashboard' | 'new-request' | 'history' | 'technicians' | 'jobs' | 'analytics' | 'profile';