

import { User, Technician, ServiceRequest, TechnicianStatus, RequestStatus, Role } from '../types/index';

export const SERVICE_CATEGORIES = ['Plumbing', 'Electrical', 'IT Support', 'HVAC', 'Appliance Repair', 'Landscaping', 'Other'];
export const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

export const ALL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Connor',
    email: 'user@example.com',
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100',
    role: Role.User,
    registeredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    address: '123 Maple St, Springfield, USA',
    contactPhone: '555-0101',
  },
  {
    id: 'tech-1',
    name: 'John Wick',
    email: 'tech@example.com',
    avatarUrl: 'https://picsum.photos/seed/john/100/100',
    role: Role.Technician,
    registeredAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50 days ago
    address: '1000 Continental, New York, NY',
    contactPhone: '555-0201',
  },
  {
    id: 'admin-1',
    name: 'The Director',
    email: 'admin@example.com',
    avatarUrl: 'https://picsum.photos/seed/director/100/100',
    role: Role.Admin,
    registeredAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    address: 'The Management Suite, High Table Tower',
    contactPhone: '555-0301',
  },
  // Add other technicians as users too
  { id: 'tech-2', name: 'Alice Smith', email: 'alice@example.com', avatarUrl: 'https://picsum.photos/seed/alice/100/100', role: Role.Technician, registeredAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), address: '200 Electric Ave, Circuit City', contactPhone: '555-0202' },
  { id: 'tech-3', name: 'Robert Brown', email: 'robert@example.com', avatarUrl: 'https://picsum.photos/seed/robert/100/100', role: Role.Technician, registeredAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), address: '300 Binary Blvd, Techtopia', contactPhone: '555-0203' },
];

export const TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'John Wick',
    specialty: 'Plumbing',
    rating: 4.9,
    status: TechnicianStatus.Available,
    avatarUrl: 'https://picsum.photos/seed/john/100/100',
    jobsCompleted: 127,
  },
  {
    id: 'tech-2',
    name: 'Alice Smith',
    specialty: 'Electrical',
    rating: 4.8,
    status: TechnicianStatus.Available,
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
    jobsCompleted: 88,
  },
  {
    id: 'tech-3',
    name: 'Robert Brown',
    specialty: 'IT Support',
    rating: 4.9,
    status: TechnicianStatus.Busy,
    busyUntil: '4:00 PM',
    avatarUrl: 'https://picsum.photos/seed/robert/100/100',
    jobsCompleted: 210,
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


export const SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    userId: 'user-1',
    title: 'Leaky faucet in kitchen',
    description: 'The kitchen sink faucet has been dripping constantly for the past two days. It seems to be a slow but steady leak.',
    category: 'Plumbing',
    status: RequestStatus.Pending,
    requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    requestedTimeslot: { date: formatDate(tomorrow), time: '10:00 AM' },
    address: '123 Maple St, Springfield, USA',
    contactPhone: '555-0101',
    assignedTechnicianId: null,
    cost: 150,
    media: [
        { type: 'image', url: 'https://placehold.co/600x400/EEE/31343C?text=Leaky+Faucet+1' },
        { type: 'image', url: 'https://placehold.co/600x400/DDD/31343C?text=Under+Sink' }
    ],
  },
  {
    id: 'req-2',
    userId: 'user-1',
    title: 'Power outlet not working',
    description: 'The main power outlet in the bedroom has stopped working. None of the devices plugged into it are receiving power.',
    category: 'Electrical',
    status: RequestStatus.InProgress,
    requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    requestedTimeslot: { date: formatDate(today), time: '2:00 PM' },
    address: '456 Oak Ave, Springfield, USA',
    contactPhone: '555-0102',
    assignedTechnicianId: 'tech-3',
    cost: 200,
    messages: [
        { id: 'msg-3', senderId: 'tech-3', text: 'I am on my way, should be there in 15 minutes.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    ]
  },
  {
    id: 'req-3',
    userId: 'user-1',
    title: 'Laptop screen is flickering',
    description: 'My work laptop screen started flickering yesterday. It is intermittent but very distracting.',
    category: 'IT Support',
    status: RequestStatus.Paid,
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    requestedTimeslot: { date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), time: '11:00 AM' },
    address: '789 Pine Ln, Springfield, USA',
    contactPhone: '555-0103',
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    assignedTechnicianId: 'tech-2',
    cost: 250,
    invoice: {
      id: 'inv-3',
      issuedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      items: [{ description: 'IT Support & Screen Repair', amount: 250 }],
      tax: 20.00,
      total: 270.00
    },
    userRating: {
      value: 5,
      feedback: 'Alice was fantastic! She fixed the screen quickly and was very professional.',
      ratedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  },
  {
    id: 'req-4',
    userId: 'user-1',
    title: 'Install new smart thermostat',
    description: 'I have a new Nest thermostat that I need installed and configured to work with my existing HVAC system.',
    category: 'Electrical',
    status: RequestStatus.Accepted,
    requestedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    requestedTimeslot: { date: formatDate(tomorrow), time: '9:00 AM' },
    address: '101 Elm Ct, Springfield, USA',
    contactPhone: '555-0104',
    assignedTechnicianId: 'tech-1',
    cost: 175,
    messages: [
        { id: 'msg-1', senderId: 'user-1', text: 'Hi John, just confirming our appointment for tomorrow at 9 AM to install the thermostat.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { id: 'msg-2', senderId: 'tech-1', text: 'Confirmed! See you then. I will bring all necessary tools.', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000) }
    ]
  },
   {
    id: 'req-5',
    userId: 'user-1',
    title: 'Fix rattling AC unit',
    description: 'The outdoor air conditioning unit is making a loud rattling noise whenever it runs.',
    category: 'HVAC',
    status: RequestStatus.Cancelled,
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    requestedTimeslot: { date: formatDate(nextWeek), time: '3:00 PM' },
    address: '212 Birch Rd, Springfield, USA',
    contactPhone: '555-0105',
    assignedTechnicianId: 'tech-1',
    cost: 300,
    cancellationReason: 'Technician emergency. Unable to make the appointment.'
  },
  {
    id: 'req-6',
    userId: 'user-1',
    title: 'Router Configuration',
    description: 'New fiber internet installed, need help setting up the router for optimal performance and security.',
    category: 'IT Support',
    status: RequestStatus.Completed,
    requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    requestedTimeslot: { date: formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), time: '1:00 PM' },
    address: '123 Maple St, Springfield, USA',
    contactPhone: '555-0101',
    assignedTechnicianId: 'tech-3',
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    cost: 120,
  },
  {
    id: 'req-7',
    userId: 'user-1',
    title: 'Clogged drain in bathroom',
    description: 'The main bathroom sink is completely clogged and will not drain.',
    category: 'Plumbing',
    status: RequestStatus.Paid, // Paid but not yet rated
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    requestedTimeslot: { date: formatDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)), time: '3:00 PM' },
    address: '123 Maple St, Springfield, USA',
    contactPhone: '555-0101',
    assignedTechnicianId: 'tech-1',
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    cost: 180,
    invoice: {
      id: 'inv-7',
      issuedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: [{ description: 'Drain Clearing Service', amount: 180 }],
      tax: 14.40,
      total: 194.40
    }
  },
];
