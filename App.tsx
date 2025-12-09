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
import { LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, UserCircleIcon, CheckCircleIcon, InformationCircleIcon, CloseIcon, ChevronDownIcon, LogoutIcon, LockClosedIcon, DownloadIcon } from './components/Icons';
import { eccData } from './data/controls';
import { assessmentData as initialAssessmentData } from './data/assessmentData';
import { pdplAssessmentData as initialPdplAssessmentData } from './data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from './data/samaCsfAssessmentData';
import type { Domain, Control, Subdomain, SearchResult, ChatMessage, PolicyDocument, UserRole, DocumentStatus, User, CompanyProfile, AuditLogEntry, AuditAction, License, AssessmentItem, ControlStatus } from './types';
import { rolePermissions } from './types';

// Mock user data for the new RBAC system
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

  // Multi-tenancy state
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [allCompanyData, setAllCompanyData] = useState<Record<string, CompanyData>>({});
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
      }, 5000); // Auto-dismiss after 5 seconds
  }, []);

  const currentUserPermissions = useMemo(() => {
    const isExpired = currentUser?.accessExpiresAt && currentUser.accessExpiresAt < Date.now();
    if (!currentUser || isExpired) {
        // Return minimal permissions for an expired or non-existent user
        return new Set(rolePermissions['Employee']);
    }
    return new Set(rolePermissions[currentUser.role] || []);
  }, [currentUser]);
  
    // --- License Check Logic ---
    useEffect(() => {
        if (currentCompany) {
            const license = currentCompany.license;
            if (license && license.status === 'active' && license.expiresAt > Date.now()) {
                setIsLicensed(true);
            } else {
                setIsLicensed(false);
                // If license expired, update its status
                if (license && license.status === 'active' && license.expiresAt <= Date.now()) {
                    const updatedLicense: License = { ...license, status: 'expired' };
                    const updatedProfile: CompanyProfile = { ...currentCompany, license: updatedLicense };
                    setCompanies(prev => prev.map(c => c.id === updatedProfile.id ? updatedProfile : c));
                }
            }
        } else if (session) { // A session exists but company profile might be loading/missing
             setIsLicensed(false);
        }
    }, [currentCompany, session]);

  // Load all data from localStorage on initial render
  useEffect(() => {
    try {
        const savedCompaniesData = window.localStorage.getItem('companies');
        
        // If no data, seed the application with a default company and users
        if (!savedCompaniesData || savedCompaniesData === '[]') {
            console.log("No companies found in localStorage. Seeding with default data.");

            const defaultCompanyId = 'default-company-1';
            const defaultCompany: CompanyProfile = {
                id: defaultCompanyId,
                name: 'Example Corp',
                logo: '',
                ceoName: 'Michael Chen',
                cioName: 'Fatima Khan',
                cisoName: 'Samia Ahmed',
                ctoName: 'John Doe',
                license: {
                    key: 'default-starter-key',
                    status: 'active',
                    tier: 'yearly',
                    expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime(),
                }
            };

            const defaultCompanyData: CompanyData = {
                users: initialUsers,
                documents: [],
                auditLog: [],
                eccAssessment: initialAssessmentData,
                pdplAssessment: initialPdplAssessmentData,
                samaCsfAssessment: initialSamaCsfAssessmentData,
                assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle' }
            };

            setCompanies([defaultCompany]);
            setAllCompanyData({ [defaultCompanyId]: defaultCompanyData });
            
            // Save the default data to localStorage to persist it
            const { logo, ...companyToStore } = defaultCompany;
            window.localStorage.setItem('companies', JSON.stringify([companyToStore]));
            window.localStorage.setItem('companyLogos', JSON.stringify({}));
            window.localStorage.setItem(`companyData-${defaultCompanyId}`, JSON.stringify(defaultCompanyData));
            return; // Exit after seeding
        }

        const companiesWithoutLogos: Omit<CompanyProfile, 'logo'>[] = JSON.parse(savedCompaniesData);
        
        if (companiesWithoutLogos.length > 0) {
            const savedLogosData = window.localStorage.getItem('companyLogos');
            const companyLogos: Record<string, string> = savedLogosData ? JSON.parse(savedLogosData) : {};
            
            const hydratedCompanies: CompanyProfile[] = companiesWithoutLogos.map(c => ({
                ...c,
                logo: companyLogos[c.id] || ''
            }));
            setCompanies(hydratedCompanies);
            
            const loadedCompanyData: Record<string, CompanyData> = {};
            for (const company of hydratedCompanies) {
                const data = window.localStorage.getItem(`companyData-${company.id}`);
                const parsedData = data ? JSON.parse(data) : { users: [], documents: [], auditLog: [] };
                // Ensure assessment data is present
                loadedCompanyData[company.id] = {
                    ...parsedData,
                    eccAssessment: parsedData.eccAssessment || initialAssessmentData,
                    pdplAssessment: parsedData.pdplAssessment || initialPdplAssessmentData,
                    samaCsfAssessment: parsedData.samaCsfAssessment || initialSamaCsfAssessmentData,
                    assessmentStatuses: parsedData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' }
                };
            }
            setAllCompanyData(loadedCompanyData);
        }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Save companies list to localStorage when it changes
  useEffect(() => {
    if (companies.length > 0) {
      try {
        // Separate logos from main company data to reduce size and avoid quota errors
        const companiesToStore = companies.map(({ logo, ...rest }) => rest);
        const logosToStore = companies.reduce((acc, company) => {
            if (company.logo) {
                acc[company.id] = company.logo;
            }
            return acc;
        }, {} as Record<string, string>);

        window.localStorage.setItem('companies', JSON.stringify(companiesToStore));
        window.localStorage.setItem('companyLogos', JSON.stringify(logosToStore));
      } catch (error) {
        console.error("Failed to save companies to localStorage", error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            addNotification("Storage limit reached. Could not save all company data. You may need to remove large company logos.", "info");
        }
      }
    }
  }, [companies, addNotification]);

  // Save data for the CURRENT company to localStorage when it changes
  useEffect(() => {
    if (currentCompanyId && allCompanyData[currentCompanyId]) {
      try {
        window.localStorage.setItem(`companyData-${currentCompanyId}`, JSON.stringify(allCompanyData[currentCompanyId]));
      } catch (error) {
        console.error(`Failed to save data for company ${currentCompanyId} to localStorage`, error);
      }
    }
  }, [allCompanyData, currentCompanyId]);

    const handleInitiateAssessment = (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId || !window.confirm("Are you sure you want to start a new assessment? This will reset all current progress for this assessment type.")) return;

        let sourceData: AssessmentItem[];
        switch (type) {
            case 'ecc': sourceData = initialAssessmentData; break;
            case 'pdpl': sourceData = initialPdplAssessmentData; break;
            case 'sama': sourceData = initialSamaCsfAssessmentData; break;
            default: return;
        }

        // Use map to create a new array of new objects. This avoids potential mutation issues.
        const resetData = sourceData.map(item => ({
            ...item,
            saudiCeramicsCurrentStatus: "",
            controlStatus: 'Not Implemented' as ControlStatus,
            recommendation: "",
            managementResponse: "",
            targetDate: "",
        }));
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId];
            if (!currentData) return prev;
            
            let key: keyof CompanyData;
            switch(type) {
                case 'ecc': key = 'eccAssessment'; break;
                case 'pdpl': key = 'pdplAssessment'; break;
                case 'sama': key = 'samaCsfAssessment'; break;
                default: return prev;
            }

            return {
                ...prev,
                [currentCompanyId]: {
                    ...currentData,
                    [key]: resetData,
                    assessmentStatuses: { ...(currentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' }), [type]: 'in-progress' }
                }
            };
        });
        addNotification(`${type.toUpperCase()} assessment has been initiated.`, 'success');
    };

    const handleCompleteAssessment = (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId];
            if (!currentData) return prev;
            return {
                ...prev,
                [currentCompanyId]: {
                    ...currentData,
                    assessmentStatuses: { ...(currentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' }), [type]: 'idle' }
                }
            };
        });
        addNotification(`${type.toUpperCase()} assessment has been marked as complete.`, 'success');
    };

    const handleUpdateAssessmentItem = (type: keyof AssessmentStatuses, controlCode: string, updatedItem: AssessmentItem) => {
        if (!currentCompanyId) return;
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId];
            if (!currentData) return prev;
            
            let key: keyof CompanyData;
            switch(type) {
                case 'ecc': key = 'eccAssessment'; break;
                case 'pdpl': key = 'pdplAssessment'; break;
                case 'sama': key = 'samaCsfAssessment'; break;
                default: return prev;
            }

            const currentAssessmentData = currentData[key] as AssessmentItem[] || [];

            const newData = currentAssessmentData.map(item => 
                item.controlCode === controlCode ? updatedItem : item
            );

            return {
                ...prev,
                [currentCompanyId]: {
                    ...currentData,
                    [key]: newData
                }
            };
        });
    };

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

    const handleCompanySetup = (
      profileData: Omit<CompanyProfile, 'id' | 'license'>,
      adminData: Omit<User, 'id' | 'isVerified' | 'role'>
    ) => {
        const companyId = `company-${Date.now()}`;
        const newCompany: CompanyProfile = {
            ...profileData,
            id: companyId,
        };

        const adminUser: User = {
            ...adminData,
            id: `user-${Date.now()}`,
            role: 'Administrator',
            isVerified: true,
        };

        setCompanies(prev => [...prev, newCompany]);
        setAllCompanyData(prev => ({
            ...prev,
            [companyId]: { 
              users: [adminUser], 
              documents: [], 
              auditLog: [],
              eccAssessment: initialAssessmentData,
              pdplAssessment: initialPdplAssessmentData,
              samaCsfAssessment: initialSamaCsfAssessmentData,
              assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle' }
            },
        }));

        setViewForNoSession('login');
        addNotification('Company and administrator account created successfully! You can now log in.', 'success');
    };

  const handleSaveCompanyProfile = (profile: CompanyProfile) => {
      const existing = companies.find(c => c.id === profile.id);
      
      if (existing) {
          if (JSON.stringify(existing.license) !== JSON.stringify(profile.license) && profile.license) {
               addAuditLog('LICENSE_UPDATED', `Company license updated to ${profile.license.tier} plan, expires ${new Date(profile.license.expiresAt).toLocaleDateString()}`, profile.id);
          } else {
              addAuditLog('COMPANY_PROFILE_UPDATED', `Company profile for ${profile.name} was updated.`, profile.id);
          }
          setCompanies(prev => prev.map(c => (c.id === profile.id ? profile : c)));
      }
      addNotification('Company profile saved successfully.', 'success');
  };

  const handleAddDocumentToRepo = useCallback((
    control: Control,
    subdomain: Subdomain,
    domain: Domain,
    generatedContent: { policy: string; procedure: string; guideline: string }
  ) => {
    if(!currentCompanyId) return;
    const now = Date.now();
    const newDocument: PolicyDocument = {
      id: `policy-${control.id}-${now}`,
      controlId: control.id,
      domainName: domain.name,
      subdomainTitle: subdomain.title,
      controlDescription: control.description,
      status: 'Pending CISO Approval',
      content: generatedContent,
      approvalHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    setDocumentRepositoryForCurrentCompany(prevRepo => [...prevRepo, newDocument]);
    
    const companyUsers = allCompanyData[currentCompanyId]?.users || [];
    const cisoUsers = companyUsers.filter(u => u.role === 'CISO');
    if (cisoUsers.length > 0) {
        cisoUsers.forEach(ciso => {
            addNotification(`Email notification sent to ${ciso.name} (${ciso.email}) for new document ${newDocument.controlId}.`);
        });
    } else {
        addNotification(`New document ${newDocument.controlId} is pending CISO approval, but no user with that role was found.`, 'info');
    }

  }, [allCompanyData, currentCompanyId, addNotification]);
  
  const approvalOrder: { role: UserRole; status: DocumentStatus }[] = [
    { role: 'CISO', status: 'Pending CISO Approval' },
    { role: 'CTO', status: 'Pending CTO Approval' },
    { role: 'CIO', status: 'Pending CIO Approval' },
    { role: 'CEO', status: 'Pending CEO Approval' },
  ];

  const handleApprovalAction = (documentId: string, decision: 'Approved' | 'Rejected', comments?: string) => {
    if (!currentUser) return;

    const doc = documentRepository.find(d => d.id === documentId);
    if (!doc) return;
    
    const now = Date.now();
    const newHistory = [...doc.approvalHistory, { role: currentUser.role, decision, timestamp: now, comments }];

    let newStatus: DocumentStatus;
    
    if (decision === 'Rejected') {
        newStatus = 'Rejected';
        addAuditLog('DOCUMENT_REJECTED', `Document ${doc.controlId} was rejected. Comments: ${comments || 'N/A'}`, documentId);
    } else {
        const currentStepIndex = approvalOrder.findIndex(step => step.status === doc.status);
        if (currentStepIndex === -1 || approvalOrder[currentStepIndex].role !== currentUser.role) {
            return; 
        }
        const nextStepIndex = currentStepIndex + 1;
        newStatus = nextStepIndex < approvalOrder.length ? approvalOrder[nextStepIndex].status : 'Approved';
        addAuditLog('DOCUMENT_APPROVED', `Document ${doc.controlId} was approved at the ${currentUser.role} level. Comments: ${comments || 'N/A'}`, documentId);
    }
    
    setDocumentRepositoryForCurrentCompany(prevRepo =>
        prevRepo.map(d => 
            d.id === documentId 
                ? { ...d, status: newStatus, approvalHistory: newHistory, updatedAt: now } 
                : d
        )
    );

    // Handle notifications based on the new status
    if (newStatus === 'Rejected') {
        addNotification(`Document ${doc.controlId} has been rejected.`, 'info');
    } else if (newStatus === 'Approved') {
        addNotification(`Document ${doc.controlId} has been fully approved!`, 'success');
    } else if (newStatus.startsWith('Pending')) {
        const nextStepIndex = approvalOrder.findIndex(step => step.status === newStatus);
        if (nextStepIndex !== -1) {
            const nextApproverRole = approvalOrder[nextStepIndex].role;
            const nextApprovers = users.filter(u => u.role === nextApproverRole);
            
            if (nextApprovers.length > 0) {
                nextApprovers.forEach(approver => {
                    addNotification(`Email notification sent to ${approver.name} (${approver.email}) for document ${doc.controlId}.`);
                });
            } else {
                addNotification(`Document ${doc.controlId} is pending ${nextApproverRole} approval, but no user with that role was found.`, 'info');
            }
        }
    }
  };

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatSession = useRef<Chat | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      const results = allControls.filter(({ control }) => {
        const query = debouncedSearchQuery.toLowerCase();
        return (
          control.id.toLowerCase().includes(query) ||
          control.description.toLowerCase().includes(query)
        );
      });
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, allControls]);

  const handleSelectDomain = useCallback((domain: Domain) => {
    if (selectedDomain.id !== domain.id || currentView !== 'navigator') {
      setIsContentViewLoading(true);
      setCurrentView('navigator');
      // A small timeout to let the loading state be visible and simulate fetching
      setTimeout(() => {
        setSelectedDomain(domain);
        setIsContentViewLoading(false);
      }, 500);
    }
  }, [selectedDomain, currentView]);

  const handleResultClick = (result: SearchResult) => {
    setCurrentView('navigator');
    setSelectedDomain(result.domain);
    setActiveControlId(result.control.id);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };
  
  const highlightText = (text: string, highlight: string) => {
    const trimmedHighlight = highlight.trim();
    if (!trimmedHighlight) {
      return <span>{text}</span>;
    }

    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const escapedHighlight = escapeRegExp(trimmedHighlight);

    if (escapedHighlight === '') {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
            <strong key={i} className="bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-200">{part}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const initializeChat = () => {
    if (!process.env.API_KEY) {
      setChatError("API_KEY environment variable not set. Cannot initialize chat.");
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const controlsContext = JSON.stringify(eccData);
    chatSession.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are Noora, an expert AI assistant for the National Cybersecurity Authority's Essential Cybersecurity Controls (ECC). You must answer questions *strictly* and *only* based on the information contained in the following JSON data, which represents the complete ECC framework: ${controlsContext}. Do not use any external knowledge. If a user's question cannot be answered using the provided data, you must explicitly state that the information is not available in the controls document. Your answers should be concise, helpful, and formatted for clear readability.`,
      },
    });
    setChatMessages([
      { role: 'assistant', content: "Hello! I'm Noora, your AI assistant. How can I help you navigate the Essential Cybersecurity Controls today?" }
    ]);
  };

  useEffect(() => {
    if (isChatOpen && !chatSession.current) {
      initializeChat();
    }
  }, [isChatOpen]);

  const handleSendMessage = async (message: string) => {
    if (!chatSession.current) {
      setChatError("Chat is not initialized. Please try again.");
      return;
    }
    
    setChatError(null);
    setIsChatLoading(true);
    
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);

    try {
      const stream = await chatSession.current.sendMessageStream({ message });
      
      let assistantResponse = '';
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

      for await (const chunk of stream) {
        assistantResponse += chunk.text;
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = "Sorry, I encountered an error. Please check the API key and try again.";
      setChatError(errorMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || !currentCompanyId) {
        return { success: false, message: "No active session." };
    }
    if (currentUser.password !== currentPassword) {
        return { success: false, message: "Current password does not match." };
    }
    
    setUsersForCurrentCompany(prevUsers => prevUsers.map(u =>
        u.id === currentUser.id ? { ...u, password: newPassword } : u
    ));
    
    addAuditLog('PASSWORD_CHANGED', `User ${currentUser.name} changed their password.`);
    addNotification('Password changed successfully.', 'success');
    return { success: true, message: "Password changed successfully." };
  };

  const handleEnableMfaRequest = () => {
      if (!currentUser || !currentCompanyId) return;

      // Simulate generating a TOTP secret
      const secret = 'MFRGGZDFMZTWQ2LKNNWG23TPOBYXEYLTMUXWGY3MMUXGG33NM1TGGZBTMFRGY2DF'; // A sample base32 secret for demo
      
      setUsersForCurrentCompany(prevUsers => prevUsers.map(u =>
          u.id === currentUser.id ? { ...u, mfaSecret: secret, mfaEnabled: false } : u // set secret but not enabled yet
      ));
      
      const updatedUserForMfa = { ...currentUser, mfaSecret: secret, mfaEnabled: false };
      setMfaSetupUser(updatedUserForMfa);
      setCurrentView('mfaSetup');
  };

  const handleVerifyMfaSetup = async (userId: string, verificationCode: string): Promise<{ success: boolean; message?: string }> => {
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        return { success: false, message: 'Invalid code format. Please enter a 6-digit code.' };
      }
      // In a real app, you would verify the code against the secret. Here we simulate success for any 6-digit code.
      
      setUsersForCurrentCompany(prevUsers => prevUsers.map(u =>
          u.id === userId ? { ...u, mfaEnabled: true } : u
      ));
      
      addAuditLog('MFA_ENABLED', `User ${currentUser?.name} enabled MFA.`);
      addNotification('Multi-Factor Authentication enabled successfully!', 'success');
      
      // Exit MFA setup flow
      setMfaSetupUser(null);
      setCurrentView('userProfile');
      return { success: true };
  };

  const handleDisableMfa = async (password: string): Promise<{ success: boolean; message: string }> => {
      if (!currentUser || currentUser.password !== password) {
          return { success: false, message: 'Incorrect password.' };
      }
      
      setUsersForCurrentCompany(prevUsers => prevUsers.map(u =>
          u.id === currentUser.id ? { ...u, mfaEnabled: false, mfaSecret: undefined } : u
      ));

      addAuditLog('MFA_DISABLED', `User ${currentUser.name} disabled MFA.`);
      addNotification('Multi-Factor Authentication has been disabled.', 'success');
      return { success: true, message: 'MFA disabled.' };
  };


  const renderMainContent = () => {
    if (!currentCompany && currentView !== 'companyProfile') {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Welcome!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Please set up your company profile to begin.</p>
                <button
                    onClick={() => setCurrentView('companyProfile')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                >
                    Go to Profile Setup
                </button>
            </div>
        );
    }

    switch (currentView) {
      case 'dashboard':
        return currentUserPermissions.has('dashboard:read') ? (
          <DashboardPage
            repository={documentRepository}
            currentUser={currentUser!}
            allControls={allControls}
            domains={eccData}
            onSetView={setCurrentView as any}
          />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the dashboard.</p>;
      case 'assessment':
        return currentUserPermissions.has('assessment:read') ? (
            <AssessmentPage 
              assessmentData={eccAssessment}
              onUpdateItem={(controlCode, updatedItem) => handleUpdateAssessmentItem('ecc', controlCode, updatedItem)}
              status={assessmentStatuses.ecc as 'idle' | 'in-progress'}
              onInitiate={() => handleInitiateAssessment('ecc')}
              onComplete={() => handleCompleteAssessment('ecc')}
              permissions={currentUserPermissions}
            />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the assessment.</p>;
      case 'pdplAssessment':
        return currentUserPermissions.has('pdplAssessment:read') ? (
            <PDPLAssessmentPage 
              assessmentData={pdplAssessment}
              onUpdateItem={(controlCode, updatedItem) => handleUpdateAssessmentItem('pdpl', controlCode, updatedItem)}
              status={assessmentStatuses.pdpl as 'idle' | 'in-progress'}
              onInitiate={() => handleInitiateAssessment('pdpl')}
              onComplete={() => handleCompleteAssessment('pdpl')}
              permissions={currentUserPermissions}
            />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the PDPL assessment.</p>;
      case 'samaCsfAssessment':
        return currentUserPermissions.has('samaCsfAssessment:read') ? (
            <SamaCsfAssessmentPage 
              assessmentData={samaCsfAssessment}
              onUpdateItem={(controlCode, updatedItem) => handleUpdateAssessmentItem('sama', controlCode, updatedItem)}
              status={assessmentStatuses.sama as 'idle' | 'in-progress'}
              onInitiate={() => handleInitiateAssessment('sama')}
              onComplete={() => handleCompleteAssessment('sama')}
              permissions={currentUserPermissions}
            />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the SAMA CSF assessment.</p>;
      case 'navigator':
        return currentUserPermissions.has('navigator:read') ? (
          isContentViewLoading ? <ContentViewSkeleton /> :
          <ContentView
            domain={selectedDomain}
            activeControlId={activeControlId}
            setActiveControlId={setActiveControlId}
            onAddDocument={handleAddDocumentToRepo}
            documentRepository={documentRepository}
            permissions={currentUserPermissions}
          />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the controls navigator.</p>;
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
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view document management.</p>;
      case 'users':
        return currentUserPermissions.has('users:read') ? (
          <UserManagementPage
            users={users}
            setUsers={setUsersForCurrentCompany}
            currentUser={currentUser!}
            addNotification={addNotification}
            addAuditLog={addAuditLog}
          />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to manage users.</p>;
      case 'companyProfile':
        return currentUserPermissions.has('company:read') ? (
            <CompanyProfilePage
                company={currentCompany}
                onSave={handleSaveCompanyProfile}
                canEdit={!currentCompany || currentUserPermissions.has('company:update')}
                addNotification={addNotification}
            />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the company profile.</p>;
      case 'userProfile':
        return currentUserPermissions.has('userProfile:read') ? (
            <UserProfilePage
                currentUser={currentUser!}
                onChangePassword={handleChangePassword}
                onEnableMfa={handleEnableMfaRequest}
                onDisableMfa={handleDisableMfa}
            />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view your profile.</p>;
      case 'auditLog':
        return currentUserPermissions.has('audit:read') ? (
            <AuditLogPage auditLog={auditLog} />
        ) : <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">You do not have permission to view the audit log.</p>;
      default:
        return null;
    }
  };
  
  const handleLogin = async (email: string, password: string): Promise<{error: string, code?: string} | null> => {
    for (const company of companies) {
        const companyData = allCompanyData[company.id];
        if (companyData) {
            const user = companyData.users.find(u => u.email === email && u.password === password);
            if (user) {
                if (user.accessExpiresAt && user.accessExpiresAt < Date.now()) {
                    return { error: "Your access has expired. Please contact an administrator." };
                }
                if (!user.isVerified) {
                    return { error: "Your account is not verified. Please check your email for a verification link.", code: 'unverified' };
                }

                setSession({ user, companyId: company.id });
                addAuditLog('USER_LOGIN', `User ${user.name} logged in.`);
                
                return null;
            }
        }
    }
    return { error: "Invalid email or password." };
  };

  const handleVerifyUser = (email: string): boolean => {
    let userFoundAndVerified = false;
    let companyIdOfUser: string | null = null;
    let userToVerify: User | null = null;

    for (const company of companies) {
        const companyData = allCompanyData[company.id];
        if (companyData) {
            const user = companyData.users.find(u => u.email === email && !u.isVerified);
            if (user) {
                companyIdOfUser = company.id;
                userToVerify = user;
                break;
            }
        }
    }

    if (companyIdOfUser && userToVerify) {
        setAllCompanyData(prevData => {
            const newCompanyData = {
                ...prevData[companyIdOfUser!],
                users: prevData[companyIdOfUser!].users.map(u => 
                    u.id === userToVerify!.id ? { ...u, isVerified: true } : u
                )
            };
            return {
                ...prevData,
                [companyIdOfUser!]: newCompanyData
            };
        });
        userFoundAndVerified = true;
    }

    if (userFoundAndVerified) {
        addNotification(`Email ${email} verified successfully. You can now log in.`, 'success');
    }
    
    return userFoundAndVerified;
  };

  const handleForgotPasswordRequest = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
    let userToUpdate: User | null = null;
    let companyIdOfUser: string | null = null;

    for (const company of companies) {
        const companyData = allCompanyData[company.id];
        if (companyData) {
            const user = companyData.users.find(u => u.email === email);
            if (user) {
                userToUpdate = user;
                companyIdOfUser = company.id;
                break;
            }
        }
    }

    if (!userToUpdate || !companyIdOfUser) {
        return { success: true, message: "If an account with that email exists, password reset instructions have been sent." };
    }

    const resetToken = crypto.randomUUID();
    const expires = Date.now() + 3600000; // 1 hour

    const tempSessionForAudit = { user: userToUpdate, companyId: companyIdOfUser };
    const addAuditLogForReset = (action: AuditAction, details: string, targetId?: string) => {
        const newLogEntry: AuditLogEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: Date.now(),
            userId: tempSessionForAudit.user.id,
            userName: tempSessionForAudit.user.name,
            action,
            details,
            targetId
        };
        setAllCompanyData(prevData => {
            const currentData = prevData[companyIdOfUser!] || { users: [], documents: [], auditLog: [] };
            const newAuditLog = [newLogEntry, ...(currentData.auditLog || [])];
            const updatedUsers = currentData.users.map(u => u.id === userToUpdate!.id ? { ...u, passwordResetToken: resetToken, passwordResetExpires: expires } : u);
            return {
                ...prevData,
                [companyIdOfUser!]: { ...currentData, users: updatedUsers, auditLog: newAuditLog }
            };
        });
    };
    
    addAuditLogForReset('PASSWORD_RESET_REQUESTED', `Password reset requested for user ${userToUpdate.name}.`, userToUpdate.id);

    return { 
        success: true, 
        message: `For this demo, your password reset token is provided below. In a real application, this would be sent to your email.`,
        token: resetToken 
    };
};

const handleResetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    let userToUpdate: User | null = null;
    let companyIdOfUser: string | null = null;

    for (const company of companies) {
        const companyData = allCompanyData[company.id];
        if (companyData) {
            const user = companyData.users.find(u => u.passwordResetToken === token);
            if (user) {
                userToUpdate = user;
                companyIdOfUser = company.id;
                break;
            }
        }
    }

    if (!userToUpdate || !companyIdOfUser) {
        return { success: false, message: "Invalid or expired password reset token." };
    }

    if (userToUpdate.passwordResetExpires && userToUpdate.passwordResetExpires < Date.now()) {
        return { success: false, message: "Invalid or expired password reset token." };
    }

    const tempSessionForAudit = { user: userToUpdate, companyId: companyIdOfUser };
    const addAuditLogForCompletion = (action: AuditAction, details: string, targetId?: string) => {
        const newLogEntry: AuditLogEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: Date.now(),
            userId: tempSessionForAudit.user.id,
            userName: tempSessionForAudit.user.name,
            action,
            details,
            targetId
        };
         setAllCompanyData(prevData => {
            const currentData = prevData[companyIdOfUser!] || { users: [], documents: [], auditLog: [] };
            const newAuditLog = [newLogEntry, ...(currentData.auditLog || [])];
            const updatedUsers = currentData.users.map(u => u.id === userToUpdate!.id ? { ...u, password: newPassword, passwordResetToken: undefined, passwordResetExpires: undefined } : u);
            return {
                ...prevData,
                [companyIdOfUser!]: { ...currentData, users: updatedUsers, auditLog: newAuditLog }
            };
        });
    };

    addAuditLogForCompletion('PASSWORD_RESET_COMPLETED', `Password reset completed for user ${userToUpdate.name}.`, userToUpdate.id);
    addNotification(`Password for ${userToUpdate.email} has been reset successfully.`, 'success');

    return { success: true, message: "Password has been reset successfully. You can now sign in." };
};
  
  const handleLogout = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if(session) {
      addAuditLog('USER_LOGOUT', `User ${session.user.name} logged out.`);
    }
    setIsIdleWarningVisible(false);
    setSession(null);
    setViewForNoSession('login');
  }, [session, addAuditLog]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const handleSwitchUser = (userId: string) => {
    if (!currentCompanyId) return;
    const companyUsers = allCompanyData[currentCompanyId].users;
    const newUser = companyUsers.find(u => u.id === userId);
    if (newUser) {
        // Switching users should also log out and force re-authentication for security
        handleLogout();
    }
    setIsUserMenuOpen(false);
  };
  
  // --- Inactivity Logic ---

  const resetIdleTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    warningTimerRef.current = window.setTimeout(() => {
        setIsIdleWarningVisible(true);
    }, IDLE_TIMEOUT_MS - WARNING_DURATION_MS);

    logoutTimerRef.current = window.setTimeout(() => {
        handleLogout();
    }, IDLE_TIMEOUT_MS);
  }, [handleLogout]);

  const handleStayLoggedIn = () => {
      setIsIdleWarningVisible(false);
      resetIdleTimers();
  };

  useEffect(() => {
    if (session) {
        const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
        const reset = () => {
            if (!isIdleWarningVisible) {
                resetIdleTimers();
            }
        };
        
        activityEvents.forEach(event => window.addEventListener(event, reset));
        resetIdleTimers(); // Start the timer initially

        return () => {
            activityEvents.forEach(event => window.removeEventListener(event, reset));
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }
  }, [session, resetIdleTimers, isIdleWarningVisible]);

  // Countdown timer for the warning modal
  useEffect(() => {
      let interval: number | undefined;
      if (isIdleWarningVisible) {
          setCountdown(WARNING_DURATION_MS / 1000); // Reset countdown
          interval = window.setInterval(() => {
              setCountdown(prev => (prev > 0 ? prev - 1 : 0));
          }, 1000);
      }
      return () => {
          if (interval) clearInterval(interval);
      };
  }, [isIdleWarningVisible]);
  
  // --- End Inactivity Logic ---


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  if (!session) {
    if (viewForNoSession === 'setup') {
      return <CompanySetupPage onSetup={handleCompanySetup} onCancel={() => setViewForNoSession('login')} theme={theme} toggleTheme={toggleTheme} />;
    }
    return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} onSetupCompany={() => setViewForNoSession('setup')} onVerify={handleVerifyUser} onForgotPassword={handleForgotPasswordRequest} onResetPassword={handleResetPassword} />;
  }
  
  if (currentView === 'mfaSetup' && mfaSetupUser && currentCompany) {
      return <MfaSetupPage
                user={mfaSetupUser}
                companyName={currentCompany.name}
                onVerified={handleVerifyMfaSetup}
                onCancel={() => {
                    setMfaSetupUser(null);
                    setCurrentView('userProfile');
                }}
                theme={theme}
                toggleTheme={toggleTheme}
             />;
  }

  const activeUsers = users.filter(u => !(u.accessExpiresAt && u.accessExpiresAt < Date.now()));

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <LogoIcon className="h-12 w-12 text-teal-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentCompany?.name || 'Cybersecurity Controls'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Essential Cybersecurity Controls (ECC) Navigator</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative w-full max-w-md hidden sm:block">
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      placeholder="Search controls..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)} // Delay to allow click
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
              </div>
              {isSearchFocused && searchResults.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 overflow-auto focus:outline-none sm:text-sm">
                      {searchResults.map((result) => (
                          <li
                              key={result.control.id}
                              className="cursor-default select-none relative py-2 pl-3 pr-4 text-gray-900 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 flex items-center justify-between"
                          >
                              <div className="flex flex-col flex-1 min-w-0">
                                  <span className="font-semibold font-mono text-teal-700 dark:text-teal-400">
                                      {result.control.id}
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                      {highlightText(result.control.description, debouncedSearchQuery)}
                                  </span>
                                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      {result.domain.name} &gt; {result.subdomain.title}
                                  </span>
                              </div>
                              <button
                                  onMouseDown={() => handleResultClick(result)}
                                  className="ml-4 flex-shrink-0 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                  aria-label={`View details for control ${result.control.id}`}
                              >
                                  View
                                  <ArrowUpRightIcon className="w-4 h-4 ml-1.5" />
                              </button>
                          </li>
                      ))}
                  </ul>
              )}
          </div>
           {!isStandalone && (
              <button
                onClick={handleInstallClick}
                disabled={!installPrompt}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Install to Desktop"
                title={installPrompt ? 'Install to Desktop' : 'Installation is not available at this time'}
              >
                <DownloadIcon className="w-6 h-6" />
              </button>
           )}
           {currentUser && (
            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                      <UserCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 hidden sm:inline">{currentUser.name}</span>
                      <ChevronDownIcon className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 z-30">
                        <div className="p-2">
                            <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{currentUser.email}</p>
                            </div>
                            <div className="py-2">
                                <p className="px-2 pb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Switch User (Requires re-login)</p>
                                {activeUsers.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleSwitchUser(user.id)}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center ${
                                            user.id === currentUser.id
                                            ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-200'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {user.name} ({user.role})
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <LogoutIcon className="w-5 h-5 mr-2" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
           )}
          <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6" />
              )}
            </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {isLicensed || (currentView === 'companyProfile' && currentUserPermissions.has('company:update')) ? (
          <>
            <Sidebar
              domains={eccData}
              selectedDomain={selectedDomain}
              onSelectDomain={handleSelectDomain}
              currentView={currentView}
              onSetView={setCurrentView}
              permissions={currentUserPermissions}
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {renderMainContent()}
            </main>
          </>
        ) : (
          <LicenseWall currentUser={currentUser} onGoToProfile={() => setCurrentView('companyProfile')} permissions={currentUserPermissions} />
        )}
      </div>
      {/* Inactivity Warning Modal */}
      {isIdleWarningVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-[200] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Are you still there?</h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                      For your security, you will be automatically logged out due to inactivity in...
                  </p>
                  <div className="my-6 text-6xl font-bold text-teal-600 dark:text-teal-400">
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex justify-center gap-4">
                      <button
                          onClick={handleLogout}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                          Sign Out
                      </button>
                      <button
                          onClick={handleStayLoggedIn}
                          className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                          Stay Signed In
                      </button>
                  </div>
              </div>
          </div>
      )}
      {/* Notification Container */}
      <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
              {notifications.map((notification) => (
                  <div
                      key={notification.id}
                      className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 overflow-hidden"
                  >
                      <div className="p-4">
                          <div className="flex items-start">
                              <div className="flex-shrink-0">
                                  {notification.type === 'success' ? (
                                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                                  ) : (
                                      <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                                  )}
                              </div>
                              <div className="ml-3 w-0 flex-1 pt-0.5">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      Notification
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                      {notification.message}
                                  </p>
                              </div>
                              <div className="ml-4 flex-shrink-0 flex">
                                  <button
                                      type="button"
                                      className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                      onClick={() => removeNotification(notification.id)}
                                  >
                                      <span className="sr-only">Close</span>
                                      <CloseIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
       <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        error={chatError}
      />
    </div>
  );
};

export default App;