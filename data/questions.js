// Forensic Readiness Assessment Questions
// Organized by 6 components

export function getQuestions() {
  return [
    // GOVERNANCE Component
    {
      id: 'gov-1',
      component: 'governance',
      category: 'Policy & Framework',
      question: 'Does your bank have a documented Forensic Readiness Policy?',
      description: 'A formal policy document that outlines the bank\'s approach to forensic readiness'
    },
    {
      id: 'gov-2',
      component: 'governance',
      category: 'Policy & Framework',
      question: 'Is there a dedicated Forensic Readiness Committee or governance structure?',
      description: 'A committee or team responsible for overseeing forensic readiness initiatives'
    },
    {
      id: 'gov-3',
      component: 'governance',
      category: 'Policy & Framework',
      question: 'Are roles and responsibilities for forensic activities clearly defined?',
      description: 'Clear job descriptions and responsibilities for forensic-related roles'
    },
    {
      id: 'gov-4',
      component: 'governance',
      category: 'Policy & Framework',
      question: 'Is there a budget allocated for forensic readiness activities?',
      description: 'Dedicated budget for tools, training, and forensic capabilities'
    },
    {
      id: 'gov-5',
      component: 'governance',
      category: 'Risk Management',
      question: 'Is forensic readiness integrated into the bank\'s risk management framework?',
      description: 'Forensic readiness considered in risk assessments and management'
    },
    {
      id: 'gov-6',
      component: 'governance',
      category: 'Risk Management',
      question: 'Are there regular reviews and updates of forensic readiness policies?',
      description: 'Scheduled reviews and updates of policies and procedures'
    },

    // PEOPLE Component
    {
      id: 'people-1',
      component: 'people',
      category: 'Skills & Training',
      question: 'Does your bank have staff trained in digital forensics?',
      description: 'Employees with formal training or certification in digital forensics'
    },
    {
      id: 'people-2',
      component: 'people',
      category: 'Skills & Training',
      question: 'Is there a training program for forensic readiness awareness?',
      description: 'Regular training sessions for staff on forensic readiness'
    },
    {
      id: 'people-3',
      component: 'people',
      category: 'Skills & Training',
      question: 'Are forensic investigators certified by recognized bodies?',
      description: 'Staff with certifications from recognized forensic bodies'
    },
    {
      id: 'people-4',
      component: 'people',
      category: 'Skills & Training',
      question: 'Is there a clear career path for forensic professionals?',
      description: 'Career development opportunities for forensic staff'
    },
    {
      id: 'people-5',
      component: 'people',
      category: 'Team Structure',
      question: 'Is there a dedicated forensic team or unit?',
      description: 'A dedicated team responsible for forensic investigations'
    },
    {
      id: 'people-6',
      component: 'people',
      category: 'Team Structure',
      question: 'Are forensic roles clearly defined and staffed?',
      description: 'Clear job roles with appropriate staffing levels'
    },

    // PROCESSES Component
    {
      id: 'proc-1',
      component: 'processes',
      category: 'Incident Response',
      question: 'Is there a documented incident response plan?',
      description: 'Formal plan for responding to security incidents'
    },
    {
      id: 'proc-2',
      component: 'processes',
      category: 'Incident Response',
      question: 'Are forensic procedures integrated into the incident response process?',
      description: 'Forensic steps included in incident response workflows'
    },
    {
      id: 'proc-3',
      component: 'processes',
      category: 'Evidence Management',
      question: 'Is there a chain of custody procedure for digital evidence?',
      description: 'Formal procedures for maintaining evidence integrity'
    },
    {
      id: 'proc-4',
      component: 'processes',
      category: 'Evidence Management',
      question: 'Are evidence collection procedures documented and standardized?',
      description: 'Standard operating procedures for evidence collection'
    },
    {
      id: 'proc-5',
      component: 'processes',
      category: 'Documentation',
      question: 'Are forensic investigations properly documented?',
      description: 'Comprehensive documentation of all forensic activities'
    },
    {
      id: 'proc-6',
      component: 'processes',
      category: 'Documentation',
      question: 'Is there a process for reporting forensic findings to management?',
      description: 'Regular reporting mechanisms for forensic activities'
    },
    {
      id: 'proc-7',
      component: 'processes',
      category: 'Testing & Validation',
      question: 'Are forensic processes tested and validated regularly?',
      description: 'Regular testing of forensic procedures and capabilities'
    },
    {
      id: 'proc-8',
      component: 'processes',
      category: 'Testing & Validation',
      question: 'Are there tabletop exercises for forensic scenarios?',
      description: 'Simulated exercises to test forensic readiness'
    },

    // TECHNOLOGY Component
    {
      id: 'tech-1',
      component: 'technology',
      category: 'Tools & Infrastructure',
      question: 'Does your bank have forensic investigation tools (e.g., EnCase, FTK)?',
      description: 'Commercial or open-source forensic investigation tools'
    },
    {
      id: 'tech-2',
      component: 'technology',
      category: 'Tools & Infrastructure',
      question: 'Is there a dedicated forensic lab or workspace?',
      description: 'Physical or virtual environment for forensic work'
    },
    {
      id: 'tech-3',
      component: 'technology',
      category: 'Tools & Infrastructure',
      question: 'Are forensic tools regularly updated and maintained?',
      description: 'Regular updates and maintenance of forensic tools'
    },
    {
      id: 'tech-4',
      component: 'technology',
      category: 'Logging & Monitoring',
      question: 'Is there comprehensive logging of system activities?',
      description: 'Logging infrastructure for capturing system events'
    },
    {
      id: 'tech-5',
      component: 'technology',
      category: 'Logging & Monitoring',
      question: 'Are logs stored securely and retained for appropriate periods?',
      description: 'Secure storage and retention policies for logs'
    },
    {
      id: 'tech-6',
      component: 'technology',
      category: 'Data Protection',
      question: 'Is there encryption for data at rest and in transit?',
      description: 'Encryption mechanisms for protecting sensitive data'
    },
    {
      id: 'tech-7',
      component: 'technology',
      category: 'Data Protection',
      question: 'Are there backup and recovery systems in place?',
      description: 'Backup systems for critical data and systems'
    },
    {
      id: 'tech-8',
      component: 'technology',
      category: 'Network Security',
      question: 'Is network traffic monitored and analyzed?',
      description: 'Network monitoring and analysis capabilities'
    },

    // DATA Component
    {
      id: 'data-1',
      component: 'data',
      category: 'Data Classification',
      question: 'Is there a data classification scheme?',
      description: 'System for classifying data by sensitivity and importance'
    },
    {
      id: 'data-2',
      component: 'data',
      category: 'Data Classification',
      question: 'Are data retention policies documented and enforced?',
      description: 'Policies for how long different types of data are retained'
    },
    {
      id: 'data-3',
      component: 'data',
      category: 'Data Access',
      question: 'Is access to sensitive data controlled and monitored?',
      description: 'Access controls and monitoring for sensitive data'
    },
    {
      id: 'data-4',
      component: 'data',
      category: 'Data Access',
      question: 'Are there audit trails for data access?',
      description: 'Logging and tracking of who accesses what data'
    },
    {
      id: 'data-5',
      component: 'data',
      category: 'Data Integrity',
      question: 'Are there mechanisms to ensure data integrity?',
      description: 'Checksums, hashing, or other integrity verification methods'
    },
    {
      id: 'data-6',
      component: 'data',
      category: 'Data Integrity',
      question: 'Is data backed up regularly and tested?',
      description: 'Regular backups with restoration testing'
    },
    {
      id: 'data-7',
      component: 'data',
      category: 'Data Privacy',
      question: 'Are data privacy regulations (e.g., NDPR) complied with?',
      description: 'Compliance with data protection regulations'
    },
    {
      id: 'data-8',
      component: 'data',
      category: 'Data Privacy',
      question: 'Is there a data breach notification procedure?',
      description: 'Procedures for notifying relevant parties of data breaches'
    },

    // COMPLIANCE Component
    {
      id: 'comp-1',
      component: 'compliance',
      category: 'Regulatory Compliance',
      question: 'Is the bank compliant with CBN cybersecurity guidelines?',
      description: 'Adherence to Central Bank of Nigeria cybersecurity requirements'
    },
    {
      id: 'comp-2',
      component: 'compliance',
      category: 'Regulatory Compliance',
      question: 'Are there regular compliance audits?',
      description: 'Scheduled audits to verify regulatory compliance'
    },
    {
      id: 'comp-3',
      component: 'compliance',
      category: 'Regulatory Compliance',
      question: 'Is forensic readiness aligned with regulatory requirements?',
      description: 'Forensic capabilities meet regulatory expectations'
    },
    {
      id: 'comp-4',
      component: 'compliance',
      category: 'Standards & Frameworks',
      question: 'Does the bank follow recognized forensic standards (e.g., ISO 27037)?',
      description: 'Adherence to international forensic standards'
    },
    {
      id: 'comp-5',
      component: 'compliance',
      category: 'Standards & Frameworks',
      question: 'Are forensic activities documented according to legal requirements?',
      description: 'Documentation meets legal and regulatory standards'
    },
    {
      id: 'comp-6',
      component: 'compliance',
      category: 'Reporting',
      question: 'Are forensic incidents reported to regulators as required?',
      description: 'Compliance with regulatory reporting requirements'
    },
    {
      id: 'comp-7',
      component: 'compliance',
      category: 'Reporting',
      question: 'Is there a process for regulatory submissions related to forensics?',
      description: 'Formal process for submitting forensic reports to regulators'
    }
  ];
}

