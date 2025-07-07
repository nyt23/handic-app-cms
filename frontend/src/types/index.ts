// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  language?: 'English' | 'German' | 'French' | 'Spanish' | 'Italian';
  confirmed: boolean;
  blocked: boolean;
  role: Role;
  disability_card?: DisabilityCard;
  companions?: Companion[];
  tickets?: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  type: string;
  permissions: any;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

// Event types
export interface Event {
  id: number;
  name: string;
  description?: string;
  media?: Media[];
  maxCapacity: number;
  website?: string;
  tags?: string;
  languages: 'English' | 'German' | 'Spanish' | 'French' | 'Italian';
  eventType: 'concert' | 'workshop' | 'exhibition' | 'theater' | 'festival';
  seatMap?: Media[];
  locations?: Location[];
  startTime?: string;
  endTime?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  localizations?: Event[];
  locale?: string;
}

// Location types
export interface Location {
  id: number;
  name: string;
  description?: string;
  media?: Media[];
  website?: string;
  locationOverview?: string;
  capacity?: number;
  size?: string;
  address?: Address;
  openingHours?: OpeningHours[];
  accessibilityFeatures?: AccessibilityFeature[];
  events?: Event[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OpeningHours {
  id: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start?: string;
  close?: string;
}

// Disability Card types
export interface DisabilityCard {
  id: number;
  number: string;
  proof: Media;
  reviewStatus: 'unreviewed' | 'approved' | 'expired';
  expiry: string;
  issueDate: string;
  users_permissions_user: User;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Companion types
export interface Companion {
  id: number;
  firstName: string;
  lastName: string;
  users_permissions_user: User;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Ticket types
export interface Ticket {
  id: number;
  event: Event;
  user: User;
  status: string;
  price?: number;
  seatNumber?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Accessibility types
export interface AccessibilityFeature {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  locations?: Location[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessibilityNeed {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Media types
export interface Media {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Organizer types
export interface Organizer {
  id: number;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: Media;
  events?: Event[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ApiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

// Auth types
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  language?: 'English' | 'German' | 'French' | 'Spanish' | 'Italian';
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

// Form types
export interface DisabilityCardForm {
  number: string;
  proof: File;
  expiry: string;
  issueDate: string;
}

export interface CompanionForm {
  firstName: string;
  lastName: string;
}

// Language types
export type Locale = 'en' | 'de';

export interface Translations {
  en: Record<string, string>;
  de: Record<string, string>;
} 