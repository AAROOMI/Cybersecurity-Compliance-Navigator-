import React, { useState } from 'react';
import type { ComplianceGap, AgentLogEntry, Permission } from '../types';
import { SparklesIcon } from './Icons';

interface ComplianceAgentPageProps {
    onRunAnalysis: () => ComplianceGap[];
    onGenerateDocuments: (gaps: ComplianceGap[]) => Promise<void>;
    agentLog: AgentLogEntry[];
    permissions: Set<Permission>;
}

export const ComplianceAgentPage: React.FC<ComplianceAgentPageProps> = ({ onRunAnalysis, onGenerateDocuments, agentLog, permissions }) => {
    const [gaps, setGaps] = useState<ComplianceGap[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const canRunAgent = permissions.has('complianceAgent:run');

    const handleRunAnalysis = () => {
        setIsAnalyzing(true);
        // Simulate a short delay for better UX
        setTimeout(() => {
            const foundGaps = onRunAnalysis();
            setGaps(foundGaps);
            setIsAnalyzing(false);
        }, 500);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        await onGenerateDocuments(gaps);
        setGaps([]); // Clear gaps after generation is initiated
        setIsGenerating(false);
    };

    const getStatusColor = (status: AgentLogEntry['status']) => {
        switch(status) {
            case 'success': return 'text-green-500';
            case 'working': return 'text-blue-500';
            case 'error': return 'text-red-500';
            case 'info':
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Compliance Agent</h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Let Noora analyze your assessments, identify compliance gaps, and automatically generate required documentation.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Automated Gap Analysis</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Scan all assessments for non-compliant controls that are missing documentation.</p>
                    </div>
                     {canRunAgent ? (
                        <button
                            onClick={handleRunAnalysis}
                            disabled={isAnalyzing || isGenerating}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? "Analyzing..." : "Analyze Assessments"}
                        </button>
                    ) : (
                         <p className="mt-4 sm:mt-0 text-sm text-gray-500">You don't have permission to run the agent.</p>
                    )}
                </div>

                {gaps.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Identified Gaps ({gaps.length})</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">The following controls are not fully compliant and lack a corresponding policy document.</p>
                        
                        <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {gaps.map(gap => (
                                    <li key={gap.controlCode} className="px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                                        <div>
                                            <p className="font-semibold font-mono text-sm text-gray-800 dark:text-gray-200">{gap.controlCode} <span className="text-xs font-sans text-gray-500">({gap.framework})</span></p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{gap.controlName}</p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{gap.assessedStatus.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {canRunAgent && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400"
                                >
                                     {isGenerating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating Documents...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                                            Generate All Missing Documents
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Agent Activity Log</h2>
                 <div className="mt-4 max-h-80 overflow-y-auto bg-gray-900 text-white font-mono text-sm p-4 rounded-md">
                    {agentLog.length > 0 ? (
                        agentLog.map(log => (
                            <p key={log.id}>
                                <span className="text-gray-500 mr-2">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className={`${getStatusColor(log.status)}`}>{log.message}</span>
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-500">No agent activity yet. Click "Analyze Assessments" to begin.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};