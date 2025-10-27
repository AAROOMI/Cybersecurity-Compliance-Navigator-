import React, { useState } from 'react';
import { TrashIcon } from './Icons';

type Risk = {
  id: string;
  description: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  mitigation: string;
  owner: string;
};

// Updated initial data with new 1-5 scale
const initialRiskData: Record<string, Risk[]> = {
  'Network Security': [
    { id: 'ns1', description: 'Unauthorized access to internal network via unpatched firewall.', likelihood: 3, impact: 5, mitigation: 'Implement regular firewall patch management and rule reviews.', owner: 'IT Security' },
    { id: 'ns2', description: 'Denial-of-Service (DoS) attack against public-facing web servers.', likelihood: 2, impact: 3, mitigation: 'Utilize a cloud-based DDoS protection service.', owner: 'Network Team' },
  ],
  'Data Security': [
    { id: 'ds1', description: 'Sensitive customer data leakage from production database.', likelihood: 3, impact: 5, mitigation: 'Implement Data Loss Prevention (DLP) and encrypt database at rest.', owner: 'DBA Team' },
  ],
  'Endpoint Security': [
     { id: 'es1', description: 'Ransomware infection on employee workstations via phishing email.', likelihood: 4, impact: 5, mitigation: 'Deploy advanced Endpoint Detection and Response (EDR) and conduct regular user awareness training.', owner: 'Endpoint Team' },
  ],
  'Access Control': [
    { id: 'ac1', description: 'Former employee retaining access to critical systems.', likelihood: 3, impact: 3, mitigation: 'Automate de-provisioning process upon employee termination notification from HR.', owner: 'IAM Team' },
  ],
};

// Updated options to a 1-5 scale
const likelihoodOptions = [
    { value: 1, label: 'Very Low' }, 
    { value: 2, label: 'Low' }, 
    { value: 3, label: 'Medium' }, 
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
];
const impactOptions = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
];

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
}> = ({ title, risks, onAddRisk, onUpdateRisk, onDeleteRisk }) => {
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
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                    {showAddForm ? 'Cancel' : '+ Add Risk'}
                </button>
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
                            <th className="px-4 py-3 text-right">Actions</th>
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
                                    <td className="px-4 py-3"><textarea rows={2} value={risk.description} onChange={(e) => handleUpdate('description', e.target.value)} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600"/></td>
                                    <td className="px-4 py-3">
                                        <select value={risk.likelihood} onChange={(e) => handleUpdate('likelihood', parseInt(e.target.value))} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600">
                                            {likelihoodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={risk.impact} onChange={(e) => handleUpdate('impact', parseInt(e.target.value))} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600">
                                            {impactOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 font-semibold">
                                        <span className={`px-2 py-1 rounded-full text-xs ${scoreInfo.color}`}>{score} ({scoreInfo.text})</span>
                                    </td>
                                    <td className="px-4 py-3"><textarea rows={2} value={risk.mitigation} onChange={(e) => handleUpdate('mitigation', e.target.value)} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600"/></td>
                                    <td className="px-4 py-3"><input type="text" value={risk.owner} onChange={(e) => handleUpdate('owner', e.target.value)} className="w-full p-1 bg-transparent rounded-md border border-gray-300 dark:border-gray-600"/></td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => window.confirm('Are you sure you want to delete this risk?') && onDeleteRisk(title, risk.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
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
                                <td className="px-4 py-3 text-right">
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

export const RiskAssessmentPage: React.FC = () => {
    const [risks, setRisks] = useState<Record<string, Risk[]>>(initialRiskData);

    const handleAddRisk = (category: string, risk: Omit<Risk, 'id'>) => {
        const newRisk = { ...risk, id: `${category.slice(0, 2).toLowerCase()}${Date.now()}` };
        setRisks(prev => ({
            ...prev,
            [category]: [...prev[category], newRisk]
        }));
    };

    const handleUpdateRisk = (category: string, updatedRisk: Risk) => {
        setRisks(prev => ({
            ...prev,
            [category]: prev[category].map(r => r.id === updatedRisk.id ? updatedRisk : r)
        }));
    };

    const handleDeleteRisk = (category: string, riskId: string) => {
        setRisks(prev => ({
            ...prev,
            [category]: prev[category].filter(r => r.id !== riskId)
        }));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Risk Assessment Register</h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Identify, analyze, and manage organizational risks in a centralized register.</p>
            </div>

            <div className="space-y-8">
                {Object.entries(risks).map(([category, riskItems]) => (
                    <RiskCategory
                        key={category}
                        title={category}
                        risks={riskItems}
                        onAddRisk={handleAddRisk}
                        onUpdateRisk={handleUpdateRisk}
                        onDeleteRisk={handleDeleteRisk}
                    />
                ))}
            </div>
             <style>{`
                td, th {
                    vertical-align: middle;
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
