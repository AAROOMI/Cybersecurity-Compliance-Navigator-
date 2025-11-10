import React from 'react';
import { DocumentIcon, UsersIcon, BuildingOfficeIcon, DashboardIcon, ClipboardListIcon, BeakerIcon, ClipboardCheckIcon, ShieldKeyholeIcon, LandmarkIcon, IdentificationIcon, QuestionMarkCircleIcon, GraduationCapIcon, ExclamationTriangleIcon, LineChartIcon, ArrowsRightLeftIcon, BriefcaseIcon } from './Icons';
import type { Domain, Permission, View } from '../types';

interface SidebarProps {
  domains: Domain[];
  selectedDomain: Domain;
  onSelectDomain: (domain: Domain) => void;
  currentView: View;
  onSetView: (view: View) => void;
  permissions: Set<Permission>;
}

export const Sidebar: React.FC<SidebarProps> = ({ domains, selectedDomain, onSelectDomain, currentView, onSetView, permissions }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:flex md:flex-col">
      <nav className="mb-6">
        <ul>
          {permissions.has('dashboard:read') && (
            <li>
              <button
                  id="sidebar-dashboard"
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
           {permissions.has('users:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('userManagement')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'userManagement'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  <span>User Management</span>
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
          {permissions.has('userProfile:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('userProfile')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'userProfile'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <IdentificationIcon className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                </button>
            </li>
          )}
          {permissions.has('documents:read') && (
            <li className="mt-2">
              <button
                  id="sidebar-documents"
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
           {permissions.has('mapping:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('controlMapping')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'controlMapping'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ArrowsRightLeftIcon className="w-5 h-5 mr-3" />
                  <span>Control Mapping</span>
                </button>
            </li>
          )}
          {permissions.has('training:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('training')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'training'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <GraduationCapIcon className="w-5 h-5 mr-3" />
                  <span>Training & Awareness</span>
                </button>
            </li>
          )}
          {permissions.has('riskAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('riskAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'riskAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ExclamationTriangleIcon className="w-5 h-5 mr-3" />
                  <span>Risk Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('riskRegister:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('riskRegister')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'riskRegister'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ClipboardListIcon className="w-5 h-5 mr-3" />
                  <span>Risk Register</span>
                </button>
            </li>
          )}
          {permissions.has('assessment:read') && (
            <li className="mt-2">
              <button
                  id="sidebar-assessment"
                  onClick={() => onSetView('assessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'assessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ClipboardCheckIcon className="w-5 h-5 mr-3" />
                  <span>NCA ECC Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('pdplAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('pdplAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'pdplAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <ShieldKeyholeIcon className="w-5 h-5 mr-3" />
                  <span>PDPL Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('samaCsfAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('samaCsfAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'samaCsfAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <LandmarkIcon className="w-5 h-5 mr-3" />
                  <span>SAMA CSF Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('cmaAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('cmaAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'cmaAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <LineChartIcon className="w-5 h-5 mr-3" />
                  <span>CMA Assessment</span>
                </button>
            </li>
          )}
          {permissions.has('hrsdAssessment:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('hrsdAssessment')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'hrsdAssessment'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <BriefcaseIcon className="w-5 h-5 mr-3" />
                  <span>HRSD Assessment</span>
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
          {permissions.has('help:read') && (
            <li className="mt-2">
              <button
                  onClick={() => onSetView('help')}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center ${
                    currentView === 'help'
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
                  <span>Help & Support</span>
                </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase tracking-wider">Frameworks</h2>
           <a
              href="https://ai.studio/apps/drive/1QccnATP-jWmzFg15L-j0mtHNU3hwRsSD"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <span className="flex items-center justify-center w-5 h-5 mr-3 rounded-full bg-gray-200 dark:bg-gray-600 text-xs font-bold text-gray-600 dark:text-gray-200 flex-shrink-0">1</span>
              <span>CMA</span>
            </a>
            <a
              href="https://ai.studio/apps/drive/1Wk8fq8HQryWglhSkPLcKHPn5za-ZwGVP"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <span className="flex items-center justify-center w-5 h-5 mr-3 rounded-full bg-gray-200 dark:bg-gray-600 text-xs font-bold text-gray-600 dark:text-gray-200 flex-shrink-0">2</span>
              <span>HRSD</span>
            </a>
           <a
              href="https://ai.studio/apps/drive/1HM3zXzqtZ6N--AdXXUu3EZkvfniZtOCM"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left p-3 rounded-md text-sm transition-colors duration-200 flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <span className="flex items-center justify-center w-5 h-5 mr-3 rounded-full bg-gray-200 dark:bg-gray-600 text-xs font-bold text-gray-600 dark:text-gray-200 flex-shrink-0">3</span>
              <span>PDPL</span>
            </a>
      </div>

      {permissions.has('navigator:read') && (
        <div id="sidebar-navigator-header" className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 px-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">NCA ECC Control Navigator</h2>
          </div>
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