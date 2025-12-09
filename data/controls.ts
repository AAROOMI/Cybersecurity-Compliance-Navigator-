
import type { Domain } from '../types';
import { assessmentData } from './assessmentData'; // Using the main assessment data source

// Helper function to transform the flat assessment data into the nested Domain structure
const transformDataToDomains = (): Domain[] => {
    const domainMap: Record<string, Domain> = {};

    // We sort the assessment data first to ensure domains appear in order
    const sortedData = [...assessmentData].sort((a, b) => {
        const domainComparison = parseInt(a.domainCode) - parseInt(b.domainCode);
        if (domainComparison !== 0) return domainComparison;
        
        // Custom sort for subdomains like 1.1, 1.2, 1.10
        const subA = a.subDomainCode.split('.').map(Number);
        const subB = b.subDomainCode.split('.').map(Number);
        
        if (subA[0] !== subB[0]) return subA[0] - subB[0];
        return (subA[1] || 0) - (subB[1] || 0);
    });

    sortedData.forEach(item => {
        // Initialize Domain if not exists
        if (!domainMap[item.domainCode]) {
            domainMap[item.domainCode] = {
                id: item.domainCode,
                name: item.domainName,
                subdomains: []
            };
        }

        const domain = domainMap[item.domainCode];
        
        // Find or create Subdomain
        let subdomain = domain.subdomains.find(s => s.id === item.subDomainCode);
        if (!subdomain) {
            subdomain = {
                id: item.subDomainCode,
                title: item.subdomainName,
                objective: `Objective for ${item.subdomainName}: To ensure effective ${item.subdomainName.toLowerCase()} in compliance with organizational and regulatory requirements.`,
                controls: []
            };
            domain.subdomains.push(subdomain);
        }

        // Add Control if it doesn't already exist (deduplication)
        if (!subdomain.controls.find(c => c.id === item.controlCode)) {
            subdomain.controls.push({
                id: item.controlCode,
                description: item.controlName,
                implementationGuidelines: [
                    `Implement policies and procedures specifically for ${item.controlName}.`,
                    `Ensure periodic review and updates for ${item.controlCode}.`,
                    `Assign clear roles and responsibilities for maintaining ${item.controlName}.`,
                    item.recommendation ? `Recommendation: ${item.recommendation}` : 'Follow industry best practices for implementation.'
                ],
                expectedDeliverables: [
                    `Documented policy for ${item.controlCode}.`,
                    `Evidence of implementation for ${item.controlCode}.`,
                    `Audit logs and review reports for ${item.controlCode}.`
                ],
                version: '2023',
                lastUpdated: '2024-01-01'
            });
        }
    });

    return Object.values(domainMap).sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

export const eccData: Domain[] = transformDataToDomains();
