// This file simulates a backend API by using a temporary in-memory store.
// All data will be reset when the browser is refreshed.

import type { User, CompanyProfile, AuditLogEntry, PolicyDocument, AssessmentItem, License, UserTrainingProgress, Task, Risk, Control, Subdomain, Domain, GeneratedContent, DocumentStatus } from '../types';
import { assessmentData as initialAssessmentData } from '../data/assessmentData';
import { initialPdplAssessmentData } from '../data/pdplAssessmentData';
import { samaCsfAssessmentData as initialSamaCsfAssessmentData } from '../data/samaCsfAssessmentData';
import { cmaAssessmentData as initialCmaAssessmentData } from '../data/cmaAssessmentData';
import { initialRiskData } from '../data/riskAssessmentData';

export interface CompanyData {
  users: User[];
  documents: PolicyDocument[];
  auditLog: AuditLogEntry[];
  eccAssessment: AssessmentItem[];
  pdplAssessment: AssessmentItem[];
  samaCsfAssessment: AssessmentItem[];
  cmaAssessment: AssessmentItem[];
  riskAssessmentData: Risk[];
  assessmentStatuses: {
    ecc: 'idle' | 'in-progress';
    pdpl: 'idle' | 'in-progress';
    sama: 'idle' | 'in-progress';
    cma: 'idle' | 'in-progress';
    riskAssessment: 'idle' | 'in-progress';
  };
  trainingProgress: UserTrainingProgress;
  tasks: Task[];
};

// --- In-Memory Store ---
let companies: CompanyProfile[] = [];
let companyDataStore: Record<string, CompanyData> = {};
let passwordResetTokens: Record<string, { userId: string, companyId: string }> = {};


// Helper to create a consistent audit log entry
const createAuditLog = (user: User, action: AuditLogEntry['action'], details: string, targetId?: string): AuditLogEntry => {
    return {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        userId: user.id,
        userName: user.name,
        action,
        details,
        targetId
    };
};

const addLogToCompany = (companyId: string, log: AuditLogEntry) => {
    if (companyDataStore[companyId]) {
        companyDataStore[companyId].auditLog.unshift(log); // Add to the beginning
    }
}

// --- API Functions ---

export const hasCompanies = async (): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(companies.length > 0), 100));
}

export const setupCompany = async (
    profileData: Omit<CompanyProfile, 'id' | 'license'>,
    adminData: Omit<User, 'id' | 'isVerified' | 'role'>
) => {
    return new Promise<void>((resolve, reject) => setTimeout(() => {
        if (Object.values(companyDataStore).some(data => data.users.some(u => u.email.toLowerCase() === adminData.email.toLowerCase()))) {
            const error: Error & {code?: string} = new Error("This email address is already registered. Please use a different email for the administrator.");
            error.code = 'auth/email-already-in-use';
            reject(error);
            return;
        }

        const companyId = `company-${Date.now()}`;
        
        const trialExpiresAt = new Date();
        trialExpiresAt.setFullYear(trialExpiresAt.getFullYear() + 1);
        const newLicense: License = {
          key: `trial-${companyId}-${Date.now()}`,
          status: 'active',
          tier: 'trial',
          expiresAt: trialExpiresAt.getTime(),
        };

        const newCompany: CompanyProfile = { id: companyId, ...profileData, logo: '', license: newLicense };
        const newAdmin: User = { id: `user-${Date.now()}`, ...adminData, role: 'Administrator', isVerified: true, mfaEnabled: false };
        
        companies.push(newCompany);
        companyDataStore[companyId] = {
            users: [newAdmin],
            documents: [],
            auditLog: [],
            eccAssessment: JSON.parse(JSON.stringify(initialAssessmentData)),
            pdplAssessment: JSON.parse(JSON.stringify(initialPdplAssessmentData)),
            samaCsfAssessment: JSON.parse(JSON.stringify(initialSamaCsfAssessmentData)),
            cmaAssessment: JSON.parse(JSON.stringify(initialCmaAssessmentData)),
            riskAssessmentData: JSON.parse(JSON.stringify(initialRiskData)),
            assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', riskAssessment: 'idle' },
            trainingProgress: {},
            tasks: []
        };
        
        resolve();
    }, 500));
};

export const login = async (email: string, password: string): Promise<{ user: User, companies: CompanyProfile[], initialCompanyData: CompanyData, auditLogEntry: AuditLogEntry }> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        let foundUser: User | null = null;
        let foundCompanyId: string | null = null;

        for (const companyId in companyDataStore) {
            const user = companyDataStore[companyId].users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                foundUser = user;
                foundCompanyId = companyId;
                break;
            }
        }
        
        if (!foundUser || !foundCompanyId || foundUser.password !== password) {
            const error: Error & {code?: string} = new Error("Invalid email or password.");
            reject(error);
            return;
        }

        if (!foundUser.isVerified) {
            const error: Error & {code?: string} = new Error("Your account is not verified. Please click the verification button that appears.");
            error.code = 'unverified';
            reject(error);
            return;
        }
        
        let userCompanies: CompanyProfile[] = [];
        if (foundUser.role === 'Administrator') {
            userCompanies = [...companies];
        } else {
            const userCompany = companies.find(c => c.id === foundCompanyId);
            if (userCompany) userCompanies = [userCompany];
        }

        const initialCompanyData = companyDataStore[foundCompanyId];
        
        const auditLogEntry = createAuditLog(foundUser, 'USER_LOGIN', `User ${foundUser.name} logged in successfully.`);
        addLogToCompany(foundCompanyId, auditLogEntry);

        const { password: _, ...userToReturn } = foundUser;
        resolve({ user: userToReturn, companies: userCompanies, initialCompanyData: { ...initialCompanyData, auditLog: [...initialCompanyData.auditLog] }, auditLogEntry });
    }, 500));
};


export const getCompanyData = async (companyId: string, userId: string): Promise<{ companyData: CompanyData }> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        if (!companyDataStore[companyId]) {
            reject(new Error("Company data not found."));
            return;
        }

        let user: User | undefined;
        let userCompanyId: string | undefined;

        for(const cid in companyDataStore) {
            const found = companyDataStore[cid].users.find(u => u.id === userId);
            if (found) {
                user = found;
                userCompanyId = cid;
                break;
            }
        }

        if (user && userCompanyId) {
            const switchedToCompany = companies.find(c => c.id === companyId);
            const auditLogEntry = createAuditLog(user, 'USER_SWITCH_COMPANY', `Switched to company context: ${switchedToCompany?.name}.`, companyId);
            addLogToCompany(userCompanyId, auditLogEntry);
        }

        resolve({ companyData: { ...companyDataStore[companyId] } });
    }, 300));
};

export const logout = async (userId: string) => {
    return new Promise<{ auditLogEntry: AuditLogEntry | null }>((resolve) => setTimeout(() => {
         let user: User | undefined;
         let companyId: string | undefined;

        for(const cid in companyDataStore) {
            const found = companyDataStore[cid].users.find(u => u.id === userId);
            if (found) {
                user = found;
                companyId = cid;
                break;
            }
        }
        if (user && companyId) {
            const auditLogEntry = createAuditLog(user, 'USER_LOGOUT', `User ${user.name} logged out.`);
            addLogToCompany(companyId, auditLogEntry);
            resolve({ auditLogEntry });
        } else {
            resolve({ auditLogEntry: null });
        }
    }, 100));
};

export const saveUser = async (companyId: string, user: User, originalUser: User | null, currentUserId: string): Promise<{ updatedUsers: User[], auditLogEntry: AuditLogEntry, notifications: { message: string, type: 'success' | 'info' }[] }> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        const isNew = !originalUser;
        const targetCompanyData = companyDataStore[companyId];
        if (!targetCompanyData) {
            reject(new Error("Target company not found."));
            return;
        }

        if (isNew) {
            targetCompanyData.users.push(user);
        } else {
            const userIndex = targetCompanyData.users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                const existingUser = targetCompanyData.users[userIndex];
                // Preserve password if not changed
                targetCompanyData.users[userIndex] = { ...existingUser, ...user, password: user.password || existingUser.password };
            }
        }
        
        let currentUser: User | undefined;
        for(const cid in companyDataStore) {
            currentUser = companyDataStore[cid].users.find(u => u.id === currentUserId);
            if (currentUser) break;
        }
        
        if(!currentUser) {
            reject(new Error("Performing user not found"));
            return;
        }
        
        const action = isNew ? 'USER_CREATED' : 'USER_UPDATED';
        const details = isNew ? `Created new user: ${user.name} (${user.email}).` : `Updated user profile: ${user.name}.`;
        const auditLogEntry = createAuditLog(currentUser, action, details, user.id);
        addLogToCompany(companyId, auditLogEntry);

        const notifications = [{ message: `User ${user.name} has been ${isNew ? 'created' : 'updated'}.`, type: 'success' as const }];

        resolve({ updatedUsers: [...targetCompanyData.users], auditLogEntry, notifications });
    }, 300));
};

export const deleteUser = async (companyId: string, userId: string, currentUserId: string): Promise<{ updatedUsers: User[], auditLogEntry: AuditLogEntry }> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        const targetCompanyData = companyDataStore[companyId];
        if (!targetCompanyData) {
            reject(new Error("Target company not found."));
            return;
        }
        
        const userToDelete = targetCompanyData.users.find(u => u.id === userId);
        if (!userToDelete) {
            reject(new Error("User to delete not found."));
            return;
        }
        
        targetCompanyData.users = targetCompanyData.users.filter(u => u.id !== userId);

        let currentUser: User | undefined;
        for(const cid in companyDataStore) {
            currentUser = companyDataStore[cid].users.find(u => u.id === currentUserId);
            if (currentUser) break;
        }
        if(!currentUser) {
            reject(new Error("Performing user not found"));
            return;
        }

        const auditLogEntry = createAuditLog(currentUser, 'USER_DELETED', `Deleted user: ${userToDelete.name} (${userToDelete.email}).`, userId);
        addLogToCompany(companyId, auditLogEntry);
        
        resolve({ updatedUsers: [...targetCompanyData.users], auditLogEntry });
    }, 300));
};

export const updateCompanyProfile = async (companyId: string, profile: CompanyProfile): Promise<CompanyProfile & { auditLogEntry: AuditLogEntry }> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        const companyIndex = companies.findIndex(c => c.id === companyId);
        if (companyIndex === -1) {
            reject(new Error("Company not found"));
            return;
        }
        companies[companyIndex] = { ...companies[companyIndex], ...profile };
        
        // In a real app, you'd get the current user from context, here we just fake it
        const adminUser = companyDataStore[companyId].users.find(u => u.role === 'Administrator');
        if (!adminUser) {
             reject(new Error("Admin user not found for logging"));
            return;
        }
        const auditLogEntry = createAuditLog(adminUser, 'COMPANY_PROFILE_UPDATED', 'Company profile was updated.');
        addLogToCompany(companyId, auditLogEntry);

        resolve({ ...companies[companyIndex], auditLogEntry });
    }, 300));
};

export const addDocument = async (companyId: string, payload: { control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, user: User }) => {
    return new Promise<{ documents: PolicyDocument[], auditLogEntry: AuditLogEntry, notifications: { message: string, type: 'success' | 'info'}[] }>((resolve, reject) => setTimeout(() => {
        const { control, domain, subdomain, generatedContent, user } = payload;
        const now = Date.now();
        const newDocument: PolicyDocument = { id: `policy-${control.id}-${now}`, controlId: control.id, domainName: domain.name, subdomainTitle: subdomain.title, controlDescription: control.description, status: 'Pending CISO Approval', content: generatedContent, approvalHistory: [], createdAt: now, updatedAt: now };
        
        companyDataStore[companyId].documents.push(newDocument);
        const auditLogEntry = createAuditLog(user, 'DOCUMENT_GENERATED', `Generated document for control ${control.id}.`, newDocument.id);
        addLogToCompany(companyId, auditLogEntry);
        
        resolve({ documents: [...companyDataStore[companyId].documents], auditLogEntry, notifications: [{message: 'Document created and sent for approval.', type: 'success'}] });
    }, 500));
};

export const updateDocumentApproval = async (companyId: string, documentId: string, user: User, decision: 'Approved' | 'Rejected', comments?: string) => {
    return new Promise<{ documents: PolicyDocument[], auditLogEntry: AuditLogEntry, notifications: { message: string, type: 'success' | 'info'}[] }>((resolve, reject) => setTimeout(() => {
        const doc = companyDataStore[companyId].documents.find(d => d.id === documentId);
        if (!doc) {
            reject(new Error("Document not found"));
            return;
        }
        
        const nextStatusMap: Record<string, DocumentStatus> = {
            'Pending CISO Approval': 'Pending CTO Approval',
            'Pending CTO Approval': 'Pending CIO Approval',
            'Pending CIO Approval': 'Pending CEO Approval',
            'Pending CEO Approval': 'Approved'
        };

        doc.updatedAt = Date.now();
        doc.approvalHistory.push({ role: user.role, decision, timestamp: Date.now(), comments });
        const notifications: { message: string, type: 'success' | 'info'}[] = [];

        if (decision === 'Rejected') {
            doc.status = 'Rejected';
            notifications.push({ message: `Document ${doc.controlId} was rejected.`, type: 'info'});
        } else {
            const nextStatus = nextStatusMap[doc.status];
            doc.status = nextStatus || 'Approved';
             if (doc.status === 'Approved') {
                notifications.push({ message: `Document ${doc.controlId} is now fully approved!`, type: 'success'});
            } else {
                notifications.push({ message: `Document approved, now pending ${doc.status}.`, type: 'info'});
            }
        }
        
        const auditAction = decision === 'Approved' ? 'DOCUMENT_APPROVED' : 'DOCUMENT_REJECTED';
        const auditLogEntry = createAuditLog(user, auditAction, `${decision} document for control ${doc.controlId}.`, doc.id);
        addLogToCompany(companyId, auditLogEntry);

        resolve({ documents: [...companyDataStore[companyId].documents], auditLogEntry, notifications });
    }, 500));
};

export const initiateAssessment = async (companyId: string, type: keyof CompanyData['assessmentStatuses']) => {
    return new Promise<{ data: AssessmentItem[], assessmentStatuses: CompanyData['assessmentStatuses'] }>((resolve, reject) => setTimeout(() => {
        const companyData = companyDataStore[companyId];
        if (!companyData) {
            reject(new Error("Company not found"));
            return;
        }

        let newData: AssessmentItem[];
        switch(type) {
            case 'ecc': newData = JSON.parse(JSON.stringify(initialAssessmentData)); break;
            case 'pdpl': newData = JSON.parse(JSON.stringify(initialPdplAssessmentData)); break;
            case 'sama': newData = JSON.parse(JSON.stringify(initialSamaCsfAssessmentData)); break;
            case 'cma': newData = JSON.parse(JSON.stringify(initialCmaAssessmentData)); break;
            // No case for risk assessment as its structure is different and handled separately if needed
            default: reject(new Error("Invalid assessment type")); return;
        }

        (companyData as any)[`${type}Assessment`] = newData;
        companyData.assessmentStatuses[type] = 'in-progress';

        resolve({ data: newData, assessmentStatuses: { ...companyData.assessmentStatuses } });
    }, 300));
};

export const completeAssessment = async (companyId: string, type: keyof CompanyData['assessmentStatuses']) => {
    return new Promise<CompanyData['assessmentStatuses']>((resolve, reject) => setTimeout(() => {
        const companyData = companyDataStore[companyId];
        if (!companyData) {
            reject(new Error("Company not found"));
            return;
        }
        companyData.assessmentStatuses[type] = 'idle';
        resolve({ ...companyData.assessmentStatuses });
    }, 300));
};

export const updateAssessmentItem = async (companyId: string, type: keyof Omit<CompanyData['assessmentStatuses'], 'riskAssessment'>, updatedItem: AssessmentItem) => {
    return new Promise<AssessmentItem[]>((resolve, reject) => setTimeout(() => {
        const companyData = companyDataStore[companyId];
        if (!companyData) {
            reject(new Error("Company not found"));
            return;
        }
        const key = `${type}Assessment` as 'eccAssessment' | 'pdplAssessment' | 'samaCsfAssessment' | 'cmaAssessment';
        const assessment = companyData[key];
        const itemIndex = assessment.findIndex(i => i.controlCode === updatedItem.controlCode);
        if (itemIndex !== -1) {
            assessment[itemIndex] = updatedItem;
        }
        resolve([...assessment]);
    }, 100));
};

export const updateTrainingProgress = async (companyId: string, userId: string, courseId: string, lessonId: string, score?: number) => {
    return new Promise<{ progress: UserTrainingProgress, badgeEarned: boolean, courseTitle: string }>((resolve, reject) => setTimeout(() => {
        // Since training progress is per-company, we don't need the userId for this simulation
        const progress = companyDataStore[companyId].trainingProgress;
        if (!progress[courseId]) {
            progress[courseId] = { completedLessons: [], badgeEarned: false, badgeId: '' };
        }
        if (!progress[courseId].completedLessons.includes(lessonId)) {
            progress[courseId].completedLessons.push(lessonId);
        }
        if (score !== undefined) {
             progress[courseId].score = Math.max(progress[courseId].score || 0, score);
        }

        let badgeEarned = false;
        // Check for badge
        // const course = trainingCourses.find(c => c.id === courseId);
        // if (course && !progress[courseId].badgeEarned && progress[courseId].completedLessons.length === course.lessons.length) {
        //     progress[courseId].badgeEarned = true;
        //     progress[courseId].badgeId = course.badgeId;
        //     badgeEarned = true;
        // }
        
        resolve({ progress: { ...progress }, badgeEarned: false, courseTitle: '' });
    }, 200));
};

// --- Simulated Auth/MFA Functions ---

export const verifyUser = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => {
        for(const companyId in companyDataStore) {
            const user = companyDataStore[companyId].users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                user.isVerified = true;
                resolve(true);
                return;
            }
        }
        resolve(false);
    }, 500));
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; token?: string, auditLogEntry?: AuditLogEntry }> => {
     return new Promise((resolve) => setTimeout(() => {
        for(const companyId in companyDataStore) {
            const user = companyDataStore[companyId].users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                const token = `reset-${Date.now()}`;
                passwordResetTokens[token] = { userId: user.id, companyId: companyId };
                const auditLogEntry = createAuditLog(user, 'PASSWORD_RESET_REQUESTED', `Password reset requested for ${user.email}.`);
                addLogToCompany(companyId, auditLogEntry);

                resolve({ success: true, message: `For demonstration purposes, your password reset token is provided here. In a real app, this would be emailed.`, token, auditLogEntry });
                return;
            }
        }
        resolve({ success: false, message: "If an account with that email exists, a reset link has been sent." });
    }, 500));
};

export const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve, reject) => setTimeout(() => {
        const tokenData = passwordResetTokens[token];
        if (!tokenData) {
            reject(new Error("Invalid or expired password reset token."));
            return;
        }
        const { userId, companyId } = tokenData;
        const user = companyDataStore[companyId]?.users.find(u => u.id === userId);
        if (user) {
            user.password = newPassword;
            const auditLogEntry = createAuditLog(user, 'PASSWORD_RESET_COMPLETED', `Password was successfully reset for ${user.email}.`);
            addLogToCompany(companyId, auditLogEntry);
            delete passwordResetTokens[token];
            resolve({ success: true, message: "Your password has been reset successfully. You can now log in." });
        } else {
            reject(new Error("User not found for this token."));
        }
    }, 500));
};

export const verifyMfa = async (userId: string, verificationCode: string) => {
    // This is a simplified stub. In a real app, you'd verify against a TOTP library.
    if (verificationCode === '123456') {
        // Re-run login logic to get all the necessary data
        let user: User | null = null;
        for(const companyId in companyDataStore) {
            user = companyDataStore[companyId].users.find(u => u.id === userId) || null;
            if (user) break;
        }
        if (user) {
            return login(user.email, user.password || '');
        }
    }
    throw new Error("Invalid verification code.");
};

export const finalizeMfaSetup = async (userId: string, verificationCode: string) => {
     if (verificationCode === '123456') {
        for(const companyId in companyDataStore) {
            const user = companyDataStore[companyId].users.find(u => u.id === userId);
            if (user) {
                user.mfaEnabled = true;
                const auditLogEntry = createAuditLog(user, 'MFA_ENABLED', `MFA was enabled for user ${user.name}.`);
                addLogToCompany(companyId, auditLogEntry);
                const { password, ...userToReturn } = user;
                return { user: userToReturn, auditLogEntry };
            }
        }
    }
    throw new Error("Invalid verification code.");
};

export const disableMfa = async (userId: string, password: string) => {
    for(const companyId in companyDataStore) {
        const user = companyDataStore[companyId].users.find(u => u.id === userId);
        if (user && user.password === password) {
            user.mfaEnabled = false;
            const auditLogEntry = createAuditLog(user, 'MFA_DISABLED', `MFA was disabled for user ${user.name}.`);
            addLogToCompany(companyId, auditLogEntry);
            const { password, ...userToReturn } = user;
            return { user: userToReturn, auditLogEntry };
        }
    }
    throw new Error("Invalid password.");
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    for(const companyId in companyDataStore) {
        const user = companyDataStore[companyId].users.find(u => u.id === userId);
        if (user && user.password === currentPassword) {
            user.password = newPassword;
            const auditLogEntry = createAuditLog(user, 'PASSWORD_CHANGED', `User ${user.name} changed their password.`);
            addLogToCompany(companyId, auditLogEntry);
            const { password, ...userToReturn } = user;
            return { user: userToReturn, auditLogEntry };
        }
    }
    throw new Error("Invalid current password.");
};

export const createNewCompany = async (
    profileData: Omit<CompanyProfile, 'id' | 'license'>,
    adminData: Omit<User, 'id' | 'isVerified' | 'role'>,
    currentUserId: string
) => {
     return new Promise<{ newCompany: CompanyProfile, auditLogEntry: AuditLogEntry }>((resolve, reject) => setTimeout(() => {
         // Create new company
         const companyId = `company-${Date.now()}`;
         const trialExpiresAt = new Date();
         trialExpiresAt.setDate(trialExpiresAt.getDate() + 7);
         const newLicense: License = {
             key: `trial-${companyId}-${Date.now()}`,
             status: 'active',
             tier: 'trial',
             expiresAt: trialExpiresAt.getTime(),
         };
         const newCompany: CompanyProfile = { id: companyId, ...profileData, logo: '', license: newLicense };
         companies.push(newCompany);

         // Create admin for new company
         const newAdmin: User = { id: `user-${Date.now()}`, ...adminData, role: 'Administrator', isVerified: true, mfaEnabled: false };
         companyDataStore[companyId] = {
             users: [newAdmin],
             documents: [], auditLog: [], eccAssessment: [], pdplAssessment: [], samaCsfAssessment: [], cmaAssessment: [], riskAssessmentData: [],
             assessmentStatuses: { ecc: 'idle', pdpl: 'idle', sama: 'idle', cma: 'idle', riskAssessment: 'idle' },
             trainingProgress: {}, tasks: []
         };

         // Find current user to log action
         let currentUser: User | undefined;
         let currentUserCompanyId: string | undefined;
         for(const cid in companyDataStore) {
             currentUser = companyDataStore[cid].users.find(u => u.id === currentUserId);
             if (currentUser) {
                 currentUserCompanyId = cid;
                 break;
             }
         }
         
         if (currentUser && currentUserCompanyId) {
             const auditLogEntry = createAuditLog(currentUser, 'COMPANY_CREATED', `Created new company: ${newCompany.name}.`, newCompany.id);
             addLogToCompany(currentUserCompanyId, auditLogEntry);
             resolve({ newCompany, auditLogEntry });
         } else {
             reject(new Error("Could not find current user to create audit log."));
         }
     }, 500));
};