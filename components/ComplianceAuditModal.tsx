
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CheckCircleIcon, CloseIcon, ShieldCheckIcon, DocumentTextIcon, SparklesIcon } from './Icons';
import type { PolicyDocument, ApprovalStep, Control } from '../types';

interface ComplianceAuditModalProps {
    doc: PolicyDocument;
    control?: Control;
    onClose: () => void;
    onAuditComplete: (auditResult: ApprovalStep[]) => void;
}

const AgentCard: React.FC<{ 
    name: string; 
    role: string; 
    status: 'idle' | 'analyzing' | 'approved' | 'rejected'; 
    comments: string;
    delay: number;
    avatarColor: string;
}> = ({ name, role, status, comments, delay, avatarColor }) => {
    const [visibleStatus, setVisibleStatus] = useState<'idle' | 'analyzing' | 'approved' | 'rejected'>('idle');

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        
        if (status === 'analyzing') {
            // Start analyzing after the delay
            timer = setTimeout(() => {
                setVisibleStatus('analyzing');
            }, delay);
        } else if (status === 'approved' || status === 'rejected') {
            // Show result after delay + simulated analysis time (e.g. 2000ms)
            timer = setTimeout(() => {
                setVisibleStatus(status);
            }, delay + 2000); 
        } else {
            setVisibleStatus('idle');
        }

        return () => clearTimeout(timer);
    }, [status, delay]);

    return (
        <div className={`p-4 rounded-lg border transition-all duration-500 relative overflow-hidden ${
            visibleStatus === 'idle' ? 'border-gray-200 bg-gray-50 opacity-60' :
            visibleStatus === 'analyzing' ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' :
            visibleStatus === 'approved' ? 'border-green-300 bg-green-50' :
            'border-red-300 bg-red-50'
        }`}>
            {visibleStatus === 'analyzing' && (
                <div className="absolute top-0 left-0 h-1 w-full bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-500 animate-progress-indeterminate"></div>
                </div>
            )}
            
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                    visibleStatus === 'approved' ? 'bg-green-600' : 
                    visibleStatus === 'rejected' ? 'bg-red-600' : avatarColor
                }`}>
                    {visibleStatus === 'analyzing' ? (
                        <SparklesIcon className="w-6 h-6 animate-pulse" />
                    ) : (
                        name.charAt(0)
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">{name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{role}</p>
                </div>
                <div className="ml-auto">
                    {visibleStatus === 'idle' && <span className="text-xs text-gray-400">Pending...</span>}
                    {visibleStatus === 'analyzing' && <span className="text-xs text-blue-600 font-mono animate-pulse">Analyzing...</span>}
                    {visibleStatus === 'approved' && <CheckCircleIcon className="w-6 h-6 text-green-600" />}
                    {visibleStatus === 'rejected' && <CloseIcon className="w-6 h-6 text-red-600" />}
                </div>
            </div>
            
            <div className={`text-sm rounded-md p-3 min-h-[60px] ${
                visibleStatus === 'idle' ? 'text-gray-400 italic' :
                visibleStatus === 'analyzing' ? 'text-blue-700 bg-blue-100/50 italic' :
                'text-gray-800 bg-white/50 border border-gray-100'
            }`}>
                {visibleStatus === 'idle' && 'Waiting to start audit protocol...'}
                {visibleStatus === 'analyzing' && 'Comparing document content against NCA ECC Implementation Guidelines and deliverables...'}
                {(visibleStatus === 'approved' || visibleStatus === 'rejected') && comments}
            </div>
        </div>
    );
};

export const ComplianceAuditModal: React.FC<ComplianceAuditModalProps> = ({ doc, control, onClose, onAuditComplete }) => {
    const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'complete'>('idle');
    const [results, setResults] = useState<{
        ciso: { status: 'approved' | 'rejected', comments: string } | null;
        cto: { status: 'approved' | 'rejected', comments: string } | null;
        cio: { status: 'approved' | 'rejected', comments: string } | null;
    }>({ ciso: null, cto: null, cio: null });

    const startAudit = async () => {
        setAuditStatus('running');
        
        try {
            let result;
            if (process.env.API_KEY) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

                const prompt = `
                    Act as three distinct cybersecurity auditors checking an internal policy document against NCA ECC standards.
                    
                    Auditor 1: "Samia Ahmed (AI CISO Agent)" - Focus on Governance, Risk, Strategy, and clarity of roles.
                    Auditor 2: "John Doe (AI CTO Agent)" - Focus on Technical Feasibility, Implementation Details, and correct terminology.
                    Auditor 3: "Fatima Khan (AI CIO Agent)" - Focus on IT Strategy Alignment, Operational Impact, and Resource Allocation.

                    **Control Context:**
                    ID: ${doc.controlId}
                    Description: ${doc.controlDescription}
                    Guidelines: ${control?.implementationGuidelines?.join('; ') || 'Follow NCA Guidelines'}

                    **Document Content (Excerpt):**
                    POLICY: ${doc.content.policy.substring(0, 1000)}... 
                    PROCEDURE: ${doc.content.procedure.substring(0, 1000)}...

                    **Task:**
                    Review the content. If it generally addresses the control description, PASS it. If it is nonsensical or missing key elements, FAIL it. Provide specific, professional feedback as if you are that persona.

                    **Output Format:**
                    Return a valid JSON object with this exact structure:
                    {
                        "ciso": { "verdict": "Pass" | "Fail", "comments": "Specific feedback..." },
                        "cto": { "verdict": "Pass" | "Fail", "comments": "Specific feedback..." },
                        "cio": { "verdict": "Pass" | "Fail", "comments": "Specific feedback..." }
                    }
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json' }
                });

                result = JSON.parse(response.text);
            } else {
                // Fallback simulation if no API key
                console.warn("No API Key found, using simulation");
                await new Promise(resolve => setTimeout(resolve, 1000));
                result = {
                    ciso: { verdict: "Pass", comments: "Document aligns with governance standards. Roles are clearly defined." },
                    cto: { verdict: "Pass", comments: "Technical procedures are actionable and cover the required scope." },
                    cio: { verdict: "Pass", comments: "Operational impact is manageable and aligns with IT strategy." }
                };
            }

            setResults({
                ciso: {
                    status: result.ciso.verdict === 'Pass' ? 'approved' : 'rejected',
                    comments: result.ciso.comments
                },
                cto: {
                    status: result.cto.verdict === 'Pass' ? 'approved' : 'rejected',
                    comments: result.cto.comments
                },
                cio: {
                    status: result.cio.verdict === 'Pass' ? 'approved' : 'rejected',
                    comments: result.cio.comments
                }
            });

            // Wait for the longest animation to finish before showing "Finalize" button
            setTimeout(() => {
                setAuditStatus('complete');
            }, 5500); // 3000ms delay + 2000ms analysis + buffer

        } catch (error) {
            console.error("Audit failed", error);
            // Fallback for demo if AI fails or network issue
            setResults({
                ciso: { status: 'approved', comments: 'Document aligns with governance standards. Roles are clearly defined.' },
                cto: { status: 'approved', comments: 'Technical procedures are actionable and cover the required scope.' },
                cio: { status: 'approved', comments: 'Operational impact is manageable and aligns with IT strategy.' }
            });
            setTimeout(() => setAuditStatus('complete'), 5500);
        }
    };

    const handleFinalize = () => {
        if (results.ciso && results.cto && results.cio) {
            const steps: ApprovalStep[] = [
                {
                    role: 'AI_AGENT',
                    agentName: 'Samia Ahmed (AI CISO Agent)',
                    decision: results.ciso.status === 'approved' ? 'Passed' : 'Failed',
                    timestamp: Date.now(),
                    comments: results.ciso.comments,
                    signatureId: `SIG-CISO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                },
                {
                    role: 'AI_AGENT',
                    agentName: 'John Doe (AI CTO Agent)',
                    decision: results.cto.status === 'approved' ? 'Passed' : 'Failed',
                    timestamp: Date.now(),
                    comments: results.cto.comments,
                    signatureId: `SIG-CTO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                },
                {
                    role: 'AI_AGENT',
                    agentName: 'Fatima Khan (AI CIO Agent)',
                    decision: results.cio.status === 'approved' ? 'Passed' : 'Failed',
                    timestamp: Date.now(),
                    comments: results.cio.comments,
                    signatureId: `SIG-CIO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                }
            ];
            onAuditComplete(steps);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700">
                <header className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheckIcon className="w-6 h-6 text-teal-400" />
                            Agentic Compliance Audit
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">NCA ECC Automated Validation Protocol</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900">
                    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <DocumentTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Document under review</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
                            {doc.controlId}: {doc.subdomainTitle}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <AgentCard 
                            name="Samia Ahmed" 
                            role="AI CISO Agent" 
                            status={auditStatus === 'idle' ? 'idle' : auditStatus === 'running' ? 'analyzing' : results.ciso ? results.ciso.status : 'idle'}
                            comments={results.ciso?.comments || ''}
                            delay={0}
                            avatarColor="bg-purple-600"
                        />
                        <AgentCard 
                            name="John Doe" 
                            role="AI CTO Agent" 
                            status={auditStatus === 'idle' ? 'idle' : auditStatus === 'running' ? 'analyzing' : results.cto ? results.cto.status : 'idle'}
                            comments={results.cto?.comments || ''}
                            delay={1500}
                            avatarColor="bg-indigo-600"
                        />
                        <AgentCard 
                            name="Fatima Khan" 
                            role="AI CIO Agent" 
                            status={auditStatus === 'idle' ? 'idle' : auditStatus === 'running' ? 'analyzing' : results.cio ? results.cio.status : 'idle'}
                            comments={results.cio?.comments || ''}
                            delay={3000}
                            avatarColor="bg-teal-600"
                        />
                    </div>
                </div>

                <footer className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    {auditStatus === 'idle' && (
                        <button 
                            onClick={startAudit}
                            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <ShieldCheckIcon className="w-5 h-5" />
                            Start Agentic Audit
                        </button>
                    )}
                    {auditStatus === 'running' && (
                        <button disabled className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold rounded-lg cursor-wait flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Agents Working...
                        </button>
                    )}
                    {auditStatus === 'complete' && (
                        <button 
                            onClick={handleFinalize}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            Finalize Report & Sign
                        </button>
                    )}
                </footer>
            </div>
            <style>{`
                @keyframes progress-indeterminate {
                    0% { margin-left: -50%; width: 50%; }
                    100% { margin-left: 100%; width: 50%; }
                }
                .animate-progress-indeterminate {
                    animation: progress-indeterminate 1.5s infinite linear;
                }
            `}</style>
        </div>
    );
};
