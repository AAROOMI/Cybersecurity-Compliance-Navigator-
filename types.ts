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
  | 'MFA_DISABLED';

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
  | 'audit:read'
  | 'assessment:read'
  | 'assessment:update'
  | 'pdplAssessment:read'
  | 'pdplAssessment:update'
  | 'samaCsfAssessment:read'
  | 'samaCsfAssessment:update'
  | 'userProfile:read'
  | 'userProfile:update'
  | 'help:read'
  | 'training:read'
  | 'complianceAgent:read'
  | 'complianceAgent:run';


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
    'help:read',
    'training:read',
    'complianceAgent:read',
    'complianceAgent:run',
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
    'assessment:read',
    'assessment:update',
    'pdplAssessment:read',
    'pdplAssessment:update',
    'samaCsfAssessment:read',
    'samaCsfAssessment:update',
    'userProfile:read',
    'userProfile:update',
    'help:read',
    'training:read',
    'complianceAgent:read',
    'complianceAgent:run',
  ],
  CTO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'templates:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read', 'complianceAgent:read'],
  CIO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'templates:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read', 'complianceAgent:read'],
  CEO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read', 'complianceAgent:read'],
  'Security Analyst': [
    'documents:read',
    'documents:generate',
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
    'help:read',
    'training:read',
    'complianceAgent:read',
  ],
  Employee: ['navigator:read', 'company:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read'],
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
  generatedBy?: 'user' | 'AI Agent';
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
  currentStatusDescription: string;
  controlStatus: ControlStatus;
  recommendation: string;
  managementResponse: string;
  targetDate: string;
  evidence?: {
    fileName: string;
    dataUrl: string; // base64 data URL
  };
}

// --- UPDATED: Training Module ---
export type ChallengeType = 'multiple-choice' | 'categorization' | 'spot-the-phish' | 'ordering';

export interface MultipleChoiceChallenge {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number; // index
}

export interface CategorizationItem {
  id: string;
  text: string;
  correctCategory: string;
}

export interface CategorizationChallenge {
  type: 'categorization';
  prompt: string;
  categories: string[];
  items: CategorizationItem[];
}

export interface Hotspot {
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  feedback: string;
}

export interface SpotThePhishChallenge {
  type: 'spot-the-phish';
  prompt: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

export interface OrderingItem {
  id: string;
  text: string;
}

export interface OrderingChallenge {
  type: 'ordering';
  prompt: string;
  items: OrderingItem[]; // Must be provided in the correct order
}

export type Challenge = MultipleChoiceChallenge | CategorizationChallenge | SpotThePhishChallenge | OrderingChallenge;

export interface InteractiveChallenge {
  title: string;
  items: Challenge[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown content
  challenge?: InteractiveChallenge;
}

export interface TrainingCourse {
  id:string;
  title: string;
  description: string;
  standard: 'NCA ECC' | 'PDPL' | 'SAMA CSF' | 'ISO 27001';
  lessons: Lesson[];
  badgeId: string;
}

export interface UserTrainingProgress {
  [courseId: string]: {
    completedLessons: string[];
    score?: number;
    badgeEarned: boolean;
    badgeId: string;
  };
}


// --- NEW: Task Management ---
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  controlId?: string;
  status: TaskStatus;
  createdAt: number;
}


// --- NEW: Compliance Agent ---
export interface AgentLogEntry {
  id: string;
  timestamp: number;
  message: string;
  status: 'info' | 'success' | 'working' | 'error';
}

export interface ComplianceGap {
    controlCode: string;
    controlName: string;
    domainName: string;
    assessedStatus: ControlStatus;
    framework: string;
}