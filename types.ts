// FIX: Removed self-import of types, which caused declaration conflicts with the types defined in this file.




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
  | 'COMPANY_CREATED'
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
  | 'cmaAssessment:read'
  | 'cmaAssessment:update'
  | 'userProfile:read'
  | 'userProfile:update'
  | 'help:read'
  | 'training:read'
  | 'riskAssessment:read'
  | 'riskAssessment:update'
  | 'riskRegister:read'
  | 'mapping:read'
  | 'hrsdAssessment:read'
  | 'hrsdAssessment:update';

// FIX: Moved View type from App.tsx and exported it to be used across components.
export type View = 'dashboard' | 'navigator' | 'documents' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment' | 'hrsdAssessment' | 'userProfile' | 'help' | 'training' | 'riskAssessment' | 'riskRegister' | 'userManagement' | 'controlMapping';


// User interface with all fields for custom auth
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  accessExpiresAt?: number;
  password?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
  passwordResetToken?: string;
  passwordResetExpires?: number;
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
    'cmaAssessment:read',
    'cmaAssessment:update',
    'userProfile:read',
    'userProfile:update',
    'help:read',
    'training:read',
    'riskAssessment:read',
    'riskAssessment:update',
    'riskRegister:read',
    'mapping:read',
    'hrsdAssessment:read',
    'hrsdAssessment:update',
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
    'cmaAssessment:read',
    'cmaAssessment:update',
    'userProfile:read',
    'userProfile:update',
    'help:read',
    'training:read',
    'riskAssessment:read',
    'riskAssessment:update',
    'riskRegister:read',
    'mapping:read',
    'hrsdAssessment:read',
    'hrsdAssessment:update',
  ],
  CTO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'templates:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'cmaAssessment:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read', 'riskAssessment:read', 'riskRegister:read', 'mapping:read', 'hrsdAssessment:read'],
  CIO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'templates:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'cmaAssessment:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read', 'riskAssessment:read', 'riskRegister:read', 'mapping:read', 'hrsdAssessment:read'],
  CEO: ['dashboard:read', 'documents:read', 'documents:approve', 'navigator:read', 'company:read', 'assessment:read', 'pdplAssessment:read', 'samaCsfAssessment:read', 'cmaAssessment:read', 'userProfile:read', 'userProfile:update', 'help:read', 'training:read', 'riskAssessment:read', 'riskRegister:read', 'mapping:read', 'hrsdAssessment:read'],
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
    'cmaAssessment:read',
    'cmaAssessment:update',
    'userProfile:read',
    'userProfile:update',
    'help:read',
    'training:read',
    'riskAssessment:read',
    'riskAssessment:update',
    'riskRegister:read',
    'mapping:read',
    'hrsdAssessment:read',
    'hrsdAssessment:update',
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
  qrCodeDataUrl?: string;
  barcodeDataUrl?: string;
  type?: 'policy' | 'risk_report';
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
  tier: 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | 'trial';
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
  cybersecurityOfficerName?: string;
  dpoName?: string;
  complianceOfficerName?: string;
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

// NEW: Assessment Versioning
export interface AssessmentRecord {
  timestamp: number;
  data: AssessmentItem[];
}

// --- UPDATED: Training Module ---
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index
}

export interface InteractiveQuiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown content
  quiz?: InteractiveQuiz;
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
  dueDate?: number;
}

// FIX: Added missing ChatMessage type for the AI chat widget.
// --- NEW: Chat Widget ---
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- NEW: Compliance Agent ---
export interface ComplianceGap {
    controlCode: string;
    controlName: string;
    domainName: string;
    assessedStatus: ControlStatus;
    framework: string;
}

// FIX: Added missing AgentLogEntry type for the Compliance Agent log.
export interface AgentLogEntry {
  id: string;
  timestamp: number;
  message: string;
  status: 'info' | 'working' | 'success' | 'error';
}

// --- UPDATED: Risk Assessment ---
export type RiskStatus = 'To Do' | 'In Progress' | 'Assessed' | 'Mitigated';
export type Risk = {
  id: string;
  description: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  mitigation: string;
  owner: string;
  status: RiskStatus;
  assessmentNotes: string;
  evidence: {
    fileName: string;
    dataUrl: string;
  } | null;
  assessedBy?: string;
  assessedAt?: number;
};


// --- NEW: Control Mapping ---
export type FrameworkName = 'NCA ECC' | 'PDPL' | 'SAMA CSF' | 'CMA' | 'HRSD';

export interface ControlMapping {
  sourceFramework: FrameworkName;
  sourceControlId: string;
  targetFramework: FrameworkName;
  targetControlId: string;
  justification: string;
}