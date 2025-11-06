import type { ControlMapping } from '../types';

export const mappingData: ControlMapping[] = [
  {
    sourceFramework: 'NCA ECC',
    sourceControlId: '1-2-1',
    targetFramework: 'SAMA CSF',
    targetControlId: 'SAMA-1.2.1',
    justification: 'Both controls address the establishment of a formal cybersecurity governance structure and function within the organization.'
  },
  {
    sourceFramework: 'NCA ECC',
    sourceControlId: '1-3-1',
    targetFramework: 'SAMA CSF',
    targetControlId: 'SAMA-1.3.1',
    justification: 'Both controls mandate the development, approval, and dissemination of formal cybersecurity policies and procedures.'
  },
  {
    sourceFramework: 'NCA ECC',
    sourceControlId: '1-5-1',
    targetFramework: 'SAMA CSF',
    targetControlId: 'SAMA-2.2.1',
    justification: 'Both controls require a formal methodology for conducting periodic cybersecurity risk assessments.'
  },
  {
    sourceFramework: 'NCA ECC',
    sourceControlId: '1-9-4-1',
    targetFramework: 'SAMA CSF',
    targetControlId: 'SAMA-1.2.1', // No direct SAMA mapping, so linking to general governance
    justification: 'NCA requires specific cybersecurity awareness during on-boarding, which is a key component of an overall cybersecurity governance program as required by SAMA.'
  },
  {
    sourceFramework: 'SAMA CSF',
    sourceControlId: 'SAMA-3.3.1',
    targetFramework: 'NCA ECC',
    targetControlId: '2-2-3-4',
    justification: 'Both controls explicitly require the implementation of Privileged Access Management (PAM) for critical systems.'
  },
  {
    sourceFramework: 'SAMA CSF',
    sourceControlId: 'SAMA-3.2.1',
    targetFramework: 'NCA ECC',
    targetControlId: '3-2-1',
    justification: 'Both frameworks mandate the development and regular testing of a formal Cyber Security Incident Response Plan.'
  },
  {
    sourceFramework: 'PDPL',
    sourceControlId: 'PDPL-Art19-1',
    targetFramework: 'NCA ECC',
    targetControlId: '2-3-1', // Assuming 2-3-1 relates to data protection measures
    justification: 'PDPL Article 19 requires technical and organizational measures to protect data, which aligns with the NCA ECC controls for data protection and cryptography.'
  },
   {
    sourceFramework: 'PDPL',
    sourceControlId: 'PDPL-Art20-1',
    targetFramework: 'NCA ECC',
    targetControlId: '3-2-1', // Assuming 3-2-1 is Incident Response
    justification: 'The PDPL requirement for breach notification to the competent authority is a core component of a formal Incident Response Plan as defined by NCA ECC.'
  },
  {
    sourceFramework: 'CMA',
    sourceControlId: 'CMA-1.1.1',
    targetFramework: 'SAMA CSF',
    targetControlId: 'SAMA-1.2.1',
    justification: 'Both frameworks for financial sector entities (CMA and SAMA) require a board-level committee for cybersecurity oversight, demonstrating governance alignment.'
  },
  {
    sourceFramework: 'HRSD',
    sourceControlId: 'HRSD-GRC-1',
    targetFramework: 'NCA ECC',
    targetControlId: '1-2-1',
    justification: 'Both controls address the establishment of a formal governance structure and function within the organization.'
  },
  {
    sourceFramework: 'HRSD',
    sourceControlId: 'HRSD-IAM-2',
    targetFramework: 'NCA ECC',
    targetControlId: '2-2-3-5',
    justification: 'Both controls require periodic review of user identities and access rights to ensure the principle of least privilege.'
  }
];