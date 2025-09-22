import type { Domain } from '../types';

export const eccData: Domain[] = [
  {
    id: '1',
    name: 'Cybersecurity Governance',
    subdomains: [
      {
        id: '1-1',
        title: 'Cybersecurity Strategy',
        objective: 'To ensure that cybersecurity plans, goals, initiatives and projects are contributing to compliance with related laws and regulations.',
        controls: [
          {
            id: '1-1-1',
            description: 'A cybersecurity strategy must be defined, documented and approved. It must be supported by the head of the organization or his/her delegate (referred to in this document as Authorizing Official). The strategy goals must be in-line with related laws and regulations.',
            implementationGuidelines: [
                'Conduct a workshop with stakeholders in the organization to align the objectives of the cybersecurity strategy with the organization\'s strategic objectives.',
                'Develop and document cybersecurity the strategy of the organization in order to align the organization\'s cybersecurity strategic objectives with related laws and regulations, including but not limited to (CCC, CSCC). A cybersecurity strategy often includes the following: Vision, Mission, Strategic Objectives, Strategy Implementation Plan, Projects, Initiatives.',
                'In order for the cybersecurity strategy of the organization to be effective, the approval of the representative must be based on the authority matrix approved by the organization.',
            ],
            expectedDeliverables: [
                'The cybersecurity strategy document approved by the organization (electronic copy or official hard copy).',
                'Initiatives and projects included in the cybersecurity strategy of the organization.'
            ],
            version: '1.1',
            lastUpdated: '2024-05-15',
            history: [
              {
                version: '1.0',
                date: '2022-01-10',
                changes: [
                  'Initial version of the control.',
                  'Established baseline requirements for cybersecurity strategy documentation.'
                ]
              }
            ]
          },
          {
            id: '1-1-2',
            description: 'A roadmap must be executed to implement the cybersecurity strategy.',
            implementationGuidelines: [
              'Develop a roadmap for implementing the cybersecurity strategy including the execution of the strategy\'s initiatives and projects to: Define cybersecurity priorities, Make recommendations related to cybersecurity works, Monitor the implementation of cybersecurity strategy projects and initiatives, Ensure the implementation of initiatives and projects according to requirements, Provide a clear and unified vision and communicate it to all internal and external stakeholders.',
              'Obtain NCA\'s approval for any cybersecurity initiatives that are beyond the scope of the organization.',
            ],
            expectedDeliverables: [
                'Strategy implementation roadmap.',
                'List of cybersecurity projects and initiatives and their status.'
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-1-3',
            description: 'The cybersecurity strategy must be reviewed periodically according to planned intervals or upon changes to related laws and regulations.',
            implementationGuidelines: [
              'Review and update the cybersecurity strategy periodically according to a documented and approved review plan as follows: In specific intervals according to best practices, If there are changes in the relevant laws and regulations, In the event of material changes in the organization.',
              'Document and approve the review procedures and changes to the cybersecurity strategy by the representative.',
            ],
            expectedDeliverables: [
              'An approved document that defines the review schedule for the cybersecurity strategy.',
              'An updated cybersecurity strategy after documenting changes to the cybersecurity requirements and to be approved by the representative.',
              'Project status reports.',
              'Formal approval by the representative on the updated strategy (e.g., via the organization’s official e-mail, paper or electronic signature).',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          }
        ],
      },
      {
        id: '1-2',
        title: 'Cybersecurity Management',
        objective: 'To ensure Authorizing Official\'s support in implementing and managing cybersecurity programs within the organization as per related laws and regulations.',
        controls: [
          {
            id: '1-2-1',
            description: 'A dedicated cybersecurity function (e.g., division, department) must be established within the organization. This function must be independent from the Information Technology/Information Communication and Technology (IT/ICT) functions (as per the Royal Decree number 37140 dated 14/8/1438H). It is highly recommended that this cybersecurity function reports directly to the head of the organization or his/her delegate while ensuring that this does not result in a conflict of interest.',
            implementationGuidelines: [
                'Establish a cybersecurity function within the organization to enable it to carry out its cybersecurity tasks as required.',
                'Ensure that the cybersecurity function\'s reporting line is different from that of the IT department or the digital transformation department, as per Royal Decree No. 37140 dated 14/8/1438H.',
                'Ensure the cybersecurity function is responsible for all cybersecurity monitoring activities (including compliance monitoring, operation monitoring, operations, etc.) and all cybersecurity governance activities (including defining cybersecurity requirements, managing cybersecurity risks, etc.).',
            ],
            expectedDeliverables: [
                'The organization\'s organizational structure (electronic copy or official hard copy), covering the organizational structure of the cybersecurity function.',
                'The decision to establish the Cybersecurity functions and its mandate (electronic copy or official hard copy).',
                'Reports on the cybersecurity policies compliance results.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15',
            history: [
              {
                version: '1.0',
                date: '2022-01-10',
                changes: [
                  'Initial control establishment.',
                  'Mandated the separation of Cybersecurity and IT functions based on Royal Decree.'
                ]
              }
            ]
          },
          {
            id: '1-2-2',
            description: 'The position of cybersecurity function head (e.g., CISO), and related supervisory and critical positions within the function, must be filled with full-time and experienced Saudi cybersecurity professionals.',
            implementationGuidelines: [
                'Appoint full-time and highly qualified Saudi cybersecurity professionals to fill job roles like Head of cybersecurity, Supervisory positions, and Critical roles.',
                'Define the required academic qualifications and years of experience to serve as the head of the cybersecurity function and the supervisory and critical job roles and positions. The Saudi Cybersecurity Workforce Framework (SCyWF) can be utilized as a reference.',
            ],
            expectedDeliverables: [
                'A detailed list of all personnel (direct or indirect employees and contractors), whose work is related to cybersecurity, that includes names, nationality, contractual type, position titles, job roles, years of experience, academic and professional qualifications.',
                'Job descriptions of the head of the cybersecurity and the supervisory and critical positions related to cybersecurity relying on The Saudi Cybersecurity Workforce Framework (SCyWF).',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-2-3',
            description: 'A cybersecurity steering committee must be established by the Authorizing Official to ensure the support and implementation of the cybersecurity programs and initiatives within the organization. Committee members, roles and responsibilities, and governance framework must be defined, documented and approved. The committee must include the head of the cybersecurity function as one of its members. It is highly recommended that the committee reports directly to the head of the organization or his/her delegate while ensuring that this does not result in a conflict of interest.',
            implementationGuidelines: [
              'Establish the cybersecurity supervisory committee as a committee specialized in directing and leading cybersecurity affairs.',
              'Identify the members of the supervisory committee (e.g., head of organization, head of cybersecurity, head of IT, etc.) and define their duties in a Committee Charter.',
              'Include the head of cybersecurity function as a permanent member of the committee.',
              'Conduct periodic meetings to follow up on the implementation of cybersecurity programs, manage risks, and review policies.',
            ],
            expectedDeliverables: [
              'Supervisory committee charter in the organization.',
              'A documented and approved list showing the names of the organization\'s cybersecurity supervisory committee members.',
              'Cybersecurity supervisory committee\'s agenda in the organization.',
              'Minutes of meetings held for the cybersecurity supervisory committee at the organization.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-2-4',
            description: 'A cybersecurity program maturity model must be adopted and assessed periodically to measure and improve the effectiveness of cybersecurity controls.',
            implementationGuidelines: [
                'Select an industry-standard maturity framework (e.g., CMMI, NIST CSF) to serve as a benchmark.',
                'Conduct a baseline assessment of the current maturity level against the chosen framework.',
                'Develop a time-bound roadmap with specific projects and initiatives for achieving target maturity levels.',
                'Report maturity assessment results and progress to the cybersecurity steering committee.',
            ],
            expectedDeliverables: [
                'Documented adoption of a specific cybersecurity maturity model.',
                'Periodic maturity assessment reports.',
                'A documented and approved maturity improvement roadmap.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
        ],
      },
      {
        id: '1-3',
        title: 'Cybersecurity Policies and Procedures',
        objective: 'To ensure that cybersecurity requirements are documented, communicated and complied with by the organization as per related laws and regulations, and organizational requirements.',
        controls: [
            {
                id: '1-3-1',
                description: 'Cybersecurity policies and procedures must be defined and documented by the cybersecurity function, approved by the Authorizing Official, and disseminated to relevant parties inside and outside the organization.',
                implementationGuidelines: [
                    'Define and document cybersecurity requirements in cybersecurity policies, procedures, and standard controls, and approve them by the organization\'s representative based on the authority matrix.',
                    'Ensure the communication of policies and procedures to all personnel and stakeholders through approved channels (e.g., internal portal, e-mail).',
                ],
                expectedDeliverables: [
                    'All cybersecurity policies, procedures, and standard controls documented and approved by the organization\'s representative or his/ her deputy.',
                    'Communicate cybersecurity policies, procedures, and standard controls to personnel and stakeholders.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15',
                history: [
                  {
                    version: '1.0',
                    date: '2022-01-10',
                    changes: [
                      'Initial version requiring basic documentation of policies.',
                    ]
                  }
                ]
            },
            {
                id: '1-3-2',
                description: 'The cybersecurity function must ensure that the cybersecurity policies and procedures are implemented.',
                implementationGuidelines: [
                    'Develop an action plan to implement cybersecurity policies, procedures, and standard controls.',
                    'The cybersecurity function must ensure the implementation of cybersecurity controls and adherence to the approved and documented policies.',
                    'Ensure the implementation of cybersecurity policies, procedures, and standard controls, including controls and requirements, manually or electronically (automated).',
                ],
                expectedDeliverables: [
                    'An action plan to implement the cybersecurity policies and procedures of the organization.',
                    'A report that outlines the review of the implementation of cybersecurity policies and procedures.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-3-3',
                description: 'The cybersecurity policies and procedures must be supported by technical security standards (e.g., operating systems, databases and firewall technical security standards).',
                implementationGuidelines: [
                    'Define, document, and approve technical standard controls to cover the organization\'s information and technology assets.',
                    'Communicate the technical standard controls to the relevant departments and ensure they are applied periodically.',
                ],
                expectedDeliverables: [
                    'The organization\'s approved technical cybersecurity standard controls documents.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-3-4',
                description: 'The cybersecurity policies and procedures must be reviewed periodically according to planned intervals or upon changes to related laws and regulations. Changes and reviews must be approved and documented.',
                implementationGuidelines: [
                    'Review the cybersecurity policies, procedures, and standard controls in the organization periodically according to a documented and approved plan.',
                    'Review and update policies in the event of changes in the relevant laws and regulations.',
                    'Document the review and changes and approve them by the head of the organization or his/her deputy.',
                ],
                expectedDeliverables: [
                    'An approved document that defines the review schedule.',
                    'An approved document that clarifies the review of cybersecurity policies on a periodic basis.',
                    'Policies, procedures, and standard controls documents indicating that they have been reviewed and updated.',
                    'Official approval by the representative on updated policies, procedures, and standard controls.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-3-5',
                description: 'A formal process for granting exceptions to cybersecurity policies and standards must be defined, documented, and approved.',
                implementationGuidelines: [
                    'Define the criteria for granting an exception, including a mandatory risk assessment and the identification of compensating controls.',
                    'Establish an approval workflow for all exception requests, with final approval from the cybersecurity function head.',
                    'Ensure all exceptions are granted for a limited duration and are reviewed periodically before expiration.',
                ],
                expectedDeliverables: [
                    'A documented policy exception management procedure.',
                    'A central register of all approved exceptions, including justification, compensating controls, and expiration date.',
                    'Reports from periodic exception reviews.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
        ]
      },
      {
        id: '1-4',
        title: 'Cybersecurity Roles and Responsibilities',
        objective: 'To ensure that roles and responsibilities are defined for all parties participating in implementing the cybersecurity controls within the organization.',
        controls: [
          {
            id: '1-4-1',
            description: 'Cybersecurity organizational structure and related roles and responsibilities must be defined, documented, approved, supported and assigned by the Authorizing Official while ensuring that this does not result in a conflict of interest.',
            implementationGuidelines: [
              'Define and document cybersecurity roles and responsibilities for all parties involved.',
              'Support the organizational structure, roles, and responsibilities of the organization by the executive management.',
              'Include roles and responsibilities for the cybersecurity supervisory committee, head of cybersecurity, cybersecurity function, other departments, and all personnel.',
              'Assign roles and responsibilities to the organization\'s personnel, taking into consideration the non-conflict of interests.',
            ],
            expectedDeliverables: [
              'Cybersecurity Function Organizational Structure Document.',
              'The organization\'s approved cybersecurity roles and responsibilities document (electronic copy or official hard copy).',
              'A document that clarifies the assignment of cybersecurity roles and responsibilities to the organization\'s personnel.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-4-2',
            description: 'The cybersecurity roles and responsibilities must be reviewed periodically according to planned intervals or upon changes to related laws and regulations.',
            implementationGuidelines: [
              'Review the cybersecurity roles and responsibilities in the organization periodically according to a documented and approved plan.',
              'Review and update the cybersecurity roles and responsibilities in the event of changes in the relevant laws and regulations.',
              'Document the review and changes to the cybersecurity requirements and approve them by the representative.',
            ],
            expectedDeliverables: [
              'An approved document that defines the review schedule for the roles and responsibilities.',
              'Roles and responsibilities document indicating that they are up to date and changes have been documented and approved.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          }
        ]
      },
      {
        id: '1-5',
        title: 'Cybersecurity Risk Management',
        objective: 'To ensure managing cybersecurity risks in a methodological approach in order to protect the organization\'s information and technology assets as per organizational policies and procedures, and related laws and regulations.',
        controls: [
            {
                id: '1-5-1',
                description: 'Cybersecurity risk management methodology and procedures must be defined, documented and approved as per confidentiality, integrity and availability considerations of information and technology assets.',
                implementationGuidelines: [
                    'Define and document cybersecurity risk management requirements based on relevant regulations, best practices, and standard controls.',
                    'The methodology must include: Identification of assets, Identification of risks, Risk assessment, Risk response, and Risk monitoring.',
                    'Support the cybersecurity risk management methodology and procedures by the Executive Management.',
                ],
                expectedDeliverables: [
                    'The approved cybersecurity risk management methodology (electronic copy or official hard copy).',
                    'Approved cybersecurity risk management procedures.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-5-2',
                description: 'The cybersecurity risk management methodology and procedures must be implemented by the cybersecurity function.',
                implementationGuidelines: [
                    'Implement all requirements of the cybersecurity risk management methodology and procedures adopted by the organization.',
                    'Establish a cybersecurity risk register to document and monitor risks.',
                    'Develop plans to address cybersecurity risks of the organization.',
                ],
                expectedDeliverables: [
                    'Cybersecurity Risk Register of the organization.',
                    'Cybersecurity Risk Treatment Plan of the organization.',
                    'A report that outlines the cybersecurity risk assessment and monitoring.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-5-3',
                description: 'Cybersecurity risk assessments must be performed at least annually or upon significant changes to the environment.',
                implementationGuidelines: [
                    'Establish a formal schedule for conducting organization-wide cybersecurity risk assessments.',
                    'Define triggers for ad-hoc risk assessments, such as the introduction of new systems, major security incidents, or the emergence of new, significant threats.',
                    'Ensure the results of all risk assessments are formally documented and reported to the cybersecurity steering committee.',
                ],
                expectedDeliverables: [
                    'A documented risk assessment schedule approved by management.',
                    'Completed annual and ad-hoc risk assessment reports.',
                    'Minutes of steering committee meetings where risk assessment results are presented and discussed.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-5-4',
                description: 'Threat intelligence capabilities must be established to proactively identify and analyze potential cybersecurity threats.',
                implementationGuidelines: [
                    'Subscribe to reputable threat intelligence feeds, such as those from government agencies (e.g., NCA), Information Sharing and Analysis Centers (ISACs), and commercial vendors.',
                    'Integrate threat intelligence into risk management, vulnerability management, and incident response processes.',
                    'Assign personnel to analyze threat intelligence for its relevance and potential impact on the organization.',
                ],
                expectedDeliverables: [
                    'A documented threat intelligence program procedure.',
                    'Evidence of subscriptions to threat intelligence feeds.',
                    'Threat intelligence reports and advisories that have been analyzed and shared with relevant internal teams.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
        ]
      },
      {
        id: '1-6',
        title: 'Legal, Regulatory, and Contractual Requirements',
        objective: 'To ensure compliance with legal, statutory, regulatory, and contractual requirements related to cybersecurity.',
        controls: [
          {
            id: '1-6-1',
            description: 'All relevant legal, statutory, regulatory, and contractual requirements must be identified, documented, and kept up to date.',
            implementationGuidelines: [
              'Maintain a register of all relevant laws, regulations, and contractual obligations related to cybersecurity.',
              'Assign responsibility for tracking changes in the legal and regulatory landscape.',
              'Regularly consult with legal counsel to ensure the register is comprehensive and current.',
            ],
            expectedDeliverables: [
              'A documented register of legal, regulatory, and contractual requirements.',
              'Evidence of periodic reviews of the register.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-6-2',
            description: 'Procedures must be implemented to ensure compliance with identified legal, regulatory, and contractual requirements.',
            implementationGuidelines: [
              'Integrate compliance requirements into the organization\'s policies, procedures, and standards.',
              'Conduct regular assessments to verify compliance with these requirements.',
              'Report compliance status to the cybersecurity steering committee and relevant stakeholders.',
            ],
            expectedDeliverables: [
              'Documented procedures for ensuring compliance.',
              'Compliance assessment reports.',
              'Minutes of meetings where compliance is discussed.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
        ]
      },
      {
        id: '1-7',
        title: 'Cybersecurity Audit and Review',
        objective: 'To ensure the independent review of cybersecurity controls and compliance to provide assurance to management.',
        controls: [
          {
            id: '1-7-1',
            description: 'An independent cybersecurity audit program must be established and implemented.',
            implementationGuidelines: [
              'Define the scope, frequency, and methodology for cybersecurity audits.',
              'Audits should be conducted by competent and independent auditors (internal or external).',
              'To be considered "independent," an auditor must be organizationally separate from the functions being audited. This can be a dedicated internal audit team that reports outside of the IT/Cybersecurity hierarchy, or a qualified external third-party firm.',
              'The audit program should cover all aspects of the cybersecurity framework.',
            ],
            expectedDeliverables: [
              'A documented cybersecurity audit program and plan.',
              'Audit scope and methodology documents.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-7-2',
            description: 'Audit findings must be reported to relevant management, and corrective action plans must be developed and tracked to resolution.',
            implementationGuidelines: [
              'Formalize the process for reporting audit findings to the appropriate management levels.',
              'Assign ownership and due dates for all corrective actions.',
              'The cybersecurity function must track the implementation of corrective actions and verify their effectiveness.',
            ],
            expectedDeliverables: [
              'Cybersecurity audit reports.',
              'Documented corrective action plans with assigned owners and timelines.',
              'Status reports on the remediation of audit findings.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-7-3',
            description: 'The scope of the internal cybersecurity audit program must cover all critical systems and controls within a defined cycle (e.g., three years).',
            implementationGuidelines: [
                'Develop a multi-year internal audit plan based on the results of cybersecurity risk assessments.',
                'Ensure the audit plan covers all domains of the organization\'s cybersecurity framework over a three-year cycle.',
                'The plan must be reviewed annually and approved by the cybersecurity steering committee or equivalent governing body.',
            ],
            expectedDeliverables: [
                'A documented multi-year internal cybersecurity audit plan.',
                'The audit charter defining the scope and authority of the internal audit function.',
                'Evidence of steering committee approval of the audit plan.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
          {
            id: '1-7-4',
            description: 'External audits or assessments by accredited third-parties must be conducted periodically to validate compliance and security posture.',
            implementationGuidelines: [
                'Engage qualified and independent external auditors for an annual assessment.',
                'Define a clear scope for external assessments, which may include compliance audits (e.g., against NCA frameworks), penetration testing, or maturity assessments.',
                'Ensure all findings from external audits are formally tracked, assigned owners, and remediated in a timely manner.',
            ],
            expectedDeliverables: [
                'Contracts and scope of work documents for external auditors.',
                'Complete external audit and assessment reports.',
                'A documented remediation plan for all external audit findings.',
            ],
            version: '1.1',
            lastUpdated: '2024-05-15'
          },
        ]
      },
    ],
  },
  {
    id: '2',
    name: 'Cybersecurity Defense',
    subdomains: [
        {
            id: '2-1',
            title: 'Asset Management',
            objective: 'To ensure that the organization has an accurate and detailed inventory of information and technology assets in order to support the organization\'s cybersecurity and operational requirements to maintain the confidentiality, integrity and availability of information and technology assets.',
            controls: [
                {
                    id: '2-1-1',
                    description: 'Cybersecurity requirements for managing information and technology assets must be defined, documented and approved.',
                    implementationGuidelines: [
                        'Develop and document cybersecurity requirements for information and technology assets management in the organization, including requirements for types and description, classification levels, life cycle stages, and roles and responsibilities for ownership.',
                        'Support the organization\'s developed requirements by the Executive Management through the approval of the representative.',
                    ],
                    expectedDeliverables: [
                        'Information asset management cybersecurity requirements (in form of policy or standard) approved by the organization (e.g., electronic copy or official hard copy).',
                        'Formal approval by the head of the organization or his/her deputy on the requirements (e.g., via the organization’s official e-mail, paper or electronic signature).',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15',
                    history: [
                      {
                        version: '1.0',
                        date: '2022-01-10',
                        changes: [
                          'Initial release focusing on basic asset management principles.',
                        ]
                      }
                    ]
                },
                {
                    id: '2-1-2',
                    description: 'The cybersecurity requirements for managing information and technology assets must be implemented.',
                    implementationGuidelines: [
                        'All cybersecurity requirements to manage information and technology assets of the organization must be implemented, including classifying, documenting, and encoding all assets.',
                        'Specific procedures for dealing with assets based on their classification and in accordance with the relevant laws and regulations must be established.',
                    ],
                    expectedDeliverables: [
                        'Documents that confirm the implementation of cybersecurity requirements related to information and technology asset management as documented in the policy.',
                        'An action plan to implement the cybersecurity requirements of information and technology assets management.',
                        'A documented and up-to-date record of all information and technology assets (e.g., Excel spreadsheet or CMDB).',
                        'Specific procedures for dealing with assets based on their classification.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-1-3',
                    description: 'Acceptable use policy of information and technology assets must be defined, documented and approved.',
                    implementationGuidelines: [
                      'Develop acceptable use policy for information and technology assets of the organization, which may include: specific regulations for access and use, clear examples of unacceptable use, consequences if rules are breached, method used to monitor adherence.',
                      'Acceptable use policy must be communicated to all employees and stakeholders.',
                      'Support the organization\'s policy by the Executive Management.',
                    ],
                    expectedDeliverables: [
                      'Approved policy that covers the requirements for acceptable use of the organization\'s information and technology assets.',
                      'Evidence that all employees and stakeholders are aware and informed must be provided.',
                      'Formal approval by the head of the organization or his/her deputy on the policy.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-2',
            title: 'Identity and Access Management',
            objective: 'To ensure the secure and restricted logical access to information and technology assets in order to prevent unauthorized access and allow only authorized access for users which are necessary to accomplish assigned tasks.',
            controls: [
                {
                    id: '2-2-1',
                    description: 'Cybersecurity requirements for identity and access management must be defined, documented and approved.',
                    implementationGuidelines: [
                        'Develop and document cybersecurity policy for identity and access management in the organization, which may include, but is not limited to: Grant access, Revoke and Change Access, Review Identity and Access, Manage passwords.',
                        'Support the organization\'s policy by the Executive Management.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers Identity and Access Management (e.g., electronic copy or official hard copy).',
                        'Formal approval by the head of the organization or his/her deputy on the policy.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-2-2',
                    description: 'The cybersecurity requirements for identity and access management must be implemented.',
                    implementationGuidelines: [
                        'All cybersecurity requirements must be implemented for the organization\'s approved identity and access management procedures, covering: User Authentication, Password management, User authorization, Remote access management, Access Cancellation and Update Management.',
                    ],
                    expectedDeliverables: [
                        'Action plan for cybersecurity requirements for Identity and Access Management.',
                        'Evidence that the identity and access management controls must be implemented on all technical and information assets in the organization.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-2-3',
                    description: 'Multi-factor authentication must be implemented for remote access and for access to critical systems and data.',
                    implementationGuidelines: [
                        'Define and document the requirements of this ECC in the cybersecurity requirements of identity and access management at the organization.',
                        'Develop procedures for remote access with Multi-Factor Authentication.',
                        'Provide appropriate and advanced multi-factor authentication techniques and link them to remote access technologies (e.g., VPN).',
                        'Use two of the following authentication elements: Something you know (password), Something you have (SMS/token), Something you are (biometrics).',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers Identity and Access Management.',
                        'Formal approval by the head of the organization on the policy.',
                        'Evidence that outlines the implementation of multi-factor authentication requirements to remote access and critical systems.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-2-4',
                    description: 'Privileged Access Management (PAM) solution must be implemented to secure, manage, and monitor access to critical assets.',
                    implementationGuidelines: [
                        'Deploy a PAM solution to vault and rotate privileged credentials (e.g., administrator, root, service accounts).',
                        'Enforce session monitoring and recording for all privileged access.',
                        'Implement Just-In-Time (JIT) access to grant temporary privileged rights.',
                    ],
                    expectedDeliverables: [
                        'PAM policy and procedures document.',
                        'Deployment architecture of the PAM solution.',
                        'Sample privileged session recordings and access logs.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-2-5',
                    description: 'Single Sign-On (SSO) must be implemented for accessing organizational applications, particularly cloud services.',
                    implementationGuidelines: [
                        'Integrate critical enterprise applications with a central Identity Provider (IdP) using standard protocols like SAML or OIDC.',
                        'Enforce the use of SSO as the primary authentication method for supported applications.',
                        'Combine SSO with multi-factor authentication for enhanced security.',
                    ],
                    expectedDeliverables: [
                        'SSO implementation policy and roadmap.',
                        'A list of applications integrated with the SSO solution.',
                        'Configuration documentation for the Identity Provider (IdP).',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-3',
            title: 'Human Resources Security',
            objective: 'To ensure that employees and contractors understand their cybersecurity responsibilities and are suitable for the roles for which they are considered.',
            controls: [
                {
                    id: '2-3-1',
                    description: 'Cybersecurity screening requirements for candidates for employment must be defined and implemented.',
                    implementationGuidelines: [
                        'Define background verification checks in line with local laws and ethics.',
                        'Ensure screening is appropriate to the business requirements and the sensitivity of the information to be accessed.',
                        'Document the screening requirements in recruitment policies and procedures.',
                    ],
                    expectedDeliverables: [
                        'Documented HR security policy covering screening.',
                        'Evidence of background checks for new hires in sensitive roles.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-3-2',
                    description: 'All employees of the organization and, where relevant, contractors must receive appropriate cybersecurity awareness education and training and regular updates in organizational policies and procedures.',
                    implementationGuidelines: [
                        'Establish a cybersecurity awareness program for all new and existing employees.',
                        'Training should cover the organization\'s security policies, threat landscape, and individual responsibilities.',
                        'Conduct periodic phishing simulations and other exercises to reinforce training.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity awareness and training program material.',
                        'Records of employee participation and completion of training.',
                        'Phishing simulation campaign reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-3-3',
                    description: 'A formal disciplinary process must be in place to take action against employees who have violated organizational cybersecurity policies and procedures.',
                    implementationGuidelines: [
                        'Define and document a disciplinary process for security violations.',
                        'Ensure the process is communicated to all employees.',
                        'The process should be fair, consistent, and in line with HR policies and local laws.',
                    ],
                    expectedDeliverables: [
                        'Documented disciplinary process for cybersecurity violations.',
                        'Evidence of communication to all employees (e.g., in the employee handbook).',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-4',
            title: 'Physical and Environmental Security',
            objective: 'To prevent unauthorized physical access, damage, and interference to the organization’s information and information processing facilities.',
            controls: [
                {
                    id: '2-4-1',
                    description: 'Physical security perimeters must be defined and used to protect areas that contain sensitive or critical information and information processing facilities.',
                    implementationGuidelines: [
                        'Define physical security zones based on risk assessment (e.g., public areas, offices, data centers).',
                        'Implement physical access controls at the perimeter of each zone (e.g., card readers, reception desks, locks).',
                        'The perimeter should be physically sound (solid walls, doors, etc.).',
                    ],
                    expectedDeliverables: [
                        'Physical security policy and procedures.',
                        'Diagram of physical security perimeters and zones.',
                        'Records of physical access control system configuration.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-4-2',
                    description: 'Secure areas must be protected by appropriate entry controls to ensure that only authorized personnel are allowed access.',
                    implementationGuidelines: [
                        'Implement a formal physical access request and approval process.',
                        'Use authentication mechanisms (e.g., access cards, biometrics) to control entry to secure areas.',
                        'Maintain and review logs of physical access to sensitive areas like data centers.',
                    ],
                    expectedDeliverables: [
                        'Physical access control logs.',
                        'Documented procedure for managing physical access rights.',
                        'Periodic access review reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-4-3',
                    description: 'Equipment must be protected from physical and environmental threats.',
                    implementationGuidelines: [
                        'Implement environmental controls in data centers (e.g., temperature and humidity monitoring, fire suppression systems).',
                        'Protect against power failures using uninterruptible power supplies (UPS) and backup generators.',
                        'Secure equipment to prevent theft or unauthorized removal.',
                    ],
                    expectedDeliverables: [
                        'Environmental monitoring logs for data centers.',
                        'Maintenance and testing records for UPS and fire suppression systems.',
                        'Asset management records showing equipment location.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-5',
            title: 'Communications and Operations Management',
            objective: 'To ensure the secure operation of information processing facilities.',
            controls: [
                {
                    id: '2-5-1',
                    description: 'Operating procedures must be documented and made available to all users who need them.',
                    implementationGuidelines: [
                        'Develop and maintain documented operating procedures for key systems and processes.',
                        'Ensure procedures are stored in a central, accessible location.',
                        'Review and update procedures regularly, especially after system changes.',
                    ],
                    expectedDeliverables: [
                        'A library of documented operating procedures.',
                        'Change management records related to procedure updates.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-5-2',
                    description: 'Change management procedures must be implemented for all changes to information processing facilities and systems.',
                    implementationGuidelines: [
                        'Establish a formal change management process that includes risk assessment, approval, testing, and back-out plans.',
                        'All changes, including emergency changes, must be logged and reviewed.',
                        'A Change Advisory Board (CAB) should review and approve significant changes.',
                    ],
                    expectedDeliverables: [
                        'Documented change management policy and procedure.',
                        'Change records in a ticketing or change management system.',
                        'Minutes from CAB meetings.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-5-3',
                    description: 'Capacity management must be in place to ensure that the capacity of systems and networks is sufficient to meet business requirements.',
                    implementationGuidelines: [
                        'Monitor the performance and capacity of critical systems and networks.',
                        'Analyze usage trends to forecast future capacity requirements.',
                        'Plan and implement upgrades in a timely manner to avoid performance degradation.',
                    ],
                    expectedDeliverables: [
                        'Capacity monitoring reports and dashboards.',
                        'Capacity plans and forecasts.',
                        'Change records related to capacity upgrades.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-5-4',
                    description: 'Secure configuration baselines (hardening) must be developed and applied to all information systems.',
                    implementationGuidelines: [
                        'Develop and document secure configuration standards for operating systems, databases, network devices, and applications, based on industry best practices (e.g., CIS Benchmarks).',
                        'Use automated tools to apply and enforce these secure configurations.',
                        'Regularly audit systems for compliance with the baselines.',
                    ],
                    expectedDeliverables: [
                        'Documented secure configuration standards (hardening guides).',
                        'System images or automated scripts (e.g., IaC) that implement the standards.',
                        'Configuration compliance scan reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-5-5',
                    description: 'Segregation of duties must be implemented to reduce the risk of unauthorized or unintentional modification of information.',
                    implementationGuidelines: [
                        'Identify and define roles and responsibilities that should be segregated (e.g., system development vs. system administration, requestor vs. approver).',
                        'Configure system access controls to enforce segregation of duties.',
                        'Periodically review access rights to ensure segregation of duties is maintained.',
                    ],
                    expectedDeliverables: [
                        'Segregation of duties policy.',
                        'A matrix of conflicting roles and responsibilities.',
                        'Access control configurations and periodic access review reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-6',
            title: 'Technical Vulnerability Management',
            objective: 'To ensure that vulnerabilities in systems and networks are identified and remediated in a timely manner.',
            controls: [
                {
                    id: '2-6-1',
                    description: 'A vulnerability management program must be established to identify, assess, and remediate vulnerabilities.',
                    implementationGuidelines: [
                        'Define a policy for vulnerability scanning frequency and scope.',
                        'Use automated tools to regularly scan all internal and external systems and networks.',
                        'Prioritize vulnerabilities based on severity, exploitability, and asset criticality.',
                    ],
                    expectedDeliverables: [
                        'Vulnerability management policy and procedures.',
                        'Vulnerability scan reports.',
                        'Documented risk ratings and prioritization criteria.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-6-2',
                    description: 'Security patches for all systems and applications must be applied in a timely manner based on risk.',
                    implementationGuidelines: [
                        'Establish a patch management process that includes identifying, testing, and deploying patches.',
                        'Define SLAs for patching based on vulnerability severity (e.g., critical vulnerabilities patched within 14 days).',
                        'Track and report on patching compliance.',
                    ],
                    expectedDeliverables: [
                        'Patch management policy and procedures.',
                        'Patch deployment records and reports.',
                        'Dashboards showing patching compliance rates.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-6-3',
                    description: 'Penetration testing must be conducted regularly on external and internal systems.',
                    implementationGuidelines: [
                        'Schedule annual penetration tests by qualified third-party vendors.',
                        'The scope should include critical external-facing systems and internal networks.',
                        'Findings from penetration tests must be tracked and remediated.',
                    ],
                    expectedDeliverables: [
                        'Penetration test reports.',
                        'Remediation plans for identified findings.',
                        'Evidence of re-testing to confirm closure of findings.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-6-4',
                    description: 'Threat and vulnerability intelligence feeds must be used to proactively identify and prioritize risks.',
                    implementationGuidelines: [
                        'Subscribe to and monitor vulnerability disclosure mailing lists, vendor security advisories, and threat intelligence services.',
                        'Use this intelligence to inform vulnerability scanning, risk assessments, and patch prioritization.',
                        'Proactively search for indicators of compromise (IoCs) related to new threats in the environment.',
                    ],
                    expectedDeliverables: [
                        'Procedure for consuming and analyzing vulnerability intelligence.',
                        'Examples of alerts or reports based on intelligence feeds.',
                        'Evidence of proactive actions taken based on threat intelligence.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-7',
            title: 'Malware Protection',
            objective: 'To protect against malware across all relevant assets.',
            controls: [
                {
                    id: '2-7-1',
                    description: 'Anti-malware software must be deployed on all endpoints and servers.',
                    implementationGuidelines: [
                        'Install and maintain anti-malware solutions on all workstations, laptops, and servers.',
                        'Ensure anti-malware signatures and engines are updated automatically and regularly.',
                        'Configure solutions to perform regular scans and provide real-time protection.',
                    ],
                    expectedDeliverables: [
                        'Anti-malware policy and standards.',
                        'Deployment reports from the central management console.',
                        'Configuration settings screenshots.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-7-2',
                    description: 'Anti-malware controls must be centrally managed and monitored.',
                    implementationGuidelines: [
                        'Use a central management console to manage policies, updates, and alerts for all anti-malware clients.',
                        'Configure alerts for malware detections and policy violations.',
                        'Regularly review the console for health status and security events.',
                    ],
                    expectedDeliverables: [
                        'Dashboards from the central management console.',
                        'Alerting configuration and sample alerts.',
                        'Reports on malware incidents and system health.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-7-3',
                    description: 'Advanced threat protection mechanisms must be implemented to detect and block sophisticated malware.',
                    implementationGuidelines: [
                        'Deploy sandboxing technology to analyze suspicious email attachments and web downloads in an isolated environment.',
                        'Utilize Endpoint Detection and Response (EDR) solutions for advanced threat hunting and incident response capabilities on endpoints.',
                        'Configure email and web gateways to block file types commonly associated with malware.',
                    ],
                    expectedDeliverables: [
                        'Configuration documents for sandboxing solutions.',
                        'EDR deployment reports and policy configurations.',
                        'Reports from security gateways showing blocked malicious files.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                }
            ]
        },
        {
            id: '2-8',
            title: 'Cryptographic Controls',
            objective: 'To ensure the proper and effective use of cryptography to protect the confidentiality and integrity of information.',
            controls: [
                {
                    id: '2-8-1',
                    description: 'A policy on the use of cryptographic controls for protection of information must be developed and implemented.',
                    implementationGuidelines: [
                        'Define requirements for data encryption, both in transit and at rest.',
                        'Specify approved cryptographic algorithms, protocols, and key lengths.',
                        'The policy should cover key management processes.',
                    ],
                    expectedDeliverables: [
                        'Cryptographic controls policy.',
                        'Standards for data encryption and key management.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-8-2',
                    description: 'A key management process must be in place to manage cryptographic keys throughout their lifecycle.',
                    implementationGuidelines: [
                        'Define secure procedures for key generation, distribution, storage, backup, and destruction.',
                        'Restrict access to cryptographic keys.',
                        'Use a secure key management system where appropriate (e.g., HSM).',
                    ],
                    expectedDeliverables: [
                        'Key management policy and procedures.',
                        'Access control lists for key management systems.',
                        'Logs from key management activities.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-8-3',
                    description: 'Data-at-rest must be encrypted on all servers, databases, and end-user devices that store sensitive information.',
                    implementationGuidelines: [
                        'Implement full-disk encryption on all laptops and removable media.',
                        'Utilize transparent data encryption (TDE) for databases containing sensitive data.',
                        'Encrypt sensitive files stored on file servers.',
                    ],
                    expectedDeliverables: [
                        'Policy for data-at-rest encryption.',
                        'Reports from disk encryption management tools.',
                        'Database configuration demonstrating TDE is enabled.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-8-4',
                    description: 'Data-in-transit must be encrypted using strong, approved cryptographic protocols.',
                    implementationGuidelines: [
                        'Enforce the use of TLS 1.2 or higher for all web and API communications, both internal and external.',
                        'Use secure protocols like SSH or SFTP for remote administration and file transfers, and disable insecure protocols like Telnet and FTP.',
                        'Encrypt all data transmitted over wireless networks using WPA2 or WPA3.',
                    ],
                    expectedDeliverables: [
                        'Network and system configuration files showing enforcement of strong encryption protocols.',
                        'Reports from network scanners verifying the absence of weak protocols.',
                        'Wireless network configuration documentation.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-9',
            title: 'Secure Development',
            objective: 'To ensure that cybersecurity is an integral part of information systems across the entire lifecycle.',
            controls: [
                {
                    id: '2-9-1',
                    description: 'Secure coding standards must be defined and enforced for all in-house software development.',
                    implementationGuidelines: [
                        'Adopt and document secure coding guidelines (e.g., OWASP Top 10, SANS CWE 25).',
                        'Provide training on secure coding practices to all developers.',
                        'Use static application security testing (SAST) tools to automatically scan code for vulnerabilities.',
                    ],
                    expectedDeliverables: [
                        'Documented secure coding standards.',
                        'Developer training records.',
                        'SAST scan reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-9-2',
                    description: 'Security testing must be integrated into the software development lifecycle.',
                    implementationGuidelines: [
                        'Conduct dynamic application security testing (DAST) on applications before deployment.',
                        'Perform security code reviews for critical applications.',
                        'Remediate identified vulnerabilities before releasing software to production.',
                    ],
                    expectedDeliverables: [
                        'DAST scan reports.',
                        'Code review findings.',
                        'Evidence of vulnerability remediation.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-9-3',
                    description: 'Separate environments must be used for development, testing, and production.',
                    implementationGuidelines: [
                        'Maintain logically and physically separate environments.',
                        'Access to the production environment should be tightly controlled.',
                        'Production data should not be used in development or testing environments without being anonymized or masked.',
                    ],
                    expectedDeliverables: [
                        'Network diagrams showing environment separation.',
                        'Access control policies for each environment.',
                        'Data masking procedures.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-9-4',
                    description: 'The security of third-party and open-source components must be managed.',
                    implementationGuidelines: [
                        'Maintain an inventory of all third-party and open-source libraries used in software development (e.g., via a Software Bill of Materials - SBOM).',
                        'Use Software Composition Analysis (SCA) tools to scan for known vulnerabilities in these components.',
                        'Establish a process for updating or replacing vulnerable components.',
                    ],
                    expectedDeliverables: [
                        'Software Bill of Materials (SBOM) for critical applications.',
                        'SCA scan reports.',
                        'Change management records showing updates to vulnerable libraries.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-9-5',
                    description: 'Application Programming Interfaces (APIs) must be designed, developed, and managed securely.',
                    implementationGuidelines: [
                        'Implement strong authentication and authorization for all APIs.',
                        'Enforce rate limiting and input validation to protect against abuse and attacks.',
                        'Maintain a comprehensive inventory of all internal and external APIs.',
                    ],
                    expectedDeliverables: [
                        'API security standard and development guidelines.',
                        'API inventory document.',
                        'Penetration test reports specifically targeting APIs.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '2-10',
            title: 'Endpoint and Communications Security',
            objective: 'To secure endpoints and protect information in networks and its supporting information processing facilities.',
            controls: [
                {
                    id: '2-10-1',
                    description: 'Network security controls must be implemented to protect against threats.',
                    implementationGuidelines: [
                        'Deploy firewalls at the network perimeter and between internal network segments.',
                        'Implement Intrusion Detection/Prevention Systems (IDS/IPS) to monitor for malicious activity.',
                        'Segregate networks based on trust levels and data sensitivity.',
                    ],
                    expectedDeliverables: [
                        'Firewall rule sets.',
                        'IDS/IPS configuration and alert logs.',
                        'Network diagrams showing segmentation.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-10-2',
                    description: 'Security mechanisms for endpoints (e.g., laptops, workstations) must be implemented.',
                    implementationGuidelines: [
                        'Enforce the use of personal firewalls and host-based intrusion prevention on endpoints.',
                        'Implement full-disk encryption on all laptops.',
                        'Control the use of removable media (e.g., USB drives).',
                    ],
                    expectedDeliverables: [
                        'Endpoint security policy and standards.',
                        'Configuration screenshots from endpoint management tools.',
                        'Disk encryption status reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-10-3',
                    description: 'Email and web filtering solutions must be implemented to protect against malicious content.',
                    implementationGuidelines: [
                        'Deploy a secure email gateway to scan for spam, phishing, and malware.',
                        'Use a web proxy or secure web gateway to block access to malicious websites and filter content.',
                        'Implement DMARC, DKIM, and SPF to protect against email spoofing.',
                    ],
                    expectedDeliverables: [
                        'Configuration of email and web filtering solutions.',
                        'DNS records for DMARC, DKIM, and SPF.',
                        'Reports on blocked threats.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-10-4',
                    description: 'Data Loss Prevention (DLP) controls must be implemented to detect and prevent the unauthorized exfiltration of sensitive data.',
                    implementationGuidelines: [
                        'Deploy DLP solutions at key exit points, such as email gateways, web proxies, and endpoints.',
                        'Define policies and rules based on the organization\'s data classification scheme to identify and block sensitive data in transit.',
                        'Establish a process for reviewing and responding to DLP alerts.',
                    ],
                    expectedDeliverables: [
                        'DLP policy and rule set documentation.',
                        'Reports from the DLP management console showing blocked events.',
                        'Incident response procedures for DLP alerts.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-10-5',
                    description: 'Network Access Control (NAC) must be implemented to enforce security policies on devices connecting to the corporate network.',
                    implementationGuidelines: [
                        'Deploy a NAC solution to authenticate users and devices before granting network access.',
                        'Enforce endpoint compliance checks (e.g., anti-malware status, patch level) as a condition of access.',
                        'Implement guest and contractor network access through a segregated VLAN with limited privileges.',
                    ],
                    expectedDeliverables: [
                        'NAC policy and implementation plan.',
                        'Configuration documentation for the NAC solution.',
                        'Reports showing compliant and non-compliant devices.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-10-6',
                    description: 'Mobile devices that access organizational data must be managed through a Mobile Device Management (MDM) or Unified Endpoint Management (UEM) solution.',
                    implementationGuidelines: [
                        'Enforce security policies on mobile devices, such as mandatory passcodes, encryption, and application blacklisting.',
                        'Implement capabilities to remotely wipe corporate data from lost or stolen devices.',
                        'Use containerization to separate corporate data from personal data on employee-owned devices (BYOD).',
                    ],
                    expectedDeliverables: [
                        'Mobile device security policy.',
                        'MDM/UEM policy configuration screenshots.',
                        'Device inventory and compliance reports from the management console.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '2-10-7',
                    description: 'Protective DNS services must be used to block access to known malicious domains.',
                    implementationGuidelines: [
                        'Configure endpoint and network DNS resolvers to use a Protective DNS service that filters requests based on threat intelligence.',
                        'Monitor DNS logs for suspicious activity and potential command-and-control (C2) communications.',
                        'Block DNS requests for newly registered domains and high-risk domain categories.',
                    ],
                    expectedDeliverables: [
                        'Policy on the use of Protective DNS.',
                        'Configuration documentation for DNS settings on endpoints and network devices.',
                        'Reports from the Protective DNS service showing blocked domains.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
    ]
  },
  {
      id: '3',
      name: 'Cybersecurity Resilience',
      subdomains: [
          {
              id: '3-1',
              title: 'Cybersecurity Resilience Aspects of Business Continuity Management (BCM)',
              objective: 'To ensure the inclusion of the cybersecurity resiliency requirements within the organization\'s business continuity management and to remediate and minimize the impacts on systems, information processing facilities and critical e-services from disasters caused by cybersecurity incidents.',
              controls: [
                  {
                      id: '3-1-1',
                      description: 'Cybersecurity requirements for business continuity management must be defined, documented and approved.',
                      implementationGuidelines: [
                          'Include and document cybersecurity requirements within the organization\'s business continuity management, including ensuring continuity of systems, developing incident response plans, and creating a Disaster Recovery Plan.',
                          'Cybersecurity requirements within business continuity management must be supported by the Executive Management.',
                      ],
                      expectedDeliverables: [
                          'Cybersecurity policy that covers the requirements of business continuity management (e.g., electronic copy or official hard copy).',
                          'Formal approval by the head of the organization or his/her deputy on such document.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15',
                      history: [
                        {
                          version: '1.0',
                          date: '2022-01-10',
                          changes: [
                            'Initial release focusing on integrating cybersecurity into BCM.',
                          ]
                        }
                      ]
                  },
                  {
                      id: '3-1-2',
                      description: 'The cybersecurity requirements for business continuity management must be implemented.',
                      implementationGuidelines: [
                          'Implement cybersecurity requirements within business continuity management that have been identified, documented, and approved in the policy.',
                          'Develop an action plan to implement all cybersecurity requirements to ensure BCM in the organization.',
                          'Include cybersecurity requirements for BCM in the organization\'s BCM procedures to ensure compliance with cybersecurity requirements for all internal and external stakeholders.',
                      ],
                      expectedDeliverables: [
                          'Documents that confirm the implementation of cybersecurity requirements related to BCM as documented in the policy.',
                          'An action plan to implement cybersecurity requirements for BCM in the organization.',
                          'Evidence showing the implementation of BCM controls at the organization.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-1-3',
                      description: 'Disaster recovery plans must be developed, documented, and tested.',
                      implementationGuidelines: [
                        'Define and document the requirements of this ECC in the cybersecurity requirements document and approve them by the representative.',
                        'Develop disaster recovery plans, including (but not limited to): Identify disaster recovery team, Identify and assess disaster risk, Conduct Business Impact Analysis (BIA), Define backup and external storage procedures, Test disaster recovery plans.',
                        'Establish a disaster recovery center for critical systems.',
                        'Conduct periodic tests to ensure the effectiveness of disaster recovery plans.',
                      ],
                      expectedDeliverables: [
                        'A document (such as approved policy or procedure) indicating the identification and documentation of the requirements related to this control.',
                        'Organization-approved disaster recovery plans.',
                        'Reports on the implementation of disaster recovery plans tests at the organization.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  }
              ]
          },
          {
              id: '3-2',
              title: 'Cybersecurity Incident Management',
              objective: 'To ensure a consistent and effective approach to the management of cybersecurity incidents.',
              controls: [
                  {
                      id: '3-2-1',
                      description: 'Cybersecurity incident management responsibilities and procedures must be established.',
                      implementationGuidelines: [
                          'Define and document an incident response plan that covers all phases: preparation, identification, containment, eradication, recovery, and lessons learned.',
                          'Establish a Computer Security Incident Response Team (CSIRT) with defined roles and responsibilities.',
                          'Ensure all employees know how to identify and report a security incident.',
                      ],
                      expectedDeliverables: [
                          'Cybersecurity incident response plan.',
                          'CSIRT charter and contact list.',
                          'Incident reporting procedures for employees.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-2-2',
                      description: 'Cybersecurity incidents must be reported to relevant authorities and stakeholders in accordance with laws and regulations.',
                      implementationGuidelines: [
                          'Identify all legal and regulatory requirements for incident reporting.',
                          'Integrate these requirements into the incident response plan, including thresholds and timelines for reporting.',
                          'Maintain contact information for relevant authorities (e.g., NCA, SAMA).',
                      ],
                      expectedDeliverables: [
                          'Documented procedure for reporting to authorities.',
                          'Records of incidents reported to external parties.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-2-3',
                      description: 'The incident response plan must be tested periodically.',
                      implementationGuidelines: [
                          'Conduct regular tabletop exercises and functional drills to test the incident response plan.',
                          'Involve key stakeholders from IT, legal, communications, and management in the tests.',
                          'Use the results of tests to identify gaps and improve the plan.',
                      ],
                      expectedDeliverables: [
                          'Incident response test plan and schedule.',
                          'Post-exercise reports with findings and recommendations.',
                          'Updated incident response plan incorporating lessons learned.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-2-4',
                      description: 'A cybersecurity incident communication plan must be established to manage internal and external communications during an incident.',
                      implementationGuidelines: [
                          'Define roles and responsibilities for incident communication, including a primary spokesperson.',
                          'Develop pre-approved communication templates for various incident scenarios and stakeholders (e.g., employees, customers, regulators).',
                          'Establish secure, out-of-band communication channels for the incident response team.',
                      ],
                      expectedDeliverables: [
                          'A documented incident communication plan.',
                          'Pre-approved communication templates.',
                          'Contact lists for key internal and external stakeholders.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-2-5',
                      description: 'Digital forensics readiness must be established to support the investigation of cybersecurity incidents.',
                      implementationGuidelines: [
                          'Identify and securely maintain tools and resources required for forensic investigations.',
                          'Provide training to incident response team members on forensic evidence collection and preservation.',
                          'Define procedures for maintaining the chain of custody for all collected evidence.',
                      ],
                      expectedDeliverables: [
                          'Digital forensics readiness and investigation procedure.',
                          'An inventory of forensic tools and software.',
                          'Training records for incident responders on forensic techniques.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
              ]
          },
          {
              id: '3-3',
              title: 'Logging and Monitoring',
              objective: 'To detect unauthorized activities and to support incident investigations.',
              controls: [
                  {
                      id: '3-3-1',
                      description: 'Audit logs recording user activities, exceptions, faults, and information security events must be produced, kept, and regularly reviewed.',
                      implementationGuidelines: [
                          'Enable logging on all critical systems, applications, and network devices.',
                          'Ensure logs capture sufficient detail (e.g., user ID, timestamp, event type, source/destination IP).',
                          'Protect logs from tampering and unauthorized access.',
                      ],
                      expectedDeliverables: [
                          'Logging policy and standard.',
                          'Evidence of logging configurations on critical systems.',
                          'Procedures for log review.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-3-2',
                      description: 'A Security Information and Event Management (SIEM) system must be implemented to centralize and correlate logs.',
                      implementationGuidelines: [
                          'Forward logs from all critical systems to a central SIEM solution.',
                          'Develop correlation rules and alerts to detect suspicious activities.',
                          'Monitor the SIEM for security alerts and investigate them in a timely manner.',
                      ],
                      expectedDeliverables: [
                          'SIEM architecture diagram.',
                          'Examples of correlation rules and alerts.',
                          'Incident tickets generated from SIEM alerts.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-3-3',
                      description: 'Clocks across all relevant information processing systems must be synchronized with an authoritative time source.',
                      implementationGuidelines: [
                          'Configure all systems to synchronize with a central, trusted Network Time Protocol (NTP) server.',
                          'Ensure the NTP server is synchronized with an external authoritative time source.',
                          'Monitor for time synchronization failures.',
                      ],
                      expectedDeliverables: [
                          'Network diagram showing time synchronization architecture.',
                          'Configuration settings for NTP on clients and servers.',
                          'Monitoring alerts for time drift.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-3-4',
                      description: 'Security logs must be retained for a defined period in compliance with legal, regulatory, and organizational requirements.',
                      implementationGuidelines: [
                          'Define and document log retention periods for different types of logs based on applicable requirements (e.g., 12 months).',
                          'Implement a log management solution that provides secure, long-term storage.',
                          'Ensure that retained logs are accessible for investigation and audit purposes.',
                      ],
                      expectedDeliverables: [
                          'Log retention policy.',
                          'Configuration documentation for the log storage solution.',
                          'Evidence of successful log retrieval for a past event.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-3-5',
                      description: 'User activity on critical systems must be monitored to detect anomalous or unauthorized behavior.',
                      implementationGuidelines: [
                          'Implement User and Entity Behavior Analytics (UEBA) capabilities, either standalone or as part of a SIEM.',
                          'Define baselines of normal user activity and create alerts for significant deviations.',
                          'Pay special attention to the activity of privileged accounts.',
                      ],
                      expectedDeliverables: [
                          'UEBA policy and use case documentation.',
                          'Configuration of UEBA monitoring rules and alerts.',
                          'Reports and incident tickets generated from UEBA alerts.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-3-6',
                      description: 'A formal process for security alert triage and investigation must be established.',
                      implementationGuidelines: [
                          'Develop and document procedures (playbooks) for handling common types of security alerts.',
                          'Assign responsibilities within the security operations team for alert monitoring, triage, and escalation.',
                          'Use a ticketing system to track the status of all security alert investigations.',
                      ],
                      expectedDeliverables: [
                          'Security alert triage and investigation procedure.',
                          'A library of incident response playbooks.',
                          'Sample tickets from the alert tracking system.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
              ]
          },
          {
              id: '3-4',
              title: 'Information Backup and Recovery',
              objective: 'To ensure that information can be recovered in a timely manner following an incident.',
              controls: [
                  {
                      id: '3-4-1',
                      description: 'A backup and recovery policy must be defined, documented, and implemented, defining scope, frequency, and retention periods.',
                      implementationGuidelines: [
                          'Classify data to determine appropriate backup requirements (e.g., RPO/RTO).',
                          'Define and document backup schedules and methods for different types of data and systems.',
                          'Specify secure off-site or cloud storage locations for backup media.',
                          'Define roles and responsibilities for backup and recovery operations.',
                      ],
                      expectedDeliverables: [
                          'Documented backup and recovery policy and procedures.',
                          'Data classification documentation with associated backup requirements.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-4-2',
                      description: 'Regular backups of critical information, software, and system images must be taken and stored securely.',
                      implementationGuidelines: [
                          'Automate backup processes to ensure consistency and reliability.',
                          'Encrypt backup data both in transit and at rest.',
                          'Implement access controls to protect backup files from unauthorized access or modification.',
                      ],
                      expectedDeliverables: [
                          'Backup job logs and schedules.',
                          'Configuration of backup encryption.',
                          'Access control lists for backup storage.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-4-3',
                      description: 'Backup and recovery capabilities must be tested periodically to ensure they function correctly.',
                      implementationGuidelines: [
                          'Conduct regular tests of data restoration from backups to a test environment.',
                          'Perform full system recovery tests as part of the disaster recovery testing program.',
                          'Document the results of all tests and remediate any failures.',
                      ],
                      expectedDeliverables: [
                          'Backup and recovery test plans and schedules.',
                          'Reports detailing the results of recovery tests.',
                          'Evidence of remediation for any test failures.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-4-4',
                      description: 'Backup media must be physically protected against damage, theft, and unauthorized access.',
                      implementationGuidelines: [
                          'Store backup media (e.g., tapes, hard drives) in a secure, environmentally controlled off-site location.',
                          'Maintain a chain of custody log for all physical backup media.',
                          'For cloud backups, ensure the provider meets stringent security and compliance requirements.',
                      ],
                      expectedDeliverables: [
                          'Procedure for handling and storing backup media.',
                          'Contracts with off-site storage providers.',
                          'Chain of custody logs for physical media.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-4-5',
                      description: 'A secondary disaster recovery (DR) site must be established for critical systems.',
                      implementationGuidelines: [
                          'The DR site must be geographically separate from the primary site to reduce the risk of being affected by the same disaster.',
                          'Ensure the DR site has sufficient capacity and resources to run critical business functions.',
                          'Establish secure network connectivity between the primary and DR sites.',
                      ],
                      expectedDeliverables: [
                          'Disaster recovery site strategy and design document.',
                          'Contracts and SLAs for the DR site.',
                          'Network diagrams for DR connectivity.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
                  {
                      id: '3-4-6',
                      description: 'Data for critical systems must be replicated to the disaster recovery site.',
                      implementationGuidelines: [
                          'Implement synchronous or asynchronous replication for critical databases and applications, based on Recovery Point Objectives (RPO).',
                          'Regularly monitor the health and status of data replication.',
                          'Test failover to the replicated data as part of the DR testing program.',
                      ],
                      expectedDeliverables: [
                          'Data replication architecture document.',
                          'Configuration of replication technologies.',
                          'Reports on replication status and successful failover tests.',
                      ],
                      version: '1.1',
                      lastUpdated: '2024-05-15'
                  },
              ]
          }
      ]
  },
  {
    id: '4',
    name: 'Third-Party and Cloud Computing Cybersecurity',
    subdomains: [
        {
            id: '4-1',
            title: 'Third-Party Cybersecurity',
            objective: 'To ensure the protection of assets against the cybersecurity risks related to third-parties including outsourcing and managed services as per organizational policies and procedures, and related laws and regulations.',
            controls: [
                {
                    id: '4-1-1',
                    description: 'Cybersecurity requirements for contracts and agreements with third-parties must be identified, documented and approved.',
                    implementationGuidelines: [
                        'Develop and document cybersecurity policy for Third-Party Cybersecurity in the organization, including requirements within contracts, third-party risk assessment procedures, Data and Information Protection, and Cybersecurity Incident Management.',
                        'Support the organization\'s policy by the Executive Management.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of contracts and agreements with third-parties (e.g., electronic copy or official hard copy).',
                        'Formal approval by the head of the organization or his/her deputy on the policy (e.g., via the organization’s official e-mail, paper or electronic signature).',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15',
                    history: [
                      {
                        version: '1.0',
                        date: '2022-01-10',
                        changes: [
                          'Established baseline for including cybersecurity requirements in third-party agreements.',
                        ]
                      }
                    ]
                },
                {
                    id: '4-1-2',
                    description: 'Cybersecurity managed services centers for monitoring and operations must be completely present inside the Kingdom of Saudi Arabia.',
                    implementationGuidelines: [
                        'Define and document the requirements for the managed operation and monitoring cybersecurity operations centers, which use remote access method, to be located within the Kingdom.',
                        'Ensure that Cybersecurity operation centers managed for operation and monitoring are located within the Kingdom.',
                        'Include a clause in the contract or service level agreement that obliges the third party to have operations centers within the Kingdom.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of contracts and agreements with third-parties.',
                        'A sample of the evidence of hosting or managing the cybersecurity operations center within the Kingdom.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-1-3',
                    description: 'A formal exit strategy must be defined for critical third-party relationships to ensure a smooth transition of services.',
                    implementationGuidelines: [
                        'Define and document a termination and exit plan for each critical third-party service.',
                        'The plan should cover data retrieval, service transition, and secure data deletion requirements.',
                        'Include exit strategy clauses in the third-party contract.',
                    ],
                    expectedDeliverables: [
                        'Documented exit strategy plans for critical third parties.',
                        'Contract clauses related to service termination and exit.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '4-2',
            title: 'Cloud Computing and Hosting Cybersecurity',
            objective: 'To ensure the proper and efficient remediation of cyber risks and the implementation of cybersecurity requirements related to hosting and cloud computing as per organizational policies and procedures, and related laws and regulations. It is also to ensure the protection of the organization\'s information and technology assets hosted on the cloud or processed/managed by third-parties.',
            controls: [
                {
                    id: '4-2-1',
                    description: 'Cybersecurity requirements related to the use of hosting and cloud computing services must be defined, documented and approved.',
                    implementationGuidelines: [
                        'Develop and document cybersecurity policy for cloud computing and hosting services in the organization, including contract requirements, data location requirements, data removal/retrieval, data classification, SLA inclusion, and non-disclosure clauses.',
                        'Support the organization\'s policy by the Executive Management.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of the use of cloud computing and hosting services.',
                        'Formal approval by the head of the organization or his/her deputy on the policy.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-2-2',
                    description: 'Organization\'s information hosting and storage must be inside the Kingdom of Saudi Arabia.',
                    implementationGuidelines: [
                        'Ensure that the documented and approved policy includes the requirements for the location of hosting and storing the organization\'s information and must be within the Kingdom.',
                        'Include a clause in the contract or service level agreement signed with the service provider that data storage must be within the Kingdom.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of the use of cloud computing and hosting services.',
                        'Evidence of the location of hosting and storing the organization\'s information within the Kingdom.',
                        'Evidence by the service provider proving the storage of data within the Kingdom.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                }
            ]
        },
        {
            id: '4-3',
            title: 'Third-Party and Supply Chain Risk Management',
            objective: 'To manage cybersecurity risks associated with the supply chain and third-party relationships.',
            controls: [
                {
                    id: '4-3-1',
                    description: 'A process to assess the cybersecurity posture of third parties must be implemented before establishing a relationship.',
                    implementationGuidelines: [
                        'Develop a third-party risk assessment methodology, including questionnaires and evidence review.',
                        'Assess all potential third parties based on the sensitivity of the data they will access and the criticality of the service they provide.',
                        'Do not engage with third parties that do not meet the organization\'s minimum security requirements.',
                    ],
                    expectedDeliverables: [
                        'Third-party risk management policy and procedures.',
                        'Completed risk assessment questionnaires for new vendors.',
                        'Reports summarizing the risks of third-party relationships.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-3-2',
                    description: 'Cybersecurity requirements must be included in all contracts with third parties.',
                    implementationGuidelines: [
                        'Use a standard cybersecurity addendum for all third-party contracts.',
                        'Requirements should include incident notification, right to audit, data handling, and compliance with the organization\'s policies.',
                        'The contract should specify consequences for non-compliance.',
                    ],
                    expectedDeliverables: [
                        'Standard contract templates with cybersecurity clauses.',
                        'Signed contracts with third parties showing the inclusion of security requirements.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-3-3',
                    description: 'The cybersecurity posture of critical third parties must be monitored throughout the relationship.',
                    implementationGuidelines: [
                        'Conduct periodic reviews and assessments of critical third parties.',
                        'Use third-party risk monitoring services to receive alerts about security issues at your vendors.',
                        'Review SOC 2 reports or other certifications annually.',
                    ],
                    expectedDeliverables: [
                        'Periodic third-party risk assessment reports.',
                        'SOC 2 reports or other certifications from vendors.',
                        'Records of issues identified and remediated with third parties.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-3-4',
                    description: 'A Software Bill of Materials (SBOM) must be requested from vendors of critical software.',
                    implementationGuidelines: [
                        'Incorporate the requirement for an SBOM into the procurement and contracting process.',
                        'Use the SBOM to assess the risk of open-source and third-party components within vendor software.',
                        'Monitor for new vulnerabilities affecting components listed in the SBOM.',
                    ],
                    expectedDeliverables: [
                        'Procurement policy requiring SBOMs.',
                        'SBOM documents received from critical software vendors.',
                        'Vulnerability reports related to SBOM components.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-3-5',
                    description: 'The integrity of critical hardware and software acquired from third parties must be verified.',
                    implementationGuidelines: [
                        'Establish a process for verifying the authenticity and integrity of hardware and software upon receipt.',
                        'Use techniques such as cryptographic signature verification for software and anti-tampering checks for hardware.',
                        'Source all critical assets from trusted and authorized suppliers.',
                    ],
                    expectedDeliverables: [
                        'Supply chain integrity verification procedure.',
                        'Records of hardware and software integrity checks.',
                        'A list of approved and trusted suppliers.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '4-4',
            title: 'Cloud Service Configuration Management',
            objective: 'To ensure that cloud services are configured securely and remain secure over time.',
            controls: [
                {
                    id: '4-4-1',
                    description: 'Secure baseline configurations, based on industry best practices, must be defined and implemented for all cloud services.',
                    implementationGuidelines: [
                        'Develop secure configuration standards for IaaS, PaaS, and SaaS services (e.g., based on CIS Benchmarks).',
                        'Use Infrastructure as Code (IaC) templates to enforce secure configurations during deployment.',
                        'Disable unnecessary ports, services, and features in cloud environments.',
                    ],
                    expectedDeliverables: [
                        'Documented secure configuration standards for cloud services.',
                        'Approved Infrastructure as Code templates.',
                        'Reports from cloud configuration assessment tools.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-4-2',
                    description: 'Cloud service configurations must be continuously monitored for misconfigurations and drift from the secure baseline.',
                    implementationGuidelines: [
                        'Deploy a Cloud Security Posture Management (CSPM) tool to automate the monitoring of cloud configurations.',
                        'Configure alerts for critical misconfigurations and unauthorized changes.',
                        'Establish a process for remediating identified misconfigurations in a timely manner.',
                    ],
                    expectedDeliverables: [
                        'Reports and dashboards from the CSPM tool.',
                        'Configuration of alerts for cloud security issues.',
                        'Records of remediated misconfigurations.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-4-3',
                    description: 'Identity and Access Management (IAM) in cloud environments must be securely configured and managed.',
                    implementationGuidelines: [
                        'Apply the principle of least privilege to all cloud IAM roles and policies.',
                        'Avoid the use of long-lived static credentials; prefer temporary credentials and roles.',
                        'Regularly review and remove unused or excessive permissions.',
                    ],
                    expectedDeliverables: [
                        'Cloud IAM policy and standards.',
                        'Documented IAM roles and associated permissions.',
                        'Periodic IAM access review reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '4-4-4',
                    description: 'Data residency and storage locations in the cloud must be continuously monitored to ensure compliance with legal and regulatory requirements.',
                    implementationGuidelines: [
                        'Use cloud provider tools and third-party solutions to monitor where data is stored.',
                        'Configure policies to restrict the creation of resources or storage of data outside of approved regions.',
                        'Regularly audit cloud configurations to verify data residency compliance.',
                    ],
                    expectedDeliverables: [
                        'Data residency policy for cloud services.',
                        'Configuration of cloud policies restricting data locations.',
                        'Data residency monitoring and audit reports.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        }
    ]
  },
  {
    id: '5',
    name: 'Industrial Control Systems (ICS) Cybersecurity',
    subdomains: [
        {
            id: '5-1',
            title: 'Industrial Control Systems (ICS) Protection',
            objective: 'To ensure the appropriate and effective cybersecurity management of Industrial Controls Systems and Operational Technology (ICS/OT) to protect the confidentiality, integrity and availability of the organization\'s assets against cyber attacks in line with the organization\'s cybersecurity strategy and related and applicable local and international laws and regulations.',
            controls: [
                {
                    id: '5-1-1',
                    description: 'Cybersecurity requirements related to Industrial Controls Systems and Operational Technology (ICS/OT) must be defined, documented and approved.',
                    implementationGuidelines: [
                        'Develop and document cybersecurity policy for ICS/OT in the organization, including requirements for the protection of industrial production networks, protection of ICS and restrict access, and Cybersecurity Incident Management.',
                        'Support the organization\'s policy by the Executive Management.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of the protection of ICS/OT (e.g., electronic copy or official hard copy).',
                        'Formal approval by the head of the organization or his/her deputy on the policy (e.g., via the organization’s official e-mail, paper or electronic signature).',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15',
                    history: [
                      {
                        version: '1.0',
                        date: '2022-01-10',
                        changes: [
                          'First version of the ICS/OT cybersecurity control framework.',
                          'Focused on foundational policy and documentation.'
                        ]
                      }
                    ]
                },
                {
                    id: '5-1-2',
                    description: 'Strict physical and virtual segmentation when connecting industrial production networks to other networks within the organization (e.g., corporate network).',
                    implementationGuidelines: [
                        'Ensure that the approved documented policy includes the requirements of restriction and physical and logical segregation when connecting industrial production networks (ICS/OT) with other networks.',
                        'Isolate industrial production networks (ICS/OT) from other networks physically or logically based on cyber risks.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of the protection of ICS/OT.',
                        'The design plan of the industrial production network indicating how it connects to the organization\'s corporate network.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                 {
                    id: '5-1-3',
                    description: 'Isolation of Safety Instrumental Systems (SIS).',
                    implementationGuidelines: [
                        'Ensure that the approved documented policy includes requirements for the isolation of Safety Instrumented System.',
                        'Identify and assess the cyber risks associated with connecting Safety Instrumented Systems with other systems.',
                        'Isolate Safety Instrumented Systems from other systems based on physical/logical isolation based on cyber risks and provider guidelines.',
                    ],
                    expectedDeliverables: [
                        'Cybersecurity policy that covers the requirements of the protection of ICS/OT.',
                        'Design plan of the approved Safety Instrumented Systems network.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-1-4',
                    description: 'A comprehensive and accurate inventory of all ICS/OT assets must be maintained.',
                    implementationGuidelines: [
                        'Use passive network discovery tools designed for OT environments to identify and inventory all connected devices.',
                        'The inventory should include details such as device type, vendor, model, firmware version, and network location.',
                        'The inventory must be reviewed and updated at least quarterly.',
                    ],
                    expectedDeliverables: [
                        'ICS/OT asset management procedure.',
                        'A complete and up-to-date ICS/OT asset inventory.',
                        'Reports from asset discovery tools.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-1-5',
                    description: 'Cybersecurity requirements for the organization\'s external web applications must be defined, documented, and implemented to protect against cyber risks.',
                    implementationGuidelines: [
                        'Implement a Web Application Firewall (WAF).',
                        'Utilize a multi-tier architecture to segregate application layers.',
                        'Enforce the use of secure protocols, such as HTTPS, for all web traffic.',
                        'Adhere to secure application development and update standards, including regular testing.',
                        'Define and communicate a secure user usage policy for web applications.',
                        'Implement Multi-Factor Authentication (MFA) for user access to external applications.',
                        'Conduct regular vulnerability assessments and penetration testing for web applications.',
                        'Perform regular backups of web applications and data, storing them in secure locations.',
                        'Continuously screen for and close unnecessary open ports, services, processes, and unused protocols.',
                    ],
                    expectedDeliverables: [
                        'Web Application Security Policy document.',
                        'Web Application Firewall (WAF) configuration and rule set documentation.',
                        'Network architecture diagrams illustrating the multi-tier setup.',
                        'Secure software development lifecycle (SDLC) documentation.',
                        'Vulnerability assessment and penetration testing reports.',
                        'Backup policy and evidence of successful backup and restoration tests.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-21',
                },
            ]
        },
        {
            id: '5-2',
            title: 'ICS Architecture and Segmentation',
            objective: 'To protect ICS/OT networks through robust network architecture and segmentation.',
            controls: [
                {
                    id: '5-2-1',
                    description: 'A detailed network architecture diagram of the ICS environment must be maintained.',
                    implementationGuidelines: [
                        'The diagram should show all devices, network segments, and data flows.',
                        'It should be updated regularly as part of the change management process.',
                        'The diagram must clearly identify trust zones and conduits.',
                    ],
                    expectedDeliverables: [
                        'Up-to-date ICS network architecture diagram.',
                        'Change management records related to network changes.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-2-2',
                    description: 'The ICS network must be segmented from the corporate IT network using a Demilitarized Zone (DMZ).',
                    implementationGuidelines: [
                        'Implement firewalls to create a DMZ between the IT and OT networks.',
                        'All communication between IT and OT must pass through the DMZ.',
                        'Strictly limit the protocols and services allowed to cross the IT/OT boundary.',
                    ],
                    expectedDeliverables: [
                        'Network diagrams showing the IT/OT DMZ.',
                        'Firewall rule sets for the IT/OT boundary.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-2-3',
                    description: 'Remote access to the ICS network must be strictly controlled and monitored.',
                    implementationGuidelines: [
                        'Prohibit direct remote access from the internet to the ICS network.',
                        'Implement multi-factor authentication for all remote access.',
                        'All remote sessions must be logged and monitored.',
                    ],
                    expectedDeliverables: [
                        'Remote access policy for ICS.',
                        'Configuration of remote access solutions (e.g., VPN, jump host).',
                        'Logs of remote access sessions.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-2-4',
                    description: 'The use of wireless technologies within the ICS/OT environment must be strictly controlled.',
                    implementationGuidelines: [
                        'Develop a policy that prohibits unauthorized wireless access points in the OT network.',
                        'If wireless is required for operational reasons, use strong encryption (e.g., WPA3) and authentication mechanisms.',
                        'Regularly scan for rogue wireless devices in the OT environment.',
                    ],
                    expectedDeliverables: [
                        'Wireless security policy for ICS/OT environments.',
                        'Configuration standards for secure wireless deployments in OT.',
                        'Reports from rogue access point detection scans.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '5-3',
            title: 'ICS Monitoring and Incident Response',
            objective: 'To detect and respond to cybersecurity incidents within the ICS/OT environment.',
            controls: [
                {
                    id: '5-3-1',
                    description: 'A specialized incident response plan for the ICS environment must be developed and maintained.',
                    implementationGuidelines: [
                        'The ICS incident response plan should align with the corporate plan but include specific procedures for OT systems.',
                        'The plan must prioritize safety and operational continuity.',
                        'Define clear criteria for system shutdown and restart.',
                    ],
                    expectedDeliverables: [
                        'Documented ICS incident response plan.',
                        'Playbooks for specific ICS-related threats (e.g., ransomware, PLC malware).',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-3-2',
                    description: 'The ICS network must be monitored for anomalous behavior and potential security incidents.',
                    implementationGuidelines: [
                        'Deploy network monitoring tools that are specifically designed for ICS protocols.',
                        'Establish a baseline of normal network traffic and alert on deviations.',
                        'Integrate alerts into the organization\'s central security monitoring system (SIEM).',
                    ],
                    expectedDeliverables: [
                        'Configuration of ICS network monitoring tools.',
                        'Baseline traffic analysis reports.',
                        'Alerts generated from the ICS monitoring system.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-3-3',
                    description: 'Forensic capabilities must be established to collect and analyze data from ICS/OT systems following an incident.',
                    implementationGuidelines: [
                        'Identify tools and procedures for acquiring data from ICS devices (e.g., PLCs, HMIs) in a forensically sound manner.',
                        'Train incident responders on ICS-specific forensic techniques.',
                        'Establish procedures for preserving evidence while maintaining operational safety.',
                    ],
                    expectedDeliverables: [
                        'ICS forensic investigation procedures.',
                        'Inventory of forensic tools for ICS environments.',
                        'Training records for incident responders.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-3-4',
                    description: 'Integrity monitoring and change detection must be implemented for critical files and configurations on ICS/OT systems.',
                    implementationGuidelines: [
                        'Deploy tools to monitor for unauthorized changes to PLC logic, HMI configurations, and other critical system files.',
                        'Establish a baseline of known-good configurations.',
                        'Generate alerts for any unauthorized modifications and investigate them immediately.',
                    ],
                    expectedDeliverables: [
                        'Configuration of file integrity monitoring or change detection tools.',
                        'A documented baseline of critical ICS/OT configurations.',
                        'Alerts and investigation reports related to unauthorized changes.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
            ]
        },
        {
            id: '5-4',
            title: 'ICS-Specific Security Training and Awareness',
            objective: 'To ensure that personnel operating and maintaining ICS/OT systems have the specialized knowledge to do so securely.',
            controls: [
                {
                    id: '5-4-1',
                    description: 'Personnel with responsibilities for ICS/OT systems, including operators and engineers, must receive specialized cybersecurity training.',
                    implementationGuidelines: [
                        'Develop a training program covering ICS-specific threats, vulnerabilities, and secure operating procedures.',
                        'Training should address the unique safety and operational considerations of the OT environment.',
                        'Include hands-on exercises using a simulated or testbed ICS environment.',
                    ],
                    expectedDeliverables: [
                        'ICS cybersecurity training program curriculum and materials.',
                        'Training records for all relevant personnel.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                },
                {
                    id: '5-4-2',
                    description: 'Regular security awareness briefings that address current threats to ICS/OT environments must be conducted.',
                    implementationGuidelines: [
                        'Communicate information about new threats and vulnerabilities relevant to the organization\'s ICS.',
                        'Reinforce policies and procedures for remote access, use of removable media, and incident reporting in the OT context.',
                        'Use lessons learned from internal or industry-wide incidents to inform awareness briefings.',
                    ],
                    expectedDeliverables: [
                        'Schedule and materials for ICS security awareness briefings.',
                        'Attendance records for awareness sessions.',
                    ],
                    version: '1.1',
                    lastUpdated: '2024-05-15'
                }
            ]
        }
    ]
  }
];