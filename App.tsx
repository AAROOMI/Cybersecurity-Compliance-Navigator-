

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
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
import { UserProfilePage } from './components/UserProfilePage';
import { HelpSupportPage } from './components/HelpSupportPage';
import { TrainingPage } from './components/TrainingPage';
import { RiskAssessmentPage } from './components/RiskAssessmentPage';
import { TourGuide } from './components/TourGuide';
import { LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, CheckCircleIcon, InformationCircleIcon, CloseIcon, DownloadIcon, ExclamationTriangleIcon, LockClosedIcon, LogoutIcon, ChevronDownIcon, CheckIcon, BuildingOfficeIcon, ChatBotIcon, SendIcon } from './components/Icons';
import { eccData } from './data/controls';
import { trainingCourses } from './data/trainingData';
import type { Domain, Control, Subdomain, SearchResult, PolicyDocument, UserRole, DocumentStatus, User, CompanyProfile, AuditLogEntry, AuditAction, License, AssessmentItem, UserTrainingProgress, Task, ComplianceGap, Risk, ChatMessage } from './types';
import { rolePermissions } from './types';
import { ChatWidget } from './components/ChatWidget';

// Import pages for custom auth flow
import { LoginPage } from './components/LoginPage';
import { CompanySetupPage } from './components/CompanySetupPage';
import { MfaSetupPage } from './components/MfaSetupPage';
import { MfaVerifyPage } from './components/MfaVerifyPage';
import { UserManagementPage } from './components/UserManagementPage';
import { CreateCompanyModal } from './components/CreateCompanyModal';


import * as api from './components/api';


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

type View = 'dashboard' | 'navigator' | 'documents' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment' | 'userProfile' | 'help' | 'training' | 'riskAssessment' | 'userManagement';

type AppState = 'login' | 'setup' | 'app' | 'mfa_verify' | 'mfa_setup';

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
  const [allCompanyData, setAllCompanyData] = useState<Record<string, api.CompanyData>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isContentViewLoading, setIsContentViewLoading] = useState(false);
  const [appIsLoading, setAppIsLoading] = useState(true);

  const [isIdleWarningVisible, setIsIdleWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION_MS / 1000);
  const warningTimerRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const [isLicensed, setIsLicensed] = useState(true);
  
  const [showInitiateConfirmModal, setShowInitiateConfirmModal] = useState<keyof AssessmentStatuses | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);
  const [isCompanySwitcherOpen, setIsCompanySwitcherOpen] = useState(false);

  // Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { role: 'assistant', content: "Hello! I'm Noora, your AI assistant. How can I help you with the Cybersecurity Controls Navigator today?" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkInitialSetup = async () => {
        try {
            const hasCompanies = await api.hasCompanies();
            if (!hasCompanies) {
                setAppState('setup');
            } else {
                setAppState('login');
            }
        } catch (error) {
            console.error("Error checking for companies:", error);
            // Default to login on error, maybe show a notification
            setAppState('login');
        } finally {
            setAppIsLoading(false);
        }
    };
    checkInitialSetup();
  }, []);

  const currentCompany = useMemo(() => companies.find(c => c.id === currentCompanyId), [companies, currentCompanyId]);
  const documentRepository = useMemo(() => allCompanyData[currentCompanyId || '']?.documents || [], [allCompanyData, currentCompanyId]);
  const auditLog = useMemo(() => allCompanyData[currentCompanyId || '']?.auditLog || [], [allCompanyData, currentCompanyId]);
  const eccAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.eccAssessment || [], [allCompanyData, currentCompanyId]);
  const pdplAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.pdplAssessment || [], [allCompanyData, currentCompanyId]);
  const samaCsfAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.samaCsfAssessment || [], [allCompanyData, currentCompanyId]);
  const cmaAssessment = useMemo(() => allCompanyData[currentCompanyId || '']?.cmaAssessment || [], [allCompanyData, currentCompanyId]);
  const riskAssessmentData = useMemo(() => allCompanyData[currentCompanyId || '']?.riskAssessmentData || [], [allCompanyData, currentCompanyId]);
  const assessmentStatuses = useMemo(() => allCompanyData[currentCompanyId || '']?.assessmentStatuses || { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', riskAssessment: 'idle' }, [allCompanyData, currentCompanyId]);
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
  
    const addAuditLogEntry = useCallback((newLogEntry: AuditLogEntry | null) => {
        if (!currentCompanyId || !newLogEntry) return;
         setAllCompanyData(prevData => {
            const currentData = prevData[currentCompanyId] || { users: [], documents: [], auditLog: [], tasks: [] };
            const newAuditLog = [newLogEntry, ...(currentData.auditLog || [])]; 
            return { ...prevData, [currentCompanyId]: { ...currentData, auditLog: newAuditLog } };
        });
    }, [currentCompanyId]);

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
                    // In a real app, the backend would manage this. We simulate it here.
                    const updatedLicense: License = { ...license, status: 'expired' };
                    const updatedProfile: CompanyProfile = { ...currentCompany, license: updatedLicense };
                    setCompanies(prev => prev.map(c => c.id === updatedProfile.id ? updatedProfile : c));
                }
            }
        } else if (currentUser) {
             setIsLicensed(false);
        }
    }, [currentCompany, currentUser]);


    const handleUpdateUsers = (updatedUsers: User[]) => {
        if (!currentCompanyId) return;
        setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: { ...prev[currentCompanyId], users: updatedUsers }
        }));
    };
    
    const handleUpdateDocuments = (updatedDocuments: PolicyDocument[]) => {
        if (!currentCompanyId) return;
         setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: { ...prev[currentCompanyId], documents: updatedDocuments }
        }));
    };
    
    const handleUpdateRisks = (updatedRisks: Risk[]) => {
        if (!currentCompanyId) return;
         setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: { ...prev[currentCompanyId], riskAssessmentData: updatedRisks }
        }));
    };

    const handleUpdateTasks = (updatedTasks: Task[]) => {
        if (!currentCompanyId) return;
         setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: { ...prev[currentCompanyId], tasks: updatedTasks }
        }));
    };

    const executeInitiateAssessment = async (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        setShowInitiateConfirmModal(null);

        const { data, assessmentStatuses: newStatuses } = await api.initiateAssessment(currentCompanyId, type);

        setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: {
                ...prev[currentCompanyId],
                [`${type}Assessment`]: data,
                assessmentStatuses: newStatuses
            }
        }));
        addNotification(`${type.toUpperCase()} assessment has been initiated.`, 'success');
    };
    
    const handleInitiateAssessment = (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        setShowInitiateConfirmModal(type);
    };

    const handleCompleteAssessment = async (type: keyof AssessmentStatuses) => {
        if (!currentCompanyId) return;
        const newStatuses = await api.completeAssessment(currentCompanyId, type);
        setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: { ...prev[currentCompanyId], assessmentStatuses: newStatuses }
        }));
        addNotification(`${type.toUpperCase()} assessment has been completed.`, 'success');
    };

    const handleUpdateAssessmentItem = async (type: keyof Omit<AssessmentStatuses, 'riskAssessment'>, controlCode: string, updatedItem: AssessmentItem) => {
        if (!currentCompanyId) return;
        const result = await api.updateAssessmentItem(currentCompanyId, type, updatedItem);
        const key = `${type}Assessment`;
        setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: {
                ...prev[currentCompanyId],
                [key]: result
            }
        }));
    };
    
    const handleUpdateTrainingProgress = async (courseId: string, lessonId: string, score?: number) => {
        if (!currentCompanyId || !currentUser) return;
        const result = await api.updateTrainingProgress(currentCompanyId, currentUser.id, courseId, lessonId, score);
        setAllCompanyData(prev => ({
            ...prev,
            [currentCompanyId]: { ...prev[currentCompanyId], trainingProgress: result.progress }
        }));
        if (result.badgeEarned) {
             addNotification(`Congratulations! You've earned the ${result.courseTitle} badge!`, 'success');
        }
    };

  const allControls = useMemo((): SearchResult[] => eccData.flatMap(domain => domain.subdomains.flatMap(subdomain => subdomain.controls.map(control => ({ control, subdomain, domain })))), []);

  const handleSaveCompanyProfile = async (profile: CompanyProfile) => {
      const updatedProfile = await api.updateCompanyProfile(profile.id, profile);
      setCompanies(prev => prev.map(c => c.id === updatedProfile.id ? updatedProfile : c));
      addAuditLogEntry(updatedProfile.auditLogEntry);
      addNotification('Company profile saved successfully.', 'success');
  };

  const handleAddDocumentToRepo = async (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: { policy: string; procedure: string; guideline: string }) => {
    if(!currentCompanyId || !currentUser) return;
    const result = await api.addDocument(currentCompanyId, { control, subdomain, domain, generatedContent, user: currentUser });
    
    handleUpdateDocuments(result.documents);
    addAuditLogEntry(result.auditLogEntry);

    if (result.notifications.length > 0) {
        result.notifications.forEach(n => addNotification(n.message, n.type));
    }
  };
  
  const handleApprovalAction = async (documentId: string, decision: 'Approved' | 'Rejected', comments?: string) => {
    if (!currentUser || !currentCompanyId) return;
    const result = await api.updateDocumentApproval(currentCompanyId, documentId, currentUser, decision, comments);

    handleUpdateDocuments(result.documents);
    addAuditLogEntry(result.auditLogEntry);
    result.notifications.forEach(n => addNotification(n.message, n.type));
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
       try {
            const { user, companies: userCompanies, initialCompanyData, auditLogEntry } = await api.login(email, password);
            const firstCompany = userCompanies[0];
            
            if (user.mfaEnabled) {
                setMfaRequiredUser(user);
                setCurrentCompanyId(firstCompany.id); // Still need company context for MFA verification
                setCompanies(userCompanies);
                setAppState('mfa_verify');
                return null;
            }

            setCurrentUser(user);
            setCompanies(userCompanies);
            setCurrentCompanyId(firstCompany.id);
            setAllCompanyData({ [firstCompany.id]: initialCompanyData });
            setAppState('app');
            addAuditLogEntry(auditLogEntry);
            return null;
       } catch (error: any) {
           return { error: error.message, code: error.code };
       }
    };

    const handleMfaVerify = async (userId: string, verificationCode: string): Promise<{ success: boolean, message?: string }> => {
        try {
            const { user, companies: userCompanies, initialCompanyData, auditLogEntry } = await api.verifyMfa(userId, verificationCode);
            const firstCompany = userCompanies[0];

            setCurrentUser(user);
            setCompanies(userCompanies);
            setCurrentCompanyId(firstCompany.id);
            setAllCompanyData({ [firstCompany.id]: initialCompanyData });
            setAppState('app');
            addAuditLogEntry(auditLogEntry);
            setMfaRequiredUser(null);
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const handleEnableMfa = () => {
        if (!currentUser || !currentCompanyId) return;
        setMfaSetupUser(currentUser);
        setAppState('mfa_setup');
    };

    const handleMfaSetupVerified = async (userId: string, verificationCode: string): Promise<{ success: boolean, message?: string }> => {
       try {
            const { user, auditLogEntry } = await api.finalizeMfaSetup(userId, verificationCode);
            setCurrentUser(user); // Update with MFA enabled flag
            handleUpdateUsers(usersForCurrentCompany.map(u => u.id === user.id ? user : u));
            addAuditLogEntry(auditLogEntry);
            addNotification("MFA enabled successfully!", "success");
            setMfaSetupUser(null);
            setAppState('app');
            return { success: true };
       } catch (error: any) {
           return { success: false, message: error.message };
       }
    };
    
    const handleDisableMfa = async (password: string): Promise<{ success: boolean, message: string }> => {
        if (!currentUser) return { success: false, message: "No user logged in." };
        try {
            const { user, auditLogEntry } = await api.disableMfa(currentUser.id, password);
            setCurrentUser(user);
            handleUpdateUsers(usersForCurrentCompany.map(u => u.id === user.id ? user : u));
            addAuditLogEntry(auditLogEntry);
            addNotification("MFA disabled successfully.", "success");
            return { success: true, message: "MFA disabled." };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };
    
    const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
        if (!currentUser) return { success: false, message: "No user logged in." };
        try {
            const { user, auditLogEntry } = await api.changePassword(currentUser.id, currentPassword, newPassword);
            setCurrentUser(user); // Password is not stored on frontend, but we get the updated user object
            handleUpdateUsers(usersForCurrentCompany.map(u => u.id === user.id ? user : u));
            addAuditLogEntry(auditLogEntry);
            return { success: true, message: "Password updated successfully." };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const handleLogout = async () => {
        if (currentUser) {
            const { auditLogEntry } = await api.logout(currentUser.id);
            addAuditLogEntry(auditLogEntry);
        }
        setCurrentUser(null);
        setCurrentCompanyId(null);
        setCompanies([]);
        setAllCompanyData({});
        setAppState('login');
    };

    const handleVerifyUser = async (email: string): Promise<boolean> => {
        try {
            await api.verifyUser(email);
            addNotification(`Email ${email} has been verified. You can now log in.`, 'success');
            return true;
        } catch (error) {
            return false;
        }
    };
    
     const handleForgotPassword = async (email: string): Promise<{ success: boolean; message: string; token?: string }> => {
        try {
            const result = await api.forgotPassword(email);
            if (result.success) {
                if (result.auditLogEntry) {
                     addAuditLogEntry(result.auditLogEntry);
                }
                return { success: true, message: result.message, token: result.token };
            } else {
                return { success: false, message: result.message };
            }
        } catch(error: any) {
            return { success: false, message: error.message };
        }
    };
    
    const handleResetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        try {
            const result = await api.resetPassword(token, newPassword);
            return { success: true, message: result.message };
        } catch(error: any) {
            return { success: false, message: error.message };
        }
    };

    const handleSetupCompany = async (
        profileData: Omit<CompanyProfile, 'id' | 'license'>,
        adminData: Omit<User, 'id' | 'isVerified' | 'role'>
    ) => {
        try {
            await api.setupCompany(profileData, adminData);
            addNotification("Company and administrator account created successfully! Please log in.", "success");
            setAppState('login');
        } catch (error: any) {
            // Re-throw the error so the calling component can catch it and display it in the form.
            throw error;
        }
    };

    const handleCreateNewCompany = async (
        profileData: Omit<CompanyProfile, 'id' | 'license'>,
        adminData: Omit<User, 'id' | 'isVerified' | 'role'>
    ) => {
        if (!currentUser) return;
        try {
            const { newCompany, auditLogEntry } = await api.createNewCompany(profileData, adminData, currentUser.id);
            setCompanies(prev => [...prev, newCompany]);
            addAuditLogEntry(auditLogEntry);
            addNotification(`Company "${newCompany.name}" created with a 7-day trial.`, "success");
        } catch (error: any) {
             addNotification(error.message, 'info');
        }
    };
    
    const handleSwitchCompany = async (newCompanyId: string) => {
        if (!currentUser || newCompanyId === currentCompanyId) return;

        setIsCompanySwitcherOpen(false);
        setIsContentViewLoading(true);

        try {
            // Check if data is already cached
            if (!allCompanyData[newCompanyId]) {
                 const { companyData } = await api.getCompanyData(newCompanyId, currentUser.id);
                 setAllCompanyData(prev => ({ ...prev, [newCompanyId]: companyData }));
            }
            setCurrentCompanyId(newCompanyId);
            setCurrentView('dashboard'); // Always return to dashboard on switch
        } catch(error: any) {
            addNotification(`Error switching company: ${error.message}`, 'info');
        } finally {
            setIsContentViewLoading(false);
        }
    };

    // --- CHAT WIDGET LOGIC ---
    const handleSendMessage = async (message: string) => {
        setChatMessages(prev => [...prev, { role: 'user', content: message }]);
        setIsChatLoading(true);
        setChatError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `System: You are Noora, an AI assistant for the Cybersecurity Controls Navigator app. Your goal is to provide helpful, concise answers about the NCA ECC framework based on the provided data. Be friendly and professional.
              
              User: ${message}`
            });

            const text = response.text;
            setChatMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error: any) {
            console.error("Gemini API error:", error);
            setChatError("Sorry, I couldn't get a response. Please check the console for details.");
        } finally {
            setIsChatLoading(false);
        }
    };

    
    if (appIsLoading) {
         return <div id="loading-indicator"><LogoIcon /><p>Loading application...</p></div>;
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
        const setupCompanyName = companies.find(c => c.id === currentCompanyId)?.name || '';
        return <MfaSetupPage
            user={mfaSetupUser}
            companyName={setupCompanyName}
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
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const renderView = () => {
    if (!currentCompany) return <ContentViewSkeleton />;
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
        case 'dashboard': return <DashboardPage repository={documentRepository} currentUser={currentUser!} allControls={allControls} domains={eccData} onSetView={handleSetView} trainingProgress={trainingProgress} eccAssessment={eccAssessment} pdplAssessment={pdplAssessment} samaCsfAssessment={samaCsfAssessment} cmaAssessment={cmaAssessment} tasks={tasks} setTasks={handleUpdateTasks} />;
        case 'navigator': return <ContentView domain={selectedDomain} activeControlId={activeControlId} setActiveControlId={setActiveControlId} onAddDocument={handleAddDocumentToRepo} documentRepository={documentRepository} permissions={currentUserPermissions} onSetView={handleSetView} />;
        case 'documents': return <DocumentsPage repository={documentRepository} currentUser={currentUser!} onApprovalAction={handleApprovalAction} onAddDocument={handleAddDocumentToRepo} permissions={currentUserPermissions} company={currentCompany!} />;
        case 'companyProfile': return <CompanyProfilePage company={currentCompany} onSave={handleSaveCompanyProfile} canEdit={currentUserPermissions.has('company:update')} addNotification={addNotification} />;
        case 'auditLog': return <AuditLogPage auditLog={auditLog} />;
        case 'assessment': return <AssessmentPage assessmentData={eccAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('ecc', c, u)} status={assessmentStatuses.ecc} onInitiate={() => handleInitiateAssessment('ecc')} onComplete={() => handleCompleteAssessment('ecc')} permissions={currentUserPermissions} onSetView={handleSetView} />;
        case 'pdplAssessment': return <PDPLAssessmentPage assessmentData={pdplAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('pdpl', c, u)} status={assessmentStatuses.pdpl} onInitiate={() => handleInitiateAssessment('pdpl')} onComplete={() => handleCompleteAssessment('pdpl')} permissions={currentUserPermissions} />;
        case 'samaCsfAssessment': return <SamaCsfAssessmentPage assessmentData={samaCsfAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('sama', c, u)} status={assessmentStatuses.sama} onInitiate={() => handleInitiateAssessment('sama')} onComplete={() => handleCompleteAssessment('sama')} permissions={currentUserPermissions} />;
        case 'cmaAssessment': return <CMAAssessmentPage assessmentData={cmaAssessment} onUpdateItem={(c, u) => handleUpdateAssessmentItem('cma', c, u)} status={assessmentStatuses.cma} onInitiate={() => handleInitiateAssessment('cma')} onComplete={() => handleCompleteAssessment('cma')} permissions={currentUserPermissions} />;
        case 'userManagement': return <UserManagementPage users={usersForCurrentCompany} setUsers={handleUpdateUsers} currentUser={currentUser} addNotification={addNotification} addAuditLog={addAuditLogEntry} companyId={currentCompanyId} allCompanies={companies} />;
        case 'userProfile': return <UserProfilePage currentUser={currentUser!} onChangePassword={handleChangePassword} onEnableMfa={handleEnableMfa} onDisableMfa={handleDisableMfa} />;
        case 'help': return <HelpSupportPage onStartTour={() => setIsTourOpen(true)} />;
        case 'training': return <TrainingPage userProgress={trainingProgress} onUpdateProgress={handleUpdateTrainingProgress} />;
        case 'riskAssessment': return <RiskAssessmentPage risks={riskAssessmentData} setRisks={handleUpdateRisks} status={assessmentStatuses.riskAssessment} onInitiate={() => handleInitiateAssessment('riskAssessment')} onComplete={() => handleCompleteAssessment('riskAssessment')} permissions={currentUserPermissions} />;
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
                            <div className="relative">
                                <button onClick={() => setIsCompanySwitcherOpen(!isCompanySwitcherOpen)} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <span className="font-semibold text-sm">{currentCompany?.name}</span>
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isCompanySwitcherOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isCompanySwitcherOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                        <div className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">SWITCH COMPANY</div>
                                        <ul className="py-1">
                                            {companies.map(company => (
                                                <li key={company.id}>
                                                    <button onClick={() => handleSwitchCompany(company.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                                                        <span>{company.name}</span>
                                                        {company.id === currentCompanyId && <CheckIcon className="w-5 h-5 text-teal-500" />}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        {currentUserPermissions.has('company:update') && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 p-1">
                                                <button onClick={() => { setIsCreateCompanyModalOpen(true); setIsCompanySwitcherOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                                    <BuildingOfficeIcon className="w-5 h-5 mr-2 text-gray-500"/>
                                                    Create New Company
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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
          
          <TourGuide isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} steps={tourSteps} />
          
           {isCreateCompanyModalOpen && (
                <CreateCompanyModal 
                    onSetup={handleCreateNewCompany}
                    onClose={() => setIsCreateCompanyModalOpen(false)}
                />
            )}

          <div className="fixed top-5 right-5 z-[200] space-y-3">
              {notifications.map(n => (
                  <div key={n.id} className={`flex items-start p-4 rounded-lg shadow-lg border animate-fade-in-down ${n.type === 'success' ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700' : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'}`}>
                      {n.type === 'success' ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <InformationCircleIcon className="w-6 h-6 text-blue-500" />}
                      <div className="ml-3 flex-1"><p className={`text-sm font-medium ${n.type === 'success' ? 'text-green-800 dark:text-green-100' : 'text-blue-800 dark:text-blue-100'}`}>{n.message}</p></div>
                      <button onClick={() => removeNotification(n.id)} className="ml-4 p-1 rounded-full hover:bg-black/10"><CloseIcon className="w-4 h-4 text-gray-500" /></button>
                  </div>
              ))}
          </div>

          {isIdleWarningVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-[250] flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
                      <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto" />
                      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Are you still there?</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">You've been inactive for a while. For your security, you will be logged out in <span className="font-bold">{countdown}</span> seconds.</p>
                      <div className="mt-6"><button onClick={resetIdleTimers} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700">I'm still here</button></div>
                  </div>
              </div>
          )}

          {showInitiateConfirmModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-[250] flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
                      <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10"><ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-300" aria-hidden="true" /></div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Initiate New Assessment</h3>
                              <div className="mt-2"><p className="text-sm text-gray-500 dark:text-gray-400">Are you sure? This will delete all current progress for the {showInitiateConfirmModal.toUpperCase()} assessment and start over with a fresh template. This action cannot be undone.</p></div>
                          </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => executeInitiateAssessment(showInitiateConfirmModal)}>Yes, Initiate</button>
                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setShowInitiateConfirmModal(null)}>Cancel</button>
                      </div>
                  </div>
              </div>
          )}
          
          <ChatWidget 
            isOpen={isChatOpen}
            onToggle={() => setIsChatOpen(!isChatOpen)}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            error={chatError}
          />

          <style>{`@keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }`}</style>
      </>
  );
}

export default App;