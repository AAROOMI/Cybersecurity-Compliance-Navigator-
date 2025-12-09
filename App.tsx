
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import { ContentViewSkeleton } from './components/ContentViewSkeleton';
import { ChatWidget } from './components/ChatWidget';
import { DocumentsPage } from './components/DocumentsPage';
import { DashboardPage } from './components/Dashboard';
import { UserManagementPage } from './components/UserManagementPage';
import { CompanyProfilePage } from './components/CompanyProfilePage';
import { LoginPage } from './components/LoginPage';
import { AuditLogPage } from './components/AuditLogPage';
import { CompanySetupPage } from './components/CompanySetupPage';
import { MfaSetupPage } from './components/MfaSetupPage';
import { MfaVerifyPage } from './components/MfaVerifyPage';
import { AssessmentPage } from './components/AssessmentPage';
import { PDPLAssessmentPage } from './components/PDPLAssessmentPage';
import { SamaCsfAssessmentPage } from './components/SamaCsfAssessmentPage';
import { UserProfilePage } from './components/UserProfilePage';
import { ComplianceAuditModal } from './components/ComplianceAuditModal';
import { LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, UserCircleIcon, CheckCircleIcon, InformationCircleIcon, CloseIcon, ChevronDownIcon, LogoutIcon, LockClosedIcon, DownloadIcon } from './components/Icons';
import { eccData } from './data/controls';
import { assessmentData as initialAssessmentData } from './data/assessmentData';
import { pdplAssessmentData as initialPdplAssessmentData } from './data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from './data/samaCsfAssessmentData';
import type { Domain, Control, Subdomain, SearchResult, ChatMessage, PolicyDocument, UserRole, DocumentStatus, User, CompanyProfile, AuditLogEntry, AuditAction, License, AssessmentItem, ControlStatus, ApprovalStep, ComplianceEvidence } from './types';
import { rolePermissions } from './types';

// Updated user data to match specific roles and names requested
const initialUsers: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: 'Administrator', password: 'password123', isVerified: true },
  { id: 'user-2', name: 'Samia Ahmed (CISO)', email: 's.ahmed@example.com', role: 'CISO', password: 'password123', isVerified: true },
  { id: 'user-3', name: 'John Doe (CTO)', email: 'j.doe@example.com', role: 'CTO', password: 'password123', isVerified: true },
  { id: 'user-4', name: 'Fatima Khan (CIO)', email: 'f.khan@example.com', role: 'CIO', password: 'password123', isVerified: true },
  { id: 'user-5', name: 'Michael Chen (CEO)', email: 'm.chen@example.com', role: 'CEO', password: 'password123', isVerified: true },
  { id: 'user-6', name: 'David Lee (Analyst)', email: 'd.lee@example.com', role: 'Security Analyst', accessExpiresAt: new Date(new Date().setDate(new Date().getDate() + 30)).getTime(), password: 'password123', isVerified: true },
  { id: 'user-7', name: 'Regular Employee', email: 'employee@example.com', role: 'Employee', password: 'password123', isVerified: true },
];

type CompanyData = {
  users: User[];
  documents: PolicyDocument[];
  auditLog: AuditLogEntry[];
  eccAssessment?: AssessmentItem[];
  pdplAssessment?: AssessmentItem[];
  samaCsfAssessment?: AssessmentItem[];
  assessmentStatuses?: AssessmentStatuses;
};

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface Session {
  user: User;
  companyId: string;
}

interface AssessmentStatuses {
    ecc: 'idle' | 'in-progress';
    pdpl: 'idle' | 'in-progress';
    sama: 'idle' | 'in-progress';
}

// --- Inactivity Timeout Constants ---
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_DURATION_MS = 1 * 60 * 1000; // 1 minute

// Declare QR code library from global
declare const QRCode: any;

const LicenseWall: React.FC<{
  currentUser: User | undefined;
  onGoToProfile: () => void;
  permissions: Set<string>;
}> = ({ currentUser, onGoToProfile, permissions }) => {
  const canManageCompany = permissions.has('company:update');

  return (
    <main className="flex-1 flex items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-lg w-full">
        <LockClosedIcon className="w-16 h-16 mx-auto text-yellow-500" />
        <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">Subscription Required</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your company's subscription has expired or is not configured. Access to the platform is currently disabled.
        </p>
        {canManageCompany ? (
          <>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">Please activate a new license key to restore access for your organization.</p>
            <button
              onClick={onGoToProfile}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Manage Subscription
            </button>
          </>
        ) : (
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">Please contact your company's administrator to renew the subscription.</p>
        )}
      </div>
    </main>
  );
};

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain>(eccData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeControlId, setActiveControlId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });
  const [currentView, setCurrentView] = useState<'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'userProfile' | 'mfaSetup'>('dashboard');

  // Multi-tenancy state - Initialize with Demo Company
  const [companies, setCompanies] = useState<CompanyProfile[]>([
      {
          id: 'comp-demo',
          name: 'Demo Company',
          logo: '',
          ceoName: 'Michael Chen',
          cioName: 'Fatima Khan',
          cisoName: 'Samia Ahmed',
          ctoName: 'John Doe',
          license: { key: 'demo-key', status: 'active', tier: 'yearly', expiresAt: Date.now() + 31536000000 }
      }
  ]);
  const [allCompanyData, setAllCompanyData] = useState<Record<string, CompanyData>>({
      'comp-demo': {
          users: initialUsers,
          documents: [],
          auditLog: [],
          eccAssessment: initialAssessmentData,
          pdplAssessment: initialPdplAssessmentData,
          samaCsfAssessment: initialSamaCsfAssessmentData,
          assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle' }
      }
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [viewForNoSession, setViewForNoSession] = useState<'login' | 'setup'>('login');
  
  const [isContentViewLoading, setIsContentViewLoading] = useState(false);

  // Inactivity state
  const [isIdleWarningVisible, setIsIdleWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION_MS / 1000);
  const warningTimerRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  // PWA Install Prompt state
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  // Subscription/License state
  const [isLicensed, setIsLicensed] = useState(true);
  
  // MFA setup state
  const [mfaSetupUser, setMfaSetupUser] = useState<User | null>(null);

  // Agentic Audit State
  const [auditDoc, setAuditDoc] = useState<{ doc: PolicyDocument, control: Control } | null>(null);

  // Derived state from session
  const currentUser = session?.user;
  const currentCompanyId = session?.companyId;

  const currentCompany = useMemo(() => companies.find(c => c.id === currentCompanyId), [companies, currentCompanyId]);
  const users = useMemo(() => allCompanyData[currentCompanyId || '']?.users || [], [allCompanyData, currentCompanyId]);
  const documentRepository = useMemo(() => allCompanyData[currentCompanyId || '']?.documents || [], [allCompanyData, currentCompanyId]);
  const auditLog = useMemo(() => allCompanyData[currentCompanyId || '']?.auditLog || [], [allCompanyData, currentCompanyId]);
  const eccAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.eccAssessment || initialAssessmentData, [allCompanyData, currentCompanyId]);
  const pdplAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.pdplAssessment || initialPdplAssessmentData, [allCompanyData, currentCompanyId]);
  const samaCsfAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.samaCsfAssessment || initialSamaCsfAssessmentData, [allCompanyData, currentCompanyId]);
  const assessmentStatuses = useMemo(() => allCompanyData[currentCompanyId || '']?.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' }, [allCompanyData, currentCompanyId]);

  // PWA install prompt handler
  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          addNotification('Application installed successfully!', 'success');
        }
        setInstallPrompt(null);
      });
    }
  };

  const handleToggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addAuditLog = useCallback((
      action: AuditAction, 
      details: string, 
      targetId?: string
  ) => {
      const userForLog = session?.user;
      const companyIdForLog = session?.companyId;

      if (!companyIdForLog || !userForLog) return;

      const newLogEntry: AuditLogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: Date.now(),
          userId: userForLog.id,
          userName: userForLog.name,
          action,
          details,
          targetId
      };

      setAllCompanyData(prevData => {
          const currentData = prevData[companyIdForLog] || { users: [], documents: [], auditLog: [] };
          // Prepend new log to the beginning of the array
          const newAuditLog = [newLogEntry, ...(currentData.auditLog || [])]; 
          return {
              ...prevData,
              [companyIdForLog]: { ...currentData, auditLog: newAuditLog }
          };
      });
  }, [session?.user, session?.companyId]);

  const setUsersForCurrentCompany = (updater: React.SetStateAction<User[]>) => {
    if (!currentCompanyId) return;
    setAllCompanyData(prevData => {
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [] };
      const newUsers = typeof updater === 'function' ? updater(currentData.users) : updater;
      
      // Update session if the current user's data has changed
      if (session) {
        const updatedCurrentUser = newUsers.find(u => u.id === session.user.id);
        if (updatedCurrentUser && JSON.stringify(updatedCurrentUser) !== JSON.stringify(session.user)) {
            setSession(prev => prev ? { ...prev, user: updatedCurrentUser } : null);
        }
      }

      return {
        ...prevData,
        [currentCompanyId]: { ...currentData, users: newUsers }
      };
    });
  };

  const setDocumentRepositoryForCurrentCompany = (updater: React.SetStateAction<PolicyDocument[]>) => {
    if (!currentCompanyId) return;
    setAllCompanyData(prevData => {
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [] };
      const newDocuments = typeof updater === 'function' ? updater(currentData.documents) : updater;
      return {
        ...prevData,
        [currentCompanyId]: { ...currentData, documents: newDocuments }
      };
    });
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const addNotification = useCallback((message: string, type: 'success' | 'info' = 'info') => {
      const id = Date.now();
      setNotifications(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
          removeNotification(id);
      }, 5000); 
  }, []);

  const currentUserPermissions = useMemo(() => {
    const isExpired = currentUser?.accessExpiresAt && currentUser.accessExpiresAt < Date.now();
    if (!currentUser || isExpired) {
        return new Set(rolePermissions['Employee']);
    }
    return new Set(rolePermissions[currentUser.role] || []);
  }, [currentUser]);

  useEffect(() => {
      if (currentCompany) {
          const license = currentCompany.license;
          if (license && license.status === 'active' && license.expiresAt > Date.now()) {
              setIsLicensed(true);
          } else {
              setIsLicensed(false);
              if (license && license.status === 'active' && license.expiresAt <= Date.now()) {
                  const updatedLicense: License = { ...license, status: 'expired' };
                  const updatedProfile: CompanyProfile = { ...currentCompany, license: updatedLicense };
                  setCompanies(prev => prev.map(c => c.id === updatedProfile.id ? updatedProfile : c));
              }
          }
      } else if (session) {
           setIsLicensed(false);
      }
  }, [currentCompany, session]);

  const handleInitiateAssessment = (type: keyof AssessmentStatuses) => {
      if (!currentCompanyId) return;
      setAllCompanyData(prev => ({
          ...prev,
          [currentCompanyId]: {
              ...prev[currentCompanyId],
              assessmentStatuses: { ...prev[currentCompanyId].assessmentStatuses, [type]: 'in-progress' } as AssessmentStatuses
          }
      }));
      addAuditLog('AGENT_AUDIT_INITIATED', `Initiated ${type.toUpperCase()} assessment`);
  };

  const handleCompleteAssessment = (type: keyof AssessmentStatuses) => {
      if (!currentCompanyId) return;
      setAllCompanyData(prev => ({
          ...prev,
          [currentCompanyId]: {
              ...prev[currentCompanyId],
              assessmentStatuses: { ...prev[currentCompanyId].assessmentStatuses, [type]: 'idle' } as AssessmentStatuses
          }
      }));
      addAuditLog('AGENT_AUDIT_COMPLETED', `Completed ${type.toUpperCase()} assessment`);
  };

  const handleUpdateAssessmentItem = (type: keyof AssessmentStatuses, controlCode: string, updatedItem: AssessmentItem) => {
      if (!currentCompanyId) return;
      const dataKey = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : 'samaCsfAssessment';
      
      setAllCompanyData(prev => {
          const currentList = prev[currentCompanyId][dataKey] as AssessmentItem[];
          const newList = currentList.map(item => item.controlCode === controlCode ? updatedItem : item);
          return {
              ...prev,
              [currentCompanyId]: { ...prev[currentCompanyId], [dataKey]: newList }
          };
      });
  };

  const handleCompanySetup = (profileData: any, adminData: any) => {
      const newCompanyId = profileData.id || `company-${Date.now()}`;
      const newCompany: CompanyProfile = { ...profileData, id: newCompanyId };
      const newAdmin: User = { 
          ...adminData, 
          id: `user-${Date.now()}`, 
          role: 'Administrator', 
          isVerified: true // Auto-verify first admin
      };

      setCompanies(prev => [...prev, newCompany]);
      setAllCompanyData(prev => ({
          ...prev,
          [newCompanyId]: {
              users: initialUsers.map(u => ({...u, id: `user-${Math.random().toString(36).substr(2,9)}`})), // Clone mock users for new company
              documents: [],
              auditLog: [],
              eccAssessment: initialAssessmentData,
              pdplAssessment: initialPdplAssessmentData,
              samaCsfAssessment: initialSamaCsfAssessmentData,
              assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle' }
          }
      }));
      
      // Add the real admin user
      setAllCompanyData(prev => ({
          ...prev,
          [newCompanyId]: {
              ...prev[newCompanyId],
              users: [newAdmin, ...prev[newCompanyId].users]
          }
      }));

      setSession({ user: newAdmin, companyId: newCompanyId });
      addNotification('Company workspace created successfully!', 'success');
  };

  const handleSaveCompanyProfile = (profile: CompanyProfile) => {
      setCompanies(prev => prev.map(c => c.id === profile.id ? profile : c));
      addAuditLog('COMPANY_PROFILE_UPDATED', 'Company profile details updated');
  };

  const handleAddDocumentToRepo = useCallback((
    control: Control,
    subdomain: Subdomain,
    domain: Domain,
    generatedContent: { policy: string; procedure: string; guideline: string }
  ) => {
    if(!currentCompanyId) return;
    const now = Date.now();
    
    // Generate a QR Code for the document
    let qrCodeUrl = '';
    if (typeof QRCode !== 'undefined') {
        const docUrl = `https://ecc-navigator.app/verify/${control.id}-${now}`; // Simulated verification URL
        QRCode.toDataURL(docUrl, { width: 128, margin: 1 }, (err: any, url: string) => {
            if (!err) qrCodeUrl = url;
        });
    }

    const newDocument: PolicyDocument = {
      id: `policy-${control.id}-${now}`,
      controlId: control.id,
      domainName: domain.name,
      subdomainTitle: subdomain.title,
      controlDescription: control.description,
      status: 'Pending CISO Approval',
      content: generatedContent,
      approvalHistory: [],
      evidence: [],
      createdAt: now,
      updatedAt: now,
      qrCodeUrl: qrCodeUrl,
      barcodeId: `ECC-${control.id}-${now.toString().slice(-6)}`
    };
    setDocumentRepositoryForCurrentCompany(prevRepo => [...prevRepo, newDocument]);
    
    addNotification(`Document for ${control.id} generated successfully.`);

  }, [currentCompanyId, addNotification]);
  
  const handleApprovalAction = (documentId: string, decision: 'Approved' | 'Rejected', comments?: string) => {
    if (!currentUser) return;
    const doc = documentRepository.find(d => d.id === documentId);
    if (!doc) return;
    
    const now = Date.now();
    const newHistory = [...doc.approvalHistory, { role: currentUser.role, decision, timestamp: now, comments }];
    
    let nextStatus = doc.status;
    if (decision === 'Rejected') {
        nextStatus = 'Rejected';
    } else {
        // Simple linear workflow for demo
        if (doc.status === 'Pending CISO Approval') nextStatus = 'Pending CTO Approval';
        else if (doc.status === 'Pending CTO Approval') nextStatus = 'Pending CIO Approval';
        else if (doc.status === 'Pending CIO Approval') nextStatus = 'Pending CEO Approval';
        else if (doc.status === 'Pending CEO Approval') nextStatus = 'Approved';
    }

    setDocumentRepositoryForCurrentCompany(prevRepo =>
        prevRepo.map(d => d.id === documentId ? { ...d, status: nextStatus, approvalHistory: newHistory, updatedAt: now } : d)
    );
    addAuditLog(decision === 'Approved' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED', `Document ${doc.controlId} ${decision.toLowerCase()} by ${currentUser.name}`, documentId);
  };

  const handleAuditComplete = (auditResult: ApprovalStep[]) => {
      if (!auditDoc || !currentCompanyId) return;
      
      const docId = auditDoc.doc.id;
      const allPassed = auditResult.every(step => step.decision === 'Passed');
      const newStatus: DocumentStatus = allPassed ? 'Approved' : 'Rejected';
      
      // Append new audit steps to existing history
      const updatedHistory = [...auditDoc.doc.approvalHistory, ...auditResult];

      setDocumentRepositoryForCurrentCompany(prevRepo => 
          prevRepo.map(d => 
              d.id === docId 
                  ? { ...d, status: newStatus, approvalHistory: updatedHistory, updatedAt: Date.now() } 
                  : d
          )
      );

      addAuditLog('AGENT_AUDIT_COMPLETED', `Agentic Audit completed for ${auditDoc.doc.controlId}. Result: ${newStatus}`, docId);
      addNotification(`Agentic Audit completed. Document ${newStatus}.`, allPassed ? 'success' : 'info');
      setAuditDoc(null);
  };

  const handleUploadEvidence = useCallback((docId: string, file: File) => {
      if (!currentCompanyId || !currentUser) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const evidence: ComplianceEvidence = {
              id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name: file.name,
              url: e.target?.result as string,
              type: file.type,
              uploadedBy: currentUser.name,
              uploadedAt: Date.now()
          };

          setDocumentRepositoryForCurrentCompany(prevRepo => 
              prevRepo.map(doc => {
                  if (doc.id === docId) {
                      const updatedDoc = { ...doc, evidence: [...(doc.evidence || []), evidence] };
                      return updatedDoc;
                  }
                  return doc;
              })
          );
          addAuditLog('EVIDENCE_UPLOADED', `Evidence ${file.name} uploaded for document ${docId}`, docId);
          addNotification(`Evidence uploaded successfully.`, 'success');
      };
      reader.readAsDataURL(file);
  }, [currentCompanyId, currentUser, addNotification, addAuditLog]);

  const allControls = useMemo((): SearchResult[] => {
    return eccData.flatMap(domain =>
      domain.subdomains.flatMap(subdomain =>
        subdomain.controls.map(control => ({
          control,
          subdomain,
          domain,
        }))
      )
    );
  }, []);

  // Login handler
  const handleLogin = async (e: string, p: string) => {
      // 1. Fallback check for demo purposes if state isn't perfectly synced yet
      if (e === 'admin@example.com' && p === 'password123') {
          // Find the demo company or create it dynamically if missing
          let demoCompId = 'comp-demo';
          let user = initialUsers.find(u => u.email === e);
          if (!user) user = { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: 'Administrator', password: 'password123', isVerified: true };
          
          setSession({ user, companyId: demoCompId });
          return null;
      }

      // 2. Standard check against all company data
      for (const cid in allCompanyData) {
          const user = allCompanyData[cid].users.find(u => u.email === e && u.password === p);
          if (user) {
              setSession({ user, companyId: cid });
              return null;
          }
      }
      return { error: 'Invalid credentials' };
  }
  
  const handleVerifyMfa = async () => ({ success: true }); // Mock
  const handleVerifyEmail = () => true;

  const renderMainContent = () => {
    if (!currentCompany && currentView !== 'companyProfile') {
        return <div>Please setup company profile.</div>;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardPage repository={documentRepository} currentUser={currentUser!} allControls={allControls} domains={eccData} onSetView={setCurrentView as any} />;
      case 'assessment':
        return <AssessmentPage assessmentData={eccAssessment} onUpdateItem={(code, item) => handleUpdateAssessmentItem('ecc', code, item)} status={assessmentStatuses.ecc} onInitiate={() => handleInitiateAssessment('ecc')} onComplete={() => handleCompleteAssessment('ecc')} permissions={currentUserPermissions} />;
      case 'pdplAssessment':
        return <PDPLAssessmentPage assessmentData={pdplAssessment} onUpdateItem={(code, item) => handleUpdateAssessmentItem('pdpl', code, item)} status={assessmentStatuses.pdpl} onInitiate={() => handleInitiateAssessment('pdpl')} onComplete={() => handleCompleteAssessment('pdpl')} permissions={currentUserPermissions} />;
      case 'samaCsfAssessment':
        return <SamaCsfAssessmentPage assessmentData={samaCsfAssessment} onUpdateItem={(code, item) => handleUpdateAssessmentItem('sama', code, item)} status={assessmentStatuses.sama} onInitiate={() => handleInitiateAssessment('sama')} onComplete={() => handleCompleteAssessment('sama')} permissions={currentUserPermissions} />;
      case 'navigator':
        return currentUserPermissions.has('navigator:read') ? (
          isContentViewLoading ? <ContentViewSkeleton /> :
          <ContentView
            domain={selectedDomain}
            activeControlId={activeControlId}
            setActiveControlId={setActiveControlId}
            onAddDocument={handleAddDocumentToRepo}
            onStartAudit={(doc, control) => setAuditDoc({ doc, control })}
            onUploadEvidence={handleUploadEvidence}
            documentRepository={documentRepository}
            permissions={currentUserPermissions}
            currentUser={currentUser!}
          />
        ) : <div>No permission</div>;
      case 'documents':
        return currentUserPermissions.has('documents:read') ? (
          <DocumentsPage
            repository={documentRepository}
            currentUser={currentUser!}
            onApprovalAction={handleApprovalAction}
            onAddDocument={handleAddDocumentToRepo}
            permissions={currentUserPermissions}
            company={currentCompany!}
          />
        ) : <div>No permission</div>;
      case 'users':
          return <UserManagementPage users={users} setUsers={setUsersForCurrentCompany} currentUser={currentUser!} addNotification={addNotification} addAuditLog={addAuditLog} />;
      case 'companyProfile':
          return <CompanyProfilePage company={currentCompany} onSave={handleSaveCompanyProfile} canEdit={currentUserPermissions.has('company:update')} addNotification={addNotification} />;
      case 'auditLog':
          return <AuditLogPage auditLog={auditLog} />;
      case 'userProfile':
          return <UserProfilePage currentUser={currentUser!} onChangePassword={async () => ({success:true, message:'Updated'})} onEnableMfa={() => setCurrentView('mfaSetup')} onDisableMfa={async () => ({success:true, message:'Disabled'})} />;
      case 'mfaSetup':
          return <MfaSetupPage user={currentUser!} companyName={currentCompany?.name || 'App'} onVerified={handleVerifyMfa} onCancel={() => setCurrentView('userProfile')} theme={theme} toggleTheme={handleToggleTheme} />;
      default: return null;
    }
  };

  if (!session) {
      if (viewForNoSession === 'setup') return <CompanySetupPage onSetup={handleCompanySetup} onCancel={() => setViewForNoSession('login')} theme={theme} toggleTheme={handleToggleTheme} />;
      return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={handleToggleTheme} onSetupCompany={() => setViewForNoSession('setup')} onVerify={handleVerifyEmail} onForgotPassword={async () => ({success:true, message:'Sent'})} onResetPassword={async () => ({success:true, message:'Reset'})} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-200">
      <div className="flex flex-1 overflow-hidden">
        {isLicensed || (currentView === 'companyProfile' && currentUserPermissions.has('company:update')) ? (
          <>
            <Sidebar
              domains={eccData}
              selectedDomain={selectedDomain}
              onSelectDomain={setSelectedDomain}
              currentView={currentView}
              onSetView={setCurrentView}
              permissions={currentUserPermissions}
              theme={theme}
              toggleTheme={handleToggleTheme}
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {renderMainContent()}
            </main>
          </>
        ) : (
          <LicenseWall currentUser={currentUser} onGoToProfile={() => setCurrentView('companyProfile')} permissions={currentUserPermissions} />
        )}
      </div>
      
      {/* Audit Modal */}
      {auditDoc && (
          <ComplianceAuditModal 
              doc={auditDoc.doc} 
              control={auditDoc.control} 
              onClose={() => setAuditDoc(null)} 
              onAuditComplete={handleAuditComplete} 
          />
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded shadow-lg text-white ${n.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
                {n.message}
            </div>
        ))}
      </div>
      
      <ChatWidget isOpen={false} onToggle={()=>{}} messages={[]} onSendMessage={()=>{}} isLoading={false} error={null} />
    </div>
  );
};

export default App;
