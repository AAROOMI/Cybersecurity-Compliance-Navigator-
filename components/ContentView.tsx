import React from 'react';
import { SubdomainAccordion } from './SubdomainAccordion';
import type { Domain } from '../types';

interface ContentViewProps {
  domain: Domain;
  activeControlId: string | null;
  setActiveControlId: (id: string | null) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ domain, activeControlId, setActiveControlId }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">{domain.id}: {domain.name}</h1>
        <p className="mt-2 text-lg text-gray-500">Explore the subdomains and controls for {domain.name}.</p>
      </div>
      <div className="space-y-4">
        {domain.subdomains.map((subdomain) => (
          <SubdomainAccordion 
            key={subdomain.id} 
            domain={domain}
            subdomain={subdomain} 
            activeControlId={activeControlId} 
            setActiveControlId={setActiveControlId} 
          />
        ))}
      </div>
    </div>
  );
};