// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'institution' | 'user';
  createdAt: string;
}

// Institution types
export interface Institution {
  id: string;
  name: string;
  description: string;
  city: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  entryFee: number;
  isVerified: boolean;
  registrationDate: string;
  acceptanceDate?: string;
  creationDate: string;
  rating: number;
  totalVisitors: number;
  workingHours: WorkingHours;
  images: string[];
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Ticket types
export interface Ticket {
  id: string;
  institutionId: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  createdAt: string;
}

// Announcement types
export interface Announcement {
  id: string;
  institutionId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Complaint types
export interface Complaint {
  id: string;
  userId: string;
  institutionId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-review' | 'resolved';
  createdAt: string;
  resolution?: string;
  resolvedAt?: string;
}

// Stats types
export interface AdminStats {
  totalRevenue: number;
  ticketsSold: number;
  totalUsers: number;
  pendingInstitutions: number;
  userGrowthData: {
    month: string;
    count: number;
  }[];
  topInstitutions: {
    id: string;
    name: string;
    visitors: number;
    revenue: number;
  }[];
}

export interface InstitutionStats {
  visitors: number;
  revenue: number;
  ticketsSold: number;
  visitorTrend: {
    month: string;
    count: number;
  }[];
  revenueTrend: {
    month: string;
    amount: number;
  }[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}