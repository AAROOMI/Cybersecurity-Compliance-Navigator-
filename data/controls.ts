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
          }
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
                id: '1-5-3-1',
                description: 'The cybersecurity risk assessment procedures must be implemented at least in the following cases: Early stages of technology projects.',
                implementationGuidelines: [
                    'Integrate risk assessment into the project initiation phase.',
                    'Ensure project managers are trained to identify when a risk assessment is required.',
                    'Document the risk assessment results as a formal project deliverable.',
                ],
                expectedDeliverables: [
                    'Project management lifecycle documentation showing risk assessment phase.',
                    'Completed risk assessment reports for new technology projects.',
                ],
                version: '1.0',
                lastUpdated: '2024-07-25'
            },
            {
                id: '1-5-3-2',
                description: 'Before making major changes to technology infrastructure.',
                implementationGuidelines: [
                    'Define "major change" in the change management policy to trigger a risk assessment.',
                    'Ensure the Change Advisory Board (CAB) verifies that a risk assessment has been completed before approving major changes.',
                    'Analyze the impact of the change on the existing security posture.',
                ],
                expectedDeliverables: [
                    'Change Management policy defining triggers for risk assessment.',
                    'Change request forms with a dedicated section for risk assessment results.',
                    'CAB meeting minutes showing review of risk assessments.',
                ],
                version: '1.0',
                lastUpdated: '2024-07-25'
            },
            {
                id: '1-5-3-3',
                description: 'During the planning phase of obtaining third party services.',
                implementationGuidelines: [
                    'Conduct due diligence and risk assessments on all potential vendors before signing contracts.',
                    'Evaluate the vendor\'s security posture and their ability to meet the organization\'s security requirements.',
                    'The scope of the assessment should be proportional to the risk of the service being procured.',
                ],
                expectedDeliverables: [
                    'Third-party risk management policy.',
                    'Completed vendor security questionnaires and risk assessment reports.',
                    'Contract clauses reflecting risk mitigation requirements.',
                ],
                version: '1.0',
                lastUpdated: '2024-07-25'
            },
            {
                id: '1-5-3-4',
                description: 'During the planning phase and before going live for new technology services and products.',
                implementationGuidelines: [
                    'Perform a final risk assessment before a new service is deployed to production.',
                    'This assessment should validate that all identified risks have been mitigated to an acceptable level.',
                    'Obtain formal sign-off from the risk owner before go-live.',
                ],
                expectedDeliverables: [
                    'Go-live checklist that includes a final risk assessment step.',
                    'Pre-production risk assessment reports.',
                    'Documented risk acceptance from the business owner.',
                ],
                version: '1.0',
                lastUpdated: '2024-07-25'
            },
            {
                id: '1-5-4',
                description: 'The cybersecurity risk management methodology and procedures must be reviewed periodically according to planned intervals or upon changes to related laws and regulations. Changes and reviews must be approved and documented.',
                implementationGuidelines: [
                    'Establish an annual review cycle for the risk management framework.',
                    'Monitor legal and regulatory changes that may impact the risk management process.',
                    'Ensure all changes to the methodology are approved by the cybersecurity steering committee.',
                ],
                expectedDeliverables: [
                    'Documented annual review schedule for risk management framework.',
                    'Minutes of meetings where the risk methodology was reviewed.',
                    'Updated risk management methodology document with version history.',
                ],
                version: '1.1',
                lastUpdated: '2024-05-15'
            },
            {
                id: '1-5-5',
                description: 'A formal risk escalation procedure must be defined, documented, and implemented to ensure that significant cybersecurity risks are communicated to the appropriate management levels in a timely manner.',
                implementationGuidelines: [
                    'Define specific triggers and thresholds for escalation (e.g., risks rated \'High\' or \'Critical\').',
                    'Establish a clear escalation path (e.g., from Analyst -> CISO -> Steering Committee -> Board).',
                    'Define timelines for each step of the escalation process.',
                ],
                expectedDeliverables: [
                    'A documented and approved risk escalation procedure.',
                    'Evidence of escalated risks (e.g., meeting minutes, reports to senior management).',
                ],
                version: '1.0',
                lastUpdated: '2024-07-22'
            },
        ]
      },
      {
        id: '1-6',
        title: 'Cybersecurity in Information Technology Projects',
        objective: 'To ensure cybersecurity is integrated into the entire lifecycle of technology projects and changes.',
        controls: [
          {
            id: '1-6-1',
            description: 'Cybersecurity requirements must be included in project and asset (information/ technology) change management methodology and procedures to identify and manage cybersecurity risks as part of project management lifecycle. The cybersecurity requirements must be a key part of the overall requirements of technology projects.',
            implementationGuidelines: [
              'Integrate a security review gate into the formal project management lifecycle.',
              'Develop a checklist of security requirements to be considered for all new projects.',
            ],
            expectedDeliverables: [
              'Project Management Lifecycle documentation with security gates.',
              'Standard project security requirements checklist.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-2-1',
            description: 'The cybersecurity requirements in project and assets (information/technology) change management must include at least the following: Vulnerability assessment and remediation.',
            implementationGuidelines: [
              'Mandate vulnerability scanning of new systems before they are deployed to production.',
              'Ensure that critical and high vulnerabilities are remediated before go-live.',
            ],
            expectedDeliverables: [
              'Pre-production vulnerability scan reports.',
              'Documented evidence of vulnerability remediation.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-2-2',
            description: 'Conducting a configurations’ review, secure configuration and hardening and patching before changes or going live for technology projects.',
            implementationGuidelines: [
              'Verify that all new systems comply with the organization\'s secure configuration baselines (hardening standards).',
              'Ensure all applicable security patches are installed before deployment.',
            ],
            expectedDeliverables: [
              'Configuration compliance scan reports for new systems.',
              'Patch status reports for pre-production environments.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-3-1',
            description: 'The cybersecurity requirements related to software and application development projects must include at least the following: Using secure coding standards.',
            implementationGuidelines: [
              'Adopt and enforce secure coding standards (e.g., OWASP Top 10) for all in-house development.',
              'Provide developers with regular training on secure coding practices.',
            ],
            expectedDeliverables: [
              'Documented secure coding standards.',
              'Developer training records.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-3-2',
            description: 'Using trusted and licensed sources for software development tools and libraries.',
            implementationGuidelines: [
              'Maintain a list of approved software development tools and libraries.',
              'Implement a process for reviewing and approving new third-party components.',
              'Use Software Composition Analysis (SCA) tools to identify vulnerabilities in open-source libraries.',
            ],
            expectedDeliverables: [
              'Approved software and library list.',
              'SCA scan reports.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-3-3',
            description: 'Conducting compliance test for software against the defined organizational cybersecurity requirements.',
            implementationGuidelines: [
              'Perform security testing, including Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST), as part of the CI/CD pipeline.',
              'Conduct manual penetration testing for high-risk applications.',
            ],
            expectedDeliverables: [
              'SAST and DAST reports.',
              'Penetration test reports.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-3-4',
            description: 'Secure integration between software components.',
            implementationGuidelines: [
              'Ensure all communication between microservices and components is authenticated and encrypted.',
              'Implement API security best practices, including input validation and rate limiting.',
            ],
            expectedDeliverables: [
              'Application architecture diagrams showing secure integrations.',
              'API security test results.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-3-5',
            description: 'Conducting a configurations’ review, secure configuration and hardening and patching before going live for software products.',
            implementationGuidelines: [
              'Review the configuration of the application and its underlying infrastructure before deployment.',
              'Ensure that all components meet hardening standards and are fully patched.',
            ],
            expectedDeliverables: [
              'Pre-deployment configuration review checklist.',
              'Sign-off from the security team before go-live.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-6-4',
            description: 'The cybersecurity requirements in project management must be reviewed periodically.',
            implementationGuidelines: [
              'Conduct an annual review of the security requirements within the project management lifecycle.',
              'Update requirements based on new threats, technologies, and lessons learned.',
            ],
            expectedDeliverables: [
              'Annual review report of the project management security gates.',
              'Updated project security documentation.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
        ]
      },
      {
        id: '1-7',
        title: 'Cybersecurity Regulatory Compliance',
        objective: 'To ensure compliance with legal, statutory, regulatory, and contractual requirements related to cybersecurity.',
        controls: [
          {
            id: '1-7-1',
            description: 'The organization must comply with related national cybersecurity laws and regulations.',
            implementationGuidelines: [
              'Maintain a register of all relevant laws and regulations (e.g., NCA ECC, PDPL).',
              'Conduct regular gap assessments against these regulations.',
            ],
            expectedDeliverables: [
              'A register of applicable laws and regulations.',
              'Compliance gap assessment reports.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-7-2',
            description: 'The organization must comply with any nationally-approved international agreements and commitments related to cybersecurity.',
            implementationGuidelines: [
              'Identify and document any international agreements relevant to the organization\'s sector.',
              'Incorporate the requirements of these agreements into the organization\'s policies and procedures.',
            ],
            expectedDeliverables: [
              'List of applicable international agreements.',
              'Evidence of compliance with specific requirements from those agreements.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
        ]
      },
      {
        id: '1-8',
        title: 'Cybersecurity Periodical Assessment and Audit',
        objective: 'To ensure the independent review of cybersecurity controls and compliance to provide assurance to management.',
        controls: [
          {
            id: '1-8-1',
            description: 'Cybersecurity reviews must be conducted periodically by the cybersecurity function in the organization to assess the compliance with the cybersecurity controls in the organization.',
            implementationGuidelines: [
              'Establish a program of self-assessments to be conducted by the cybersecurity team.',
              'These reviews should be conducted at least annually and cover all domains of the cybersecurity framework.',
            ],
            expectedDeliverables: [
              'Internal compliance review schedule.',
              'Completed self-assessment reports.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-8-2',
            description: 'Cybersecurity audits and reviews must be conducted by independent parties outside the cybersecurity function (e.g., Internal Audit function) to assess the compliance with the cybersecurity controls in the organization. Audits and reviews must be conducted independently, while ensuring that this does not result in a conflict of interest, as per the Generally Accepted Auditing Standards (GAAS), and related laws and regulations.',
            implementationGuidelines: [
              'Develop a multi-year internal audit plan for cybersecurity, to be executed by the Internal Audit department or a qualified third party.',
              'Ensure the audit function has the necessary skills and independence to perform the audit.',
            ],
            expectedDeliverables: [
              'Internal audit charter and plan for cybersecurity.',
              'Completed internal audit reports.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-8-3',
            description: 'Results from the cybersecurity audits and reviews must be documented and presented to the cybersecurity steering committee and Authorizing Official. Results must include the audit/review scope, observations, recommendations and remediation plans.',
            implementationGuidelines: [
              'Formalize the process for reporting all audit findings to senior management.',
              'Develop a formal management response for each finding.',
              'Track all remediation plans to completion.',
            ],
            expectedDeliverables: [
              'Audit reports presented to the steering committee.',
              'Documented management responses and remediation plans.',
              'Status reports on the tracking of audit findings.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
        ]
      },
      {
        id: '1-9',
        title: 'Cybersecurity in Human Resources',
        objective: 'To ensure that personnel understand and are suitable for their cybersecurity responsibilities.',
        controls: [
          {
            id: '1-9-1',
            description: 'Personnel cybersecurity requirements (prior to employment, during employment and after termination/separation) must be defined, documented and approved.',
            implementationGuidelines: [
              'Develop a comprehensive HR security policy covering the entire employee lifecycle.',
              'Ensure the policy is approved by senior management and communicated to all relevant parties.',
            ],
            expectedDeliverables: [
              'Approved HR Security Policy.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-2',
            description: 'The personnel cybersecurity requirements must be implemented.',
            implementationGuidelines: [
              'Integrate the HR security requirements into standard HR processes.',
              'Provide training to HR staff on their security responsibilities.',
            ],
            expectedDeliverables: [
              'HR process documentation reflecting security requirements.',
              'Training records for HR staff.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-3-1',
            description: 'The personnel cybersecurity requirements prior to employment must include at least the following: Inclusion of personnel cybersecurity responsibilities and non-disclosure clauses (covering the cybersecurity requirements during employment and after termination/separation) in employment contracts.',
            implementationGuidelines: [
              'Work with the legal department to ensure all employment contracts include clauses on confidentiality, acceptable use, and cybersecurity responsibilities.',
            ],
            expectedDeliverables: [
              'Standard employment contract template with cybersecurity clauses.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-3-2',
            description: 'Screening or vetting candidates of cybersecurity and critical/privileged positions.',
            implementationGuidelines: [
              'Define and document the background screening requirements for different role sensitivity levels.',
              'Conduct background checks in accordance with local laws and regulations.',
            ],
            expectedDeliverables: [
              'Background screening policy.',
              'Evidence of completed background checks for sensitive roles.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-4-1',
            description: 'The personnel Cybersecurity requirements during employment must include at least the following: Cybersecurity awareness (during on-boarding and during employment).',
            implementationGuidelines: [
              'All new hires must complete mandatory cybersecurity awareness training as part of their onboarding.',
              'All employees must complete annual refresher training.',
            ],
            expectedDeliverables: [
              'Onboarding checklist including security awareness training.',
              'Annual training completion records.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-4-2',
            description: 'Implementation of and compliance with the cybersecurity requirements as per the organizational cybersecurity policies and procedures.',
            implementationGuidelines: [
              'Require all employees to sign an acknowledgment of the acceptable use policy annually.',
              'Implement a disciplinary process for violations of cybersecurity policies.',
            ],
            expectedDeliverables: [
              'Signed policy acknowledgment forms.',
              'Documented disciplinary process.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-5',
            description: 'Personnel access to information and technology assets must be reviewed and removed immediately upon termination/separation.',
            implementationGuidelines: [
              'Develop a formal employee termination checklist that includes immediate revocation of all physical and logical access.',
              'Ensure HR and IT have a clear process for communicating terminations.',
            ],
            expectedDeliverables: [
              'Employee termination checklist.',
              'Records showing timely deactivation of accounts for terminated employees.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-9-6',
            description: 'Personnel cybersecurity requirements must be reviewed periodically.',
            implementationGuidelines: [
              'Conduct an annual review of the HR security policy and related procedures.',
              'Update the policy to reflect changes in threats, technology, and business processes.',
            ],
            expectedDeliverables: [
              'Annual HR security policy review report.',
              'Updated HR security policy document.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
        ]
      },
      {
        id: '1-10',
        title: 'Cybersecurity Awareness and Training Program',
        objective: 'To ensure that all personnel are aware of their cybersecurity responsibilities.',
        controls: [
          {
            id: '1-10-1',
            description: 'A cybersecurity awareness program must be developed and approved. The program must be conducted periodically through multiple channels to strengthen the awareness about cybersecurity, cyber threats and risks, and to build a positive cybersecurity awareness culture.',
            implementationGuidelines: [
              'Develop an annual awareness plan that includes different activities like training, phishing simulations, newsletters, and posters.',
              'The program should be approved by the cybersecurity steering committee.',
            ],
            expectedDeliverables: [
              'Documented cybersecurity awareness program plan.',
              'Approval of the plan from management.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-2',
            description: 'The cybersecurity awareness program must be implemented.',
            implementationGuidelines: [
              'Execute the activities defined in the awareness plan.',
              'Track participation and completion rates for all training activities.',
            ],
            expectedDeliverables: [
              'Evidence of program execution (e.g., newsletters, training records).',
              'Metrics on program effectiveness.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-3-1',
            description: 'The cybersecurity awareness program must cover the latest cyber threats and how to protect against them, and must include at least the following subjects: Secure handling of email services, especially phishing emails.',
            implementationGuidelines: [
              'Conduct regular phishing simulation campaigns to test and train employees.',
              'Provide immediate feedback to employees who click on phishing links.',
            ],
            expectedDeliverables: [
              'Phishing simulation campaign schedule and reports.',
              'Examples of training materials on phishing.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-3-2',
            description: 'Secure handling of mobile devices and storage media.',
            implementationGuidelines: [
              'Provide training on the secure use of mobile devices, including requirements for passcodes and encryption.',
              'Educate users on the risks of using untrusted USB drives.',
            ],
            expectedDeliverables: [
              'Training modules on mobile and removable media security.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-3-3',
            description: 'Secure Internet browsing.',
            implementationGuidelines: [
              'Train users to identify and avoid malicious websites.',
              'Educate users on the risks of downloading software from untrusted sources.',
            ],
            expectedDeliverables: [
              'Training materials on safe browsing habits.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-3-4',
            description: 'Secure use of social media.',
            implementationGuidelines: [
              'Provide guidance on protecting personal and company information on social media.',
              'Train employees to recognize social engineering attacks conducted via social media.',
            ],
            expectedDeliverables: [
              'Social media security guidelines for employees.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-4-1',
            description: 'Essential and customized (i.e., tailored to job functions as it relates to cybersecurity) training and access to professional skillsets must be made available to personnel working directly on tasks related to cybersecurity including: Cybersecurity function’s personnel.',
            implementationGuidelines: [
              'Develop a training plan for the cybersecurity team to ensure their skills remain current.',
              'Support certifications and attendance at industry conferences.',
            ],
            expectedDeliverables: [
              'Training and development plan for the cybersecurity team.',
              'Records of completed training and certifications.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-4-2',
            description: 'Personnel working on software/application development. and information and technology assets operations.',
            implementationGuidelines: [
              'Provide role-based training for developers (secure coding), system administrators (secure configuration), and network engineers (network security).',
            ],
            expectedDeliverables: [
              'Role-based training curriculum.',
              'Training records for technical staff.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-4-3',
            description: 'Executive and supervisory positions.',
            implementationGuidelines: [
              'Provide tailored security briefings to senior management on cybersecurity risks and their role in managing them.',
            ],
            expectedDeliverables: [
              'Materials from executive security briefings.',
              'Attendance records for management sessions.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
          {
            id: '1-10-5',
            description: 'The implementation of the cybersecurity awareness program must be reviewed periodically.',
            implementationGuidelines: [
              'Conduct an annual review of the awareness program to assess its effectiveness.',
              'Use metrics such as phishing click rates and training completion rates to measure success.',
            ],
            expectedDeliverables: [
              'Annual awareness program review report.',
              'Updated awareness plan based on the review.',
            ],
            version: '1.0',
            lastUpdated: '2024-07-25',
          },
        ]
      }
    ],
  },
  {
    id: '2',
    name: 'Cybersecurity Defense',
    subdomains: [
        {
            id: '2-1',
            title: 'Asset Management',
            objective: 'To ensure an accurate inventory of all assets to support cybersecurity operations.',
            controls: [
                {
                    id: '2-1-1',
                    description: 'Cybersecurity requirements for managing information and technology assets must be defined, documented and approved.',
                    implementationGuidelines: [
                        'Develop a formal asset management policy that defines asset types, ownership, and classification.',
                    ],
                    expectedDeliverables: [
                        'Approved asset management policy document.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
                {
                    id: '2-1-2',
                    description: 'The cybersecurity requirements for managing information and technology assets must be implemented.',
                    implementationGuidelines: [
                        'Implement an asset inventory system to track all hardware and software assets.',
                        'Ensure the inventory is automatically updated where possible.',
                    ],
                    expectedDeliverables: [
                        'A comprehensive and up-to-date asset inventory.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
                {
                    id: '2-1-3',
                    description: 'Acceptable use policy of information and technology assets must be defined, documented and approved.',
                    implementationGuidelines: [
                        'Develop an acceptable use policy that defines rules for the use of company assets.',
                        'Communicate the policy to all employees and require acknowledgment.',
                    ],
                    expectedDeliverables: [
                        'Approved Acceptable Use Policy.',
                        'Signed acknowledgment forms from employees.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
                {
                    id: '2-1-4',
                    description: 'Acceptable use policy of information and technology assets must be implemented.',
                    implementationGuidelines: [
                        'Use technical controls to enforce the acceptable use policy (e.g., web filtering, application control).',
                        'Monitor for violations of the policy.',
                    ],
                    expectedDeliverables: [
                        'Configuration of technical enforcement controls.',
                        'Reports on policy violations.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
                {
                    id: '2-1-5',
                    description: 'Information and technology assets must be classified, labeled and handled as per related law and regulatory requirements.',
                    implementationGuidelines: [
                        'Implement a data classification scheme (e.g., Public, Internal, Confidential).',
                        'Train employees on how to handle data based on its classification.',
                        'Use technical controls to enforce data handling rules.',
                    ],
                    expectedDeliverables: [
                        'Data classification policy.',
                        'Data handling guidelines.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
                {
                    id: '2-1-6',
                    description: 'The cybersecurity requirements for managing information and technology assets must be reviewed periodically.',
                    implementationGuidelines: [
                        'Conduct an annual review of the asset management policy and procedures.',
                        'Perform periodic audits of the asset inventory to ensure accuracy.',
                    ],
                    expectedDeliverables: [
                        'Annual review report of the asset management program.',
                        'Asset inventory audit reports.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
                 {
                    id: '2-1-7',
                    description: 'A formal process must be defined and implemented for the secure disposal of information and technology assets.',
                    implementationGuidelines: [
                        'Develop a media sanitization and hardware disposal procedure.',
                        'Ensure all storage media are securely wiped or physically destroyed before disposal.',
                    ],
                    expectedDeliverables: [
                        'Secure asset disposal procedure.',
                        'Certificates of data destruction from disposal vendors.',
                    ],
                    version: '1.0',
                    lastUpdated: '2024-07-26',
                },
            ]
        },
        {
            id: '2-2',
            title: 'Identity and Access Management',
            objective: 'To ensure secure and restricted access to information and technology assets.',
            controls: [
                 {
                    id: '2-2-1',
                    description: 'Cybersecurity requirements for identity and access management must be defined, documented and approved.',
                    implementationGuidelines: ['Develop a formal policy covering user registration, access provisioning, password management, and access reviews.'],
                    expectedDeliverables: ['Approved Identity and Access Management Policy.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-2',
                    description: 'The cybersecurity requirements for identity and access management must be implemented.',
                    implementationGuidelines: ['Implement technical controls to enforce the IAM policy.', 'Automate user provisioning and de-provisioning where possible.'],
                    expectedDeliverables: ['IAM system configurations.', 'Process documentation for access requests.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-3-1',
                    description: 'The cybersecurity requirements for identity and access management must include at least the following: User authentication based on username and password.',
                    implementationGuidelines: ['Enforce strong password complexity and history requirements.', 'Implement account lockout mechanisms after a set number of failed login attempts.'],
                    expectedDeliverables: ['Password policy documentation.', 'System configurations showing password and lockout settings.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-3-2',
                    description: 'Multi-Factor authentication for remote access.',
                    implementationGuidelines: ['Implement MFA for all remote access methods, including VPN and cloud services.', 'Provide users with a choice of MFA factors where possible (e.g., app, SMS).'],
                    expectedDeliverables: ['MFA policy.', 'Configuration of VPN and cloud services to require MFA.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-3-3',
                    description: 'User authorization based on identity and access control principles: Need-to-Know, and Need-to-Use, Least Privilege and Segregation of Duties.',
                    implementationGuidelines: ['Implement role-based access control (RBAC) where possible.', 'Ensure access requests are approved by the data or system owner.'],
                    expectedDeliverables: ['RBAC matrix.', 'Approved access request forms.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-3-4',
                    description: 'Privileged Access Management.',
                    implementationGuidelines: ['Implement a Privileged Access Management (PAM) solution to vault and manage administrator credentials.', 'Enforce session recording for all privileged access.'],
                    expectedDeliverables: ['PAM policy.', 'PAM solution configuration and sample session recordings.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-3-5',
                    description: 'Periodic review of users’ identities and access rights.',
                    implementationGuidelines: ['Conduct quarterly access reviews for all users and systems.', 'Ensure that system owners certify the access rights of their users.'],
                    expectedDeliverables: ['Access review procedure.', 'Completed access review certification reports.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
                {
                    id: '2-2-4',
                    description: 'The implementation of the cybersecurity requirements for identity and access management must be reviewed periodically.',
                    implementationGuidelines: ['Conduct an annual review of the IAM policy and procedures.', 'Perform periodic audits of access controls to ensure they are effective.'],
                    expectedDeliverables: ['Annual review report of the IAM program.', 'IAM audit reports.'],
                    version: '1.0',
                    lastUpdated: '2024-07-26'
                },
            ]
        },
        {
          id: '2-3',
          title: 'Data Protection & Cryptography',
          objective: 'To protect the confidentiality, integrity, and availability of data at rest and in transit.',
          controls: Array.from({ length: 15 }, (_, i) => ({
              id: `2-3-${i + 1}`,
              description: `Control for Data Protection & Cryptography, item ${i + 1}. This involves establishing cryptographic standards, data leakage prevention, and secure data handling procedures.`,
              implementationGuidelines: [
                  'Define and implement an organizational cryptography policy.',
                  `Implement Data Loss Prevention (DLP) for critical data channels (item ${i + 1}).`,
                  `Ensure data at rest is encrypted on all critical systems and removable media (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'Cryptography Policy Document.',
                  `DLP configuration report for item ${i + 1}.`,
                  `Encryption status report for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-4',
          title: 'Endpoint Security',
          objective: 'To secure all endpoints (servers, workstations, mobile devices) from threats.',
          controls: Array.from({ length: 12 }, (_, i) => ({
              id: `2-4-${i + 1}`,
              description: `Control for Endpoint Security, item ${i + 1}. This includes anti-malware, host-based firewalls, and device hardening.`,
              implementationGuidelines: [
                  'Deploy and manage a centrally managed anti-malware solution on all endpoints.',
                  `Enforce host-based firewall rules on all servers and workstations (item ${i + 1}).`,
                  `Implement secure configuration baselines for all endpoint operating systems (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'Anti-malware solution deployment report.',
                  `Firewall policy documentation for item ${i + 1}.`,
                  `Endpoint hardening standard for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-5',
          title: 'Network Security',
          objective: 'To protect the organization\'s network infrastructure and segregate critical systems.',
          controls: Array.from({ length: 15 }, (_, i) => ({
              id: `2-5-${i + 1}`,
              description: `Control for Network Security, item ${i + 1}. This covers firewalls, intrusion detection/prevention, network segmentation, and secure wireless access.`,
              implementationGuidelines: [
                  'Implement and maintain firewalls at the network perimeter and internal segments.',
                  `Deploy an Intrusion Prevention System (IPS) on critical network segments (item ${i + 1}).`,
                  `Implement network segmentation to isolate sensitive environments (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'Firewall rule review reports.',
                  `IPS alert and event logs for item ${i + 1}.`,
                  `Network architecture diagram showing segmentation for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-6',
          title: 'Vulnerability Management',
          objective: 'To identify, assess, and remediate security vulnerabilities in a timely manner.',
          controls: Array.from({ length: 8 }, (_, i) => ({
              id: `2-6-${i + 1}`,
              description: `Control for Vulnerability Management, item ${i + 1}. This includes vulnerability scanning, patch management, and penetration testing.`,
              implementationGuidelines: [
                  'Establish a formal patch management process with defined SLAs for different severity levels.',
                  `Conduct regular authenticated vulnerability scans of all internal and external assets (item ${i + 1}).`,
                  `Perform annual external and internal penetration tests (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'Patch Management Policy and Procedure.',
                  `Vulnerability scan reports for item ${i + 1}.`,
                  `Penetration test report for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-7',
          title: 'Logging & Monitoring',
          objective: 'To collect, analyze, and retain security logs to detect and respond to incidents.',
          controls: Array.from({ length: 10 }, (_, i) => ({
              id: `2-7-${i + 1}`,
              description: `Control for Logging & Monitoring, item ${i + 1}. This involves centralizing logs, establishing a SIEM, and defining monitoring use cases.`,
              implementationGuidelines: [
                  'Implement a centralized logging solution (e.g., SIEM) to collect logs from critical systems.',
                  `Define and implement security monitoring use cases to detect anomalous activity (item ${i + 1}).`,
                  `Ensure logs are retained for a minimum period as per regulatory requirements (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'SIEM architecture and configuration document.',
                  `Documentation of monitoring use cases for item ${i + 1}.`,
                  `Log retention policy for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-8',
          title: 'Email & Web Security',
          objective: 'To protect against threats originating from email and web browsing.',
          controls: Array.from({ length: 10 }, (_, i) => ({
              id: `2-8-${i + 1}`,
              description: `Control for Email & Web Security, item ${i + 1}. This covers email filtering, web content filtering, and DNS security.`,
              implementationGuidelines: [
                  'Implement a secure email gateway with anti-spam, anti-phishing, and anti-malware capabilities.',
                  `Deploy a web content filtering solution to block access to malicious and inappropriate websites (item ${i + 1}).`,
                  `Implement DNS filtering to block connections to known malicious domains (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'Email gateway configuration report.',
                  `Web filtering policy and block reports for item ${i + 1}.`,
                  `DNS security solution configuration for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-9',
          title: 'Physical Security',
          objective: 'To protect physical assets and facilities from unauthorized access and environmental hazards.',
          controls: Array.from({ length: 10 }, (_, i) => ({
              id: `2-9-${i + 1}`,
              description: `Control for Physical Security, item ${i + 1}. This includes access control to facilities, environmental controls, and visitor management.`,
              implementationGuidelines: [
                  'Implement physical access controls (e.g., card readers, biometrics) for sensitive areas like data centers.',
                  `Ensure data centers have appropriate environmental controls (HVAC, fire suppression) (item ${i + 1}).`,
                  `Establish and enforce a visitor management policy (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'Physical access control logs.',
                  `Environmental monitoring reports for item ${i + 1}.`,
                  `Visitor log book or system report for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        },
        {
          id: '2-10',
          title: 'Application Security',
          objective: 'To ensure that applications are developed and maintained securely throughout their lifecycle.',
          controls: Array.from({ length: 15 }, (_, i) => ({
              id: `2-10-${i + 1}`,
              description: `Control for Application Security, item ${i + 1}. This involves secure coding practices, application security testing, and protection of application infrastructure.`,
              implementationGuidelines: [
                  'Integrate Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST) into the SDLC.',
                  `Deploy a Web Application Firewall (WAF) to protect critical web applications (item ${i + 1}).`,
                  `Ensure secure configuration of application servers and databases (item ${i + 1}).`
              ],
              expectedDeliverables: [
                  'SAST/DAST scan reports.',
                  `WAF policy and block reports for item ${i + 1}.`,
                  `Hardening guides for application infrastructure for item ${i + 1}.`
              ],
              version: '1.0',
              lastUpdated: '2024-07-26',
          }))
        }
    ]
  },
  {
    id: '3',
    name: 'Cybersecurity Resilience',
    subdomains: [
      {
        id: '3-1',
        title: 'Business Continuity Management',
        objective: 'To ensure the continuity of critical business operations in the event of a disruption.',
        controls: Array.from({ length: 3 }, (_, i) => ({
            id: `3-1-${i + 1}`,
            description: `Control for Business Continuity Management, item ${i + 1}. This includes Business Impact Analysis (BIA), recovery strategies, and plan testing.`,
            implementationGuidelines: [
                'Conduct a Business Impact Analysis (BIA) to identify critical processes and recovery time objectives (RTOs).',
                `Develop and document a Business Continuity Plan (BCP) and Disaster Recovery (DR) plan (item ${i + 1}).`,
                `Test the BCP/DR plans at least annually (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'BIA report.',
                `BCP/DR plan documents for item ${i + 1}.`,
                `BCP/DR test report for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      },
      {
        id: '3-2',
        title: 'Incident Response & Management',
        objective: 'To prepare for, respond to, and recover from cybersecurity incidents.',
        controls: Array.from({ length: 3 }, (_, i) => ({
            id: `3-2-${i + 1}`,
            description: `Control for Incident Response & Management, item ${i + 1}. This involves incident response planning, team formation, and post-incident analysis.`,
            implementationGuidelines: [
                'Establish and maintain a formal Cyber Security Incident Response Plan (CSIRP).',
                `Form a dedicated Cyber Security Incident Response Team (CSIRT) with defined roles (item ${i + 1}).`,
                `Conduct post-incident reviews (lessons learned) after every major incident (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'CSIRP document.',
                `CSIRT charter and contact list for item ${i + 1}.`,
                `Post-incident review reports for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      }
    ]
  },
  {
    id: '4',
    name: 'Third-Party & Cloud Cybersecurity',
    subdomains: [
      {
        id: '4-1',
        title: 'Third-Party Security Management',
        objective: 'To manage cybersecurity risks associated with third-party vendors, suppliers, and partners.',
        controls: Array.from({ length: 7 }, (_, i) => ({
            id: `4-1-${i + 1}`,
            description: `Control for Third-Party Security Management, item ${i + 1}. This covers due diligence, contractual requirements, and ongoing monitoring.`,
            implementationGuidelines: [
                'Implement a third-party risk management program that includes security assessments before onboarding.',
                `Include cybersecurity requirements and right-to-audit clauses in all third-party contracts (item ${i + 1}).`,
                `Conduct periodic security reviews of critical third parties (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'Third-party risk management policy.',
                `Standard contract security addendum for item ${i + 1}.`,
                `Third-party assessment reports for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      },
      {
        id: '4-2',
        title: 'Cloud Security',
        objective: 'To ensure the secure adoption and use of cloud services.',
        controls: Array.from({ length: 6 }, (_, i) => ({
            id: `4-2-${i + 1}`,
            description: `Control for Cloud Security, item ${i + 1}. This includes cloud governance, secure configuration, and monitoring of cloud environments.`,
            implementationGuidelines: [
                'Develop a cloud security policy and a cloud adoption framework.',
                `Implement a Cloud Security Posture Management (CSPM) tool to monitor for misconfigurations (item ${i + 1}).`,
                `Ensure IAM policies in the cloud adhere to the principle of least privilege (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'Cloud security policy.',
                `CSPM tool reports for item ${i + 1}.`,
                `Cloud IAM role and policy review report for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      }
    ]
  },
  {
    id: '5',
    name: 'Industrial Control Systems (ICS) Cybersecurity',
    subdomains: [
      {
        id: '5-1',
        title: 'ICS Governance & Risk Management',
        objective: 'To establish governance and manage risks specific to Industrial Control Systems (ICS) and Operational Technology (OT) environments.',
        controls: Array.from({ length: 4 }, (_, i) => ({
            id: `5-1-${i + 1}`,
            description: `Control for ICS Governance & Risk Management, item ${i + 1}. This includes specific policies, risk assessments, and roles for ICS security.`,
            implementationGuidelines: [
                'Develop a specific cybersecurity policy for the ICS/OT environment.',
                `Conduct regular risk assessments focused on the ICS environment, considering physical and cyber threats (item ${i + 1}).`,
                `Define clear roles and responsibilities for ICS cybersecurity, bridging IT and OT teams (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'ICS/OT Cybersecurity Policy.',
                `ICS risk assessment report for item ${i + 1}.`,
                `ICS security roles and responsibilities matrix for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      },
      {
        id: '5-2',
        title: 'ICS Network & System Security',
        objective: 'To implement technical controls to protect ICS networks and systems.',
        controls: Array.from({ length: 6 }, (_, i) => ({
            id: `5-2-${i + 1}`,
            description: `Control for ICS Network & System Security, item ${i + 1}. This covers network segmentation, access control, and system hardening for ICS.`,
            implementationGuidelines: [
                'Implement strict network segmentation between IT and OT/ICS networks using a DMZ architecture.',
                `Apply application whitelisting on critical ICS workstations and servers (item ${i + 1}).`,
                `Restrict remote access to the ICS network and use multi-factor authentication where possible (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'Network diagram showing IT/OT segmentation.',
                `Application whitelisting policy and software inventory for item ${i + 1}.`,
                `Remote access logs and MFA configuration for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      },
      {
        id: '5-3',
        title: 'ICS Incident Response & Recovery',
        objective: 'To ensure the ability to respond to and recover from cybersecurity incidents in the ICS environment.',
        controls: Array.from({ length: 3 }, (_, i) => ({
            id: `5-3-${i + 1}`,
            description: `Control for ICS Incident Response & Recovery, item ${i + 1}. This involves tailored incident response plans and recovery procedures for ICS.`,
            implementationGuidelines: [
                'Develop an ICS-specific incident response plan that includes safety considerations.',
                `Establish procedures for creating and testing backups of critical ICS systems and configurations (item ${i + 1}).`,
                `Conduct annual incident response exercises that simulate attacks on the ICS environment (item ${i + 1}).`
            ],
            expectedDeliverables: [
                'ICS Incident Response Plan.',
                `ICS backup and recovery test results for item ${i + 1}.`,
                `ICS incident response drill report for item ${i + 1}.`
            ],
            version: '1.0',
            lastUpdated: '2024-07-26',
        }))
      }
    ]
  }
];
