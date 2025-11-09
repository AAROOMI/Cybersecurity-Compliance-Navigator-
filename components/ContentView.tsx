import React, { useMemo } from 'react';
import { SubdomainAccordion } from './SubdomainAccordion';
import type { Domain, Control, Subdomain, GeneratedContent, PolicyDocument, Permission, View } from '../types';

interface ContentViewProps {
  domain: Domain;
  activeControlId: string | null;
  setActiveControlId: (id: string | null) => void;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent, generatedBy?: 'user' | 'AI Agent') => Promise<void>;
  documentRepository: PolicyDocument[];
  permissions: Set<Permission>;
  onSetView: (view: View) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ domain, activeControlId, setActiveControlId, onAddDocument, documentRepository, permissions, onSetView }) => {
  const activeHierarchy = useMemo(() => {
    if (!activeControlId) return null;
    for (const subdomain of domain.subdomains) {
      const control = subdomain.controls.find(c => c.id === activeControlId);
      if (control) {
        return { subdomain, control };
      }
    }
    return null;
  }, [domain, activeControlId]);

  return (
    <div className="space-y-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <button
              onClick={() => onSetView('dashboard')}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              Dashboard
            </button>
          </li>
          <li {...(!activeHierarchy ? { 'aria-current': 'page' } : {})}>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              {activeHierarchy ? (
                 <button
                  onClick={() => setActiveControlId(null)}
                  className="ml-1 text-sm font-medium text-gray-500 hover:text-teal-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                >
                  {domain.name}
                </button>
              ) : (
                <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2 dark:text-gray-200">{domain.name}</span>
              )}
            </div>
          </li>
          {activeHierarchy && (
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2 dark:text-gray-200">{activeHierarchy.subdomain.title}</span>
              </div>
            </li>
          )}
        </ol>
      </nav>
      
      <div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">{domain.id}: {domain.name}</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Explore the subdomains and controls for {domain.name}.</p>
      </div>
      <div className="space-y-4">
        {domain.subdomains.map((subdomain) => (
          <SubdomainAccordion 
            key={subdomain.id} 
            domain={domain}
            subdomain={subdomain} 
            activeControlId={activeControlId} 
            setActiveControlId={setActiveControlId} 
            onAddDocument={onAddDocument}
            documentRepository={documentRepository}
            permissions={permissions}
          />
        ))}
      </div>
    </div>
  );
};
