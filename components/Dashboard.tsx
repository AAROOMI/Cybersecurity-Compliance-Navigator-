import React, { useEffect, useRef, useMemo } from 'react';
import type { PolicyDocument, User, SearchResult, Domain, DocumentStatus, UserRole } from '../types';
import { CheckCircleIcon, DocumentIcon } from './Icons';

declare const Chart: any;

interface DashboardPageProps {
    repository: PolicyDocument[];
    currentUser: User;
    allControls: SearchResult[];
    domains: Domain[];
    onSetView: (view: 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile') => void;
}

const statusToRoleMap: Record<string, UserRole> = {
    'Pending CISO Approval': 'CISO',
    'Pending CTO Approval': 'CTO',
    'Pending CIO Approval': 'CIO',
    'Pending CEO Approval': 'CEO',
};

const getStatusColor = (status: DocumentStatus | 'Not Covered', opacity = 1) => {
    switch (status) {
        case 'Approved': return `rgba(16, 185, 129, ${opacity})`; // green-500
        case 'Rejected': return `rgba(239, 68, 68, ${opacity})`; // red-500
        case 'Pending CISO Approval':
        case 'Pending CTO Approval':
        case 'Pending CIO Approval':
        case 'Pending CEO Approval': return `rgba(245, 158, 11, ${opacity})`; // amber-500
        case 'Not Covered': return `rgba(107, 114, 128, ${opacity})`; // gray-500
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

const OverallComplianceChart: React.FC<{ percentage: number }> = ({ percentage }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !Chart) return;

        const isDark = document.documentElement.classList.contains('dark');
        const trackColor = isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 1)';
        const textColor = isDark ? 'rgba(243, 244, 246, 1)' : 'rgba(17, 24, 39, 1)';

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [getStatusColor('Approved'), trackColor],
                    borderColor: [getStatusColor('Approved'), trackColor],
                    circumference: 180,
                    rotation: -90,
                    cutout: '80%',
                    borderRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
            }
        });
        
        return () => chartRef.current?.destroy();

    }, [percentage]);

    return (
        <Card className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Overall Compliance</h3>
            <div className="relative w-48 h-24">
                <canvas ref={canvasRef}></canvas>
                <div className="absolute inset-0 flex items-end justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">{percentage.toFixed(0)}%</span>
                </div>
            </div>
        </Card>
    );
};

const StatusDistributionChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !Chart) return;
        
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#E5E7EB' : '#374151';

        const chartData = {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(status => getStatusColor(status as DocumentStatus, 0.8)),
                borderColor: isDark ? '#1f2937' : '#ffffff',
                borderWidth: 2,
            }]
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            padding: 15,
                            boxWidth: 12,
                        }
                    },
                }
            }
        });

        return () => chartRef.current?.destroy();

    }, [data]);
    
    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Document Status</h3>
            <div className="h-64">
                <canvas ref={canvasRef} />
            </div>
        </Card>
    );
};

const DomainComplianceChart: React.FC<{ data: { name: string, compliance: number }[] }> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !Chart) return;
        
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#E5E7EB' : '#4B5563';
        const gridColor = isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 1)';
        
        const chartData = {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'Compliance %',
                data: data.map(d => d.compliance),
                backgroundColor: getStatusColor('Approved', 0.7),
                borderColor: getStatusColor('Approved'),
                borderWidth: 1,
                borderRadius: 4,
            }]
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: chartData,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: gridColor },
                        ticks: { color: textColor, callback: (value) => `${value}%` },
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    }
                }
            }
        });

        return () => chartRef.current?.destroy();
    }, [data]);

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Compliance by Domain</h3>
            <div className="h-96">
                <canvas ref={canvasRef}></canvas>
            </div>
        </Card>
    );
};


export const DashboardPage: React.FC<DashboardPageProps> = ({ repository, currentUser, allControls, domains, onSetView }) => {
    const stats = useMemo(() => {
        const approvedCount = repository.filter(doc => doc.status === 'Approved').length;
        const pendingCount = repository.filter(doc => doc.status.startsWith('Pending')).length;
        const totalControls = allControls.length;
        const coverage = (repository.length / totalControls) * 100;
        const compliance = (approvedCount / totalControls) * 100;
        
        return { approvedCount, pendingCount, coverage, compliance, totalControls };
    }, [repository, allControls]);

    const myTasks = useMemo(() => {
        if (!currentUser) return [];
        return repository.filter(doc => statusToRoleMap[doc.status] === currentUser.role);
    }, [repository, currentUser]);

    const statusDistribution = useMemo(() => {
        const distribution: Record<string, number> = {};
        repository.forEach(doc => {
            distribution[doc.status] = (distribution[doc.status] || 0) + 1;
        });
        return distribution;
    }, [repository]);

    const domainCompliance = useMemo(() => {
        return domains.map(domain => {
            const controlsInDomain = allControls.filter(c => c.domain.id === domain.id);
            const approvedDocsInDomain = repository.filter(doc => 
                doc.status === 'Approved' && controlsInDomain.some(c => c.control.id === doc.controlId)
            );
            const compliance = controlsInDomain.length > 0 ? (approvedDocsInDomain.length / controlsInDomain.length) * 100 : 0;
            return { name: domain.name, compliance };
        });
    }, [domains, allControls, repository]);
    
    const recentActivity = useMemo(() => {
        return [...repository]
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 5);
    }, [repository]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Compliance Dashboard</h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Welcome, {currentUser?.name}. Here's your compliance overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <OverallComplianceChart percentage={stats.compliance} />
                <StatCard title="Control Coverage" value={`${stats.coverage.toFixed(0)}%`} description={`${repository.length} of ${stats.totalControls} controls have documents.`} />
                <StatCard title="Approved Policies" value={stats.approvedCount} description="Fully implemented controls." />
                <StatCard title="Pending Approvals" value={stats.pendingCount} description="Documents waiting for review." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DomainComplianceChart data={domainCompliance} />
                </div>
                <div>
                    <StatusDistributionChart data={statusDistribution} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">My Tasks ({myTasks.length})</h3>
                    {myTasks.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                           {myTasks.map(task => (
                                <li key={task.id} className="py-3 flex items-center justify-between">
                                   <div>
                                     <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.controlId}</p>
                                     <p className="text-sm text-gray-500 dark:text-gray-400">{task.controlDescription}</p>
                                   </div>
                                    <button onClick={() => onSetView('documents')} className="text-sm font-semibold text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200">
                                        View
                                    </button>
                                </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No pending tasks. Great job!</p>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Activity</h3>
                    <ul className="space-y-4">
                        {recentActivity.map(doc => (
                            <li key={doc.id} className="flex items-start space-x-3">
                                <div className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full`} style={{ backgroundColor: getStatusColor(doc.status) }}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="font-semibold">{doc.controlId}</span> was updated to <span className="font-semibold">{doc.status}</span>.
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(doc.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};
