import React, { useState, useMemo } from 'react';
import { TrashIcon, MicrophoneIcon, DownloadIcon, PrinterIcon } from './Icons';
import type { Risk, Permission } from '../types';
import { likelihoodOptions, impactOptions } from '../data/riskAssessmentData';

// Updated risk score calculation and color coding
const getRiskScoreInfo = (score: number): { text: string, color: string } => {
  if (score <= 5) return { text: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  if (score <= 10) return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
  if (score <= 15) return { text: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
  if (score <= 20) return { text: 'Very High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
  return { text: 'Critical', color: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-100 font-bold' };
};

const RiskCategory: React.FC<{
  title: string;
  risks: Risk[];
  onAddRisk: (category: string, risk: Omit<Risk, 'id'>) => void;
  onUpdateRisk: (category: string, risk: Risk) => void;
  onDeleteRisk: (category: string, riskId: string) => void;
  isEditable: boolean;
}> = ({ title, risks, onAddRisk, onUpdateRisk, onDeleteRisk, isEditable }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRisk, setNewRisk] = useState<Omit<Risk, 'id'>>({ description: '', likelihood: 1, impact: 1, mitigation: '', owner: '' });

    const handleSaveNewRisk = () => {
        if (newRisk.description.trim() && newRisk.owner.trim()) {
            onAddRisk(title, newRisk);
            setNewRisk({ description: '', likelihood: 1, impact: 1, mitigation: '', owner: '' });
            setShowAddForm(false);
        } else {
            alert('Risk Description and Owner cannot be empty.');
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center no-print">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                {isEditable && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Risk'}
                    </button>
                )}
            </header>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3 text-left w-1/4">Risk Description</th>
                            <th className="px-4 py-3 text-left">Likelihood</th>
                            <th className="px-4 py-3 text-left">Impact</th>
                            <th className="px-4 py-3 text-left">Risk Score</th>
                            <th className="px-4 py-3 text-left w-1/4">Mitigation Strategy</th>
                            <th className="px-4 py-3 text-left">Owner</th>
                            <th className="px-4 py-3 text-right no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {risks.map(risk => {
                            const score = risk.likelihood * risk.impact;
                            const scoreInfo = getRiskScoreInfo(score);
                            
                            const handleUpdate = (field: keyof Risk, value: string | number) => {
                                onUpdateRisk(title, { ...risk, [field]: value });
                            };

                            return (
                                <tr key={risk.id}>
                                    <td className="px-4 py-3"><textarea rows={2} value={risk.description} onChange={(e) => handleUpdate('description', e.target.value)} disabled={!isEditable} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700/50"/></td>
                                    <td className="px-4 py-3">
                                        <select value={risk.likelihood} onChange={(e) => handleUpdate('likelihood', parseInt(e.target.value))} disabled={!isEditable} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700/50">
                                            {likelihoodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={risk.impact} onChange={(e) => handleUpdate('impact', parseInt(e.target.value))} disabled={!isEditable} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700/50">
                                            {impactOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        <span className={`px-2 py-1 rounded-full text-xs ${scoreInfo.color}`}>{score} ({scoreInfo.text})</span>
                                    </td>
                                    <td className="px-4 py-3"><textarea rows={2} value={risk.mitigation} onChange={(e) => handleUpdate('mitigation', e.target.value)} disabled={!isEditable} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700/50"/></td>
                                    <td className="px-4 py-3"><input type="text" value={risk.owner} onChange={(e) => handleUpdate('owner', e.target.value)} disabled={!isEditable} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700/50"/></td>
                                    <td className="px-4 py-3 text-right no-print">
                                        {isEditable && (
                                            <button onClick={() => window.confirm('Are you sure you want to delete this risk?') && onDeleteRisk(title, risk.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {showAddForm && (
                             <tr className="bg-teal-50/50 dark:bg-teal-900/20">
                                <td className="px-4 py-3"><textarea placeholder="Describe the risk..." rows={2} value={newRisk.description} onChange={(e) => setNewRisk({...newRisk, description: e.target.value})} className="w-full p-1 rounded-md border border-gray-300 dark:border-gray-600"/></td>
                                <td className="px-4 py-3">
                                    <select value={newRisk.likelihood} onChange={(e) => setNewRisk({...newRisk, likelihood: parseInt(e.target.value)})} className="w-full p-1 rounded-md border border-gray-300 dark:border-gray-600">
                                        {likelihoodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select value={newRisk.impact} onChange={(e) => setNewRisk({...newRisk, impact: parseInt(e.target.value)})} className="w-full p-1 rounded-md border border-gray-300 dark:border-gray-600">
                                        {impactOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"><textarea placeholder="Describe mitigation..." rows={2} value={newRisk.mitigation} onChange={(e) => setNewRisk({...newRisk, mitigation: e.target.value})} className="w-full p-1 rounded-md border border-gray-300 dark:border-gray-600"/></td>
                                <td className="px-4 py-3"><input type="text" placeholder="e.g., IT Team" value={newRisk.owner} onChange={(e) => setNewRisk({...newRisk, owner: e.target.value})} className="w-full p-1 rounded-md border border-gray-300 dark:border-gray-600"/></td>
                                <td className="px-4 py-3 text-right no-print">
                                    <button onClick={handleSaveNewRisk} className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">Save</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const RiskMatrix: React.FC<{ allRisks: Risk[] }> = ({ allRisks }) => {
  const matrix: Risk[][][] = useMemo(() => {
    const m: Risk[][][] = Array(5).fill(0).map(() => Array(5).fill(0).map(() => []));
    allRisks.forEach(risk => {
      if (risk.likelihood >= 1 && risk.likelihood <= 5 && risk.impact >= 1 && risk.impact <= 5) {
        m[risk.likelihood - 1][risk.impact - 1].push(risk);
      }
    });
    return m;
  }, [allRisks]);

  const getCellColor = (likelihood: number, impact: number): string => {
    const score = likelihood * impact;
    if (score <= 5) return 'bg-green-500/80 hover:bg-green-500';
    if (score <= 10) return 'bg-yellow-400/80 hover:bg-yellow-400 dark:text-gray-800';
    if (score <= 15) return 'bg-orange-500/80 hover:bg-orange-500';
    if (score <= 20) return 'bg-red-500/80 hover:bg-red-500';
    return 'bg-red-700/80 hover:bg-red-700';
  };
  
  return (
    <div className="risk-heatmap bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Risk Heatmap</h2>
      <div className="flex justify-center items-start gap-4">
        <div className="flex flex-col items-center justify-center pt-8 self-stretch">
            <div className="transform -rotate-90 whitespace-nowrap font-bold text-gray-600 dark:text-gray-300 tracking-wider">LIKELIHOOD</div>
        </div>
        <div className="flex-1 max-w-2xl">
          <div className="grid grid-cols-[auto_1fr] gap-x-2">
              <div className="flex flex-col-reverse justify-around text-right text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {likelihoodOptions.map(opt => (
                      <div key={opt.value} className="h-16 flex items-center pr-2">{opt.label}</div>
                  ))}
              </div>
              <div className="grid grid-cols-5 grid-rows-5 gap-1.5">
                  {likelihoodOptions.slice().reverse().flatMap(l_opt => 
                      impactOptions.map(i_opt => {
                          const likelihood = l_opt.value;
                          const impact = i_opt.value;
                          const cellRisks = matrix[likelihood - 1]?.[impact - 1] ?? [];
                          const hasRisks = cellRisks.length > 0;
                          
                          return (
                              <div key={`${likelihood}-${impact}`} className="relative group h-16 flex items-center justify-center">
                                  <div className={`w-full h-full rounded-md flex items-center justify-center text-white font-bold text-2xl transition-all duration-200 ${getCellColor(likelihood, impact)} ${hasRisks ? 'cursor-pointer' : ''}`}>
                                      {hasRisks ? cellRisks.length : ''}
                                  </div>
                                  {hasRisks && (
                                      <div className="absolute bottom-full mb-3 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 dark:bg-gray-700">
                                          <h4 className="font-bold border-b border-gray-600 pb-1 mb-2">Risks ({cellRisks.length})</h4>
                                          <ul className="list-disc list-inside space-y-1 max-h-48 overflow-y-auto">
                                              {cellRisks.map(risk => <li key={risk.id}>{risk.description}</li>)}
                                          </ul>
                                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900 dark:border-t-gray-700"></div>
                                      </div>
                                  )}
                              </div>
                          );
                      })
                  )}
              </div>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2 ml-[52px]">
              {impactOptions.map(opt => <div key={opt.value}>{opt.label}</div>)}
          </div>
           <div className="text-center mt-2 font-bold text-gray-600 dark:text-gray-300 ml-[52px]">IMPACT</div>
        </div>
      </div>
    </div>
  );
};

interface RiskAssessmentPageProps {
    risks: Risk[];
    setRisks: (updater: React.SetStateAction<Risk[]>) => void;
    status: 'idle' | 'in-progress';
    onInitiate: () => void;
    onComplete: () => void;
    permissions: Set<Permission>;
    onStartAssistant: () => void;
}

export const RiskAssessmentPage: React.FC<RiskAssessmentPageProps> = ({ risks, setRisks, status, onInitiate, onComplete, permissions, onStartAssistant }) => {
    const isEditable = status === 'in-progress' && permissions.has('riskAssessment:update');

    // FIX: Refactored categorizedRisks to use a simpler, single-pass grouping logic to fix a TypeScript error.
    const categorizedRisks = useMemo(() => {
        const categories: Record<string, Risk[]> = {};

        risks.forEach(risk => {
            const match = risk.id.match(/^[a-zA-Z]+/);
            const prefix = match ? match[0] : 'unknown';
            let category = 'General';
            switch (prefix) {
                case 'ns': category = 'Network Security'; break;
                case 'ds': category = 'Data Security'; break;
                case 'es': category = 'Endpoint Security'; break;
                case 'ac': category = 'Access Control'; break;
            }
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(risk);
        });
        return categories;
    }, [risks]);


    const handleAddRisk = (category: string, risk: Omit<Risk, 'id'>) => {
        const newRisk = { ...risk, id: `${category.slice(0, 2).toLowerCase()}${Date.now()}` };
        setRisks(prev => [...prev, newRisk]);
    };

    const handleUpdateRisk = (category: string, updatedRisk: Risk) => {
        setRisks(prev => prev.map(r => r.id === updatedRisk.id ? updatedRisk : r));
    };

    const handleDeleteRisk = (category: string, riskId: string) => {
        setRisks(prev => prev.filter(r => r.id !== riskId));
    };

    const escapeCSV = (field: string | number) => {
        if (field === null || field === undefined) return '';
        let str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const handleExportCSV = () => {
        if (risks.length === 0) {
            alert("No risks to export.");
            return;
        }

        const headers = ['Risk ID', 'Category', 'Risk Description', 'Likelihood (1-5)', 'Impact (1-5)', 'Risk Score', 'Risk Level', 'Mitigation Strategy', 'Owner'];
        const csvRows = [headers.join(',')];

        risks.forEach(risk => {
            const score = risk.likelihood * risk.impact;
            const scoreInfo = getRiskScoreInfo(score);
            const match = risk.id.match(/^[a-zA-Z]+/);
            const prefix = match ? match[0] : 'unknown';
            let category = 'General';
            switch (prefix) {
                case 'ns': category = 'Network Security'; break;
                case 'ds': category = 'Data Security'; break;
                case 'es': category = 'Endpoint Security'; break;
                case 'ac': category = 'Access Control'; break;
            }

            const row = [
                escapeCSV(risk.id), escapeCSV(category), escapeCSV(risk.description),
                risk.likelihood, risk.impact, score, scoreInfo.text,
                escapeCSV(risk.mitigation), escapeCSV(risk.owner)
            ].join(',');
            csvRows.push(row);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `risk_assessment_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };
    
    if (status === 'idle') {
        return (
            <div className="text-center">
                 <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Risk Assessment Not Started</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        There is no risk assessment in progress. Initiate a new one to begin identifying and managing organizational risks.
                    </p>
                    <div className="mt-6">
                        <button onClick={onInitiate} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
                            Initiate New Risk Assessment
                        </button>
                    </div>
                 </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 risk-assessment-page">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Risk Assessment Register</h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Identify, analyze, and manage organizational risks in a centralized register.</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 flex-wrap no-print">
                    {isEditable && (
                        <button onClick={onStartAssistant} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                            <MicrophoneIcon className="w-5 h-5 mr-2" />
                            AI Assistant
                        </button>
                    )}
                    <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <PrinterIcon className="w-5 h-5" />
                        Print
                    </button>
                    <button onClick={handleExportCSV} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <DownloadIcon className="w-5 h-5" />
                        Download CSV
                    </button>
                    <button onClick={onComplete} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                        Complete Assessment
                    </button>
                </div>
            </div>
            
            <RiskMatrix allRisks={risks} />

            <div className="space-y-8">
                {Object.entries(categorizedRisks).map(([category, riskItems]) => (
                    <RiskCategory
                        key={category}
                        title={category}
                        risks={riskItems}
                        onAddRisk={handleAddRisk}
                        onUpdateRisk={handleUpdateRisk}
                        onDeleteRisk={handleDeleteRisk}
                        isEditable={isEditable}
                    />
                ))}
            </div>
             <style>{`
                td textarea, td input, td select {
                    color: #111827; /* a default color for non-dark mode */
                }
                .dark td textarea, .dark td input, .dark td select {
                    color: #f9fafb; /* text-gray-50 */
                }
                td textarea, td input, td select {
                    background-color: transparent;
                    width: 100%;
                }
                td textarea:focus, td input:focus, td select:focus {
                    outline: none;
                    --tw-ring-color: #14b8a6;
                    border-color: #14b8a6;
                    box-shadow: 0 0 0 1px #14b8a6;
                }
             `}</style>
        </div>
    );
};