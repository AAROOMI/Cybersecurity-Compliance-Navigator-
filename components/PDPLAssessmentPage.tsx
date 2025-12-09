import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { AssessmentItem, ControlStatus, Permission } from '../types';
import { ChevronDownIcon, SearchIcon, DownloadIcon, MicrophoneIcon } from './Icons';
import { PDPLDomainComplianceBarChart } from './PDPLComplianceBarChart';
import { NooraAssistant } from './NooraAssistant';

declare const Chart: any;

const allStatuses: ControlStatus[] = ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'];

const statusColors: Record<ControlStatus, string> = {
    'Implemented': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Partially Implemented': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Not Implemented': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Not Applicable': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const getStatusChartColor = (status: ControlStatus | 'Not Covered', opacity = 1) => {
    switch (status) {
        case 'Implemented': return `rgba(16, 185, 129, ${opacity})`; // green-500
        case 'Partially Implemented': return `rgba(245, 158, 11, ${opacity})`; // amber-500
        case 'Not Implemented': return `rgba(239, 68, 68, ${opacity})`; // red-500
        case 'Not Applicable': return `rgba(107, 114, 128, ${opacity})`; // gray-500
        default: return `rgba(156, 163, 175, ${opacity})`; // gray-400
    }
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        {children}
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number; description?: string }> = ({ title, value, description }) => (
    <Card>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
        <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </Card>
);

const StatusDistributionChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || typeof Chart === 'undefined') return;
        
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#E5E7EB' : '#374151';

        const chartData = {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(status => getStatusChartColor(status as ControlStatus, 0.8)),
                borderColor: isDark ? '#1f2937' : '#ffffff',
                borderWidth: 2,
            }]
        };

        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(canvasRef.current, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: textColor, padding: 15, boxWidth: 12 }
                    },
                }
            }
        });

        return () => chartRef.current?.destroy();
    }, [data]);
    
    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Status Distribution</h3>
            <div className="h-64">
                <canvas ref={canvasRef} />
            </div>
        </Card>
    );
};


const ControlRow: React.FC<{ item: AssessmentItem; isEditable: boolean; onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void; }> = ({ item, isEditable, onUpdateItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editableItem, setEditableItem] = useState(item);

    useEffect(() => {
        setEditableItem(item);
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditableItem(prev => ({...prev, [name]: name === 'controlStatus' ? (value as ControlStatus) : value}));
    };
    
    const handleBlur = () => {
        if (JSON.stringify(editableItem) !== JSON.stringify(item)) {
            onUpdateItem(item.controlCode, editableItem);
        }
    };

    return (
        <>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 dark:text-gray-300">{item.controlCode}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{item.controlName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {isEditable ? (
                        <select
                            name="controlStatus"
                            value={editableItem.controlStatus}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onClick={(e) => e.stopPropagation()}
                            className={`block w-full text-xs p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${statusColors[editableItem.controlStatus]} border-transparent`}
                        >
                            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[item.controlStatus]}`}>
                            {item.controlStatus}
                        </span>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     {isEditable ? (
                        <input
                            type="date"
                            name="targetDate"
                            value={editableItem.targetDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full text-xs p-1 border rounded-md bg-transparent dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    ) : (
                        item.targetDate
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <td colSpan={5} className="p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Current Status</h4>
                                {isEditable ? (
                                    <textarea name="saudiCeramicsCurrentStatus" value={editableItem.saudiCeramicsCurrentStatus} onChange={handleChange} onBlur={handleBlur} rows={3} className="mt-1 block w-full text-sm border rounded-md bg-transparent dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                ) : (
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{item.saudiCeramicsCurrentStatus}</p>
                                )}
                            </div>
                             <div>
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Recommendation</h4>
                                {isEditable ? (
                                    <textarea name="recommendation" value={editableItem.recommendation} onChange={handleChange} onBlur={handleBlur} rows={3} className="mt-1 block w-full text-sm border rounded-md bg-transparent dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                ) : (
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{item.recommendation}</p>
                                )}
                            </div>
                             <div>
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Management Response</h4>
                                {isEditable ? (
                                    <textarea name="managementResponse" value={editableItem.managementResponse} onChange={handleChange} onBlur={handleBlur} rows={2} className="mt-1 block w-full text-sm border rounded-md bg-transparent dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                ) : (
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{item.managementResponse}</p>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

interface PDPLAssessmentPageProps {
    assessmentData: AssessmentItem[];
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    status: 'idle' | 'in-progress';
    onInitiate: () => void;
    onComplete: () => void;
    permissions: Set<Permission>;
}

export const PDPLAssessmentPage: React.FC<PDPLAssessmentPageProps> = ({ assessmentData, onUpdateItem, status, onInitiate, onComplete, permissions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ControlStatus | 'All'>('All');
    const [domainFilter, setDomainFilter] = useState('All');
    const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({});
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [currentControlIndex, setCurrentControlIndex] = useState(0);

    const isEditable = status === 'in-progress';
    const canUpdate = permissions.has('pdplAssessment:update');

    const handleNextControl = () => {
        setCurrentControlIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex >= assessmentData.length) {
                alert("You have completed all controls in the assessment.");
                setIsAssistantOpen(false);
                return 0; 
            }
            return nextIndex;
        });
    };

    const stats = useMemo(() => {
        const totalApplicable = assessmentData.filter(d => d.controlStatus !== 'Not Applicable').length;
        const implemented = assessmentData.filter(d => d.controlStatus === 'Implemented').length;
        const partially = assessmentData.filter(d => d.controlStatus === 'Partially Implemented').length;
        const notImplemented = assessmentData.filter(d => d.controlStatus === 'Not Implemented').length;
        const compliance = totalApplicable > 0 ? (implemented / totalApplicable) * 100 : 0;

        return { compliance, implemented, partially, notImplemented, total: assessmentData.length };
    }, [assessmentData]);

    const statusDistribution = useMemo(() => {
        const dist: Record<string, number> = {
            'Implemented': 0, 'Partially Implemented': 0, 'Not Implemented': 0, 'Not Applicable': 0
        };
        assessmentData.forEach(item => {
            dist[item.controlStatus]++;
        });
        return dist;
    }, [assessmentData]);
    
    const domains = useMemo(() => {
        const domainMap: Record<string, AssessmentItem[]> = {};
        for(const item of assessmentData) {
            if (!domainMap[item.domainName]) {
                domainMap[item.domainName] = [];
            }
            domainMap[item.domainName].push(item);
        }
        return Object.entries(domainMap).map(([name, items]) => ({ name, items }));
    }, [assessmentData]);

    const filteredDomains = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        
        return domains
            .filter(domain => domainFilter === 'All' || domain.name === domainFilter)
            .map(domain => {
                const filteredItems = domain.items.filter(item => 
                    (statusFilter === 'All' || item.controlStatus === statusFilter) &&
                    (
                        item.controlCode.toLowerCase().includes(lowerSearch) ||
                        item.controlName.toLowerCase().includes(lowerSearch) ||
                        item.saudiCeramicsCurrentStatus.toLowerCase().includes(lowerSearch) ||
                        item.recommendation.toLowerCase().includes(lowerSearch)
                    )
                );
                return { ...domain, items: filteredItems };
            })
            .filter(domain => domain.items.length > 0);
    }, [domains, searchTerm, statusFilter, domainFilter]);

    useEffect(() => {
        // Automatically open domains that have search results
        const newOpenState: Record<string, boolean> = {};
        if (searchTerm || statusFilter !== 'All' || domainFilter !== 'All') {
            for (const domain of filteredDomains) {
                newOpenState[domain.name] = true;
            }
        }
        setOpenDomains(newOpenState);
    }, [filteredDomains, searchTerm, statusFilter, domainFilter]);

    const handleExportCSV = () => {
        const dataToExport = filteredDomains.flatMap(domain => domain.items);
        if (dataToExport.length === 0) {
            alert("No data to export based on current filters.");
            return;
        }

        const headers = [
            'Domain Code', 'Domain Name', 'Sub-Domain Code', 'Sub-Domain Name', 
            'Control Code', 'Control Name', 'Current Status', 'Control Status', 
            'Recommendation', 'Management Response', 'Target Date'
        ];

        const escapeCSV = (field: string) => {
            if (field === null || field === undefined) {
                return '';
            }
            let str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                str = `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = [headers.join(',')];
        dataToExport.forEach(item => {
            const row = [
                escapeCSV(item.domainCode),
                escapeCSV(item.domainName),
                escapeCSV(item.subDomainCode),
                escapeCSV(item.subdomainName),
                escapeCSV(item.controlCode),
                escapeCSV(item.controlName),
                escapeCSV(item.saudiCeramicsCurrentStatus),
                escapeCSV(item.controlStatus),
                escapeCSV(item.recommendation),
                escapeCSV(item.managementResponse),
                escapeCSV(item.targetDate),
            ];
            csvRows.push(row.join(','));
        });
        const csvContent = csvRows.join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        const today = new Date().toISOString().slice(0, 10);
        link.download = `pdpl_assessment_export_${today}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">PDPL Assessment</h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Analysis of the assessment against the Personal Data Protection Law (PDPL) standards.</p>
                </div>
                 {canUpdate && (
                     <div className="flex-shrink-0 flex items-center gap-2">
                        {isEditable && (
                             <button onClick={() => setIsAssistantOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                <MicrophoneIcon className="-ml-1 mr-2 h-5 w-5" />
                                Start Voice Assessment
                            </button>
                        )}
                        {isEditable ? (
                            <button onClick={onComplete} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                Complete Assessment
                            </button>
                        ) : (
                            <button onClick={onInitiate} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
                                Initiate New Assessment
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isEditable && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400">
                    <h3 className="font-bold text-blue-800 dark:text-blue-200">Assessment in Progress</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">You are in edit mode. Changes are saved automatically as you move out of a field. Click "Complete Assessment" when you are finished.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Overall Compliance" value={`${stats.compliance.toFixed(1)}%`} description="Based on applicable controls" />
                <StatCard title="Implemented" value={stats.implemented} />
                <StatCard title="Partially Implemented" value={stats.partially} />
                <StatCard title="Not Implemented" value={stats.notImplemented} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search controls, recommendations, etc."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div>
                                <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="All">All Domains</option>
                                    {domains.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="All">All Statuses</option>
                                    {allStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                            <div>
                                <button
                                    onClick={handleExportCSV}
                                    className="w-full h-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                    <span>Export CSV</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <StatusDistributionChart data={statusDistribution} />
                </div>
            </div>

            <Card>
                <PDPLDomainComplianceBarChart data={assessmentData} />
            </Card>

            <div className="space-y-4">
                {filteredDomains.map(domain => (
                     <div key={domain.name} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                            onClick={() => setOpenDomains(prev => ({...prev, [domain.name]: !prev[domain.name]}))}
                            className="w-full flex justify-between items-center p-5 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            <div className="flex items-baseline gap-4">
                               <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{domain.name}</h3>
                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">{domain.items.length} controls</span>
                            </div>
                            <ChevronDownIcon className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform ${openDomains[domain.name] ? 'rotate-180' : ''}`} />
                        </button>
                        {openDomains[domain.name] && (
                            <div className="border-t border-gray-200 dark:border-gray-700">
                               <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Control Name</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Target Date</th>
                                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {domain.items.map(item => <ControlRow key={item.controlCode} item={item} isEditable={isEditable && canUpdate} onUpdateItem={onUpdateItem} />)}
                                        </tbody>
                                    </table>
                               </div>
                            </div>
                        )}
                    </div>
                ))}
                {filteredDomains.length === 0 && (
                     <Card className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">No assessment items match your current filters.</p>
                    </Card>
                )}
            </div>
             {isAssistantOpen && (
                <NooraAssistant
                    isOpen={isAssistantOpen}
                    onClose={() => setIsAssistantOpen(false)}
                    assessmentData={assessmentData}
                    onUpdateItem={onUpdateItem}
                    currentControlIndex={currentControlIndex}
                    onNextControl={handleNextControl}
                    frameworkName="PDPL"
                />
            )}
        </div>
    );
};
