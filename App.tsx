



import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
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
import { UserProfilePage } from './components/UserProfilePage';
import { HelpSupportPage } from './components/HelpSupportPage';
import { TrainingPage } from './components/TrainingPage';
import { LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, UserCircleIcon, CheckCircleIcon, InformationCircleIcon, CloseIcon, ChevronDownIcon, LogoutIcon, LockClosedIcon, DownloadIcon, ExclamationTriangleIcon } from './components/Icons';
import { eccData } from './data/controls';
import { assessmentData as initialAssessmentData } from './data/assessmentData';
import { pdplAssessmentData as initialPdplAssessmentData } from './data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from './data/samaCsfAssessmentData';
import { trainingCourses } from './data/trainingData';
import type { Domain, Control, Subdomain, SearchResult, ChatMessage, PolicyDocument, UserRole, DocumentStatus, User, CompanyProfile, AuditLogEntry, AuditAction, License, AssessmentItem, UserTrainingProgress, Task } from './types';
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
  trainingProgress?: UserTrainingProgress;
  tasks?: Task[];
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

type View = 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'userProfile' | 'mfaSetup' | 'help' | 'training';


// FIX: Export App component to be used in index.tsx
export const App: React.FC = () => {
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
  const trainingProgress = useMemo(() => allCompanyData[currentCompanyId || '']?.trainingProgress || {}, [allCompanyData, currentCompanyId]);
  const tasks = useMemo(() => allCompanyData[currentCompanyId || '']?.tasks || [], [allCompanyData, currentCompanyId]);


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
          const currentData = prevData[companyIdForLog] || { users: [], documents: [], auditLog: [], tasks: [] };
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
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
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
      const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
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
            const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
            const newTasks = typeof updater === 'function' ? updater(currentData.tasks || []) : updater;
            return {
                ...prevData,
                [currentCompanyId]: { ...currentData, tasks: newTasks }
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
                assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle' },
                trainingProgress: {},
                tasks: [],
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
                const parsedData = data ? JSON.parse(data) : { users: [], documents: [], auditLog: [], tasks: [] };
                // Ensure assessment data is present
                loadedCompanyData[company.id] = {
                    ...parsedData,
                    eccAssessment: parsedData.eccAssessment || initialAssessmentData,
                    pdplAssessment: parsedData.pdplAssessment || initialPdplAssessmentData,
                    samaCsfAssessment: parsedData.samaCsfAssessment || initialSamaCsfAssessmentData,
                    assessmentStatuses: parsedData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' },
                    trainingProgress: parsedData.trainingProgress || {},
                    tasks: parsedData.tasks || [],
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
            const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : 'samaCsfAssessment';
            return {
                ...prev,
                [currentCompanyId!]: {
                    ...currentData,
                    [key]: resetData,
                    assessmentStatuses: { ...(currentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' }), [type]: 'in-progress' }
                }
            };
        });
        addNotification(`${type.toUpperCase()} assessment has been initiated.`, 'success');
    };

    const handleCompleteAssessment = async (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;

        const currentData = allCompanyData[currentCompanyId];
        if (!currentData) return;

        const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : 'samaCsfAssessment';
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
                    assessmentStatuses: { ...(updatedCurrentData.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle' }), [type]: 'idle' }
                }
            };
        });
    };

    const handleUpdateAssessmentItem = (type: keyof AssessmentStatuses, controlCode: string, updatedItem: AssessmentItem) => {
        if (!currentCompanyId) return;
        
        setAllCompanyData(prev => {
            const currentData = prev[currentCompanyId];
            // FIX: Add a guard to prevent spreading an undefined `currentData` object.
            if (!currentData) return prev;
            const key = type === 'ecc' ? 'eccAssessment' : type === 'pdpl' ? 'pdplAssessment' : 'samaCsfAssessment';
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
              assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle' },
              trainingProgress: {},
              tasks: [],
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

  const handleLogout = useCallback(() => {
    if (session) {
        addAuditLog('USER_LOGOUT', `User ${session.user.name} logged out.`);
    }
    setSession(null);
    setMfaUserToVerify(null);
    setIsIdleWarningVisible(false); // Reset warning on logout
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  }, [session, addAuditLog]);

    // Inactivity timeout logic
  const resetIdleTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    if (session) {
        warningTimerRef.current = window.setTimeout(() => {
            setIsIdleWarningVisible(true);
        }, IDLE_TIMEOUT_MS - WARNING_DURATION_MS);

        logoutTimerRef.current = window.setTimeout(() => {
            handleLogout();
        }, IDLE_TIMEOUT_MS);
    }
  }, [session, handleLogout]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    const reset = () => resetIdleTimers();
    events.forEach(event => window.addEventListener(event, reset));
    resetIdleTimers();

    return () => {
        events.forEach(event => window.removeEventListener(event, reset));
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [resetIdleTimers]);

  useEffect(() => {
    let interval: number | null = null;
    if (isIdleWarningVisible) {
        setCountdown(WARNING_DURATION_MS / 1000);
        interval = window.setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    if (interval) clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => {
        if (interval) clearInterval(interval);
    };
  }, [isIdleWarningVisible]);

  // Authentication Handlers
  const handleLogin = async (email: string, password: string): Promise<{error: string, code?: string} | null> => {
    let user: User | undefined;
    let companyId: string | undefined;

    for (const cid of Object.keys(allCompanyData)) {
        const companyUsers = allCompanyData[cid].users;
        const foundUser = companyUsers.find(u => u.email === email);
        if (foundUser) {
            user = foundUser;
            companyId = cid;
            break;
        }
    }

    if (user && user.password === password) {
        if (!user.isVerified) {
            return { error: 'Your account has not been verified. Please check your email.', code: 'unverified' };
        }
        
        const isExpired = user.accessExpiresAt && user.accessExpiresAt < Date.now();
        if (isExpired) {
             return { error: 'Your access has expired. Please contact an administrator.' };
        }

        if (user.mfaEnabled) {
            setMfaUserToVerify(user);
            return null; // Proceed to MFA verification
        }

        if (companyId) {
            setSession({ user, companyId });
            addAuditLog('USER_LOGIN', `User ${user.name} logged in successfully.`);
            return null;
        }
    }
    return { error: 'Invalid email or password.' };
  };
  
  const handleMfaLoginVerify = async (userId: string, verificationCode: string): Promise<{ success: boolean; message?: string }> => {
    // In a real app, you'd verify the TOTP code. Here we'll just simulate success for any 6-digit code.
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
         return { success: false, message: 'Invalid code format. Please enter a 6-digit code.' };
    }
    
    const user = mfaUserToVerify;
    if (user && user.id === userId) {
        let companyId: string | undefined;
        for (const cid of Object.keys(allCompanyData)) {
            if (allCompanyData[cid].users.some(u => u.id === userId)) {
                companyId = cid;
                break;
            }
        }
        if (companyId) {
            setSession({ user, companyId });
            // Cannot call addAuditLog here as session is not set yet for it. It will be called after session is set.
            // Let's modify addAuditLog to not depend on session state directly but passed arguments
            
            const newLogEntry: AuditLogEntry = {
              id: `log-${Date.now()}`,
              timestamp: Date.now(),
              userId: user.id,
              userName: user.name,
              action: 'USER_LOGIN',
              details: `User ${user.name} logged in successfully via MFA.`
            };
            setAllCompanyData(prev => ({
              ...prev,
              [companyId!]: {
                ...prev[companyId!],
                auditLog: [newLogEntry, ...(prev[companyId!]?.auditLog || [])]
              }
            }));

            setMfaUserToVerify(null);
            return { success: true };
        }
    }
    return { success: false, message: 'Verification failed.' };
  };
  
  const handleVerifyUser = (email: string): boolean => {
    let userFound = false;
    setAllCompanyData(prevData => {
      const newData = { ...prevData };
      for (const companyId in newData) {
        const users = newData[companyId].users;
        const userIndex = users.findIndex(u => u.email === email && !u.isVerified);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], isVerified: true };
          newData[companyId] = { ...newData[companyId], users: [...users] };
          userFound = true;
          break; 
        }
      }
      return newData;
    });
    if (userFound) {
      addNotification('Your account has been verified! You can now log in.', 'success');
    }
    return userFound;
  };
  
  const handleForgotPassword = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
    let user: User | undefined;
    let userCompanyId: string | undefined;

    for (const companyId of Object.keys(allCompanyData)) {
         const foundUser = allCompanyData[companyId].users.find(u => u.email === email);
         if (foundUser) {
             user = foundUser;
             userCompanyId = companyId;
             break;
         }
    }

    if (user && userCompanyId) {
        const token = `reset-${Date.now()}`; // Mock token
        const expires = Date.now() + 3600000; // 1 hour
        
        setAllCompanyData(prev => ({
            ...prev,
            [userCompanyId!]: {
                ...prev[userCompanyId!],
                users: prev[userCompanyId!].users.map(u => u.id === user!.id ? {...u, passwordResetToken: token, passwordResetExpires: expires} : u)
            }
        }));

        // Cannot call addAuditLog here.
        return { success: true, message: "For demonstration, your reset token is provided below. In a real app, this would be emailed.", token };
    }
    return { success: false, message: "No account found with that email address." };
  };

  const handleResetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    let user: User | undefined;
    let userCompanyId: string | undefined;

    for (const companyId of Object.keys(allCompanyData)) {
         const foundUser = allCompanyData[companyId].users.find(u => u.passwordResetToken === token && u.passwordResetExpires && u.passwordResetExpires > Date.now());
         if (foundUser) {
             user = foundUser;
             userCompanyId = companyId;
             break;
         }
    }
    
    if (user && userCompanyId) {
         setAllCompanyData(prev => ({
            ...prev,
            [userCompanyId!]: {
                ...prev[userCompanyId!],
                users: prev[userCompanyId!].users.map(u => u.id === user!.id ? {...u, password: newPassword, passwordResetToken: undefined, passwordResetExpires: undefined} : u)
            }
        }));
        // Cannot call addAuditLog here.
        return { success: true, message: "Password reset successfully! You can now log in." };
    }

    return { success: false, message: "Invalid or expired reset token." };
  };


  const renderMainContent = () => {
    if (!session) {
      if (mfaUserToVerify) {
        return (
          <MfaVerifyPage
            user={mfaUserToVerify}
            onVerify={handleMfaLoginVerify}
            onCancel={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      }

      if (viewForNoSession === 'login') {
        return (
          <LoginPage
            onLogin={handleLogin}
            theme={theme}
            toggleTheme={toggleTheme}
            onSetupCompany={() => setViewForNoSession('setup')}
            onVerify={handleVerifyUser}
            onForgotPassword={handleForgotPassword}
            onResetPassword={handleResetPassword}
          />
        );
      } else { // 'setup'
        return (
          <CompanySetupPage
            onSetup={handleCompanySetup}
            onCancel={() => setViewForNoSession('login')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      }
    }
    
    // Logged-in view
    const mainContent = () => {
        if (!isLicensed && currentView !== 'companyProfile') {
            return (
                 <LicenseWall 
                    currentUser={currentUser}
                    onGoToProfile={() => setCurrentView('companyProfile')}
                    permissions={currentUserPermissions}
                />
            );
        }

        if (isContentViewLoading) return <ContentViewSkeleton />;

        switch (currentView) {
            case 'dashboard':
                return <DashboardPage
                    repository={documentRepository}
                    currentUser={currentUser!}
                    allControls={allControls}
                    domains={eccData}
                    onSetView={setCurrentView}
                    trainingProgress={trainingProgress}
                    eccAssessment={eccAssessment}
                    pdplAssessment={pdplAssessment}
                    samaCsfAssessment={samaCsfAssessment}
                    tasks={tasks}
                    setTasks={setTasksForCurrentCompany}
                />;
            case 'navigator':
                return <ContentView domain={selectedDomain} activeControlId={activeControlId} setActiveControlId={setActiveControlId} onAddDocument={handleAddDocumentToRepo} documentRepository={documentRepository} permissions={currentUserPermissions} onSetView={setCurrentView} />;
            case 'documents':
                 return <DocumentsPage repository={documentRepository} currentUser={currentUser!} onApprovalAction={handleApprovalAction} onAddDocument={handleAddDocumentToRepo} permissions={currentUserPermissions} company={currentCompany!} />;
            case 'users':
                return <UserManagementPage users={users} setUsers={setUsersForCurrentCompany} currentUser={currentUser!} addNotification={addNotification} addAuditLog={addAuditLog} />;
            case 'companyProfile':
                return <CompanyProfilePage company={currentCompany} onSave={handleSaveCompanyProfile} canEdit={currentUserPermissions.has('company:update')} addNotification={addNotification} />;
            case 'auditLog':
                 return <AuditLogPage auditLog={auditLog} />;
            case 'assessment':
                return <AssessmentPage assessmentData={eccAssessment} onUpdateItem={(code, item) => handleUpdateAssessmentItem('ecc', code, item)} status={assessmentStatuses.ecc} onInitiate={() => handleInitiateAssessment('ecc')} onComplete={() => handleCompleteAssessment('ecc')} permissions={currentUserPermissions} onSetView={setCurrentView} />;
            case 'pdplAssessment':
                 return <PDPLAssessmentPage assessmentData={pdplAssessment} onUpdateItem={(code, item) => handleUpdateAssessmentItem('pdpl', code, item)} status={assessmentStatuses.pdpl} onInitiate={() => handleInitiateAssessment('pdpl')} onComplete={() => handleCompleteAssessment('pdpl')} permissions={currentUserPermissions} />;
            case 'samaCsfAssessment':
                return <SamaCsfAssessmentPage assessmentData={samaCsfAssessment} onUpdateItem={(code, item) => handleUpdateAssessmentItem('sama', code, item)} status={assessmentStatuses.sama} onInitiate={() => handleInitiateAssessment('sama')} onComplete={() => handleCompleteAssessment('sama')} permissions={currentUserPermissions} />;
            case 'userProfile':
                return <UserProfilePage currentUser={currentUser!} onChangePassword={handleChangePassword} onEnableMfa={handleEnableMfaRequest} onDisableMfa={handleDisableMfa} />;
            case 'mfaSetup':
                 if (!mfaSetupUser) {
                    setCurrentView('userProfile'); // Should not happen, redirect
                    return null;
                }
                return <MfaSetupPage user={mfaSetupUser} companyName={currentCompany?.name || 'Your Company'} onVerified={handleVerifyMfaSetup} onCancel={() => { setMfaSetupUser(null); setCurrentView('userProfile'); }} theme={theme} toggleTheme={toggleTheme} />;
            case 'help':
                return <HelpSupportPage />;
            case 'training':
                return <TrainingPage userProgress={trainingProgress} onUpdateProgress={handleUpdateTrainingProgress} />;
            default:
                return <div>Not Found</div>;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar
                domains={eccData}
                selectedDomain={selectedDomain}
                onSelectDomain={handleSelectDomain}
                currentView={currentView}
                onSetView={setCurrentView}
                permissions={currentUserPermissions}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center flex-1 min-w-0">
                            <div className="relative w-full max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for controls (e.g., 1.5.1)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                                {isSearchFocused && searchResults.length > 0 && (
                                    <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 z-10">
                                        <ul>
                                            {searchResults.map((result) => (
                                                <li key={result.control.id} onMouseDown={() => handleResultClick(result)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{result.control.id}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300">{highlightText(result.control.description, debouncedSearchQuery)}</p>
                                                        </div>
                                                        <ArrowUpRightIcon className="w-5 h-5 text-gray-400 ml-4" />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center ml-6">
                            {installPrompt && !isStandalone && (
                                <button
                                  onClick={handleInstallClick}
                                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                                  title="Install to Desktop"
                                >
                                  <DownloadIcon className="w-6 h-6" />
                                </button>
                            )}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                            </button>
                             <div className="ml-4 flex items-center">
                                <UserCircleIcon className="w-6 h-6 text-gray-500" />
                                <div className="ml-2 text-sm">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{currentUser?.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{currentUser?.role}</p>
                                </div>
                            </div>
                             <button onClick={handleLogout} className="ml-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none" aria-label="Sign Out">
                                <LogoutIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {mainContent()}
                </main>
            </div>
             <LiveAssistantWidget isOpen={isAssistantOpen} onToggle={() => setIsAssistantOpen(!isAssistantOpen)} onNavigate={(view) => { setCurrentView(view); setIsAssistantOpen(false); }} />
        </div>
    );
  };
  
    return (
        <>
            {/* Notification container */}
            <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {notifications.map(notification => (
                        <div key={notification.id} className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {notification.type === 'success' ? (
                                            <CheckCircleIcon className="h-6 w-6 text-green-400" />
                                        ) : (
                                            <InformationCircleIcon className="h-6 w-6 text-blue-400" />
                                        )}
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.message}</p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button onClick={() => removeNotification(notification.id)} className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300">
                                            <span className="sr-only">Close</span>
                                            <CloseIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isIdleWarningVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Session Timeout Warning</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            You have been inactive. For your security, you will be logged out in...
                        </p>
                        <p className="text-5xl font-bold text-teal-600 dark:text-teal-400 my-4">{countdown}</p>
                        <button
                            onClick={() => {
                                setIsIdleWarningVisible(false);
                                resetIdleTimers();
                            }}
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                        >
                            Stay Logged In
                        </button>
                    </div>
                </div>
            )}
            
            {showInitiateConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[200] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md transform transition-all" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-gray-100" id="modal-headline">Initiate New Assessment?</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to start a new {showInitiateConfirmModal.toUpperCase()} assessment? All current progress for this assessment type will be permanently deleted. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => executeInitiateAssessment(showInitiateConfirmModal)}
                            >
                                Initiate
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setShowInitiateConfirmModal(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {renderMainContent()}
        </>
    );
};