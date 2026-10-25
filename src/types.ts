export type RegionType = 'rec' | 'med' | 'dec';
export type RegionFilter = 'all' | 'rec' | 'med' | 'dec' | 'us' | 'intl';
export type TierType = 'free' | 't1' | 't2';
export type LegalStatusType = '100% Legal' | 'Medical Marijuana Card Required' | 'Decriminalized';

export interface CityDestination {
  id: string;
  cityName: string;
  stateName: string;
  hotelName: string;
  hotelPhone: string;
  basePrice: number;
  image: string;
  description: string;
  highlights: string[];
}

export interface StatePlace {
  id: string;
  stateName: string;
  country: string;
  region: RegionType;
  legalStatus: LegalStatusType;
  badge: string;
  heroImage: string;
  description: string;
  cities: CityDestination[];
}

export interface Destination {
  id: string;
  name: string;
  region: RegionType;
  location: string;
  badge: string;
  legalStatus: LegalStatusType;
  basePrice: number;
  image: string;
  cannabisStatus: string;
  description: string;
  highlights: string[];
  hotelName?: string;
  hotelPhone?: string;
}

export interface PriceBreakdown {
  hotel: number;
  transportation: number;
  activities: number;
  concierge: number;
  taxes: number;
  total: number;
}

export interface Quote {
  id: string;
  dest: string;
  pp: string;
  tot: string;
  lux: string;
  dur: string;
  grp: string;
  d: string;
  pts: number;
  userId?: string;
  userEmail?: string;
  breakdown?: PriceBreakdown;
}

export interface User {
  uid?: string;
  name: string;
  email: string;
  tier: TierType;
  role?: 'user' | 'admin';
  pass?: string;
  points: number;
}

export interface Booking {
  id: string;
  planId: string;
  dest: string;
  state?: string;
  city?: string;
  checkin: string;
  checkout: string;
  nights: number;
  guests: number;
  leadGuest: string;
  email: string;
  phone: string;
  accommodation: string;
  hotelName: string;
  hotelPhone: string;
  cannabisProgram: string;
  amountPaid: string;
  paymentMethod: string;
  status: 'Upcoming' | 'Completed' | 'Pending';
  specialist: string;
  venue: string;
  userId?: string;
  breakdown?: PriceBreakdown;
  adminCalledAndBooked?: boolean;
}

export interface WaitlistEntry {
  id: string;
  dest: string;
  dateRange: string;
  name: string;
  email: string;
  groupSize: string;
  flexibility: string;
  position: number;
  notification: string[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  desc: string;
  date: string;
  amt: number;
  type: 'in' | 'out';
  status: string;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  dest: string;
  dates?: string;
  date: string;
  stars: number;
  text: string;
  helpfulCount: number;
  response?: {
    author: string;
    text: string;
  };
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  bio: string;
  location: string;
  plan: 'monthly' | 'yearly';
  price: string;
  active: boolean;
  website: string;
  image: string;
  phone?: string;
}

export interface EmailNotification {
  id: string;
  type: string;
  subject: string;
  to: string;
  date: string;
  preview: string;
  status: 'sent' | 'scheduled' | 'draft';
}

export interface ChatMsg {
  id: string;
  sender: 'concierge' | 'guest';
  text: string;
  time: string;
}
