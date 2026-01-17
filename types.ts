
export type UserRole = 'USER' | 'ADMIN' | 'AUTHORITY_POLICE' | 'AUTHORITY_MEDICAL' | 'AUTHORITY_FIRE';
export type IncidentScope = 'CAMPUS' | 'CITY';

export interface User {
  id: string;
  name: string;
  contact: string;
  role: UserRole;
}

export enum IncidentStatus {
  PENDING = 'PENDING',
  DISPATCHED = 'DISPATCHED',
  ON_SITE = 'ON_SITE',
  RESOLVED = 'RESOLVED'
}

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  MEDICAL = 'MEDICAL',
  FIRE = 'FIRE',
  CRIME = 'CRIME',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  OTHER = 'OTHER'
}

/**
 * IncidentCategory enum as used in AI analysis services and components.
 */
export enum IncidentCategory {
  MEDICAL = 'Medical Emergency',
  SECURITY = 'Security Threat',
  INFRASTRUCTURE = 'Infrastructure Hazard',
  HARASSMENT = 'Harassment/Safety',
  OTHER = 'Other'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface IncidentLocation {
  lat: number;
  lng: number;
  address?: string;
}

/**
 * Common Location alias used across the application.
 */
export type Location = IncidentLocation;

export interface SafetyService {
  id: string;
  name: string;
  type: IncidentType;
  address: string;
  distance?: string;
  location: { lat: number, lng: number };
  isCampus?: boolean;
}

/**
 * AspectRatio type for image and video generation tools.
 */
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "2:3" | "3:2" | "21:9";

/**
 * Result structure for AI incident analysis.
 */
export interface AIAnalysisResult {
  category: IncidentCategory;
  severity: Severity;
  summary: string;
  actions: string[];
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  /** Added missing fields referenced in components and services */
  category?: IncidentCategory;
  severity: Severity;
  status: IncidentStatus;
  scope: IncidentScope;
  timestamp: string;
  location: IncidentLocation;
  responderLocation?: IncidentLocation;
  reporterId: string;
  mediaUrl?: string;
  /** Additional fields for AI insights and media handling */
  imageUrl?: string;
  aiAnalysis?: string;
  aiSummary?: string;
  recommendedAsset?: string; 
  recommendedActions?: string[];
  dispatchedTo?: string; 
}
