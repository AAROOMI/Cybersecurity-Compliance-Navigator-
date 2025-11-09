

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import { ContentViewSkeleton } from './components/ContentViewSkeleton';
import { DocumentsPage } from './components/DocumentsPage';
import { DashboardPage } from './components/Dashboard';
import { CompanyProfilePage } from './components/CompanyProfilePage';
import { AuditLogPage } from './components/AuditLogPage';
import { AssessmentPage } from './components/AssessmentPage';
import { PDPLAssessmentPage } from './components/PDPLAssessmentPage';
import { SamaCsfAssessmentPage } from './components/SamaCsfAssessmentPage';
import { CMAAssessmentPage } from './components/CMAAssessmentPage';
import { HRSDAssessmentPage } from './components/HRSDAssessmentPage';
import { UserProfilePage } from './components/UserProfilePage';
import { HelpSupportPage } from './components/HelpSupportPage';
import { TrainingPage } from './components/TrainingPage';
import { RiskAssessmentPage } from './components/RiskAssessmentPage';
import { ControlMappingPage } from './components/ControlMappingPage';
import { TourGuide } from './components/TourGuide';
import { NooraAssistant } from './components/NooraAssistant';
import { RiskAssistant } from './components/RiskAssistant';
import { LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, CheckCircleIcon, InformationCircleIcon, CloseIcon, DownloadIcon, ExclamationTriangleIcon, LockClosedIcon, LogoutIcon } from './components/Icons';
import { eccData } from './data/controls';
import { assessmentData as initialAssessmentData } from './data/assessmentData';
import { initialPdplAssessmentData } from './data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from './data/samaCsfAssessmentData';
import { cmaAssessmentData as initialCmaAssessmentData } from './data/cmaAssessmentData';
import { initialHrsdAssessmentData } from './data/hrsdAssessmentData';
import { initialRiskData } from './data/riskAssessmentData';
import { trainingCourses } from './data/trainingData';
import { mappingData } from './data/mappingData';
// FIX: Import the 'View' type from 'types.ts' to make it available globally.
import type { Domain, Control, Subdomain, SearchResult, PolicyDocument, UserRole, DocumentStatus, User, CompanyProfile, AuditLogEntry, AuditAction, License, AssessmentItem, UserTrainingProgress, Task, ComplianceGap, Risk, AssessmentRecord, GeneratedContent, View } from './types';
import { rolePermissions } from './types';

// Import pages for custom auth flow
import { LoginPage } from './components/LoginPage';
import { CompanySetupPage } from './components/CompanySetupPage';
import { MfaSetupPage } from './components/MfaSetupPage';
import { MfaVerifyPage } from './components/MfaVerifyPage';
import { UserManagementPage } from './components/UserManagementPage';


declare const QRCode: any;

// Mock user data with passwords for the custom RBAC system
const initialUsers: User[] = [
  { id: 'user-1', name: 'Super Administrator', email: 'aaroomi@gmail.com', role: 'Administrator', isVerified: true, password: 'password123', mfaEnabled: false, mfaSecret: 'JBSWY3DPEHPK3PXP' },
  { id: 'user-2', name: 'Samia Ahmed (CISO)', email: 's.ahmed@example.com', role: 'CISO', isVerified: true, password: 'password123', mfaEnabled: false },
  { id: 'user-3', name: 'John Doe (CTO)', email: 'j.doe@example.com', role: 'CTO', isVerified: true, password: 'password123', mfaEnabled: false },
  { id: 'user-4', name: 'Fatima Khan (CIO)', email: 'f.khan@example.com', role: 'CIO', isVerified: true, password: 'password123', mfaEnabled: false },
  { id: 'user-5', name: 'Michael Chen (CEO)', email: 'm.chen@example.com', role: 'CEO', isVerified: true, password: 'password123', mfaEnabled: false },
  { id: 'user-6', name: 'David Lee (Analyst)', email: 'd.lee@example.com', role: 'Security Analyst', accessExpiresAt: new Date(new Date().setDate(new Date().getDate() + 30)).getTime(), isVerified: true, password: 'password123', mfaEnabled: false },
  { id: 'user-7', name: 'Regular Employee', email: 'employee@example.com', role: 'Employee', isVerified: true, password: 'password123', mfaEnabled: false },
];

type CompanyData = {
  users: User[];
  documents: PolicyDocument[];
  auditLog: AuditLogEntry[];
  eccAssessment?: AssessmentItem[];
  pdplAssessment?: AssessmentItem[];
  samaCsfAssessment?: AssessmentItem[];
  cmaAssessment?: AssessmentItem[];
  hrsdAssessment?: AssessmentItem[];
  riskAssessmentData?: Risk[];
  assessmentStatuses?: AssessmentStatuses;
  trainingProgress?: UserTrainingProgress;
  tasks?: Task[];
  eccAssessmentHistory?: AssessmentRecord[];
  pdplAssessmentHistory?: AssessmentRecord[];
  samaCsfAssessmentHistory?: AssessmentRecord[];
  cmaAssessmentHistory?: AssessmentRecord[];
  hrsdAssessmentHistory?: AssessmentRecord[];
};

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface AssessmentStatuses {
    ecc: 'idle' | 'in-progress';
    pdpl: 'idle' | 'in-progress';
    sama: 'idle' | 'in-progress';
    cma: 'idle' | 'in-progress';
    hrsd: 'idle' | 'in-progress';
    riskAssessment: 'idle' | 'in-progress';
}

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_DURATION_MS = 1 * 60 * 1000; // 1 minute

const tourSteps = [
  { target: 'body', title: 'Welcome to the Guided Tour!', content: "Let's take a quick walk-through of the key features of the Cybersecurity Controls Navigator. Click \"Next\" to begin." },
  { target: '#sidebar-dashboard', title: 'The Dashboard', content: 'This is your mission control. It provides a high-level overview of your compliance posture, recent activities, and pending tasks.', position: 'right' },
  { target: '#sidebar-navigator-header', title: 'Control Navigator', content: 'Here you can browse the entire NCA ECC framework, domain by domain. Click on a domain to explore its subdomains and controls in detail.', position: 'right' },
  { target: '#header-search-input', title: 'Universal Search', content: 'Quickly find any control by its ID or description. The search is fast and will take you directly to the relevant control.', position: 'bottom' },
  { target: '#sidebar-documents', title: 'Document Management', content: 'This is where all generated policy documents are stored. You can manage their approval lifecycle, view history, and export them.', position: 'right' },
  { target: '#sidebar-assessment', title: 'Compliance Assessments', content: 'Conduct detailed assessments against various frameworks like NCA ECC, PDPL, and SAMA CSF. You can track status, provide evidence, and generate reports.', position: 'right' },
  { target: 'body', title: 'Tour Complete!', content: "You've seen the main features. You can restart this tour anytime from the Help & Support page. Now you're ready to take control of your compliance!" }
];

// FIX: Removed local 'View' type definition as it's now imported from 'types.ts'.
type AppState = 'login' | 'setup' | 'app' | 'mfa_verify' | 'mfa_setup';

const NotificationComponent: React.FC<{ notification: Notification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
    const Icon = notification.type === 'success' ? CheckCircleIcon : InformationCircleIcon;
    const colors = notification.type === 'success'
        ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 border-green-200 dark:border-green-600'
        : 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-600';

    return (
        <div className={`max-w-sm w-full rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border ${colors}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={onDismiss} className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800">
                            <span className="sr-only">Close</span>
                            <CloseIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  const [mfaRequiredUser, setMfaRequiredUser] = useState<User | null>(null);
  const [mfaSetupUser, setMfaSetupUser] = useState<User | null>(null);

  const [selectedDomain, setSelectedDomain] = useState<Domain>(eccData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeControlId, setActiveControlId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [allCompanyData, setAllCompanyData] = useState<Record<string, CompanyData>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isContentViewLoading, setIsContentViewLoading] = useState(false);

  const [isIdleWarningVisible, setIsIdleWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION_MS / 1000);
  const warningTimerRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const [isLicensed, setIsLicensed] = useState(true);
  
  const [showInitiateConfirmModal, setShowInitiateConfirmModal] = useState<keyof AssessmentStatuses | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  // Noora AI Assistant State
  const [isNooraAssessing, setIsNooraAssessing] = useState(false);
  type NooraAssessmentType = 'ecc' | 'pdpl' | 'sama' | 'cma' | 'hrsd';
  const [nooraAssessmentType, setNooraAssessmentType] = useState<NooraAssessmentType | null>(null);
  const [nooraCurrentControlIndex, setNooraCurrentControlIndex] = useState(0);
  const [nooraActiveField, setNooraActiveField] = useState<{ controlCode: string | null, field: keyof AssessmentItem | null }>({ controlCode: null, field: null });
  const [nooraEvidenceRequest, setNooraEvidenceRequest] = useState<string | null>(null);
  
  // Risk Assistant State
  const [assessingRisk, setAssessingRisk] = useState<Risk | null>(null);
  const [riskAssistantActiveField, setRiskAssistantActiveField] = useState<{ riskId: string | null; field: keyof Risk | null }>({ riskId: null, field: null });
  const [riskEvidenceRequest, setRiskEvidenceRequest] = useState<Risk | null>(null);


  const currentCompany = useMemo(() => companies.find(c => c.id === currentCompanyId), [companies, currentCompanyId]);
  const documentRepository = useMemo(() => allCompanyData[currentCompanyId || '']?.documents || [], [allCompanyData, currentCompanyId]);
  const auditLog = useMemo(() => allCompanyData[currentCompanyId || '']?.auditLog || [], [allCompanyData, currentCompanyId]);
  const eccAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.eccAssessment || initialAssessmentData, [allCompanyData, currentCompanyId]);
  const pdplAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.pdplAssessment || initialPdplAssessmentData, [allCompanyData, currentCompanyId]);
  const samaCsfAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.samaCsfAssessment || initialSamaCsfAssessmentData, [allCompanyData, currentCompanyId]);
  const cmaAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.cmaAssessment || initialCmaAssessmentData, [allCompanyData, currentCompanyId]);
  const hrsdAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.hrsdAssessment || initialHrsdAssessmentData, [allCompanyData, currentCompanyId]);
  const riskAssessmentData = useMemo(() => allCompanyData[currentCompanyId || '']?.riskAssessmentData || initialRiskData, [allCompanyData, currentCompanyId]);
  const assessmentStatuses = useMemo(() => allCompanyData[currentCompanyId || '']?.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', hrsd: 'idle', riskAssessment: 'idle' }, [allCompanyData, currentCompanyId]);
  const trainingProgress = useMemo(() => allCompanyData[currentCompanyId || '']?.trainingProgress || {}, [allCompanyData, currentCompanyId]);
  const tasks = useMemo(() => allCompanyData[currentCompanyId || '']?.tasks || [], [allCompanyData, currentCompanyId]);
  const usersForCurrentCompany = useMemo(() => allCompanyData[currentCompanyId || '']?.users || [], [allCompanyData, currentCompanyId]);

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

  const addAuditLog = useCallback((action: AuditAction, details: string, targetId?: string) => {
    const userForLog = currentUser;
    const companyIdForLog = currentCompanyId;

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
      const currentData = prevData[companyIdForLog] || { users: [], documents: [], auditLog: [], tasks: [] };
      const newAuditLog = [newLogEntry, ...(currentData.auditLog || [])]; 
      return { ...prevData, [companyIdForLog]: { ...currentData, auditLog: newAuditLog } };
    });
  }, [currentUser, currentCompanyId]);
  
  const setUsersForCurrentCompany = (updater: React.SetStateAction<User[]>) => {
    if (!currentCompanyId) return;
    setAllCompanyData(prevData => {
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
      const newUsers = typeof updater === 'function' ? updater(currentData.users) : updater;
      return { ...prevData, [currentCompanyId]: { ...currentData, users: newUsers } };
    });
  };
  
  const setDocumentRepositoryForCurrentCompany = (updater: React.SetStateAction<PolicyDocument[]>) => {
    if (!currentCompanyId) return;
    setAllCompanyData(prevData => {
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
      const newDocuments = typeof updater === 'function' ? updater(currentData.documents) : updater;
      return { ...prevData, [currentCompanyId]: { ...currentData, documents: newDocuments } };
    });
  };
  
    const setRiskAssessmentDataForCurrentCompany = (updater: React.SetStateAction<Risk[]>) => {
        if (!currentCompanyId) return;
        setAllCompanyData(prevData => {
            const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
            const newData = typeof updater === 'function' ? updater(currentData.riskAssessmentData || []) : updater;
            return { ...prevData, [currentCompanyId]: { ...currentData, riskAssessmentData: newData } };
        });
    };

    const setTasksForCurrentCompany = (updater: React.SetStateAction<Task[]>) => {
        if (!currentCompanyId) return;
        setAllCompanyData(prevData => {
            const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
            const newTasks = typeof updater === 'function' ? updater(currentData.tasks || []) : updater;
            return { ...prevData, [currentCompanyId]: { ...currentData, tasks: newTasks } };
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
        } else if (currentUser) {
             setIsLicensed(false);
        }
    }, [currentCompany, currentUser]);

  useEffect(() => {
    try {
        const savedCompaniesData = window.localStorage.getItem('companies');
        if (!savedCompaniesData || savedCompaniesData === '[]') {
            console.log("No companies found in localStorage. Seeding with default data.");
            setAppState('login'); // Can be 'setup' if we want first user to setup
            const defaultCompanyId = 'default-company-1';
            const defaultCompany: CompanyProfile = {
                id: defaultCompanyId, name: 'Example Corp', logo: '', ceoName: 'Michael Chen', cioName: 'Fatima Khan', cisoName: 'Samia Ahmed', ctoName: 'John Doe',
                cybersecurityOfficerName: 'Ali Hassan', dpoName: 'Nora Saleh', complianceOfficerName: 'Omar Abdullah',
                license: { key: 'default-starter-key', status: 'active', tier: 'yearly', expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime() }
            };
            const defaultCompanyData: CompanyData = {
                users: initialUsers, documents: [], auditLog: [], eccAssessment: initialAssessmentData, pdplAssessment: initialPdplAssessmentData, samaCsfAssessment: initialSamaCsfAssessmentData,
                cmaAssessment: initialCmaAssessmentData, hrsdAssessment: initialHrsdAssessmentData, riskAssessmentData: initialRiskData, assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', hrsd: 'idle', riskAssessment: 'idle' },
                trainingProgress: {}, tasks: [],
            };
            setCompanies([defaultCompany]);
            setAllCompanyData({ [defaultCompanyId]: defaultCompanyData });
            
            const { logo, ...companyToStore } = defaultCompany;
            window.localStorage.setItem('companies', JSON.stringify([companyToStore]));
            window.localStorage.setItem('companyLogos', JSON.stringify({}));
            window.localStorage.setItem(`companyData-${defaultCompanyId}`, JSON.stringify(defaultCompanyData));
            return;
        }

        const companiesWithoutLogos: Omit<CompanyProfile, 'logo'>[] = JSON.parse(savedCompaniesData);
        if (companiesWithoutLogos.length > 0) {
            const savedLogosData = window.localStorage.getItem('companyLogos');
            const companyLogos: Record<string, string> = savedLogosData ? JSON.parse(savedLogosData) : {};
            const hydratedCompanies: CompanyProfile[] = companiesWithoutLogos.map(c => ({ ...c, logo: companyLogos[c.id] || '' }));
            setCompanies(hydratedCompanies);
            
            const loadedCompanyData: Record<string, CompanyData> = {};
            for (const company of hydratedCompanies) {
                const data = window.localStorage.getItem(`companyData-${company.id}`);
                const parsedData = data ? JSON.parse(data) : { users: [], documents: [], auditLog: [], tasks: [] };
                loadedCompanyData[company.id] = {
                    ...parsedData, eccAssessment: parsedData.eccAssessment || initialAssessmentData, pdplAssessment: parsedData.pdplAssessment || initialPdplAssessmentData,
                    samaCsfAssessment: parsedData.samaCsfAssessment || initialSamaCsfAssessmentData, cmaAssessment: parsedData.cmaAssessment || initialCmaAssessmentData,
                    hrsdAssessment: parsedData.hrsdAssessment || initialHrsdAssessmentData,
                    riskAssessmentData: parsedData.riskAssessmentData || initialRiskData, assessmentStatuses: parsedData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', hrsd: 'idle', riskAssessment: 'idle' },
                    trainingProgress: parsedData.trainingProgress || {}, tasks: parsedData.tasks || [],
                };
            }
            setAllCompanyData(loadedCompanyData);
        } else {
             setAppState('setup');
        }
    } catch (error) { console.error("Failed to load data from localStorage", error); }
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      try {
        const companiesToStore = companies.map(({ logo, ...rest }) => rest);
        const logosToStore = companies.reduce((acc, company) => {
            if (company.logo) acc[company.id] = company.logo;
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

  useEffect(() => {
    // This effect persists ALL company data to localStorage whenever it changes.
    // This is more robust and fixes issues where data was not saved when logged out (e.g., password reset).
    if (Object.keys(allCompanyData).length > 0) {
        Object.keys(allCompanyData).forEach(companyId => {
            try {
                const dataToSave = allCompanyData[companyId];
                if (dataToSave) {
                     window.localStorage.setItem(`companyData-${companyId}`, JSON.stringify(dataToSave));
                }
            } catch (error) {
                console.error(`Failed to save data for company ${companyId} to localStorage`, error);
            }
        });
    }
  }, [allCompanyData]);

  // ... (All other handlers like handleInitiateAssessment, handleCompleteAssessment, etc. remain the same)
    const handleInitiateAssessment = (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        setShowInitiateConfirmModal(type);
    };

    const executeInitiateAssessment = (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        setShowInitiateConfirmModal(null);

        let sourceData: AssessmentItem[] | Risk[];
        let key: keyof CompanyData;
        let historyKey: keyof CompanyData | undefined;
        
        switch (type) {
            case 'ecc': sourceData = initialAssessmentData; key = 'eccAssessment'; historyKey = 'eccAssessmentHistory'; break;
            case 'pdpl': sourceData = initialPdplAssessmentData; key = 'pdplAssessment'; historyKey = 'pdplAssessmentHistory'; break;
            case 'sama': sourceData = initialSamaCsfAssessmentData; key = 'samaCsfAssessment'; historyKey = 'samaCsfAssessmentHistory'; break;
            case 'cma': sourceData = initialCmaAssessmentData; key = 'cmaAssessment'; historyKey = 'cmaAssessmentHistory'; break;
            case 'hrsd': sourceData = initialHrsdAssessmentData; key = 'hrsdAssessment'; historyKey = 'hrsdAssessmentHistory'; break;
            case 'riskAssessment': sourceData = initialRiskData; key = 'riskAssessmentData'; historyKey = undefined; break; // No history for risk yet
            default: return;
        }

        const resetData = JSON.parse(JSON.stringify(sourceData));
        if (type !== 'riskAssessment') {
            (resetData as AssessmentItem[]).forEach(item => {
                item.currentStatusDescription = '';
                item.controlStatus = 'Not Implemented';
                item.recommendation = '';
                item.managementResponse = '';
                item.targetDate = '';
            });
        }
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId!];
            if (!currentData) return prev;

            const updatedData = { ...currentData };

            if (historyKey) {
                const existingAssessment = currentData[key as keyof CompanyData] as AssessmentItem[] | undefined;
                const currentHistory = (currentData[historyKey] as AssessmentRecord[] | undefined) || [];
                const newHistory = [...currentHistory];

                if (existingAssessment && existingAssessment.some(item => item.controlStatus !== 'Not Implemented' || item.currentStatusDescription !== '')) {
                    newHistory.push({ timestamp: Date.now(), data: existingAssessment });
                    updatedData[historyKey] = newHistory;
                }
            }

            updatedData[key] = resetData;
            updatedData.assessmentStatuses = { ...(currentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', hrsd: 'idle', riskAssessment: 'idle' }), [type]: 'in-progress' };
            
            return { ...prev, [currentCompanyId!]: updatedData };
        });
        addNotification(`${type.toUpperCase()} assessment has been initiated.`, 'success');
    };

    const handleCompleteAssessment = async (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;

        addNotification(`${type.toUpperCase()} assessment has been completed.`, 'success');

        setAllCompanyData(prev => {
            const updatedCurrentData = prev[currentCompanyId];
            if (!updatedCurrentData) return prev;
            return {
                ...prev,
                [currentCompanyId]: {
                    ...updatedCurrentData,
                    assessmentStatuses: { ...(updatedCurrentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', hrsd: 'idle', riskAssessment: 'idle' }), [type]: 'idle' }
                }
            };
        });
    };

    const handleUpdateAssessmentItem = (type: 'ecc' | 'pdpl' | 'sama' | 'cma' | 'hrsd', controlCode: string, updatedItem: AssessmentItem) => {
        if (!currentCompanyId) return;
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId];
            const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : type === 'sama' ? 'samaCsfAssessment' : type === 'cma' ? 'cmaAssessment' : 'hrsdAssessment';
            const currentAssessmentData = currentData[key as 'eccAssessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment' | 'hrsdAssessment'] || [];

            const newData = currentAssessmentData.map(item => 
                item.controlCode === controlCode ? updatedItem : item
            );

            return {
                ...prev,
                [currentCompanyId]: {
                    ...currentData,
                    [key as 'eccAssessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment' | 'hrsdAssessment']: newData
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

  const allControls = useMemo((): SearchResult[] => eccData.flatMap(domain => domain.subdomains.flatMap(subdomain => subdomain.controls.map(control => ({ control, subdomain, domain })))), []);

  const handleSaveCompanyProfile = (profile: CompanyProfile) => {
      const existing = companies.find(c => c.id === profile.id);
      if (existing) {
          if (JSON.stringify(existing.license) !== JSON.stringify(profile.license) && profile.license) {
               addAuditLog('LICENSE_UPDATED', `Company license updated to ${profile.license.tier} plan, expires ${new Date(profile.license.expiresAt).toLocaleDateString()}`, profile.id);
          } 
          const changes: string[] = [];
          if (existing.name !== profile.name) changes.push(`Name changed to "${profile.name}"`);
          if (existing.ceoName !== profile.ceoName) changes.push(`CEO Name changed to "${profile.ceoName}"`);
          if (existing.cioName !== profile.cioName) changes.push(`CIO Name changed to "${profile.cioName}"`);
          if (existing.cisoName !== profile.cisoName) changes.push(`CISO Name changed to "${profile.cisoName}"`);
          if (existing.ctoName !== profile.ctoName) changes.push(`CTO Name changed to "${profile.ctoName}"`);
          if (existing.cybersecurityOfficerName !== profile.cybersecurityOfficerName) changes.push(`Cybersecurity Officer changed to "${profile.cybersecurityOfficerName}"`);
          if (existing.dpoName !== profile.dpoName) changes.push(`DPO Name changed to "${profile.dpoName}"`);
          if (existing.complianceOfficerName !== profile.complianceOfficerName) changes.push(`Compliance Officer changed to "${profile.complianceOfficerName}"`);
          if (existing.logo !== profile.logo) changes.push(`Company logo was updated`);
  
          if (changes.length > 0) {
              addAuditLog('COMPANY_PROFILE_UPDATED', `Company profile updated: ${changes.join('; ')}.`, profile.id);
          }
          setCompanies(prev => prev.map(c => (c.id === profile.id ? profile : c)));
      }
      addNotification('Company profile saved successfully.', 'success');
  };

    const generateBarcodeDataURL = (text: string): string => {
        const canvas = document.createElement('canvas');
        canvas.width = 280;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let x = 10;
        // Simple visual representation, not a real barcode standard
        for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const isBlack = (charCode + i) % 2 === 0;
        const width = 1 + (charCode % 3); // bar width 1, 2, or 3
        
        if (x + width > canvas.width - 10) break;

        if (isBlack) {
            ctx.fillStyle = 'black';
            ctx.fillRect(x, 10, width, 50);
        }
        x += width;
        }
        return canvas.toDataURL('image/png');
    };

  const handleAddDocumentToRepo = useCallback(async (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy: 'user' | 'AI Agent' = 'user') => {
    if(!currentCompanyId) return;
    const now = Date.now();
    const docId = `policy-${control.id}-${now}`;

    const qrCodeDataUrl = await new Promise<string>((resolve, reject) => {
        if (typeof QRCode === 'undefined') {
            console.error("QRCode library not loaded");
            return resolve('');
        }
        QRCode.toDataURL(docId, { width: 112, margin: 1 }, (err: any, url: string) => {
            if (err) reject(err);
            else resolve(url);
        });
    });

    const barcodeDataUrl = generateBarcodeDataURL(docId);

    const newDocument: PolicyDocument = {
      id: docId, controlId: control.id, domainName: domain.name, subdomainTitle: subdomain.title, controlDescription: control.description,
      status: 'Pending CISO Approval', content: generatedContent, approvalHistory: [], createdAt: now, updatedAt: now,
      generatedBy,
      qrCodeDataUrl,
      barcodeDataUrl,
    };
    setDocumentRepositoryForCurrentCompany(prevRepo => [...prevRepo, newDocument]);
    
    const companyUsers = allCompanyData[currentCompanyId]?.users || [];
    const cisoUsers = companyUsers.filter(u => u.role === 'CISO');
    if (cisoUsers.length > 0) {
        cisoUsers.forEach(ciso => addNotification(`Email notification sent to ${ciso.name} (${ciso.email}) for new document ${newDocument.controlId}.`));
    } else {
        addNotification(`New document ${newDocument.controlId} is pending CISO approval, but no user with that role was found.`, 'info');
    }
  }, [allCompanyData, currentCompanyId, addNotification]);
  
  const approvalOrder: { role: UserRole; status: DocumentStatus }[] = [
    { role: 'CISO', status: 'Pending CISO Approval' }, { role: 'CTO', status: 'Pending CTO Approval' },
    { role: 'CIO', status: 'Pending CIO Approval' }, { role: 'CEO', status: 'Pending CEO Approval' },
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
        if (currentStepIndex === -1 || approvalOrder[currentStepIndex].role !== currentUser.role) return; 
        const nextStepIndex = currentStepIndex + 1;
        newStatus = nextStepIndex < approvalOrder.length ? approvalOrder[nextStepIndex].status : 'Approved';
        addAuditLog('DOCUMENT_APPROVED', `Document ${doc.controlId} was approved at the ${currentUser.role} level. Comments: ${comments || 'N/A'}`, documentId);
    }
    
    setDocumentRepositoryForCurrentCompany(prevRepo => prevRepo.map(d => d.id === documentId ? { ...d, status: newStatus, approvalHistory: newHistory, updatedAt: now } : d));

    if (newStatus === 'Rejected') {
        addNotification(`Document ${doc.controlId} has been rejected.`, 'info');
    } else if (newStatus === 'Approved') {
        addNotification(`Document ${doc.controlId} has been fully approved!`, 'success');
    } else if (newStatus.startsWith('Pending')) {
        const nextStepIndex = approvalOrder.findIndex(step => step.status === newStatus);
        if (nextStepIndex !== -1) {
            const nextApproverRole = approvalOrder[nextStepIndex].role;
            const companyUsers = allCompanyData[currentCompanyId || '']?.users || [];
            const nextApprovers = companyUsers.filter(u => u.role === nextApproverRole);
            if (nextApprovers.length > 0) {
                nextApprovers.forEach(approver => addNotification(`Email notification sent to ${approver.name} (${approver.email}) for document ${doc.controlId}.`));
            } else {
                addNotification(`Document ${doc.controlId} is pending ${nextApproverRole} approval, but no user with that role was found.`, 'info');
            }
        }
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => { setDebouncedSearchQuery(searchQuery); }, 300);
    return () => { clearTimeout(timerId); };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      const results = allControls.filter(({ control }) => {
        const query = debouncedSearchQuery.toLowerCase();
        return (control.id.toLowerCase().includes(query) || control.description.toLowerCase().includes(query));
      });
      setSearchResults(results.slice(0, 10));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, allControls]);

  const handleSelectDomain = useCallback((domain: Domain) => {
    if (selectedDomain.id !== domain.id || currentView !== 'navigator') {
      setIsContentViewLoading(true);
      setCurrentView('navigator');
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
    if (!trimmedHighlight) return <span>{text}</span>;
    const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedHighlight = escapeRegExp(trimmedHighlight);
    if (escapedHighlight === '') return <span>{text}</span>;
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
            <strong key={i} className="bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-200">{part}</strong>
          ) : ( part )
        )}
      </span>
    );
  };

  const resetIdleTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    setIsIdleWarningVisible(false);

    if (currentUser) {
      warningTimerRef.current = window.setTimeout(() => {
        setIsIdleWarningVisible(true);
        let countdownValue = WARNING_DURATION_MS / 1000;
        setCountdown(countdownValue);
        const intervalId = setInterval(() => {
          countdownValue -= 1;
          setCountdown(countdownValue);
          if (countdownValue <= 0) clearInterval(intervalId);
        }, 1000);
      }, IDLE_TIMEOUT_MS - WARNING_DURATION_MS);
      logoutTimerRef.current = window.setTimeout(handleLogout, IDLE_TIMEOUT_MS);
    }
  }, [currentUser]);

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
    
  const handleSetView = (view: View) => {
    setCurrentView(view);
    if (view !== 'navigator') setActiveControlId(null);
  };
    
  // --- AUTHENTICATION LOGIC ---

    const handleLogin = async (email: string, password: string): Promise<{error: string, code?: string} | null> => {
        let foundUser: User | undefined;
        let foundCompanyId: string | undefined;

        for (const company of companies) {
            const userInCompany = allCompanyData[company.id]?.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (userInCompany) {
                foundUser = userInCompany;
                foundCompanyId = company.id;
                break;
            }
        }

        if (!foundUser) {
            return { error: "Invalid email or password." };
        }
        if (foundUser.password !== password) {
            return { error: "Invalid email or password." };
        }
        if (!foundUser.isVerified) {
            return { error: "Your account is not verified. A new verification link has been sent to your email.", code: 'unverified' };
        }
        
        if (foundUser.mfaEnabled) {
            setMfaRequiredUser(foundUser);
            setCurrentCompanyId(foundCompanyId!);
            setAppState('mfa_verify');
            return null;
        }

        setCurrentUser(foundUser);
        setCurrentCompanyId(foundCompanyId!);
        setAppState('app');
        addAuditLog('USER_LOGIN', `User ${foundUser.name} logged in successfully.`);
        return null;
    };

    const handleMfaVerify = async (userId: string, verificationCode: string): Promise<{ success: boolean, message?: string }> => {
        // In a real app, this would involve a library like 'otpauth' to verify the TOTP code against the user's secret.
        // For this mock, we'll use a simple check.
        if (verificationCode === '123456' && mfaRequiredUser) {
            setCurrentUser(mfaRequiredUser);
            setAppState('app');
            addAuditLog('USER_LOGIN', `User ${mfaRequiredUser.name} logged in successfully via MFA.`);
            setMfaRequiredUser(null);
            return { success: true };
        } else {
            return { success: false, message: "Invalid verification code." };
        }
    };

    const handleEnableMfa = () => {
        if (!currentUser || !currentCompanyId) return;
        
        // Generate a mock base32 secret. Real app would use a library.
        const secret = 'JBSWY3DPEHPK3PXP'; // Mock secret for 'test@example.com'
        const userToUpdate = { ...currentUser, mfaSecret: secret };

        setMfaSetupUser(userToUpdate);
        setAppState('mfa_setup');
    };

    const handleMfaSetupVerified = async (userId: string, verificationCode: string): Promise<{ success: boolean, message?: string }> => {
        if (verificationCode === '123456' && mfaSetupUser) {
            const updatedUser = { ...mfaSetupUser, mfaEnabled: true };
            
            setUsersForCurrentCompany(prev => prev.map(u => u.id === userId ? updatedUser : u));
            setCurrentUser(updatedUser);
            addAuditLog('MFA_ENABLED', `User ${updatedUser.name} enabled MFA.`);
            addNotification("MFA enabled successfully!", "success");
            setMfaSetupUser(null);
            setAppState('app');
            return { success: true };
        } else {
            return { success: false, message: "Invalid verification code." };
        }
    };
    
    const handleDisableMfa = async (password: string): Promise<{ success: boolean, message: string }> => {
        if (!currentUser || currentUser.password !== password) {
            return { success: false, message: "Incorrect password." };
        }
        const updatedUser = { ...currentUser, mfaEnabled: false };
        setUsersForCurrentCompany(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        addAuditLog('MFA_DISABLED', `User ${updatedUser.name} disabled MFA.`);
        addNotification("MFA disabled successfully.", "success");
        return { success: true, message: "MFA disabled." };
    };
    
    const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
        if (!currentUser || currentUser.password !== currentPassword) {
            return { success: false, message: "Your current password was incorrect." };
        }
        const updatedUser = { ...currentUser, password: newPassword };
        setUsersForCurrentCompany(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        addAuditLog('PASSWORD_CHANGED', `User ${updatedUser.name} changed their password.`);
        return { success: true, message: "Password updated successfully." };
    };

    const handleLogout = () => {
        if (currentUser) {
            addAuditLog('USER_LOGOUT', `User ${currentUser.name} logged out.`);
        }
        setCurrentUser(null);
        setCurrentCompanyId(null);
        setAppState('login');
    };

    const handleVerifyUser = (email: string): boolean => {
         let found = false;
         setAllCompanyData(prev => {
            const newData = {...prev};
            for (const companyId in newData) {
                newData[companyId].users = newData[companyId].users.map(u => {
                    if (u.email.toLowerCase() === email.toLowerCase()) {
                        found = true;
                        return { ...u, isVerified: true };
                    }
                    return u;
                });
            }
            return newData;
        });
        if(found) {
            addNotification(`Email ${email} has been verified. You can now log in.`, 'success');
        }
        return found;
    };
    
     const handleForgotPassword = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
        let foundUser: User | undefined;
        let foundCompanyId: string | undefined;

        for (const company of companies) {
            const userInCompany = allCompanyData[company.id]?.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (userInCompany) {
                foundUser = userInCompany;
                foundCompanyId = company.id;
                break;
            }
        }
        if (!foundUser || !foundCompanyId) {
            return { success: false, message: "If an account with that email exists, a reset link has been sent." };
        }
        
        const token = `reset-${Date.now()}`;
        const expires = Date.now() + 3600000; // 1 hour
        const updatedUser = { ...foundUser, passwordResetToken: token, passwordResetExpires: expires };

        setAllCompanyData(prev => ({
            ...prev,
            [foundCompanyId!]: {
                ...prev[foundCompanyId!],
                users: prev[foundCompanyId!].users.map(u => u.id === updatedUser.id ? updatedUser : u),
            }
        }));

        addAuditLog('PASSWORD_RESET_REQUESTED', `Password reset requested for ${foundUser.name}.`);
        // In a real app, you would email the link. Here we provide the token directly.
        return { success: true, message: "A password reset token has been generated below (for demo purposes).", token };
    };
    
    const handleResetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        let foundUser: User | undefined;
        let foundCompanyId: string | undefined;

        for (const company of companies) {
            const userInCompany = allCompanyData[company.id]?.users.find(u => u.passwordResetToken === token);
            if (userInCompany) {
                foundUser = userInCompany;
                foundCompanyId = company.id;
                break;
            }
        }
        if (!foundUser || !foundCompanyId || !foundUser.passwordResetExpires || foundUser.passwordResetExpires < Date.now()) {
            return { success: false, message: "Invalid or expired reset token." };
        }

        const updatedUser: User = { ...foundUser, password: newPassword, passwordResetToken: undefined, passwordResetExpires: undefined };
         setAllCompanyData(prev => ({
            ...prev,
            [foundCompanyId!]: {
                ...prev[foundCompanyId!],
                users: prev[foundCompanyId!].users.map(u => u.id === updatedUser.id ? updatedUser : u),
            }
        }));
        
        addAuditLog('PASSWORD_RESET_COMPLETED', `Password was reset for ${foundUser.name}.`);
        return { success: true, message: "Password has been reset successfully. You will be redirected to the login page." };
    };

    const handleSetupCompany = (
        profileData: Omit<CompanyProfile, 'id' | 'license'>,
        adminData: Omit<User, 'id' | 'isVerified' | 'role'>
    ) => {
        const companyId = `company-${Date.now()}`;
        const newCompany: CompanyProfile = {
            id: companyId,
            ...profileData,
        };
        const newAdmin: User = {
            id: `user-${Date.now()}`,
            ...adminData,
            role: 'Administrator',
            isVerified: true, // First admin is auto-verified
            mfaEnabled: false,
        };

        const newCompanyData: CompanyData = {
            users: [newAdmin],
            documents: [],
            auditLog: [],
            tasks: [],
        };

        setCompanies(prev => [...prev, newCompany]);
        setAllCompanyData(prev => ({ ...prev, [companyId]: newCompanyData }));
        addNotification("Company and administrator account created successfully! Please log in.", "success");
        setAppState('login');
    };

    const handleCreateNewCompany = (
        profileData: Omit<CompanyProfile, 'id' | 'license'>,
        adminData: Omit<User, 'id' | 'isVerified' | 'role'>
    ) => {
        const companyId = `company-${Date.now()}`;
        const trialExpiresAt = new Date();
        trialExpiresAt.setDate(trialExpiresAt.getDate() + 7);

        const newLicense: License = {
            key: `trial-${companyId}-${Date.now()}`,
            status: 'active',
            tier: 'trial',
            expiresAt: trialExpiresAt.getTime(),
        };

        const newCompany: CompanyProfile = {
            id: companyId,
            ...profileData,
            license: newLicense,
        };
        const newAdmin: User = {
            id: `user-${companyId}-${Date.now()}`,
            ...adminData,
            role: 'Administrator',
            isVerified: true, // Auto-verified for creation by super-admin
            mfaEnabled: false,
        };

        const newCompanyData: CompanyData = {
            users: [newAdmin],
            documents: [],
            auditLog: [],
            tasks: [],
        };
        
        if (currentUser) {
            addAuditLog('COMPANY_CREATED', `User ${currentUser.name} created new company: ${newCompany.name}.`, newCompany.id);
        }

        setCompanies(prev => [...prev, newCompany]);
        setAllCompanyData(prev => ({ ...prev, [companyId]: newCompanyData }));
        addNotification(`Company "${newCompany.name}" created with a 7-day trial.`, "success");
    };

    // --- NOORA AI ASSISTANT LOGIC ---
    const handleStartNoora = (type: NooraAssessmentType) => {
        setNooraAssessmentType(type);
        setNooraCurrentControlIndex(0); // Start from the beginning
        setNooraActiveField({ controlCode: null, field: null });
        setIsNooraAssessing(true);
    };

    const handleCloseNoora = () => {
        setIsNooraAssessing(false);
        setNooraAssessmentType(null);
    };

    const handleNooraNextControl = () => {
        setNooraCurrentControlIndex(prev => {
            const data = getNooraAssessmentData();
            if (data && prev < data.length - 1) {
                return prev + 1;
            }
            return prev;
        });
    };

    const handleNooraPreviousControl = () => {
        setNooraCurrentControlIndex(prev => {
            if (prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    };
    
    const handleNooraEvidenceRequestHandled = () => {
        setNooraEvidenceRequest(null);
    }

    const getNooraAssessmentData = () => {
        switch (nooraAssessmentType) {
            case 'ecc': return eccAssessment;
            case 'pdpl': return pdplAssessment;
            case 'sama': return samaCsfAssessment;
            case 'cma': return cmaAssessment;
            case 'hrsd': return hrsdAssessment;
            default: return [];
        }
    };
    
    if (appState === 'login' && companies.length === 0) {
        setAppState('setup');
    }

    if(appState === 'login') {
        return <LoginPage 
            onLogin={handleLogin} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            onSetupCompany={() => setAppState('setup')}
            onVerify={handleVerifyUser}
            onForgotPassword={handleForgotPassword}
            onResetPassword={handleResetPassword}
        />;
    }

    if (appState === 'setup') {
        return <CompanySetupPage onSetup={handleSetupCompany} onCancel={() => setAppState('login')} theme={theme} toggleTheme={toggleTheme} />;
    }
    
    if(appState === 'mfa_verify' && mfaRequiredUser && currentCompanyId) {
        return <MfaVerifyPage
            user={mfaRequiredUser}
            onVerify={handleMfaVerify}
            onCancel={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
        />
    }

    if(appState === 'mfa_setup' && mfaSetupUser && currentCompanyId) {
        return <MfaSetupPage
            user={mfaSetupUser}
            companyName={companies.find(c => c.id === currentCompanyId)?.name || ''}
            onVerified={handleMfaSetupVerified}
            onCancel={() => setAppState('app')}
            theme={theme}
            toggleTheme={toggleTheme}
        />
    }

  if (!currentUser || !currentCompanyId) {
    return (
      <div id="loading-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
        </svg>
        <p>Loading application...</p>
      </div>
    );
  }

  const renderView = () => {
    if (!isLicensed) {
        return (
             <main className="flex-1 flex items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900 overflow-y-auto">
              <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-lg w-full">
                <LockClosedIcon className="w-16 h-16 mx-auto text-yellow-500" />
                <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">Subscription Required</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Your company's subscription has expired or is not configured. Access to the platform is currently disabled.</p>
                {currentUserPermissions.has('company:update') ? (
                  <>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">Please activate a new license key to restore access for your organization.</p>
                    <button onClick={() => handleSetView('companyProfile')} className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                      Manage Subscription
                    </button>
                  </>
                ) : (
                  <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">Please contact your company's administrator to renew the subscription.</p>
                )}
              </div>
            </main>
        );
    }
    if (isContentViewLoading) return <ContentViewSkeleton />;
    switch (currentView) {
        case 'dashboard': return <DashboardPage repository={documentRepository} currentUser={currentUser!} allControls={allControls} domains={eccData} onSetView={handleSetView} trainingProgress={trainingProgress} eccAssessment={eccAssessment} pdplAssessment={pdplAssessment} samaCsfAssessment={samaCsfAssessment} cmaAssessment={cmaAssessment} hrsdAssessment={hrsdAssessment} tasks={tasks} setTasks={setTasksForCurrentCompany} />;
        case 'navigator': return <ContentView domain={selectedDomain} activeControlId={activeControlId} setActiveControlId={setActiveControlId} onAddDocument={handleAddDocumentToRepo} documentRepository={documentRepository} permissions={currentUserPermissions} onSetView={handleSetView as (view: View) => void} />;
        case 'documents': return <DocumentsPage repository={documentRepository} currentUser={currentUser!} onApprovalAction={handleApprovalAction} onAddDocument={handleAddDocumentToRepo} permissions={currentUserPermissions} company={currentCompany!} />;
        case 'companyProfile': return <CompanyProfilePage company={currentCompany} onSave={handleSaveCompanyProfile} canEdit={currentUserPermissions.has('company:update')} addNotification={addNotification} currentUser={currentUser} onSetupCompany={handleCreateNewCompany} />;
        case 'auditLog': return <AuditLogPage auditLog={auditLog} />;
        case 'assessment': return <AssessmentPage assessmentData={eccAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('ecc', c, u)} status={assessmentStatuses.ecc} onInitiate={() => handleInitiateAssessment('ecc')} onComplete={() => handleCompleteAssessment('ecc')} permissions={currentUserPermissions} onSetView={handleSetView as (view: 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'userProfile' | 'mfaSetup') => void} onStartNoora={() => handleStartNoora('ecc')} nooraActiveField={nooraActiveField} evidenceRequestControlCode={nooraAssessmentType === 'ecc' ? nooraEvidenceRequest : null} onEvidenceRequestHandled={handleNooraEvidenceRequestHandled} />;
        case 'pdplAssessment': return <PDPLAssessmentPage assessmentData={pdplAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('pdpl', c, u)} status={assessmentStatuses.pdpl} onInitiate={() => handleInitiateAssessment('pdpl')} onComplete={() => handleCompleteAssessment('pdpl')} permissions={currentUserPermissions} onStartNoora={() => handleStartNoora('pdpl')} nooraActiveField={nooraActiveField} evidenceRequestControlCode={nooraAssessmentType === 'pdpl' ? nooraEvidenceRequest : null} onEvidenceRequestHandled={handleNooraEvidenceRequestHandled} />;
        case 'samaCsfAssessment': return <SamaCsfAssessmentPage assessmentData={samaCsfAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('sama', c, u)} status={assessmentStatuses.sama} onInitiate={() => handleInitiateAssessment('sama')} onComplete={() => handleCompleteAssessment('sama')} permissions={currentUserPermissions} onStartNoora={() => handleStartNoora('sama')} nooraActiveField={nooraActiveField} evidenceRequestControlCode={nooraAssessmentType === 'sama' ? nooraEvidenceRequest : null} onEvidenceRequestHandled={handleNooraEvidenceRequestHandled} />;
        case 'cmaAssessment': return <CMAAssessmentPage assessmentData={cmaAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('cma', c, u)} status={assessmentStatuses.cma} onInitiate={() => handleInitiateAssessment('cma')} onComplete={() => handleCompleteAssessment('cma')} permissions={currentUserPermissions} onStartNoora={() => handleStartNoora('cma')} nooraActiveField={nooraActiveField} evidenceRequestControlCode={nooraAssessmentType === 'cma' ? nooraEvidenceRequest : null} onEvidenceRequestHandled={handleNooraEvidenceRequestHandled} />;
        case 'hrsdAssessment': return <HRSDAssessmentPage assessmentData={hrsdAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('hrsd', c, u)} status={assessmentStatuses.hrsd} onInitiate={() => handleInitiateAssessment('hrsd')} onComplete={() => handleCompleteAssessment('hrsd')} permissions={currentUserPermissions} onStartNoora={() => handleStartNoora('hrsd')} nooraActiveField={nooraActiveField} evidenceRequestControlCode={nooraAssessmentType === 'hrsd' ? nooraEvidenceRequest : null} onEvidenceRequestHandled={handleNooraEvidenceRequestHandled} />;
        case 'userManagement': return <UserManagementPage users={usersForCurrentCompany} setUsers={setUsersForCurrentCompany} currentUser={currentUser} addNotification={addNotification} addAuditLog={addAuditLog} />;
        case 'userProfile': return <UserProfilePage currentUser={currentUser!} onChangePassword={handleChangePassword} onEnableMfa={handleEnableMfa} onDisableMfa={handleDisableMfa} />;
        case 'help': return <HelpSupportPage onStartTour={() => setIsTourOpen(true)} />;
        case 'training': return <TrainingPage userProgress={trainingProgress} onUpdateProgress={handleUpdateTrainingProgress} />;
        case 'riskAssessment': return <RiskAssessmentPage risks={riskAssessmentData} setRisks={setRiskAssessmentDataForCurrentCompany} status={assessmentStatuses.riskAssessment} onInitiate={() => handleInitiateAssessment('riskAssessment')} onComplete={() => handleCompleteAssessment('riskAssessment')} permissions={currentUserPermissions} onStartAssistant={(risk) => setAssessingRisk(risk)} setRepository={setDocumentRepositoryForCurrentCompany} currentUser={currentUser} company={currentCompany!} addNotification={addNotification} />;
        case 'controlMapping': return <ControlMappingPage eccData={eccData} pdplData={pdplAssessment} samaData={samaCsfAssessment} cmaData={cmaAssessment} hrsdData={hrsdAssessment} mappingData={mappingData} />;
        default: return <div>View not found</div>;
    }
  };
    
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
                                      <ul>{searchResults.map((result) => (
                                          <li key={result.control.id} onMouseDown={() => handleResultClick(result)} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700/50">
                                              <div className="flex items-center justify-between"><div className="font-semibold text-teal-600 dark:text-teal-400 font-mono text-sm">{result.control.id}</div><ArrowUpRightIcon className="w-4 h-4 text-gray-400" /></div>
                                              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{highlightText(result.control.description, debouncedSearchQuery)}</div>
                                              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">{result.domain.name} &gt; {result.subdomain.title}</div>
                                          </li>))}
                                      </ul>
                                  </div>
                              )}
                          </div>
                          <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-semibold text-sm">{currentUser.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</div>
                              </div>
                              <button onClick={handleLogout} title="Sign Out" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <LogoutIcon className="w-6 h-6" />
                              </button>
                              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                              </button>
                          </div>
                      </div>
                  </header>
                  <main className="flex-1 overflow-y-auto p-6 md:p-8">
                      {renderView()}
                  </main>
              </div>
          </div>
          
          {isNooraAssessing && nooraAssessmentType && (
            <NooraAssistant
                isAssessing={isNooraAssessing}
                onClose={handleCloseNoora}
                assessmentData={getNooraAssessmentData()}
                onUpdateItem={(controlCode, updatedItem) => handleUpdateAssessmentItem(nooraAssessmentType, controlCode, updatedItem)}
                currentControlIndex={nooraCurrentControlIndex}
                onNextControl={handleNooraNextControl}
                onPreviousControl={handleNooraPreviousControl}
                assessmentType={nooraAssessmentType.toUpperCase()}
                onInitiate={() => handleInitiateAssessment(nooraAssessmentType as keyof AssessmentStatuses)}
                onActiveFieldChange={(controlCode, field) => setNooraActiveField({ controlCode, field })}
                onRequestEvidenceUpload={(controlCode) => setNooraEvidenceRequest(controlCode)}
            />
          )}

          {assessingRisk && (
            <RiskAssistant
                isOpen={assessingRisk !== null}
                onClose={() => setAssessingRisk(null)}
                riskToAssess={assessingRisk}
                onUpdateRisk={(updatedRisk) => setRiskAssessmentDataForCurrentCompany(prev => prev.map(r => r.id === updatedRisk.id ? updatedRisk : r))}
                onSetActiveField={(riskId, field) => setRiskAssistantActiveField({ riskId, field })}
                onRequestEvidenceUpload={(risk) => setRiskEvidenceRequest(risk)}
            />
          )}

          <TourGuide isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} steps={tourSteps} />
          
          <div className="fixed top-5 right-5 z-[200] space-y-3">
            {notifications.map((n) => (
                <NotificationComponent key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
            ))}
          </div>
          
          {showInitiateConfirmModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-[150] flex items-center justify-center p-4" onClick={() => setShowInitiateConfirmModal(null)}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                      <div className="p-6 text-center">
                          <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-yellow-500" />
                          <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">Confirm New Assessment</h3>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                              Are you sure you want to start a new <span className="font-semibold uppercase">{showInitiateConfirmModal.replace('Assessment', '')}</span> assessment? All current progress for this framework will be erased. This action cannot be undone.
                          </p>
                      </div>
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3 rounded-b-lg">
                          <button
                              type="button"
                              onClick={() => setShowInitiateConfirmModal(null)}
                              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none"
                          >
                              Cancel
                          </button>
                          <button
                              type="button"
                              onClick={() => executeInitiateAssessment(showInitiateConfirmModal)}
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                          >
                              Confirm & Erase
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </>
  );
};

export default App;