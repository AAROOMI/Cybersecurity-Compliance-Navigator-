import React from 'react';
import { SubdomainAccordion } from './SubdomainAccordion';
import type { Domain, Control, Subdomain, GeneratedContent, PolicyDocument, Permission } from '../types';

interface ContentViewProps {
  domain: Domain;
  activeControlId: string | null;
  setActiveControlId: (id: string | null) => void;
  onAddDocument: (control: Control, subdomain: Subdomain, domain: Domain, generatedContent: GeneratedContent) => void;
  documentRepository: PolicyDocument[];
  permissions: Set<Permission>;
}

export const ContentView: React.FC<ContentViewProps> = ({ domain, activeControlId, setActiveControlId, onAddDocument, documentRepository, permissions }) => {
  return (
    <div className="space-y-8">
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