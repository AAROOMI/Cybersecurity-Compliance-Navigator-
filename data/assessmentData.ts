
import type { AssessmentItem } from '../types';

// Helper to generate generic controls
const generateControls = (
    domainCode: string, 
    domainName: string, 
    subDomainCode: string, 
    subdomainName: string, 
    count: number,
    startFrom: number = 1
): AssessmentItem[] => {
    return Array.from({ length: count }, (_, i) => {
        const idx = startFrom + i;
        const code = `${subDomainCode}.${idx}`;
        return {
            domainCode,
            domainName,
            subDomainCode,
            subdomainName,
            controlCode: code,
            controlName: `${subdomainName} Control ${idx}`,
            saudiCeramicsCurrentStatus: "Not Implemented",
            controlStatus: "Not Implemented",
            recommendation: "Implement control according to NCA guidelines.",
            managementResponse: "",
            targetDate: ""
        };
    });
};

// 1. Cybersecurity Governance (51 controls)
const governanceControls: AssessmentItem[] = [
    // 1.1 Strategy (3)
    { controlCode: "1.1.1", controlName: "Cybersecurity Strategy Definition", subDomainCode: "1.1", subdomainName: "Cybersecurity Strategy" },
    { controlCode: "1.1.2", controlName: "Strategy Roadmap Execution", subDomainCode: "1.1", subdomainName: "Cybersecurity Strategy" },
    { controlCode: "1.1.3", controlName: "Strategy Review", subDomainCode: "1.1", subdomainName: "Cybersecurity Strategy" },
    // 1.2 Management (4)
    { controlCode: "1.2.1", controlName: "Dedicated Cybersecurity Function", subDomainCode: "1.2", subdomainName: "Cybersecurity Management" },
    { controlCode: "1.2.2", controlName: "Head of Cybersecurity (CISO)", subDomainCode: "1.2", subdomainName: "Cybersecurity Management" },
    { controlCode: "1.2.3", controlName: "Cybersecurity Steering Committee", subDomainCode: "1.2", subdomainName: "Cybersecurity Management" },
    { controlCode: "1.2.4", controlName: "Cybersecurity Budget and Resources", subDomainCode: "1.2", subdomainName: "Cybersecurity Management" },
    // 1.3 Policies (4)
    { controlCode: "1.3.1", controlName: "Policy Definition", subDomainCode: "1.3", subdomainName: "Cybersecurity Policies and Procedures" },
    { controlCode: "1.3.2", controlName: "Policy Implementation", subDomainCode: "1.3", subdomainName: "Cybersecurity Policies and Procedures" },
    { controlCode: "1.3.3", controlName: "Technical Standards", subDomainCode: "1.3", subdomainName: "Cybersecurity Policies and Procedures" },
    { controlCode: "1.3.4", controlName: "Policy Review", subDomainCode: "1.3", subdomainName: "Cybersecurity Policies and Procedures" },
    // 1.4 Roles (3)
    { controlCode: "1.4.1", controlName: "Roles Definition", subDomainCode: "1.4", subdomainName: "Cybersecurity Roles and Responsibilities" },
    { controlCode: "1.4.2", controlName: "Roles Review", subDomainCode: "1.4", subdomainName: "Cybersecurity Roles and Responsibilities" },
    { controlCode: "1.4.3", controlName: "Segregation of Duties", subDomainCode: "1.4", subdomainName: "Cybersecurity Roles and Responsibilities" },
    // 1.5 Risk (7)
    ...generateControls("1", "Cybersecurity Governance", "1.5", "Cybersecurity Risk Management", 7),
    // 1.6 IT Projects (9)
    ...generateControls("1", "Cybersecurity Governance", "1.6", "Cybersecurity in IT Projects", 9),
    // 1.7 Compliance (2)
    { controlCode: "1.7.1", controlName: "National Regulations Compliance", subDomainCode: "1.7", subdomainName: "Cybersecurity Regulatory Compliance" },
    { controlCode: "1.7.2", controlName: "International Standards Compliance", subDomainCode: "1.7", subdomainName: "Cybersecurity Regulatory Compliance" },
    // 1.8 Audit (3)
    ...generateControls("1", "Cybersecurity Governance", "1.8", "Cybersecurity Periodical Assessment", 3),
    // 1.9 HR (8)
    ...generateControls("1", "Cybersecurity Governance", "1.9", "Cybersecurity in HR", 8),
    // 1.10 Awareness (8)
    ...generateControls("1", "Cybersecurity Governance", "1.10", "Cybersecurity Awareness", 8),
].map((item: any) => ({ ...item, domainCode: "1", domainName: "Cybersecurity Governance", saudiCeramicsCurrentStatus: item.saudiCeramicsCurrentStatus || "Not Implemented", controlStatus: "Not Implemented" as const, recommendation: item.recommendation || "Implement control per NCA ECC.", managementResponse: "", targetDate: "" }));

// 2. Cybersecurity Defense (110 controls)
const defenseControls: AssessmentItem[] = [
    // 2.1 Asset Mgt (6)
    ...generateControls("2", "Cybersecurity Defense", "2.1", "Asset Management", 6),
    // 2.2 IAM (13)
    ...generateControls("2", "Cybersecurity Defense", "2.2", "Identity and Access Management", 13),
    // 2.3 Info Sys Protection (10)
    ...generateControls("2", "Cybersecurity Defense", "2.3", "Information System Protection", 10),
    // 2.4 Email (6)
    ...generateControls("2", "Cybersecurity Defense", "2.4", "Email Protection", 6),
    // 2.5 Network (13)
    ...generateControls("2", "Cybersecurity Defense", "2.5", "Network Security", 13),
    // 2.6 Mobile (6)
    ...generateControls("2", "Cybersecurity Defense", "2.6", "Mobile Security", 6),
    // 2.7 Data Protection (6)
    ...generateControls("2", "Cybersecurity Defense", "2.7", "Data Protection", 6),
    // 2.8 Cryptography (6)
    ...generateControls("2", "Cybersecurity Defense", "2.8", "Cryptography", 6),
    // 2.9 Backup (6)
    ...generateControls("2", "Cybersecurity Defense", "2.9", "Backup and Recovery", 6),
    // 2.10 Vulnerability Mgt (8)
    ...generateControls("2", "Cybersecurity Defense", "2.10", "Vulnerability Management", 8),
    // 2.11 Penetration Testing (5)
    ...generateControls("2", "Cybersecurity Defense", "2.11", "Penetration Testing", 5),
    // 2.12 Logs (8)
    ...generateControls("2", "Cybersecurity Defense", "2.12", "Event Logs and Monitoring", 8),
    // 2.13 Incident Mgt (7)
    ...generateControls("2", "Cybersecurity Defense", "2.13", "Incident Management", 7),
    // 2.14 Physical Security (6)
    ...generateControls("2", "Cybersecurity Defense", "2.14", "Physical Security", 6),
    // 2.15 Web App Security (4)
    ...generateControls("2", "Cybersecurity Defense", "2.15", "Web Application Security", 4),
].map(item => ({ ...item, domainCode: "2", domainName: "Cybersecurity Defense", saudiCeramicsCurrentStatus: "Not Implemented", controlStatus: "Not Implemented" as const, recommendation: "Implement control per NCA ECC.", managementResponse: "", targetDate: "" }));

// 3. Cybersecurity Resilience (6 controls)
const resilienceControls: AssessmentItem[] = [
    // 3.1 BCM (6)
    ...generateControls("3", "Cybersecurity Resilience", "3.1", "Business Continuity Management", 6)
].map(item => ({ ...item, domainCode: "3", domainName: "Cybersecurity Resilience", saudiCeramicsCurrentStatus: "Not Implemented", controlStatus: "Not Implemented" as const, recommendation: "Implement control per NCA ECC.", managementResponse: "", targetDate: "" }));

// 4. Third-Party & Cloud (13 controls)
const thirdPartyControls: AssessmentItem[] = [
    // 4.1 Third Party (7)
    ...generateControls("4", "Third-Party & Cloud Computing", "4.1", "Third Party Security", 7),
    // 4.2 Cloud (6)
    ...generateControls("4", "Third-Party & Cloud Computing", "4.2", "Cloud Computing Security", 6)
].map(item => ({ ...item, domainCode: "4", domainName: "Third-Party & Cloud Computing", saudiCeramicsCurrentStatus: "Not Implemented", controlStatus: "Not Implemented" as const, recommendation: "Implement control per NCA ECC.", managementResponse: "", targetDate: "" }));

// 5. ICS Cybersecurity (13 controls)
const icsControls: AssessmentItem[] = [
    // 5.1 ICS (13)
    ...generateControls("5", "ICS Cybersecurity", "5.1", "Industrial Control Systems", 13)
].map(item => ({ ...item, domainCode: "5", domainName: "ICS Cybersecurity", saudiCeramicsCurrentStatus: "Not Implemented", controlStatus: "Not Implemented" as const, recommendation: "Implement control per NCA ECC.", managementResponse: "", targetDate: "" }));

export const assessmentData: AssessmentItem[] = [
    ...governanceControls,
    ...defenseControls,
    ...resilienceControls,
    ...thirdPartyControls,
    ...icsControls
];
