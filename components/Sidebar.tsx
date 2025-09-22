import React from 'react';
import { DocumentIcon, UsersIcon, BuildingOfficeIcon, DashboardIcon, ClipboardListIcon } from './Icons';
import type { Domain, Permission } from '../types';

interface SidebarProps {
  domains: Domain[];
  selectedDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
  currentView: 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog';
  onSetView: (view: 'dashboard' | 'navigator' | 'documents' | 'users' | 'companyProfile' | 'auditLog') => void;
  permissions: Set<Permission>;
}

// Base64 encoded image for the AI assistant
const agentImageUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMWFhUXGBgYGBgYGBgYGBgYGBgYFxgYGBgYHSggGBolHRgYITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAECBAUGBwj/xAA9EAABAwIDBgQDBgQGAgMAAAABAAIRAyEEEjEFQVFhInGBkQYyobETQsHR8FLhByNSYnKS8RVTstIkg6LC/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIxEAAgIDAAICAwEBAAAAAAAAAAECEQMSITEEE0FRIjJhcQT/2gAMAwEAAhEDEQH/APcIuS4BclwvOOkLkuAXJcICFwS4JcICFwS4JcICFwS4JcICFwS4JcICFwS4JcICFwS4JcICFwS4JcIBFyXALkuEBC5LgFyXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhcEuCXCAhclwC5LhAQuS4BclwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXBLglwgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgELkuAXJcICFwS4JcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICFwS4JcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcICEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgIXJcAuS4QELkuAXJcIBCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQH/9/9k=";

export const Sidebar: React.FC<SidebarProps> = ({ domains, selectedDomain, onSelectDomain, currentView, onSetView, permissions }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:flex md:flex-col">
      <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <button
            onClick={() => (window as any).openDIDAgent && (window as any).openDIDAgent()}
            className="group relative"
            aria-label="Talk to AI Assistant Sarah Johnson"
        >
            <img
                src={agentImageUrl}
                alt="AI Assistant Sarah Johnson"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 group-hover:border-teal-500 transition-all duration-300 shadow-md"
            />
            <div className="absolute inset-0 bg-teal-600 bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 2C15.968 2 20 6.032 20 11s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9zm4.331 6.223a.998.998 0 00-1.217-.229l-3.351 1.771a.86.86 0 01-.634 0L6.778 8.006a.998.998 0 10-.996 1.73l3.351 1.77a.86.86 0 010 1.49l-3.351 1.77a.998.998 0 10.996 1.73l3.351-1.771a.86.86 0 01.634 0l3.351 1.771a.998.998 0 10.996-1.73l-3.351-1.77a.86.86 0 010-1.49l3.351-1.77a.998.998 0 00.221-1.501z"/>
                </svg>
            </div>
        </button>
        <h3 className="mt-3 text-md font-semibold text-gray-800 dark:text-gray-200">Sarah Johnson</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">AI Voice Assistant</p>
    </div>
      <nav className="mb-6 flex-1">
        <ul>
          {permissions.has('dashboard:read') && (
            <li>
              <button
                  onClick={() => onSetView('dashboard')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'dashboard'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <DashboardIcon className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </button>
            </li>
          )}
          {permissions.has('company:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('companyProfile')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'companyProfile'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <BuildingOfficeIcon className="w-5 h-5 mr-3" />
                  <span>Company Profile</span>
                </button>
            </li>
          )}
          {permissions.has('documents:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('documents')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'documents'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <DocumentIcon className="w-5 h-5 mr-3" />
                  <span>Document Management</span>
                </button>
            </li>
          )}
          {permissions.has('users:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('users')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'users'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  <span>User Management</span>
                </button>
            </li>
          )}
          {permissions.has('audit:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('auditLog')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'auditLog'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ClipboardListIcon className="w-5 h-5 mr-3" />
                  <span>Audit Log</span>
                </button>
            </li>
          )}
        </ul>
      </nav>

      {permissions.has('navigator:read') && (
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 px-2">Controls Navigator</h2>
          <nav>
            <ul>
              {domains.map((domain, index) => {
                const controlCount = domain.subdomains.reduce((acc, sub) => acc + sub.controls.length, 0);
                const isSelected = selectedDomain.id === domain.id && currentView === 'navigator';
                return (
                  <li key={domain.id} className="mb-2">
                    <button
                      onClick={() => onSelectDomain(domain)}
                      className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      <div className="flex items-start flex-1 min-w-0">
                        <span className={`mr-3 font-mono text-teal-600 dark:text-teal-400 ${isSelected ? 'font-bold' : ''}`}>{index + 1}</span>
                        <span className="truncate" title={domain.name}>{domain.name}</span>
                      </div>
                      <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                        isSelected
                          ? 'bg-teal-200 dark:bg-teal-500/50 text-teal-800 dark:text-teal-200'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                      }`}>
                        {controlCount} {controlCount === 1 ? 'Control' : 'Controls'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </aside>
  );
};
