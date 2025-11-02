
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

import { 
  LogoIcon, SearchIcon, ArrowUpRightIcon, SunIcon, MoonIcon, UserCircleIcon, 
  LogoutIcon, DownloadIcon, ShieldKeyholeIcon, LandmarkIcon, ClipboardCheckIcon,
  IdentificationIcon, LineChartIcon, QuestionMarkCircleIcon, GraduationCapIcon,
  BeakerIcon, ExclamationTriangleIcon, LockClosedIcon
} from './components/Icons';
import { ChatWidget } from './components/ChatWidget';
import { eccData } from './data/controls';
import { initialPdplAssessmentData } from './data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from './data/samaCsfAssessmentData';
import { cmaAssessmentData as initialCmaAssessmentData } from './data/cmaAssessmentData';
import { assessmentData as initialEccAssessmentData } from './data/assessmentData';
import { initialRiskData } from './data/riskAssessmentData';

import type { 
  Domain, Subdomain, Control, SearchResult, ChatMessage, GeneratedDocsState, 
  User, UserRole, Permission, AuditAction, AuditLogEntry, PolicyDocument, 
  DocumentStatus, GeneratedContent, CompanyProfile, License, AssessmentItem, ControlStatus,
  UserTrainingProgress, Task, AgentLogEntry, ComplianceGap, Risk
} from './types';
import { rolePermissions } from './types';

// A custom hook for persisting state to localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue] as const;
}


const App: React.FC = () => {
  // --- Core State ---
  const [appState, setAppState] = useLocalStorage<'loading' | 'setup' | 'login' | 'mfaSetup' | 'mfaVerify' | 'app'>('app-state', 'loading');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('app-current-user', null);
  const [pendingMfaUser, setPendingMfaUser] = useState<User | null>(null);

  // --- Data State ---
  const [companyProfile, setCompanyProfile] = useLocalStorage<CompanyProfile | null>('app-company-profile', null);
  const [users, setUsers] = useLocalStorage<User[]>('app-users', []);
  const [documentRepository, setDocumentRepository] = useLocalStorage<PolicyDocument[]>('app-documents', []);
  const [auditLog, setAuditLog] = useLocalStorage<AuditLogEntry[]>('app-auditlog', []);

  // --- UI State ---
  const [currentView, setCurrentView] = useLocalStorage<'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog' | 'assessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment' | 'userProfile' | 'help' | 'training' | 'riskAssessment' | 'complianceAgent'>('app-current-view', 'dashboard');
  const [selectedDomain, setSelectedDomain] = useState<Domain>(eccData[0]);
  const [activeControlId, setActiveControlId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLiveAssistantOpen, setIsLiveAssistantOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, message: string, type: 'success' | 'info'}[]>([]);

  // --- Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  
  // --- Assessment State ---
  const [eccAssessment, setEccAssessment] = useLocalStorage<AssessmentItem[]>('app-assessment-ecc', []);
  const [eccStatus, setEccStatus] = useLocalStorage<'idle' | 'in-progress'>('app-status-ecc', 'idle');
  const [pdplAssessment, setPdplAssessment] = useLocalStorage<AssessmentItem[]>('app-assessment-pdpl', []);
  const [pdplStatus, setPdplStatus] = useLocalStorage<'idle' | 'in-progress'>('app-status-pdpl', 'idle');
  const [samaCsfAssessment, setSamaCsfAssessment] = useLocalStorage<AssessmentItem[]>('app-assessment-sama', []);
  const [samaCsfStatus, setSamaCsfStatus] = useLocalStorage<'idle' | 'in-progress'>('app-status-sama', 'idle');
  const [cmaAssessment, setCmaAssessment] = useLocalStorage<AssessmentItem[]>('app-assessment-cma', []);
  const [cmaStatus, setCmaStatus] = useLocalStorage<'idle' | 'in-progress'>('app-status-cma', 'idle');

  // --- Other Modules State ---
  const [tasks, setTasks] = useLocalStorage<Task[]>('app-tasks', []);
  const [trainingProgress, setTrainingProgress] = useLocalStorage<UserTrainingProgress>('app-training-progress', {});
  const [risks, setRisks] = useLocalStorage<Risk[]>('app-risks', []);
  const [riskStatus, setRiskStatus] = useLocalStorage<'idle' | 'in-progress'>('app-status-risk', 'idle');
  const [agentLog, setAgentLog] = useLocalStorage<AgentLogEntry[]>('app-agent-log', []);
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  // --- Refs ---
  const appContainerRef = useRef<HTMLDivElement>(null);
  const deferredInstallPrompt = useRef<any>(null);

  const allControls = useMemo(() => 
    eccData.flatMap(domain => 
      domain.subdomains.flatMap(subdomain => 
        subdomain.controls.map(control => ({ control, subdomain, domain }))
      )
    ), []);

  // --- Effects ---

  useEffect(() => {
    // Theme initialization
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (localTheme) {
      setTheme(localTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Initial app state determination
    if (appState === 'loading') {
      setTimeout(() => {
        if (!companyProfile) {
          setAppState('setup');
        } else if (!currentUser) {
          setAppState('login');
        } else {
          setAppState('app');
        }
      }, 1000);
    }
  }, [appState, companyProfile, currentUser, setAppState]);
  
  // --- Handlers ---

  const addNotification = (message: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const addAuditLog = useCallback((action: AuditAction, details: string, targetId?: string) => {
    if (!currentUser) return;
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      targetId,
    };
    setAuditLog(prev => [newEntry, ...prev]);
  }, [currentUser, setAuditLog]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSetup = (profileData: Omit<CompanyProfile, 'id' | 'license'>, adminData: Omit<User, 'id' | 'isVerified' | 'role'>) => {
    const newCompany: CompanyProfile = { ...profileData, id: `company-${Date.now()}` };
    const newAdmin: User = {
      ...adminData,
      id: `user-${Date.now()}`,
      role: 'Administrator',
      isVerified: true, 
      mfaEnabled: false,
    };
    setCompanyProfile(newCompany);
    setUsers([newAdmin]);
    addNotification('Company account created successfully!', 'success');
    setAppState('login');
  };

  const handleLogin = async (email: string, password: string): Promise<{error: string, code?: string} | null> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
      return { error: "Invalid email or password." };
    }
    
    if (user.accessExpiresAt && user.accessExpiresAt < Date.now()) {
      addAuditLog('USER_LOGIN', `Failed login for ${user.name}: Account access has expired.`, user.id);
      return { error: 'Your access to this account has expired. Please contact an administrator.' };
    }

    if (user.mfaEnabled) {
        setPendingMfaUser(user);
        setAppState('mfaVerify');
        return null;
    }

    setCurrentUser(user);
    addAuditLog('USER_LOGIN', `User ${user.name} logged in successfully.`, user.id);
    setAppState('app');
    return null;
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog('USER_LOGOUT', `User ${currentUser.name} logged out.`, currentUser.id);
    }
    setCurrentUser(null);
    setAppState('login');
  };
  
  const handleMfaVerify = async (userId: string, code: string): Promise<{ success: boolean; message?: string }> => {
    // This is a simplified TOTP verification for demonstration.
    // In a real app, this would involve a cryptographic library like 'notp'.
    // Here we'll just check if it's '123456' as a placeholder.
    if (code === '123456') {
        const user = pendingMfaUser || users.find(u => u.id === userId);
        if (user) {
            // If setting up for the first time
            if (appState === 'mfaSetup') {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, mfaEnabled: true } : u));
                 addAuditLog('MFA_ENABLED', `User ${user.name} enabled MFA.`, user.id);
                 addNotification('MFA enabled successfully!', 'success');
            }
            setCurrentUser(user);
            addAuditLog('USER_LOGIN', `User ${user.name} logged in successfully via MFA.`, user.id);
            setAppState('app');
            setPendingMfaUser(null);
            return { success: true };
        }
    }
    return { success: false, message: 'Invalid verification code.' };
  };

  const handleSelectDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setCurrentView('navigator');
    setActiveControlId(null);
  };
  
  const handleAddDocument = (control: Control, subdomain: Subdomain, domain: Domain, content: GeneratedContent, generatedBy: 'user' | 'AI Agent' = 'user') => {
    const newDoc: PolicyDocument = {
        id: `doc-${control.id}-${Date.now()}`,
        controlId: control.id,
        domainName: domain.name,
        subdomainTitle: subdomain.title,
        controlDescription: control.description,
        status: 'Pending CISO Approval', // Starting point of workflow
        content: content,
        approvalHistory: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        generatedBy: generatedBy,
    };
    setDocumentRepository(prev => [newDoc, ...prev]);
  };
  
  // --- Render Logic ---

  if (appState === 'loading') {
    return (
      <div id="loading-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
        </svg>
        <p>Loading Cybersecurity Controls Navigator...</p>
      </div>
    );
  }

  if (appState === 'setup') {
    return <CompanySetupPage onSetup={handleSetup} onCancel={() => setAppState('login')} theme={theme} toggleTheme={toggleTheme} />;
  }

  if (appState === 'login') {
    return <LoginPage 
              onLogin={handleLogin}
              onSetupCompany={() => setAppState('setup')}
              theme={theme}
              toggleTheme={toggleTheme}
              onForgotPassword={async (email) => { return { success: true, message: "If an account exists, a password reset token has been sent (simulated).", token: "demo-token-123" }; }}
              onResetPassword={async (token, newPassword) => { return { success: true, message: "Password reset successfully! Please sign in."}; }}
            />;
  }
  
  if (appState === 'mfaVerify' && pendingMfaUser) {
    return <MfaVerifyPage user={pendingMfaUser} onVerify={handleMfaVerify} onCancel={handleLogout} theme={theme} toggleTheme={toggleTheme} />;
  }
  
  if (appState === 'mfaSetup' && currentUser) {
     return <MfaSetupPage user={{...currentUser, mfaSecret: "JBSWY3DPEHPK3PXP"}} companyName={companyProfile?.name || "My Company"} onVerified={handleMfaVerify} onCancel={() => setAppState('app')} theme={theme} toggleTheme={toggleTheme} />;
  }

  if (appState === 'app' && currentUser && companyProfile) {
    const permissions = new Set(rolePermissions[currentUser.role] || []);

    const isLicenseActive = companyProfile.license?.status === 'active' && companyProfile.license.expiresAt > Date.now();
    const MainContent = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardPage repository={documentRepository} currentUser={currentUser} allControls={allControls} domains={eccData} onSetView={setCurrentView} trainingProgress={trainingProgress[currentUser.id]} eccAssessment={eccAssessment} pdplAssessment={pdplAssessment} samaCsfAssessment={samaCsfAssessment} cmaAssessment={cmaAssessment} tasks={tasks} setTasks={setTasks} />;
            case 'navigator': return <ContentView domain={selectedDomain} activeControlId={activeControlId} setActiveControlId={setActiveControlId} onAddDocument={handleAddDocument} documentRepository={documentRepository} permissions={permissions} onSetView={setCurrentView} />;
            case 'documents': return <DocumentsPage repository={documentRepository} currentUser={currentUser} onApprovalAction={(docId, decision, comments) => {}} onAddDocument={handleAddDocument} permissions={permissions} company={companyProfile} />;
            case 'users': return <UserManagementPage users={users} setUsers={setUsers} currentUser={currentUser} addNotification={addNotification} addAuditLog={addAuditLog} />;
            case 'companyProfile': return <CompanyProfilePage company={companyProfile} onSave={setCompanyProfile} canEdit={permissions.has('company:update')} addNotification={addNotification} />;
            case 'auditLog': return <AuditLogPage auditLog={auditLog} />;
            case 'assessment': return <AssessmentPage assessmentData={eccAssessment} onUpdateItem={(code, item) => setEccAssessment(p => p.map(i => i.controlCode === code ? item : i))} status={eccStatus} onInitiate={() => { setEccAssessment(initialEccAssessmentData); setEccStatus('in-progress'); }} onComplete={() => setEccStatus('idle')} permissions={permissions} />;
            case 'pdplAssessment': return <PDPLAssessmentPage assessmentData={pdplAssessment} onUpdateItem={(code, item) => setPdplAssessment(p => p.map(i => i.controlCode === code ? item : i))} status={pdplStatus} onInitiate={() => { setPdplAssessment(initialPdplAssessmentData); setPdplStatus('in-progress'); }} onComplete={() => setPdplStatus('idle')} permissions={permissions} />;
            case 'samaCsfAssessment': return <SamaCsfAssessmentPage assessmentData={samaCsfAssessment} onUpdateItem={(code, item) => setSamaCsfAssessment(p => p.map(i => i.controlCode === code ? item : i))} status={samaCsfStatus} onInitiate={() => { setSamaCsfAssessment(initialSamaCsfAssessmentData); setSamaCsfStatus('in-progress'); }} onComplete={() => setSamaCsfStatus('idle')} permissions={permissions} />;
            case 'cmaAssessment': return <CMAAssessmentPage assessmentData={cmaAssessment} onUpdateItem={(code, item) => setCmaAssessment(p => p.map(i => i.controlCode === code ? item : i))} status={cmaStatus} onInitiate={() => { setCmaAssessment(initialCmaAssessmentData); setCmaStatus('in-progress'); }} onComplete={() => setCmaStatus('idle')} permissions={permissions} />;
            case 'userProfile': return <UserProfilePage currentUser={currentUser} onChangePassword={async () => ({success: true, message: 'Password changed successfully.'})} onEnableMfa={() => setAppState('mfaSetup')} onDisableMfa={async () => ({success: true, message: 'MFA disabled.'})} />;
            case 'help': return <HelpSupportPage onStartTour={() => setIsTourOpen(true)} />;
            case 'training': return <TrainingPage userProgress={trainingProgress[currentUser.id] || {}} onUpdateProgress={(courseId, lessonId, score) => {}} />;
            case 'riskAssessment': return <RiskAssessmentPage risks={risks} setRisks={setRisks} status={riskStatus} onInitiate={() => { setRisks(initialRiskData); setRiskStatus('in-progress'); }} onComplete={() => setRiskStatus('idle')} permissions={permissions} />;
            case 'complianceAgent': return <ComplianceAgentPage onRunAnalysis={() => []} onGenerateDocuments={async () => {}} agentLog={agentLog} permissions={permissions} />;
            default: return <DashboardPage repository={documentRepository} currentUser={currentUser} allControls={allControls} domains={eccData} onSetView={setCurrentView} trainingProgress={trainingProgress[currentUser.id]} eccAssessment={eccAssessment} pdplAssessment={pdplAssessment} samaCsfAssessment={samaCsfAssessment} cmaAssessment={cmaAssessment} tasks={tasks} setTasks={setTasks} />;
        }
    };

    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200" ref={appContainerRef}>
        <Sidebar 
          domains={eccData} 
          selectedDomain={selectedDomain} 
          onSelectDomain={handleSelectDomain}
          currentView={currentView}
          onSetView={setCurrentView}
          permissions={permissions}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {/* Header content like search bar */}
            <div/>
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
              </button>
              <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                <LogoutIcon className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 relative">
            {!isLicenseActive && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-80 z-40 flex flex-col items-center justify-center text-white p-8 text-center">
                  <LockClosedIcon className="w-16 h-16 text-yellow-400 mb-4" />
                  <h2 className="text-3xl font-bold">Subscription Expired</h2>
                  <p className="mt-2 text-lg text-gray-300">Your access is restricted because your license is inactive or has expired.</p>
                  <p className="mt-1 text-gray-400">Please contact an administrator to renew the license from the Company Profile page.</p>
                  {permissions.has('company:update') && (
                      <button onClick={() => setCurrentView('companyProfile')} className="mt-6 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600">
                          Go to Company Profile
                      </button>
                  )}
              </div>
            )}
            <div className={!isLicenseActive ? 'blur-sm' : ''}>
              <MainContent />
            </div>
          </main>
        </div>
        <ChatWidget 
            isOpen={isChatOpen} 
            onToggle={() => setIsChatOpen(!isChatOpen)}
            messages={chatMessages}
            onSendMessage={() => {}}
            isLoading={isChatLoading}
            error={chatError}
        />
        <LiveAssistantWidget 
          isOpen={isLiveAssistantOpen}
          onToggle={() => setIsLiveAssistantOpen(!isLiveAssistantOpen)}
          onNavigate={(view) => setCurrentView(view)}
        />
      </div>
    );
  }

  return null; // Should not be reached, but good for type safety
};

export default App;

