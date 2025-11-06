

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { AssessmentItem, ControlStatus, Permission } from '../types';
import { SearchIcon, DownloadIcon, UploadIcon } from './Icons';
import { SamaCsfDomainComplianceBarChart } from './SamaCsfComplianceBarChart';
import { AssessmentSheet } from './AssessmentSheet';

declare const Chart: any;

const allStatuses: ControlStatus[] = ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'];

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

interface SamaCsfAssessmentPageProps {
    assessmentData: AssessmentItem[];
    onUpdateItem: (controlCode: string, updatedItem: AssessmentItem) => void;
    status: 'idle' | 'in-progress';
    onInitiate: () => void;
    onComplete: () => void;
    permissions: Set<Permission>;
}

export const SamaCsfAssessmentPage: React.FC<SamaCsfAssessmentPageProps> = ({ assessmentData, onUpdateItem, status, onInitiate, onComplete, permissions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ControlStatus | 'All'>('All');
    const [domainFilter, setDomainFilter] = useState('All');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isEditable = status === 'in-progress';
    const canUpdate = permissions.has('samaCsfAssessment:update');

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
            if (dist[item.controlStatus] !== undefined) {
                dist[item.controlStatus]++;
            }
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
                        item.currentStatusDescription.toLowerCase().includes(lowerSearch) ||
                        item.recommendation.toLowerCase().includes(lowerSearch)
                    )
                );
                return { ...domain, items: filteredItems };
            })
            .filter(domain => domain.items.length > 0);
    }, [domains, searchTerm, statusFilter, domainFilter]);
    
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
            if (field === null || field === undefined) return '';
            let str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                str = `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = [headers.join(',')];
        dataToExport.forEach(item => {
            const row = [
                escapeCSV(item.domainCode), escapeCSV(item.domainName), escapeCSV(item.subDomainCode),
                escapeCSV(item.subdomainName), escapeCSV(item.controlCode), escapeCSV(item.controlName),
                escapeCSV(item.currentStatusDescription), escapeCSV(item.controlStatus),