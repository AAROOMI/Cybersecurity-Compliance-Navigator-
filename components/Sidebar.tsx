
import React from 'react';
import type { Domain } from '../types';

interface SidebarProps {
  domains: Domain[];
  selectedDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ domains, selectedDomain, onSelectDomain }) => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto hidden md:block">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Cybersecurity Domains</h2>
      <nav>
        <ul>
          {domains.map((domain, index) => {
            const controlCount = domain.subdomains.reduce((acc, sub) => acc + sub.controls.length, 0);
            return (
              <li key={domain.id} className="mb-2">
                <button
                  onClick={() => onSelectDomain(domain)}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-between ${
                    selectedDomain.id === domain.id
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-start flex-1 min-w-0">
                    <span className={`mr-3 font-mono text-teal-600 ${selectedDomain.id === domain.id ? 'font-bold' : ''}`}>{index + 1}</span>
                    <span className="truncate" title={domain.name}>{domain.name}</span>
                  </div>
                  <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    selectedDomain.id === domain.id
                      ? 'bg-teal-200 text-teal-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {controlCount} {controlCount === 1 ? 'Control' : 'Controls'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
