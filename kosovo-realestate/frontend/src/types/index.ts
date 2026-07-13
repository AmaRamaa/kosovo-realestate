export type Role = 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
export type ListingType = 'SALE' | 'RENT';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'LAND' | 'COMMERCIAL' | 'OFFICE' | 'WAREHOUSE' | 'STUDIO' | 'DUPLEX';
export type ListingStatus = 'PENDING' | 'ACTIVE' | 'SOLD' | 'RENTED' | 'INACTIVE' | 'REJECTED';
export type EnergyRating = 'A_PLUS' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type HeatingType = 'CENTRAL' | 'ELECTRIC' | 'GAS' | 'OIL' | 'WOOD' | 'HEAT_PUMP' | 'UNDERFLOOR' | 'NONE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  agent?: Agent;
}

export interface Agent {
  id: string;
  userId: string;
  user: Pick<User, 'firstName' | 'lastName' | 'avatar' | 'email' | 'phone'>;
  agencyId?: string;
  agency?: Pick<Agency, 'id' | 'name' | 'logo' | 'slug'>;
  bio?: string;
  licenseNumber?: string;
  yearsExperience: number;
  specializations: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  listingCount: number;
  isVerified: boolean;
  listings?: Listing[];
  reviews?: Review[];
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  email: string;
  phone: string;
  address?: string;
  city: City;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  agents?: Agent[];
  listings?: Listing[];
  reviews?: Review[];
}

export interface City {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  lat?: number;
  lng?: number;
  neighborhoods?: Neighborhood[];
  _count?: { listings: number };
}

export interface Neighborhood {
  id: string;
  name: string;
  cityId: string;
  slug: string;
  lat?: number;
  lng?: number;
}

export interface ListingImage {
  id: string;
  url: string;
  publicId?: string;
  alt?: string;
  order: number;
  isCover: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: ListingStatus;
  price: number;
  priceNegotiable: boolean;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  parkingSpaces: number;
  garageSpaces: number;
  hasGarden: boolean;
  hasPool: boolean;
  hasBalcony: boolean;
  hasTerrace: boolean;
  hasElevator: boolean;
  hasSecurity: boolean;
  hasAirCon: boolean;
  hasHeating: boolean;
  hasFurnished: boolean;
  hasStorage: boolean;
  heatingType?: HeatingType;
  energyRating?: EnergyRating;
  address: string;
  cityId: string;
  city: Pick<City, 'id' | 'name' | 'slug'>;
  neighborhoodId?: string;
  neighborhood?: Pick<Neighborhood, 'id' | 'name'>;
  lat?: number;
  lng?: number;
  viewCount: number;
  favoriteCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  images: ListingImage[];
  amenities?: Array<{ amenity: Amenity }>;
  agent?: Agent;
  agency?: Pick<Agency, 'id' | 'name' | 'logo'>;
  _count?: { favorites: number; reviews: number };
}

export interface Review {
  id: string;
  user: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  sender: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
  receiverId: string;
  receiver: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
  subject?: string;
  content: string;
  status: 'SENT' | 'READ' | 'ARCHIVED';
  listingId?: string;
  parentId?: string;
  replies?: Message[];
  createdAt: string;
}

export interface Appointment {
  id: string;
  listingId: string;
  listing: Pick<Listing, 'title' | 'slug'> & { images: ListingImage[] };
  buyerId: string;
  buyer: Pick<User, 'firstName' | 'lastName' | 'avatar' | 'phone'>;
  agent: Agent;
  scheduledAt: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  authorName: string;
  authorImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Search / Filters
export interface ListingFilters {
  listingType?: ListingType;
  propertyType?: PropertyType;
  cityId?: string;
  neighborhoodId?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  hasGarden?: boolean;
  hasPool?: boolean;
  hasBalcony?: boolean;
  hasGarage?: boolean;
  hasFurnished?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Auth
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Maps
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  title: string;
  propertyType: PropertyType;
  listingType: ListingType;
}

// Mortgage Calculator
export interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
}
