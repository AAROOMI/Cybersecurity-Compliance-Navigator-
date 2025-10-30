

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import { ContentViewSkeleton } from './components/ContentViewSkeleton';
import { LiveAssistantWidget } from './components/LiveAssistantWidget';
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
import { CMAAssessmentPage } from './components/CMAAssessmentPage';
import { UserProfilePage } from './components/UserProfilePage';
import { HelpSupportPage } from './components/HelpSupportPage';
import { TrainingPage } from './components/TrainingPage';
import { RiskAssessmentPage } from './components/RiskAssessmentPage';
import { ComplianceAgentPage } from './components/ComplianceAgentPage';
import { TourGuide } from './components/TourGuide';
import { LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, UserCircleIcon, CheckCircleIcon, InformationCircleIcon, CloseIcon, ChevronDownIcon, LogoutIcon, LockClosedIcon, DownloadIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from './components/Icons';
import { eccData } from './data/controls';
import { assessmentData as initialAssessmentData } from './data/assessmentData';
import { initialPdplAssessmentData } from './data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from './data/samaCsfAssessmentData';
import { cmaAssessmentData as initialCmaAssessmentData } from './data/cmaAssessmentData';
import { trainingCourses } from './data/trainingData';
import type { Domain, Control, Subdomain, SearchResult, ChatMessage, PolicyDocument, UserRole, DocumentStatus, User, CompanyProfile, AuditLogEntry, AuditAction, License, AssessmentItem, UserTrainingProgress, Task, AgentLogEntry, ComplianceGap } from './types';
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
  cmaAssessment?: AssessmentItem[];
  assessmentStatuses?: AssessmentStatuses;
  trainingProgress?: UserTrainingProgress;
  tasks?: Task[];
  agentLog?: AgentLogEntry[];
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
    cma: 'idle' | 'in-progress';
}

// --- Inactivity Timeout Constants ---
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_DURATION_MS = 1 * 60 * 1000; // 1 minute

const tourSteps = [
  {
    target: 'body', // special case for centered modal
    title: 'Welcome to the Guided Tour!',
    content: "Let's take a quick walk-through of the key features of the Cybersecurity Controls Navigator. Click \"Next\" to begin.",
  },
  {
    target: '#sidebar-dashboard',
    title: 'The Dashboard',
    content: 'This is your mission control. It provides a high-level overview of your compliance posture, recent activities, and pending tasks.',
    position: 'right',
  },
  {
    target: '#sidebar-navigator-header',
    title: 'Control Navigator',
    content: 'Here you can browse the entire NCA ECC framework, domain by domain. Click on a domain to explore its subdomains and controls in detail.',
    position: 'right',
  },
  {
    target: '#header-search-input',
    title: 'Universal Search',
    content: 'Quickly find any control by its ID or description. The search is fast and will take you directly to the relevant control.',
    position: 'bottom',
  },
  {
    target: '#sidebar-documents',
    title: 'Document Management',
    content: 'This is where all generated policy documents are stored. You can manage their approval lifecycle, view history, and export them.',
    position: 'right',
  },
  {
    target: '#sidebar-assessment',
    title: 'Compliance Assessments',
    content: 'Conduct detailed assessments against various frameworks like NCA ECC, PDPL, and SAMA CSF. You can track status, provide evidence, and generate reports.',
    position: 'right',
  },
  {
    target: '#sidebar-complianceAgent',
    title: 'The Compliance Agent',
    content: 'Meet Noora, your AI agent. She can automatically analyze your assessments for gaps and generate the necessary documentation for you.',
    position: 'right',
  },
  {
    target: '#live-assistant-widget-button',
    title: 'Live Voice Assistant',
    content: "Need help navigating or want to perform an assessment hands-free? Click here to start a voice conversation with our Gemini-powered assistant.",
    position: 'top',
  },
  {
    target: 'body',
    title: 'Tour Complete!',
    content: "You've seen the main features. You can restart this tour anytime from the Help & Support page. Now you're ready to take control of your compliance!",
  }
];


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

type View = 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment' | 'userProfile' | 'mfaSetup' | 'help' | 'training' | 'complianceAgent' | 'riskAssessment';


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
  const [currentView, setCurrentView] = useState<View>('dashboard');

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
  const [mfaUserToVerify, setMfaUserToVerify] = useState<User | null>(null);
  
  // Live Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // Assessment confirmation modal state
  const [showInitiateConfirmModal, setShowInitiateConfirmModal] = useState<keyof AssessmentStatuses | null>(null);

  // AI Guide Tour state
  const [isTourOpen, setIsTourOpen] = useState(false);


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
  const cmaAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.cmaAssessment || initialCmaAssessmentData, [allCompanyData, currentCompanyId]);
  const assessmentStatuses = useMemo(() => allCompanyData[currentCompanyId || '']?.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle' }, [allCompanyData, currentCompanyId]);
  const trainingProgress = useMemo(() => allCompanyData[currentCompanyId || '']?.trainingProgress || {}, [allCompanyData, currentCompanyId]);
  const tasks = useMemo(() => allCompanyData[currentCompanyId || '']?.tasks || [], [allCompanyData, currentCompanyId]);
  const agentLog = useMemo(() => allCompanyData[currentCompanyId || '']?.agentLog || [], [allCompanyData, currentCompanyId]);


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
          const currentData = prevData[companyIdForLog] || { users: [], documents: [], auditLog: [], tasks: [], agentLog: [] };
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
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [], agentLog: [] };
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
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [], agentLog: [] };
      const newDocuments = typeof updater === 'function' ? updater(currentData.documents) : updater;
      return {
        ...prevData,
        [currentCompanyId]: { ...currentData, documents: newDocuments }
      };
    });
  };

    const setTasksForCurrentCompany = (updater: React.SetStateAction<Task[]>) => {
        if (!currentCompanyId) return;
        setAllCompanyData(prevData => {
            const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [], agentLog: [] };
            const newTasks = typeof updater === 'function' ? updater(currentData.tasks || []) : updater;
            return {
                ...prevData,
                [currentCompanyId]: { ...currentData, tasks: newTasks }
            };
        });
    };

    const setAgentLogForCurrentCompany = (updater: React.SetStateAction<AgentLogEntry[]>) => {
        if (!currentCompanyId) return;
        setAllCompanyData(prevData => {
            const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [], agentLog: [] };
            const newLog = typeof updater === 'function' ? updater(currentData.agentLog || []) : updater;
            return {
                ...prevData,
                [currentCompanyId]: { ...currentData, agentLog: newLog }
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
                cmaAssessment: initialCmaAssessmentData,
                assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle' },
                trainingProgress: {},
                tasks: [],
                agentLog: [],
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
                const parsedData = data ? JSON.parse(data) : { users: [], documents: [], auditLog: [], tasks: [], agentLog: [] };
                // Ensure assessment data is present
                loadedCompanyData[company.id] = {
                    ...parsedData,
                    eccAssessment: parsedData.eccAssessment || initialAssessmentData,
                    pdplAssessment: parsedData.pdplAssessment || initialPdplAssessmentData,
                    samaCsfAssessment: parsedData.samaCsfAssessment || initialSamaCsfAssessmentData,
                    cmaAssessment: parsedData.cmaAssessment || initialCmaAssessmentData,
                    assessmentStatuses: parsedData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle' },
                    trainingProgress: parsedData.trainingProgress || {},
                    tasks: parsedData.tasks || [],
                    agentLog: parsedData.agentLog || [],
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
        if (!currentCompanyId) return;
        setShowInitiateConfirmModal(type);
    };

    const executeInitiateAssessment = (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        setShowInitiateConfirmModal(null);

        let sourceData: AssessmentItem[];
        switch (type) {
            case 'ecc': sourceData = initialAssessmentData; break;
            case 'pdpl': sourceData = initialPdplAssessmentData; break;
            case 'sama': sourceData = initialSamaCsfAssessmentData; break;
            case 'cma': sourceData = initialCmaAssessmentData; break;
            default: return;
        }

        // Create a fresh copy of the data to avoid mutating the original source
        const resetData = JSON.parse(JSON.stringify(sourceData)).map((item: AssessmentItem) => ({
            ...item,
            currentStatusDescription: '',
            controlStatus: 'Not Implemented' as 'Not Implemented',
            recommendation: '',
            managementResponse: '',
            targetDate: ''
        }));
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId!];
            if (!currentData) return prev;
            const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : type === 'sama' ? 'samaCsfAssessment' : 'cmaAssessment';
            return {
                ...prev,
                [currentCompanyId!]: {
                    ...currentData,
                    [key]: resetData,
                    assessmentStatuses: { ...(currentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle' }), [type]: 'in-progress' }
                }
            };
        });
        addNotification(`${type.toUpperCase()} assessment has been initiated.`, 'success');
    };

    const handleCompleteAssessment = async (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;

        const currentData = allCompanyData[currentCompanyId];
        if (!currentData) return;

        const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : type === 'sama' ? 'samaCsfAssessment' : 'cmaAssessment';
        const assessmentToReport = currentData[key];
        const assessmentName = type.toUpperCase();

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY not set");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are an expert cybersecurity auditor. Based on the following JSON data from a ${assessmentName} assessment, generate a formal executive summary report in Markdown format.
            The report must include:
            1. An 'Overall Summary' section with the total number of controls, the number implemented, partially implemented, and not implemented, and the overall compliance percentage (calculated from implemented controls out of all applicable controls).
            2. A 'Key Findings' section highlighting up to 5 of the most critical 'Not Implemented' or 'Partially Implemented' controls.
            3. A 'Compliance by Domain' section, listing each domain and its specific status or compliance percentage.
            4. A 'Recommendations Summary' section with a high-level summary of the next steps suggested in the assessment recommendations.
            The tone should be professional and formal.
            Here is the assessment data: ${JSON.stringify(assessmentToReport)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const reportContent = response.text;
            const now = Date.now();
            const reportDocument: PolicyDocument = {
                id: `report-${type}-${now}`,
                controlId: `REPORT-${assessmentName}`,
                domainName: "Assessment Reports",
                subdomainTitle: `${assessmentName} Assessment Report`,
                controlDescription: `Executive summary report generated on ${new Date(now).toLocaleDateString()}.`,
                status: 'Approved',
                content: { policy: reportContent, procedure: '', guideline: '' },
                approvalHistory: [],
                createdAt: now,
                updatedAt: now,
            };

            setDocumentRepositoryForCurrentCompany(prevRepo => [reportDocument, ...prevRepo]);
            addNotification(`${assessmentName} assessment report generated and saved to Document Management.`, 'success');

        } catch (e) {
            console.error("Failed to generate assessment report:", e);
            addNotification("Failed to generate assessment report. Please check the API key and try again.", 'info');
        }

        setAllCompanyData(prev => {
            const updatedCurrentData = prev[currentCompanyId];
            if (!updatedCurrentData) return prev;
            return {
                ...prev,
                [currentCompanyId]: {
                    ...updatedCurrentData,
                    assessmentStatuses: { ...(updatedCurrentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle' }), [type]: 'idle' }
                }
            };
        });
    };

    const handleUpdateAssessmentItem = (type: keyof AssessmentStatuses, controlCode: string, updatedItem: AssessmentItem) => {
        if (!currentCompanyId) return;
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId];
            const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : type === 'sama' ? 'samaCsfAssessment' : 'cmaAssessment';
            const currentAssessmentData = currentData[key] || [];

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
    
    const handleUpdateTrainingProgress = (courseId: string, lessonId: string, score?: number) => {
        if (!currentCompanyId) return;
        
        setAllCompanyData(prev => {
            const companyData = prev[currentCompanyId];
            if (!companyData) return prev;

            const progress = companyData.trainingProgress || {};
            const courseProgress = progress[courseId] || { completedLessons: [], badgeEarned: false, badgeId: '' };

            if (!courseProgress.completedLessons.includes(lessonId)) {
                courseProgress.completedLessons.push(lessonId);
            }
            
            // Check for badge
            const course = trainingCourses.find(c => c.id === courseId);
            if (course && course.lessons.every(l => courseProgress.completedLessons.includes(l.id))) {
                if (!courseProgress.badgeEarned) {
                     addNotification(`Congratulations! You've earned the ${course.title} badge!`, 'success');
                }
                courseProgress.badgeEarned = true;
                courseProgress.badgeId = course.badgeId;
            }

            return {
                ...prev,
                [currentCompanyId]: {
                    ...companyData,
                    trainingProgress: {
                        ...progress,
                        [courseId]: courseProgress,
                    }
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
              cmaAssessment: initialCmaAssessmentData,
              assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle' },
              trainingProgress: {},
              tasks: [],
              agentLog: [],
            },
        }));

        setViewForNoSession('login');
        addNotification('Company and administrator account created successfully! You can now log in.', 'success');
    };

  const handleSaveCompanyProfile = (profile: CompanyProfile) => {
      const existing = companies.find(c => c.id === profile.id);
      
      if (existing) {
          // License change logging
          if (JSON.stringify(existing.license) !== JSON.stringify(profile.license) && profile.license) {
               addAuditLog('LICENSE_UPDATED', `Company license updated to ${profile.license.tier} plan, expires ${new Date(profile.license.expiresAt).toLocaleDateString()}`, profile.id);
          } 
          
          // Profile fields change logging
          const changes: string[] = [];
          if (existing.name !== profile.name) changes.push(`Name changed to "${profile.name}"`);
          if (existing.ceoName !== profile.ceoName) changes.push(`CEO Name changed to "${profile.ceoName}"`);
          if (existing.cioName !== profile.cioName) changes.push(`CIO Name changed to "${profile.cioName}"`);
          if (existing.cisoName !== profile.cisoName) changes.push(`CISO Name changed to "${profile.cisoName}"`);
          if (existing.ctoName !== profile.ctoName) changes.push(`CTO Name changed to "${profile.ctoName}"`);
          if (existing.logo !== profile.logo) changes.push(`Company logo was updated`);
  
          if (changes.length > 0) {
              addAuditLog('COMPANY_PROFILE_UPDATED', `Company profile updated: ${changes.join('; ')}.`, profile.id);
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

    // --- Compliance Agent Handlers ---
    const addAgentLogEntry = (message: string, status: AgentLogEntry['status']) => {
        const newEntry: AgentLogEntry = {
            id: `agent-log-${Date.now()}`,
            timestamp: Date.now(),
            message,
            status,
        };
        setAgentLogForCurrentCompany(prev => [newEntry, ...prev]);
    };

    const handleRunAnalysis = (): ComplianceGap[] => {
        addAgentLogEntry("Starting compliance gap analysis...", 'working');
        const allAssessments: { framework: string, data: AssessmentItem[] }[] = [
            { framework: 'NCA ECC', data: eccAssessment },
            { framework: 'PDPL', data: pdplAssessment },
            { framework: 'SAMA CSF', data: samaCsfAssessment },
        ];
        
        const gaps: ComplianceGap[] = [];
        const documentedControlIds = new Set(documentRepository.map(doc => doc.controlId));

        for (const assessment of allAssessments) {
            if (assessment.data) {
                for (const item of assessment.data) {
                    if ((item.controlStatus === 'Not Implemented' || item.controlStatus === 'Partially Implemented') && !documentedControlIds.has(item.controlCode)) {
                        gaps.push({
                            controlCode: item.controlCode,
                            controlName: item.controlName,
                            domainName: item.domainName,
                            assessedStatus: item.controlStatus,
                            framework: assessment.framework,
                        });
                    }
                }
            }
        }
        
        addAgentLogEntry(`Analysis complete. Found ${gaps.length} compliance gaps.`, gaps.length > 0 ? 'info' : 'success');
        return gaps;
    };

    const handleGenerateDocuments = async (gaps: ComplianceGap[]) => {
        addAgentLogEntry(`Starting document generation for ${gaps.length} gaps...`, 'working');
        if (!process.env.API_KEY) {
            addAgentLogEntry("API_KEY not set. Cannot generate documents.", 'error');
            return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        for (const gap of gaps) {
            addAgentLogEntry(`Generating document for control ${gap.controlCode}...`, 'working');
            try {
                const prompt = `
                You are an expert cybersecurity policy writer. Generate compliance documentation for a control identified as a gap.
                - **Framework:** ${gap.framework}
                - **Domain:** ${gap.domainName}
                - **Control ID:** ${gap.controlCode}
                - **Control Description:** ${gap.controlName}
                - **Assessed Status:** ${gap.assessedStatus}

                Generate three documents: Policy, Procedure, and Guideline, based on the control description. Return a single valid JSON object with keys "policy", "procedure", and "guideline", with Markdown-formatted strings as values.
                `;

                const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        policy: { type: Type.STRING },
                        procedure: { type: Type.STRING },
                        guideline: { type: Type.STRING }
                    },
                    required: ["policy", "procedure", "guideline"]
                    }
                }
                });
                
                const generatedContent = JSON.parse(response.text);

                const now = Date.now();
                const newDocument: PolicyDocument = {
                id: `policy-${gap.controlCode}-${now}`,
                controlId: gap.controlCode,
                domainName: gap.domainName,
                subdomainTitle: `${gap.framework} Framework`, // Generic subdomain
                controlDescription: gap.controlName,
                status: 'Pending CISO Approval',
                content: generatedContent,
                approvalHistory: [],
                createdAt: now,
                updatedAt: now,
                generatedBy: 'AI Agent'
                };
                
                setDocumentRepositoryForCurrentCompany(prevRepo => [newDocument, ...prevRepo]);
                addAgentLogEntry(`Successfully generated and saved document for ${gap.controlCode}.`, 'success');

            } catch(e) {
                console.error(e);
                addAgentLogEntry(`Failed to generate document for ${gap.controlCode}.`, 'error');
            }
        }
        addAgentLogEntry("Document generation process complete.", 'success');
    };


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

  // --- LOGIN & SESSION HANDLERS ---
    const handleLogout = useCallback(() => {
        if (session) {
            addAuditLog('USER_LOGOUT', `User ${session.user.name} logged out.`);
        }
        setSession(null);
        setCurrentView('dashboard');
        setMfaUserToVerify(null);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        setIsIdleWarningVisible(false);
    }, [session, addAuditLog]);

    const handleLogin = async (email: string, password: string): Promise<{error: string, code?: string} | null> => {
        const companyId = companies.find(c => allCompanyData[c.id]?.users.some(u => u.email.toLowerCase() === email.toLowerCase()))?.id;
        if (!companyId) {
            return { error: "Invalid email or password." };
        }
        
        const companyUsers = allCompanyData[companyId].users;
        const user = companyUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user || user.password !== password) {
            return { error: "Invalid email or password." };
        }
        
        if (!user.isVerified) {
            return { error: "Your account is not verified. A new verification email has been sent.", code: 'unverified' };
        }
        
        if (user.mfaEnabled) {
            setMfaUserToVerify(user);
            return null;
        }

        setSession({ user, companyId });
        addAuditLog('USER_LOGIN', `User ${user.name} logged in successfully.`);
        setCurrentView('dashboard');
        return null;
    };

    const handleVerifyUser = (email: string): boolean => {
        const companyId = companies.find(c => allCompanyData[c.id]?.users.some(u => u.email.toLowerCase() === email.toLowerCase()))?.id;
        if (companyId) {
            setAllCompanyData(prev => {
                const companyData = prev[companyId];
                const updatedUsers = companyData.users.map(u => 
                    u.email.toLowerCase() === email.toLowerCase() ? { ...u, isVerified: true } : u
                );
                return { ...prev, [companyId]: { ...companyData, users: updatedUsers } };
            });
            addNotification('Email verified successfully! You can now log in.', 'success');
            return true;
        }
        return false;
    };

    // --- FORGOT/RESET PASSWORD HANDLERS ---
    const handleForgotPassword = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
        const companyId = companies.find(c => allCompanyData[c.id]?.users.some(u => u.email.toLowerCase() === email.toLowerCase()))?.id;
        if (!companyId) {
            return { success: false, message: "No account found with that email address." };
        }

        const token = `reset-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const expires = Date.now() + 3600000; // 1 hour

        setAllCompanyData(prev => {
            const companyData = prev[companyId];
            const updatedUsers = companyData.users.map(u => 
                u.email.toLowerCase() === email.toLowerCase() ? { ...u, passwordResetToken: token, passwordResetExpires: expires } : u
            );
            return { ...prev, [companyId]: { ...companyData, users: updatedUsers } };
        });

        addAuditLog('PASSWORD_RESET_REQUESTED', `Password reset requested for ${email}.`);
        
        return { success: true, message: "A password reset token has been generated. In a real app, this would be emailed to you. Please copy the token below to proceed.", token };
    };

    const handleResetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        const companyId = companies.find(c => allCompanyData[c.id]?.users.some(u => u.passwordResetToken === token))?.id;
        if (!companyId) {
            return { success: false, message: "Invalid or expired reset token." };
        }
        
        const user = allCompanyData[companyId].users.find(u => u.passwordResetToken === token);
        
        if (!user || (user.passwordResetExpires && user.passwordResetExpires < Date.now())) {
            return { success: false, message: "Invalid or expired reset token." };
        }

        setAllCompanyData(prev => {
            const companyData = prev[companyId];
            const updatedUsers = companyData.users.map(u => 
                u.id === user.id ? { ...u, password: newPassword, passwordResetToken: undefined, passwordResetExpires: undefined } : u
            );
            return { ...prev, [companyId]: { ...companyData, users: updatedUsers } };
        });

        addAuditLog('PASSWORD_RESET_COMPLETED', `Password was reset for ${user.email}.`);
        return { success: true, message: "Password reset successfully! You will be redirected to the login page." };
    };

    // --- MFA HANDLERS ---
    const handleEnableMfa = () => {
        if (!currentUser || !currentCompanyId) return;
        const mockSecret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('').sort(() => 0.5 - Math.random()).join('').substring(0, 16);
        const userWithSecret = { ...currentUser, mfaSecret: mockSecret };
        setMfaSetupUser(userWithSecret);
    };

    const handleDisableMfa = async (password: string): Promise<{ success: boolean; message: string }> => {
        if (!currentUser || !currentCompanyId || currentUser.password !== password) {
            return { success: false, message: "Incorrect password." };
        }
        setUsersForCurrentCompany(prevUsers => prevUsers.map(u =>
            u.id === currentUser.id ? { ...u, mfaEnabled: false, mfaSecret: undefined } : u
        ));
        addAuditLog('MFA_DISABLED', `MFA was disabled for user ${currentUser.name}.`);
        addNotification('Multi-Factor Authentication disabled successfully.', 'success');
        return { success: true, message: 'MFA Disabled.' };
    };

    const handleMfaSetupVerified = async (userId: string, verificationCode: string): Promise<{ success: boolean; message?: string }> => {
        if (mfaSetupUser && mfaSetupUser.id === userId && /^\d{6}$/.test(verificationCode)) {
            setUsersForCurrentCompany(prevUsers => prevUsers.map(u =>
                u.id === userId ? { ...u, mfaEnabled: true, mfaSecret: mfaSetupUser.mfaSecret } : u
            ));
            addAuditLog('MFA_ENABLED', `MFA was enabled for user ${mfaSetupUser.name}.`);
            addNotification('MFA enabled successfully!', 'success');
            setMfaSetupUser(null);
            return { success: true };
        }
        return { success: false, message: 'Invalid verification code.' };
    };

    const handleMfaVerify = async (userId: string, verificationCode: string): Promise<{ success: boolean; message?: string }> => {
        if (mfaUserToVerify && mfaUserToVerify.id === userId && /^\d{6}$/.test(verificationCode)) {
            const companyId = companies.find(c => allCompanyData[c.id]?.users.some(u => u.id === userId))!.id;
            setSession({ user: mfaUserToVerify, companyId });
            addAuditLog('USER_LOGIN', `User ${mfaUserToVerify.name} logged in successfully via MFA.`);
            setMfaUserToVerify(null);
            return { success: true };
        }
        return { success: false, message: 'Invalid verification code.' };
    };

    // --- INACTIVITY TIMEOUT LOGIC ---
    const resetIdleTimers = useCallback(() => {
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        setIsIdleWarningVisible(false);

        if (session) {
        warningTimerRef.current = window.setTimeout(() => {
            setIsIdleWarningVisible(true);
            let countdownValue = WARNING_DURATION_MS / 1000;
            setCountdown(countdownValue);
            const intervalId = setInterval(() => {
            countdownValue -= 1;
            setCountdown(countdownValue);
            if (countdownValue <= 0) {
                clearInterval(intervalId);
            }
            }, 1000);
        }, IDLE_TIMEOUT_MS - WARNING_DURATION_MS);

        logoutTimerRef.current = window.setTimeout(handleLogout, IDLE_TIMEOUT_MS);
        }
    }, [session, handleLogout]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetIdleTimers));
        resetIdleTimers();

        return () => {
        events.forEach(event => window.removeEventListener(event, resetIdleTimers));
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }, [resetIdleTimers]);
    
    // --- MAIN RENDER LOGIC ---
    const handleSetView = (view: View) => {
        setCurrentView(view);
        if (view !== 'navigator') {
            setActiveControlId(null);
        }
    };
    
    const renderView = () => {
        if (!isLicensed) {
            return <LicenseWall currentUser={currentUser} onGoToProfile={() => handleSetView('companyProfile')} permissions={currentUserPermissions} />;
        }
        if (isContentViewLoading) {
            return <ContentViewSkeleton />;
        }
        switch (currentView) {
            case 'dashboard': return <DashboardPage repository={documentRepository} currentUser={currentUser!} allControls={allControls} domains={eccData} onSetView={handleSetView} trainingProgress={trainingProgress} eccAssessment={eccAssessment} pdplAssessment={pdplAssessment} samaCsfAssessment={samaCsfAssessment} cmaAssessment={cmaAssessment} tasks={tasks} setTasks={setTasksForCurrentCompany} />;
            case 'navigator': return <ContentView domain={selectedDomain} activeControlId={activeControlId} setActiveControlId={setActiveControlId} onAddDocument={handleAddDocumentToRepo} documentRepository={documentRepository} permissions={currentUserPermissions} onSetView={handleSetView} />;
            case 'documents': return <DocumentsPage repository={documentRepository} currentUser={currentUser!} onApprovalAction={handleApprovalAction} onAddDocument={handleAddDocumentToRepo} permissions={currentUserPermissions} company={currentCompany!} />;
            case 'users': return <UserManagementPage users={users} setUsers={setUsersForCurrentCompany} currentUser={currentUser!} addNotification={addNotification} addAuditLog={addAuditLog} />;
            case 'companyProfile': return <CompanyProfilePage company={currentCompany} onSave={handleSaveCompanyProfile} canEdit={currentUserPermissions.has('company:update')} addNotification={addNotification} />;
            case 'auditLog': return <AuditLogPage auditLog={auditLog} />;
            case 'assessment': return <AssessmentPage assessmentData={eccAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('ecc', c, u)} status={assessmentStatuses.ecc} onInitiate={() => handleInitiateAssessment('ecc')} onComplete={() => handleCompleteAssessment('ecc')} permissions={currentUserPermissions} onSetView={handleSetView} />;
            case 'pdplAssessment': return <PDPLAssessmentPage assessmentData={pdplAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('pdpl', c, u)} status={assessmentStatuses.pdpl} onInitiate={() => handleInitiateAssessment('pdpl')} onComplete={() => handleCompleteAssessment('pdpl')} permissions={currentUserPermissions} />;
            case 'samaCsfAssessment': return <SamaCsfAssessmentPage assessmentData={samaCsfAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('sama', c, u)} status={assessmentStatuses.sama} onInitiate={() => handleInitiateAssessment('sama')} onComplete={() => handleCompleteAssessment('sama')} permissions={currentUserPermissions} />;
            case 'cmaAssessment': return <CMAAssessmentPage assessmentData={cmaAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('cma', c, u)} status={assessmentStatuses.cma} onInitiate={() => handleInitiateAssessment('cma')} onComplete={() => handleCompleteAssessment('cma')} permissions={currentUserPermissions} />;
            case 'userProfile': return <UserProfilePage currentUser={currentUser!} onChangePassword={handleChangePassword} onEnableMfa={handleEnableMfa} onDisableMfa={handleDisableMfa} />;
            case 'help': return <HelpSupportPage onStartTour={() => setIsTourOpen(true)} />;
            case 'training': return <TrainingPage userProgress={trainingProgress} onUpdateProgress={handleUpdateTrainingProgress} />;
            case 'complianceAgent': return <ComplianceAgentPage onRunAnalysis={handleRunAnalysis} onGenerateDocuments={handleGenerateDocuments} agentLog={agentLog} permissions={currentUserPermissions} />;
            case 'riskAssessment': return <RiskAssessmentPage />;
            default: return <div>View not found</div>;
        }
    };
    
    if (!session) {
        if (viewForNoSession === 'setup') {
            return <CompanySetupPage onSetup={handleCompanySetup} onCancel={() => setViewForNoSession('login')} theme={theme} toggleTheme={toggleTheme} />;
        }
        return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} onSetupCompany={() => setViewForNoSession('setup')} onVerify={handleVerifyUser} onForgotPassword={handleForgotPassword} onResetPassword={handleResetPassword} />;
    }

    if (mfaUserToVerify) {
        return <MfaVerifyPage user={mfaUserToVerify} onVerify={handleMfaVerify} onCancel={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
    }

    if (mfaSetupUser) {
        return <MfaSetupPage user={mfaSetupUser} companyName={currentCompany?.name || ''} onVerified={handleMfaSetupVerified} onCancel={() => setMfaSetupUser(null)} theme={theme} toggleTheme={toggleTheme} />;
    }

    return (
        <>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
                <Sidebar domains={eccData} selectedDomain={selectedDomain} onSelectDomain={handleSelectDomain} currentView={currentView} onSetView={handleSetView} permissions={currentUserPermissions} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between p-4 h-16">
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input id="header-search-input" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} placeholder="Search for a control..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                                {isSearchFocused && searchResults.length > 0 && (
                                    <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                                        <ul>
                                            {searchResults.map((result) => (
                                                <li key={result.control.id} onMouseDown={() => handleResultClick(result)} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700/50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-semibold text-teal-600 dark:text-teal-400 font-mono text-sm">{result.control.id}</div>
                                                        <ArrowUpRightIcon className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                        {highlightText(result.control.description, debouncedSearchQuery)}
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                                        {result.domain.name} &gt; {result.subdomain.title}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                                </button>
                                {installPrompt && !isStandalone && (
                                    <button onClick={handleInstallClick} title="Install to Desktop" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <DownloadIcon className="w-6 h-6" />
                                    </button>
                                )}
                                <div className="relative">
                                    <UserCircleIcon className="w-8 h-8 text-gray-500" />
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentUser.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</div>
                                </div>
                                <button onClick={handleLogout} title="Sign Out" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <LogoutIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        {renderView()}
                    </main>
                </div>
            </div>
            
            {/* Global Overlays */}
            <LiveAssistantWidget isOpen={isAssistantOpen} onToggle={() => setIsAssistantOpen(!isAssistantOpen)} onNavigate={(view) => { handleSetView(view as View); setIsAssistantOpen(false); }} />
            <TourGuide isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} steps={tourSteps} />
            
            <div className="fixed top-5 right-5 z-[200] space-y-3">
                {notifications.map(n => (
                    <div key={n.id} className={`flex items-start p-4 rounded-lg shadow-lg border animate-fade-in-down ${n.type === 'success' ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700' : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'}`}>
                        {n.type === 'success' ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <InformationCircleIcon className="w-6 h-6 text-blue-500" />}
                        <div className="ml-3 flex-1">
                            <p className={`text-sm font-medium ${n.type === 'success' ? 'text-green-800 dark:text-green-100' : 'text-blue-800 dark:text-blue-100'}`}>{n.message}</p>
                        </div>
                        <button onClick={() => removeNotification(n.id)} className="ml-4 p-1 rounded-full hover:bg-black/10">
                            <CloseIcon className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                ))}
            </div>

            {isIdleWarningVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[250] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
                        <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Are you still there?</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            You've been inactive for a while. For your security, you will be logged out in{' '}
                            <span className="font-bold">{countdown}</span> seconds.
                        </p>
                        <div className="mt-6">
                            <button onClick={resetIdleTimers} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700">
                                I'm still here
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInitiateConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[250] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-300" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                    Initiate New Assessment
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Are you sure? This will delete all current progress for the {showInitiateConfirmModal.toUpperCase()} assessment and start over with a fresh template. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => executeInitiateAssessment(showInitiateConfirmModal)}
                            >
                                Yes, Initiate
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={() => setShowInitiateConfirmModal(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
            @keyframes fade-in-down {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
                animation: fade-in-down 0.3s ease-out forwards;
            }
            `}</style>
        </>
    );
}
export default App;
