import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ChevronDownIcon, SparklesIcon, ClipboardIcon, CheckIcon } from './Icons';
import type { Domain, Control, Subdomain, GeneratedContent, PolicyDocument, Permission } from '../types';

interface ControlIdentifiersProps {
  domain: Domain;
  subdomain: Subdomain;
  control: Control;
}

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

interface GeneratedDocumentsProps {
  docs: GeneratedContent;
  domain: Domain;
  subdomain: Subdomain;
  control: Control;
}

const GeneratedDocuments: React.FC<GeneratedDocumentsProps> = ({ docs, domain, subdomain, control }) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'procedure' | 'guideline'>('policy');

  const renderMarkdown = (markdown: string) => {
    let html = '';
    let inUnorderedList = false;
    let inOrderedList = false;
    
    const lines = markdown.split('\n');

    const closeLists = () => {
      if (inUnorderedList) {
        html += '</ul>';
        inUnorderedList = false;
      }
      if (inOrderedList) {
        html += '</ol>';
        inOrderedList = false;
      }
    };

    for (const line of lines) {
      let processedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics

      if (line.startsWith('### ')) {
        closeLists();
        html += `<h3 class="text-md font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">${processedLine.substring(4)}</h3>`;
      } else if (line.startsWith('## ')) {
        closeLists();
        html += `<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-2">${processedLine.substring(3)}</h2>`;
      } else if (line.startsWith('# ')) {
        closeLists();
        html += `<h1 class="text-xl font-bold text-gray-900 dark:text-gray-50 mt-6 mb-3">${processedLine.substring(2)}</h1>`;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (inOrderedList) closeLists();
        if (!inUnorderedList) {
          html += '<ul class="list-disc list-inside space-y-1 my-2 text-gray-700 dark:text-gray-300">';
          inUnorderedList = true;
        }
        html += `<li class="mb-1">${processedLine.substring(2)}</li>`;
      } else if (/^\d+\. /.test(line)) {
        if (inUnorderedList) closeLists();
        if (!inOrderedList) {
          html += '<ol class="list-decimal list-inside space-y-1 my-2 text-gray-700 dark:text-gray-300">';
          inOrderedList = true;
        }
        html += `<li class="mb-1">${processedLine.replace(/^\d+\. /, '')}</li>`;
      } else {
        closeLists();
        if (line.trim() !== '') {
          html += `<p class="mb-3">${processedLine}</p>`;
        }
      }
    }
    closeLists(); // Close any open lists at the end
    return html;
  };

  const renderContent = (content: string) => {
    return <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
  };

  const tabButtonClasses = (tabName: 'policy' | 'procedure' | 'guideline') => 
    `whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
      activeTab === tabName
        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
    }`;

  return (
    <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
             <ControlIdentifiers domain={domain} subdomain={subdomain} control={control} />
        </div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('policy')} className={tabButtonClasses('policy')}>Policy</button>
          <button onClick={() => setActiveTab('procedure')} className={tabButtonClasses('procedure')}>Procedure</button>
          <button onClick={() => setActiveTab('guideline')} className={tabButtonClasses('guideline')}>Guideline</button>
        </nav>
      </div>
      <div className="p-5">
        {activeTab === 'policy' && renderContent(docs.policy)}
        {activeTab === 'procedure' && renderContent(docs.procedure)}
        {activeTab === 'guideline' && renderContent(docs.guideline)}
      </div>
    </div>
  );
};

const GeneratedDocumentsSkeleton: React.FC = () => {
  return (
    <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 overflow-hidden animate-pulse">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6 px-4" aria-label="Tabs">
          <div className="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-teal-500">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </nav>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="pt-6 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ControlDetailProps {
  control: Control;
  isActive: boolean;
  domain: Domain;
  subdomain: Subdomain;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy: 'user' | 'AI Agent') => void;
  documentRepository: PolicyDocument[];
  permissions: Set<Permission>;
}

const ControlDetail = React.forwardRef<HTMLDivElement, ControlDetailProps>(
  ({ control, isActive, domain, subdomain, onAddDocument, documentRepository, permissions }, ref) => {
    const [generatedDocs, setGeneratedDocs] = useState<GeneratedContent | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    
    const existingDocument = documentRepository.find(doc => doc.controlId === control.id);
    const canGenerate = permissions.has('documents:generate');

    const handleCopy = (text: string, sectionId: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedSection(sectionId);
          setTimeout(() => setCopiedSection(null), 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
          alert("Failed to copy content.");
        });
      } else {
          alert("Clipboard API not available.");
      }
    };
    
    const CopyButton: React.FC<{ textToCopy: string; sectionId: string }> = ({ textToCopy, sectionId }) => {
      const isCopied = copiedSection === sectionId;
      return (
        <button
          onClick={() => handleCopy(textToCopy, sectionId)}
          className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
          aria-label={`Copy ${sectionId} to clipboard`}
          disabled={isCopied}
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4 mr-1" />
              <span>Copy</span>
            </>
          )}
        </button>
      );
    };

    const handleGenerateDocs = async () => {
      setIsGenerating(true);
      setError(null);
      setGeneratedDocs(null);

      try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
          You are an expert cybersecurity policy writer for a Saudi Arabian organization. Your task is to generate compliance documentation based on a specific control from the National Cybersecurity Authority's (NCA) Essential Cybersecurity Controls (ECC) framework.

          **Context:**
          - **Domain:** ${domain.id}: ${domain.name}
          - **Subdomain:** ${subdomain.id}: ${subdomain.title}
          - **Control ID:** ${control.id}
          - **Control Description:** ${control.description}
          - **Official Implementation Guidelines:** ${control.implementationGuidelines.join('; ')}
          - **Official Expected Deliverables:** ${control.expectedDeliverables.join('; ')}

          **Instructions:**
          Generate three distinct documents based *only* on the provided control information. The tone and content should be professional, formal, and directly relevant to the control.

          **Formatting:**
          - For each document, format the content using standard Markdown.
          - Use headings (e.g., ## Section Title) for structure.
          - Use bulleted lists (e.g., - Point 1) for lists of items.
          - Use bold text (e.g., **Important Term**) for emphasis.

          **Document Types:**
          1.  **Policy:** A high-level statement of intent. It should define the rule and its purpose within the organization. It should be concise and authoritative.
          2.  **Procedure:** A detailed, step-by-step document explaining how to implement the policy. It should be clear, sequential, and actionable for the IT and Cybersecurity teams.
          3.  **Guideline:** A simplified, user-friendly document for all employees. It should explain the 'why' behind the rule and provide practical advice in simple terms, avoiding technical jargon where possible.

          **Output Format:**
          Return the output as a single, valid JSON object. Do not include any text, markdown formatting, or code fences outside of the JSON structure itself. The JSON keys should be "policy", "procedure", and "guideline", and their values should be the Markdown-formatted strings.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                policy: {
                  type: Type.STRING,
                  description: "The formal policy document, formatted in Markdown."
                },
                procedure: {
                  type: Type.STRING,
                  description: "The step-by-step procedure document, formatted in Markdown."
                },
                guideline: {
                  type: Type.STRING,
                  description: "The simplified guideline for employees, formatted in Markdown."
                }
              },
              required: ["policy", "procedure", "guideline"]
            }
          }
        });
        
        const parsedResponse = JSON.parse(response.text);
        onAddDocument(control, subdomain, domain, parsedResponse, 'user');
        setGeneratedDocs(parsedResponse); // Keep showing generated docs locally for a bit

      } catch (e) {
        console.error("Error generating documents:", e);
        setError("Failed to generate documentation. The API key may be missing or invalid. Please check the console for details and try again.");
      } finally {
        setIsGenerating(false);
      }
    };
    
    return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-lg p-6 border transition-all duration-700 ease-in-out ${
        isActive ? 'border-teal-500 ring-4 ring-teal-200 dark:ring-teal-500/20 shadow-lg' : 'border-gray-200 dark:border-gray-700'
      }`}
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between mb-4">
        <h4 className="text-md font-semibold text-teal-800 dark:text-teal-300 font-mono">{control.id}</h4>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-sans">
            <span>Version: {control.version}</span>
            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <span>Updated: {control.lastUpdated}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Description</h5>
                <CopyButton textToCopy={control.description} sectionId={`desc-${control.id}`} />
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">{control.description}</p>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
            <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Implementation Guidelines</h5>
            <CopyButton textToCopy={`- ${control.implementationGuidelines.join('\n- ')}`} sectionId={`impl-${control.id}`} />
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            {control.implementationGuidelines.map((guideline, index) => <li key={index}>{guideline}</li>)}
            </ul>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
            <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Expected Deliverables</h5>
            <CopyButton textToCopy={`- ${control.expectedDeliverables.join('\n- ')}`} sectionId={`deli-${control.id}`} />
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            {control.expectedDeliverables.map((deliverable, index) => <li key={index}>{deliverable}</li>)}
            </ul>
        </div>
      </div>

      {control.history && control.history.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsHistoryVisible(!isHistoryVisible)}
              className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              aria-expanded={isHistoryVisible}
            >
              <span>Version History</span>
              <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${isHistoryVisible ? 'rotate-180' : ''}`} />
            </button>
            {isHistoryVisible && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-6">
                {/* Current Version */}
                <div className="relative">
                  <div className="absolute top-1 -left-[26px] h-3 w-3 bg-teal-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                  <div className="pl-4">
                    <div className="flex items-baseline justify-between">
                        <h6 className="font-semibold text-gray-800 dark:text-gray-200">
                            Version {control.version}
                            <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full dark:bg-teal-900 dark:text-teal-200">
                                Current
                            </span>
                        </h6>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{control.lastUpdated}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-1">Latest approved version.</p>
                  </div>
                </div>

                {/* Past Versions */}
                {[...control.history].reverse().map((entry) => (
                  <div key={entry.version} className="relative">
                    <div className="absolute top-1 -left-[26px] h-3 w-3 bg-gray-300 dark:bg-gray-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                    <div className="pl-4">
                        <div className="flex items-baseline justify-between">
                            <h6 className="font-semibold text-gray-700 dark:text-gray-300">Version {entry.version}</h6>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</p>
                        </div>
                        <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {entry.changes.map((change, index) => (
                            <li key={index}>{change}</li>
                            ))}
                        </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-start">
              <h5 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Automation</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {!canGenerate ? "You do not have permission to generate documents." 
                    : existingDocument ? "A document for this control is already in the management system." 
                    : "Automatically generate policy, procedure, and guideline documents for this control using AI."}
              </p>
              {canGenerate && (
                <button
                    onClick={handleGenerateDocs}
                    disabled={isGenerating || !!existingDocument}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                            {existingDocument ? 'Document Exists' : 'Automate Documentation'}
                        </>
                    )}
                </button>
              )}
          </div>
          
          {error && <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-500/50 rounded-md text-sm">{error}</div>}
          
          {isGenerating && <GeneratedDocumentsSkeleton />}

          {generatedDocs && !isGenerating && (
             <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-500/50 rounded-md text-sm">
                <strong>Success!</strong> The generated document has been sent to the Document Management system for approval.
             </div>
          )}
          {/*
          This section is commented out as the document now lives in the DMS. 
          A success message is shown instead.
          {generatedDocs && !isGenerating && <GeneratedDocuments docs={generatedDocs} domain={domain} subdomain={subdomain} control={control} />}
          */}
      </div>
    </div>
    );
  }
);

ControlDetail.displayName = 'ControlDetail';

interface SubdomainAccordionProps {
  domain: Domain;
  subdomain: Subdomain;
  activeControlId: string | null;
  setActiveControlId: (id: string | null) => void;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy: 'user' | 'AI Agent') => void;
  documentRepository: PolicyDocument[];
  permissions: Set<Permission>;
}

export const SubdomainAccordion: React.FC<SubdomainAccordionProps> = ({ domain, subdomain, activeControlId, setActiveControlId, onAddDocument, documentRepository, permissions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const controlRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const hasActiveControl = subdomain.controls.some(c => c.id === activeControlId);

  useEffect(() => {
    if (hasActiveControl && !isOpen) {
      setIsOpen(true);
    }
  }, [hasActiveControl, isOpen]);

  useEffect(() => {
    let scrollTimer: number;
    let highlightTimer: number;

    if (hasActiveControl && isOpen && activeControlId) {
      scrollTimer = window.setTimeout(() => {
        const activeControlRef = controlRefs.current.get(activeControlId);
        if (activeControlRef) {
          activeControlRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          highlightTimer = window.setTimeout(() => {
            setActiveControlId(null);
          }, 2500);
        }
      }, 500);
    }
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(highlightTimer);
    };

  }, [activeControlId, hasActiveControl, isOpen, setActiveControlId]);

  const controlCount = subdomain.controls.length;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls={`subdomain-content-${subdomain.id}`}
      >
        <div className="flex items-center flex-1 min-w-0">
            <span className="font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50 rounded px-2 py-1 text-sm font-semibold mr-4">{subdomain.id}</span>
            <div className="flex items-baseline flex-1 min-w-0">
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate" title={subdomain.title}>{subdomain.title}</span>
              <span className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {controlCount} {controlCount === 1 ? 'Control' : 'Controls'}
              </span>
            </div>
        </div>
        <ChevronDownIcon
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div 
        id={`subdomain-content-${subdomain.id}`}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[20000px]' : 'max-h-0'}`}
      >
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-gray-600 dark:text-gray-300 italic mb-6">{subdomain.objective}</p>
            <div className="space-y-4">
                {subdomain.controls.map(control => (
                  <ControlDetail 
                    key={control.id} 
                    control={control} 
                    isActive={control.id === activeControlId}
                    domain={domain}
                    subdomain={subdomain}
                    onAddDocument={onAddDocument}
                    documentRepository={documentRepository}
                    permissions={permissions}
                    ref={(el) => { controlRefs.current.set(control.id, el); }}
                  />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};