import type { Risk } from '../types';

export const initialRiskData: Risk[] = [
    { id: 'ns1', description: 'Unauthorized access to internal network via unpatched firewall.', likelihood: 3, impact: 5, mitigation: 'Implement regular firewall patch management and rule reviews.', owner: 'IT Security' },
    { id: 'ns2', description: 'Denial-of-Service (DoS) attack against public-facing web servers.', likelihood: 2, impact: 3, mitigation: 'Utilize a cloud-based DDoS protection service.', owner: 'Network Team' },
    { id: 'ds1', description: 'Sensitive customer data leakage from production database.', likelihood: 3, impact: 5, mitigation: 'Implement Data Loss Prevention (DLP) and encrypt database at rest.', owner: 'DBA Team' },
    { id: 'es1', description: 'Ransomware infection on employee workstations via phishing email.', likelihood: 4, impact: 5, mitigation: 'Deploy advanced Endpoint Detection and Response (EDR) and conduct regular user awareness training.', owner: 'Endpoint Team' },
    { id: 'ac1', description: 'Former employee retaining access to critical systems.', likelihood: 3, impact: 3, mitigation: 'Automate de-provisioning process upon employee termination notification from HR.', owner: 'IAM Team' },
];

export const likelihoodOptions = [
    { value: 1, label: 'Very Low' }, 
    { value: 2, label: 'Low' }, 
    { value: 3, label: 'Medium' }, 
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
];
export const impactOptions = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
];