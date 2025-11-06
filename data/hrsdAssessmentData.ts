import type { AssessmentItem } from '../types';

export const initialHrsdAssessmentData: AssessmentItem[] = [
    {
        domainCode: "GRC",
        domainName: "Governance, Risk & Compliance",
        subDomainCode: "GRC-1",
        subdomainName: "Governance Framework",
        controlCode: "HRSD-GRC-1",
        controlName: "Establish a Governance, Risk, and Compliance framework.",
        currentStatusDescription: "",
        controlStatus: "Not Implemented",
        recommendation: "",
        managementResponse: "",
        targetDate: ""
    },
    {
        domainCode: "IAM",
        domainName: "Identity & Access Management",
        subDomainCode: "IAM-2",
        subdomainName: "Access Reviews",
        controlCode: "HRSD-IAM-2",
        controlName: "Implement user access reviews on a periodic basis.",
        currentStatusDescription: "",
        controlStatus: "Not Implemented",
        recommendation: "",
        managementResponse: "",
        targetDate: ""
    },
];