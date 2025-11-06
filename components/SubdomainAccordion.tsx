
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ClipboardIcon, CheckIcon } from './Icons';
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
    const [copiedSection, setCopiedSection] = useState<string | null>(null);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    
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
