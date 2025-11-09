

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ChevronDownIcon, ClipboardIcon, CheckIcon, SparklesIcon } from './Icons';
import type { Domain, Control, Subdomain, GeneratedContent, PolicyDocument, Permission } from '../types';

interface ControlIdentifiersProps {
  domain: Domain;
  subdomain: Subdomain;
  control: Control;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ControlIdentifiers: React.FC<ControlIdentifiersProps> = ({ domain, subdomain, control }) => {
    const identifier = `ECC://${domain.id}/${subdomain.id}/${control.id}`;

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border dark:border-gray-700">
            <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Control Identifier</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{identifier}</p>
            </div>
        </div>
    );
};

interface ControlDetailProps {
  control: Control;
  isActive: boolean;
  domain: Domain;
  subdomain: Subdomain;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy: 'user' | 'AI Agent') => Promise<void>;
  documentRepository: PolicyDocument[];
  permissions: Set<Permission>;
}

const ControlDetail = React.forwardRef<HTMLDivElement, ControlDetailProps>(
  ({ control, isActive, domain, subdomain, onAddDocument, documentRepository, permissions }, ref) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    
    const documentExists = documentRepository.some(doc => doc.controlId === control.id);
    const canGenerate = permissions.has('documents:generate');

    const handleGenerateDocument = async () => {
        setIsGenerating(true);
        try {
            const prompt = `You are a world-class cybersecurity consultant specializing in corporate governance and policy writing for enterprises in Saudi Arabia, adhering to NCA standards.

Based on the provided National Cybersecurity Authority (NCA) Essential Cybersecurity Control (ECC), generate a comprehensive and professionally drafted set of documents. The language must be formal, authoritative, and suitable for a corporate audience, from executives to technical staff.

**Control Details:**
- **Control ID:** ${control.id}
- **Control Description:** ${control.description}
- **Implementation Guidelines:**\n- ${control.implementationGuidelines.join('\n- ')}
- **Expected Deliverables:**\n- ${control.expectedDeliverables.join('\n- ')}

**Task:**
Generate three distinct documents as a single JSON object: a Policy, a Procedure, and a Guideline.

1.  **Policy Document:** This document should be high-level. It must contain the following sections formatted in Markdown:
    -   **Introduction/Purpose:** A professional description of why this policy exists.
    -   **Scope:** Clearly define who and what this policy applies to within the organization.
    -   **Policy Statements:** A set of clear, high-level rules derived from the control's description and objectives.

2.  **Procedure Document:** This document provides a detailed, step-by-step process for implementing the policy. It should be actionable and clear. Format it in Markdown and structure it as a formal process, using numbered steps.

3.  **Guideline Document:** This document should provide user-friendly, practical advice and best practices for employees to follow in their daily work to comply with the policy. Use clear language, bullet points, and do's and don'ts where appropriate.

**Output Format:**
Return a single, valid JSON object with three keys: "policy", "procedure", and "guideline". The content for each key must be well-structured markdown that includes the sections specified above.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            policy: { type: Type.STRING },
                            procedure: { type: Type.STRING },
                            guideline: { type: Type.STRING },
                        },
                    },
                },
            });

            const jsonString = response.text;
            const generatedContent: GeneratedContent = JSON.parse(jsonString);

            await onAddDocument(control, subdomain, domain, generatedContent, 'AI Agent');

        } catch (error) {
            console.error("Error generating document:", error);
            alert("Failed to generate document. An error occurred. Please check the console for more details.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopy = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    return (
        <div ref={ref} className={`p-6 border rounded-lg ${isActive ? 'border-teal-500 ring-2 ring-teal-500/50' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300 font-mono">{control.id}</h3>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{control.description}</p>
                </div>
                {canGenerate && (
                    <button onClick={handleGenerateDocument} disabled={isGenerating || documentExists} title={documentExists ? "Document already exists for this control" : "Generate policy with AI"} className="ml-4 flex-shrink-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isGenerating ? (<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : <SparklesIcon className="w-4 h-4 mr-2" />}
                        {isGenerating ? 'Generating...' : (documentExists ? 'Generated' : 'Generate Docs')}
                    </button>
                )}
            </div>
            <div className="mt-6 space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-600 dark:text-gray-300">Implementation Guidelines</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {control.implementationGuidelines.map((guideline, i) => <li key={i}>{guideline}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-600 dark:text-gray-300">Expected Deliverables</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {control.expectedDeliverables.map((deliverable, i) => <li key={i}>{deliverable}</li>)}
                    </ul>
                </div>
            </div>
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <ControlIdentifiers domain={domain} subdomain={subdomain} control={control} />
            </div>
        </div>
    );
  }
);

interface SubdomainAccordionProps {
  domain: Domain;
  subdomain: Subdomain;
  activeControlId: string | null;
  setActiveControlId: (id: string | null) => void;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy: 'user' | 'AI Agent') => Promise<void>;
  documentRepository: PolicyDocument[];
  permissions: Set<Permission>;
}

export const SubdomainAccordion: React.FC<SubdomainAccordionProps> = ({ domain, subdomain, activeControlId, setActiveControlId, onAddDocument, documentRepository, permissions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeControlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasActiveControl = subdomain.controls.some(c => c.id === activeControlId);
    if (hasActiveControl) {
      setIsOpen(true);
      setTimeout(() => {
        activeControlRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [activeControlId, subdomain.controls]);

  const controlCount = subdomain.controls.length;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className="mr-4 flex-shrink-0">
            <div className="h-10 w-20 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center font-mono text-lg font-semibold text-gray-700 dark:text-gray-200">
              {subdomain.id}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{subdomain.title}</p>
          </div>
          <span className="ml-4 px-3 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
            {controlCount} {controlCount === 1 ? 'Control' : 'Controls'}
          </span>
        </div>
        <ChevronDownIcon className={`ml-4 w-6 h-6 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{subdomain.objective}</p>
          <div className="space-y-6">
            {subdomain.controls.map(control => (
              <ControlDetail
                key={control.id}
                ref={activeControlId === control.id ? activeControlRef : null}
                control={control}
                isActive={activeControlId === control.id}
                domain={domain}
                subdomain={subdomain}
                onAddDocument={onAddDocument}
                documentRepository={documentRepository}
                permissions={permissions}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
