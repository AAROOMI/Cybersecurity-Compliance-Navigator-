
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
  | 'LICENSE_UPDATED'
  | 'PASSWORD_CHANGED'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'AGENT_AUDIT_INITIATED'
  | 'AGENT_AUDIT_COMPLETED'
  | 'EVIDENCE_UPLOADED';

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
  | 'documents:audit' // New permission for agentic audit
  | 'evidence:read'
  | 'evidence:upload'
  | 'templates:read'
  | 'templates:apply'
  | 'navigator:read'
  | 'company:read'
  | 'company:update'
  | 'audit:read'
  | 'assessment:read'
  | 'assessment:update'
  | 'pdplAssessment:read'
  | 'pdplAssessment:update'
  | 'samaCsfAssessment:read'
  | 'samaCsfAssessment:update'
  | 'userProfile:read'
  | 'userProfile:update';

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
  mfaSecret?: string;
  mfaEnabled?: boolean;
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
    'documents:audit',
    'evidence:read',
    'evidence:upload',
    'templates:read',
    'templates:apply',
    'navigator:read',
    'company:read',
    'company:update',
    'audit:read',
    'assessment:read',
    'assessment:update',
    'pdplAssessment:read',
    'pdplAssessment:update',
    'samaCsfAssessment:read',
    'samaCsfAssessment:update',
    'userProfile:read',
    'userProfile:update',
  ],
  CISO: [
    'dashboard:read',
    'documents:read',
    'documents:approve',
    'documents:generate',
    'documents:audit',
    'evidence:read',
    'evidence:upload',
    'templates:read',
    'templates:apply',
    'navigator:read',
    'company:read',
    'assessment:read',
    'assessment:update',
    'pdplAssessment:read',
    'pdplAssessment:update',
    'samaCsfAssessment:read',
    'samaCsfAssessment:update',
    'userProfile:read',
    'userProfile:update',
  ],
  CTO: ['dashboard:read', 'documents:read', 'documents:approve', 'documents:audit', 'evidence:read', 'navigator:read', 'templates:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'userProfile:read', 'userProfile:update'],
  CIO: ['dashboard:read', 'documents:read', 'documents:approve', 'evidence:read', 'navigator:read', 'templates:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'userProfile:read', 'userProfile:update'],
  CEO: ['dashboard:read', 'documents:read', 'documents:approve', 'evidence:read', 'navigator:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'userProfile:read', 'userProfile:update'],
  'Security Analyst': [
    'documents:read',
    'documents:generate',
    'documents:audit', // Can view audit results
    'evidence:read',
    'evidence:upload', // Key permission for Analyst
    'templates:read',
    'templates:apply',
    'navigator:read',
    'company:read',
    'assessment:read',
    'assessment:update',
    'pdplAssessment:read',
    'pdplAssessment:update',
    'samaCsfAssessment:read',
    'samaCsfAssessment:update',
    'userProfile:read',
    'userProfile:update',
  ],
  Employee: ['navigator:read', 'company:read', 'userProfile:read', 'userProfile:update'],
};


// Document Management System Types
export type DocumentStatus =
  | 'Draft'
  | 'AI Auditing'
  | 'Pending CISO Approval'
  | 'Pending CTO Approval'
  | 'Pending CIO Approval'
  | 'Pending CEO Approval'
  | 'Approved'
  | 'Rejected';

export interface ApprovalStep {
  role: UserRole | 'AI_AGENT';
  decision: 'Approved' | 'Rejected' | 'Passed' | 'Failed';
  timestamp: number;
  comments?: string;
  signatureId?: string; // Unique hash for the signature
  agentName?: string; // e.g., "AI CISO Agent", "AI CTO Agent"
}

export interface GeneratedContent {
  policy: string;
  procedure: string;
  guideline: string;
}

export interface ComplianceEvidence {
  id: string;
  name: string;
  url: string; // Base64 encoded file
  type: string; // MIME type
  uploadedBy: string;
  uploadedAt: number;
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
  evidence?: ComplianceEvidence[];
  createdAt: number;
  updatedAt: number;
  qrCodeUrl?: string;
  barcodeId?: string;
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

// --- NEW: NCA ECC Assessment ---
export type ControlStatus = 'Implemented' | 'Partially Implemented' | 'Not Implemented' | 'Not Applicable';

export interface AssessmentItem {
  domainCode: string;
  domainName: string;
  subDomainCode: string;
  subdomainName: string;
  controlCode: string;
  controlName: string;
  saudiCeramicsCurrentStatus: string;
  controlStatus: ControlStatus;
  recommendation: string;
  managementResponse: string;
  targetDate: string;
}
