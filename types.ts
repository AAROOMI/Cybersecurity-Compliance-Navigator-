export interface ControlVersion {
  version: string;
  date: string;
  changes: string[];
}

export interface Control {
  id: string;
  description:string;
  implementationGuidelines: string[];
  expectedDeliverables: string[];
  version: string;
  lastUpdated: string;
  history?: ControlVersion[];
}

export interface Subdomain {
  id: string;
  title: string;
  objective: string;
  controls: Control[];
}

export interface Domain {
  id: string;
  name: string;
  subdomains: Subdomain[];
}

export interface SearchResult {
  control: Control;
  subdomain: Subdomain;
  domain: Domain;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeneratedDocsState {
  [controlId: string]: number; // Maps control ID to generation timestamp
}

// --- NEW: Audit Log System ---

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'DOCUMENT_APPROVED'
  | 'DOCUMENT_REJECTED'
  | 'COMPANY_PROFILE_UPDATED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'LICENSE_UPDATED';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  action: AuditAction;
  details: string;
  targetId?: string; // e.g., user ID, document ID
}


// --- NEW/UPDATED: User Management and RBAC System ---

export type UserRole = 'Administrator' | 'CISO' | 'CTO' | 'CIO' | 'CEO' | 'Security Analyst' | 'Employee';

export type Permission =
  | 'dashboard:read'
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'documents:read'
  | 'documents:approve'
  | 'documents:generate'
  | 'templates:read'
  | 'templates:apply'
  | 'navigator:read'
  | 'company:read'
  | 'company:update'
  | 'audit:read';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accessExpiresAt?: number; // Timestamp for access expiration
  password?: string;
  isVerified: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  // FIX: Add mfaSecret and isMfaEnabled for multi-factor authentication
  mfaSecret?: string;
  isMfaEnabled?: boolean;
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  Administrator: [
    'dashboard:read',
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'documents:read',
    'documents:approve',
    'documents:generate',
    'templates:read',
    'templates:apply',
    'navigator:read',
    'company:read',
    'company:update',
    'audit:read',
  ],
  CISO: [
    'dashboard:read',
    'documents:read',
    'documents:approve',
    'documents:generate',
    'templates:read',
    'templates:apply',
    'navigator:read',
    'company:read',
  ],
  CTO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'templates:read', 'company:read'],
  CIO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'templates:read', 'company:read'],
  CEO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'company:read'],
  'Security Analyst': [
    'documents:read',
    'documents:generate',
    'templates:read',
    'templates:apply',
    'navigator:read',
    'company:read',
  ],
  Employee: ['navigator:read', 'company:read'],
};


// Document Management System Types
export type DocumentStatus =
  | 'Draft'
  | 'Pending CISO Approval'
  | 'Pending CTO Approval'
  | 'Pending CIO Approval'
  | 'Pending CEO Approval'
  | 'Approved'
  | 'Rejected';

export interface ApprovalStep {
  role: UserRole;
  decision: 'Approved' | 'Rejected';
  timestamp: number;
  comments?: string;
}

export interface GeneratedContent {
  policy: string;
  procedure: string;
  guideline: string;
}

export interface PolicyDocument {
  id: string;
  controlId: string;
  domainName: string;
  subdomainTitle: string;
  controlDescription: string;
  status: DocumentStatus;
  content: GeneratedContent;
  approvalHistory: ApprovalStep[];
  createdAt: number;
  updatedAt: number;
}

export interface PrebuiltPolicyTemplate {
    id: string;
    title: string;
    description: string;
    content: GeneratedContent;
}

// --- NEW: Subscription Licensing System ---
export interface License {
  key: string;
  status: 'active' | 'expired' | 'inactive';
  expiresAt: number; // Timestamp
  tier: 'monthly' | 'quarterly' | 'semi-annually' | 'yearly';
}

// New type for Company Profile
export interface CompanyProfile {
  id: string;
  name: string;
  logo: string; // base64 encoded image string
  ceoName: string;
  cioName: string;
  cisoName: string;
  ctoName: string;
  license?: License;
}